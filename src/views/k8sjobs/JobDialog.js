import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Box, Typography, Dialog, Select, MenuItem, DialogActions, DialogContent, DialogTitle, Stack, OutlinedInput, Button } from '@mui/material'
import { StyledButton } from 'ui-component/button/StyledButton'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'
import { useTheme } from '@mui/material/styles'
import useAuth from 'hooks/useAuth'
// import YamlEditor from '@focus-reactive/react-yaml';
// import { oneDark } from '@codemirror/theme-one-dark';
import { File } from 'ui-component/file/File'

// Hooks
import useApi from 'hooks/useApi'

//API
import workloadsApi from 'api/workloads'

// utils
import useNotifier from 'utils/useNotifier'

const JobDialog = ({ jobShow, jobDialogProps, jobCancel, jobConfirm }) => {
    const portalElement = document.getElementById('portal')
    const { userInfo } = useAuth()
    const applyWorkloads = useApi(workloadsApi.applyWorkloads)
    // console.log("jobshow:" + jobShow)
    // console.log(jobDialogProps)

    useNotifier()
    const [jobName, setJobName] = useState('')
    const [jobCMD, setJobCMD] = useState('')
    const [otherOpt, setOtherOpt] = useState('')
    const [llmName, setllmName] = useState('');
    const [baseModel, setBaseModel] = useState('');
    const [trainPara, setTrainPara] = useState('');
    const [trainTemp, setTrainTemp] = useState('');
    const theme = useTheme()

    const handleSelectChange = (event) => {
        setllmName(event.target.value);
    };

    const handleTemplateChange = (event) => {
        setTrainTemp(event.target.value);
    };

    const parseArgs = (str) => {
        return str.split(' ').reduce((acc, arg) => {
            const [key, value] = arg.split('=');
            acc[key] = value;
            return acc;
        }, {})
    };

    useEffect(() => {
        setJobName('')
        setJobCMD('')
        setOtherOpt('')
        setllmName('')
        setTrainTemp('')
        setTrainPara('')
        setBaseModel('')
    }, [jobDialogProps])

    useEffect(() => {
        if (applyWorkloads.data?.succeed) {
            returnPage()
        }
    }, [applyWorkloads.data])

    const submitJobConfirm = () => {
        //submit jobs
        const dataBody = {
            "job": {
                "tasks": 1,
                "name": jobName,
                "standard_output": "starcloud-job-%j.out",
                "standard_error": "starcloud-job-%j.err",
                "current_working_directory": `${process.env.REACT_APP_OUTPUT_LOCATION}/${userInfo.name}/output-${Math.random().toString(36).slice(-8)}`,
                "environment": ["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"],
                "account": "default",
                "qos": "default",
                "partition": "normal"
            },
            "script": "#!/bin/bash\nsrun " + jobCMD
        }
        //TODO: 参数值潜入body

        const parsedArgs = parseArgs(otherOpt);
        console.log(parsedArgs)

        if (parsedArgs.partition) {
            dataBody.job['partition'] = parsedArgs.partition
        }

        if (parsedArgs.nodes) {
            dataBody.job['nodes'] = parsedArgs.nodes
        }

        if (parsedArgs.qos) {
            dataBody.job['qos'] = parsedArgs.qos
        }

        if (parsedArgs.account) {
            dataBody.job['account'] = parsedArgs.account
        }

        //TODO: finetune in docker
        if (trainTemp === 1) {
            dataBody.script = "#!/bin/bash\nsrun /home/test/ChatGLM-6B/ptuning/train.sh "
            dataBody.job.name = "chatglm-6b-finetune"
            dataBody.job.current_working_directory = `${process.env.REACT_APP_OUTPUT_LOCATION}/${userInfo.name}/output-${Math.random().toString(36).slice(-8)}`
        }

        // inference jobs
        if (jobDialogProps.jobType === 'inf') {
            switch (llmName) {
                // {1}: chatglm-6b
                // {2}: chatglm-6b-int4
                // {3}: chatglm2-6b
                // {4}: chatglm2-6b-int4
                // {5}: MOSS
                // {6}: Llama2-7B-Chat
                // {7}: midjourney
                // {8}: chatglm3-6b
                case 1:
                    dataBody.script = "#!/bin/bash\nsrun docker run -v /models/chatglm-6b:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 "
                    dataBody.job.name = "chatglm-6b-inference"
                    break;
                case 2:
                    dataBody.script = "#!/bin/bash\nsrun docker run -v /models/chatglm-6b-int4:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 "
                    dataBody.job.name = "chatglm-6b-int4-inference"
                    break;
                case 3:
                    dataBody.script = "#!/bin/bash\nsrun docker run -v /models/chatglm2-6b:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 "
                    dataBody.job.name = "chatglm2-6b-inference"
                    break;
                case 4:
                    dataBody.script = "#!/bin/bash\nsrun docker run -v /models/chatglm2-6b-int4:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 "
                    dataBody.job.name = "chatglm2-6b-int4-inference"
                    break;
                case 5:
                    dataBody.script = "#!/bin/bash\nsrun ls /models/MOSS"
                    dataBody.job.name = "moss-inference"
                    break;
                case 6:
                    dataBody.script = "#!/bin/bash\nsrun ls /models/Llama2-7B-Chat"
                    dataBody.job.name = "llama2-7B-Chat-inference"
                    break;
                case 7:
                    dataBody.script = "#!/bin/bash\nsrun ls /models/midjourney-inference"
                    dataBody.job.name = "midjourney-inference"
                    break;
                case 8:
                    dataBody.script = "#!/bin/bash\nsrun docker run -v /models/chatglm3-6b:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 "
                    dataBody.job.name = "chatglm3-6b-inference"
                    break;
                default:
                    dataBody.script = "#!/bin/bash\nsrun docker --version"
                    dataBody.job.name = "errorJob"
            }
        }


        // console.log(dataBody)
        jobConfirm(dataBody)
    }

    const returnPage = () => {
        jobCancel()
    }

    const submitApply = async(file) => {
        await applyWorkloads.request({'data': file})
    }
    const component = jobShow && jobDialogProps.jobType == 'oth' ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={jobShow}
            onClose={jobCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {jobDialogProps.title}-自定义作业
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    {/* <YamlEditor json={obj} onChange={handleChange} theme={oneDark}/> */}
                    <File
                        disabled={false}
                        fileType={'.yaml'}
                        onChange={(newValue) => submitApply(newValue)}
                        value={'Choose a file to upload'}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <StyledButton
                    variant='contained'
                    onClick={() => returnPage()}
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                >
                    {jobDialogProps.returnButtonName}
                </StyledButton>
                <StyledButton
                    disabled={!(jobCMD)}
                    variant='contained'
                    onClick={() => submitJobConfirm()}
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                >
                    {jobDialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) 
    : jobShow && jobDialogProps.jobType === 'inf' ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={jobShow}
            onClose={jobCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {jobDialogProps.title}-大模型推理
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            选择大模型
                            <span style={{ color: 'red' }}>&nbsp;*</span>
                        </Typography>
                    </Stack>
                    {/* <InputLabel id="demo-simple-select-label">选择大模型</InputLabel> */}
                    <Select
                        labelId="demo-simple-select-label"
                        fullWidth
                        id="demo-simple-select"
                        value={llmName}
                        label={llmName}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value={1}>chatglm-6b</MenuItem>
                        <MenuItem value={2}>chatglm-6b-int4</MenuItem>
                        <MenuItem value={3}>chatglm2-6b</MenuItem>
                        <MenuItem value={4}>chatglm2-6b-int4</MenuItem>
                        <MenuItem value={5}>MOSS</MenuItem>
                        <MenuItem value={6}>Llama2-7B-Chat</MenuItem>
                        <MenuItem value={7}>midjourney</MenuItem>
                        <MenuItem value={8}>chatglm3-6b</MenuItem>
                        <MenuItem value={99}> &nbsp; </MenuItem>
                    </Select>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            其它参数
                        </Typography>
                    </Stack>
                    <OutlinedInput
                        id='otherOpt'
                        type='string'
                        fullWidth
                        placeholder='作业运行参数，比如作业组，资源等特殊需求. e.g: partition=low qos=default account=default'
                        multiline={true}
                        // rows={3}
                        value={otherOpt}
                        name='otherOpt'
                        onChange={(e) => setOtherOpt(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <StyledButton
                    variant='contained'
                    onClick={() => returnPage()}
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                >
                    {jobDialogProps.returnButtonName}
                </StyledButton>
                <StyledButton
                    disabled={!(llmName)}
                    variant='contained'
                    onClick={() => submitJobConfirm()}
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                >
                    {jobDialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) : jobShow && jobDialogProps.jobType == 'tra' ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={jobShow}
            onClose={jobCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {jobDialogProps.title}-大模型训练
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            选择训练模版
                            <span style={{ color: 'red' }}>&nbsp;*</span>
                        </Typography>
                    </Stack>
                    <Select
                        labelId="template-select-label"
                        fullWidth
                        id="template-select"
                        value={trainTemp}
                        label="trainTemp"
                        onChange={handleTemplateChange}
                    >
                        <MenuItem value={1}>模型分布式微调</MenuItem>
                        <MenuItem value={2}>模型单机多卡微调</MenuItem>
                        {/* <MenuItem value={99}> &nbsp; </MenuItem> */}
                    </Select>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            模型
                            <span style={{ color: 'red' }}>&nbsp;*</span>
                        </Typography>
                    </Stack>
                    <OutlinedInput
                        id='baseModel'
                        type='string'
                        fullWidth
                        placeholder='输入BaseModel在环境中的位置. e.g: /root/models/chatglm-6b'
                        multiline={false}
                        // rows={3}
                        value={baseModel}
                        name='baseModel'
                        onChange={(e) => setBaseModel(e.target.value)}
                    />
                </Box>
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            训练参数
                        </Typography>
                    </Stack>
                    <OutlinedInput
                        id='trainPara'
                        type='string'
                        fullWidth
                        placeholder='大模型训练相关参数调整'
                        multiline={false}
                        // rows={3}
                        value={trainPara}
                        name='trainPara'
                        onChange={(e) => setTrainPara(e.target.value)}
                    />
                </Box>
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            其它参数
                        </Typography>
                    </Stack>
                    <OutlinedInput
                        id='otherOpt'
                        type='string'
                        fullWidth
                        placeholder='作业运行参数，比如作业组，资源等特殊需求. e.g: partition=low qos=default account=default'
                        multiline={true}
                        // rows={3}
                        value={otherOpt}
                        name='otherOpt'
                        onChange={(e) => setOtherOpt(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <StyledButton
                    variant='contained'
                    onClick={() => returnPage()}
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                >
                    {jobDialogProps.returnButtonName}
                </StyledButton>
                <StyledButton
                    disabled={!(trainTemp && baseModel)}
                    variant='contained'
                    onClick={() => submitJobConfirm()}
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                >
                    {jobDialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) 
    : null


    return createPortal(component, portalElement)
}

JobDialog.propTypes = {
    jobShow: PropTypes.bool,
    jobDialogProps: PropTypes.object,
    jobCancel: PropTypes.func,
    jobConfirm: PropTypes.func
}

export default JobDialog
