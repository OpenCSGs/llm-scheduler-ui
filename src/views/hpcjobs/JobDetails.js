import React, { useState, useEffect } from 'react'
import { IconButton, Box, Tab, Dialog, DialogTitle, Slide } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CloseIcon from '@mui/icons-material/Close'
import JobTab from './JobTab'
import JobDataTab from './JobDataTab'
// Hooks
import useApi from 'hooks/useApi'
import jobAPI from 'api/jobs'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='left' ref={ref} {...props} />
})

const JobDetails = (props) => {
    const getSpecificJob = useApi(jobAPI.getSpecificJob)
    const { showDetails, onCancel, jobData } = props
    const [summaryTable, setSummaryTable] = useState('summary')
    const [jobDetails, setjobDetails] = useState({})
    const handleTabChange = (event, newValue) => {
        setSummaryTable(newValue)
    }

    useEffect(() => {
        if (showDetails) {
            setSummaryTable('summary')
            getSpecificJob.request(jobData.job_id)
        }
    }, [showDetails])

    useEffect(() => {
        if (getSpecificJob.data) {
            setjobDetails(getSpecificJob.data.jobs[0])
        }
    }, [getSpecificJob.data])

    return (
        <Dialog
            PaperProps={{
                sx: {
                    position: 'fixed',
                    top: 28,
                    right: 0,
                    m: 5,
                    mr: 2,
                    width: '40%',
                    height: '100%'
                }
            }}
            open={showDetails}
            TransitionComponent={Transition}
            keepMounted
            onClose={onCancel}
            aria-describedby='alert-dialog-slide-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }}>{'作业详情'}</DialogTitle>
            <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 20,
                    color: (theme) => theme.palette.grey[500]
                }}
                onClick={onCancel}
            >
                <CloseIcon fontSize='inherit' />
            </IconButton>
            <TabContext value={summaryTable}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label='lab API summaryTables example'>
                        <Tab label='汇总' value='summary' />
                        <Tab label='数据' value='data' />
                    </TabList>
                </Box>
                <TabPanel value='summary'>
                    <JobTab jobData={jobDetails} />
                </TabPanel>
                <TabPanel value='data'>
                    <JobDataTab jobData={jobDetails} parent_triger={showDetails} />
                </TabPanel>
            </TabContext>
        </Dialog>
    )
}

export default JobDetails
