import * as React from 'react';
import { Grid, List, Stack, Box, Tooltip, ListItem, IconButton, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { styled } from '@mui/material/styles';
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg'
import FileOpenIcon from '@mui/icons-material/FileOpen';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
// Hooks
import useApi from 'hooks/useApi'
import jobAPI from 'api/jobs'

// const mockData = [{
//     "file_name": "auth.py",
//     "file_path": "/Users/lifeng/go/src/git-devops/llmscheduler/packages/server/config/auth.py",
//     "file_size": "0.258kb",
//     "is_binary": false
// },
// {
//     "file_name": "logging.py",
//     "file_path": "/Users/lifeng/go/src/git-devops/llmscheduler/packages/server/config/logging.py",
//     "file_size": "0.395kb",
//     "is_binary": true
// }]

const JobDataTab = (props) => {
    const { jobData, parent_triger } = props

    const jobID = jobData.job_id
    const workDir = jobData.current_working_directory

    // const jobID = '12345'
    // const workDir = "/Users/lifeng/go/src/git-devops/llmscheduler/packages/server/config/"

    const getHPCJobFileListAPI = useApi(jobAPI.getHPCJobFileList)
    const getJobOutputAPI = useApi(jobAPI.getJobOutput)

    const [rawFileList, setRawFileList] = React.useState([])
    // handle job output dialog
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [jobOutput, setJobOutput] = React.useState('');
    const descriptionElementRef = React.useRef(null);


    const Filelist = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    const getOutputFunc = async (jobID, filepath) => {
        console.log("get job " + jobID + "'s output from file path: " + filepath)
        await getJobOutputAPI.request(jobID, filepath)
        setJobOutput(getJobOutputAPI.data)
        setOpen(true);
        setScroll('paper');
    };

    const handleClose = () => {
        setOpen(false);
        setJobOutput('')
    };

    React.useEffect(() => {
        getHPCJobFileListAPI.request(workDir)
        // console.log(`parent_triger ${workDir}`)
    }, [parent_triger])

    React.useEffect(() => {
        if (getHPCJobFileListAPI.data) {
            setRawFileList(getHPCJobFileListAPI.data)
        }
    }, [getHPCJobFileListAPI.data])

    React.useEffect(() => {
        if (getJobOutputAPI.data) {
            setJobOutput(getJobOutputAPI.data)
        }
    }, [getJobOutputAPI.data])

    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const visibleJobOutput = React.useMemo(() => (jobOutput))

    return (
        <Grid item xs={12} md={6}>
            <Filelist>
                <List dense={true}>
                    {rawFileList.length > 0 ? rawFileList.map((file_info, index) => {
                        return (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <Tooltip title='打开'>
                                        <IconButton
                                            edge="end" aria-label="open"
                                            onClick={() => getOutputFunc(jobID, file_info.file_path)}
                                        >
                                            {!file_info.is_binary ? <FileOpenIcon /> : null}
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <TextSnippetIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={file_info.file_name}
                                />
                                <ListItemText
                                    secondary={file_info.file_size}
                                />
                            </ListItem>
                        )
                    }) :
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt='WorkflowEmptySVG' />
                            </Box>
                            <div>No Data</div>
                        </Stack>}
                </List>
            </Filelist>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Job Outputs:</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        style={{ whiteSpace: 'pre-line' }}
                        tabIndex={-1}
                    >
                        {visibleJobOutput}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default JobDataTab