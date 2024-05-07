import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { Grid, Stack, IconButton, Link, Alert, Collapse, CircularProgress } from '@mui/material'
import { Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material'
import { Paper, Checkbox, Chip, Popover, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import { StyledButton } from 'ui-component/button/StyledButton'
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg'
import SyncIcon from '@mui/icons-material/Sync'
import CloseIcon from '@mui/icons-material/Close'

// Hooks
import useApi from 'hooks/useApi'

// utils
import useNotifier from 'utils/useNotifier'

// icons
import { IconPlus } from '@tabler/icons'
import useConfirm from 'hooks/useConfirm'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'
import rowMockDatas from './mockData'

import EnhancedTableToolbar from './enhancedtabletoolbar'
import EnhancedTableHead from './enhancedtablehead'
import { HeadCells } from './enhancedtablehead'
import AppDialog from './AppDialog'
import JobDialog from './JobDialog'
import jobAPI from 'api/jobs'
import useAuth from 'hooks/useAuth'
import JobDetails from './JobDetails'

// ==============================|| HPCJobs ||============================== //

const HPCJobs = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [isLoading, setLoading] = useState(false)
    const [trigger, setTrigger] = useState(true)
    const { userInfo } = useAuth()

    // *********************Code for HPCJobs*******************************//

    const getHPCJobs = useApi(jobAPI.getHPCJobs)
    const submitJobAPI = useApi(jobAPI.submitJob)
    const stopJobAPI = useApi(jobAPI.stopJob)
    const getHPCUser = useApi(jobAPI.getHPCUser)

    // handle job details dialog
    const [jobDetailOpen, setJobDetailOpen] = useState(false)
    const [jobData, setJobData] = useState({})

    // handle alert and user datas
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const [alertSeverity, setAlertSeverity] = useState('info')
    const [userDatas, setUserDatas] = useState([])
    const [pastDay, setPastDay] = useState(1)
    const [searchKeyword, setSearchKeyword] = useState()

    const getJobDetails = (jobID) => {
        setJobDetailOpen(true)
        rowDatas.map((job) => {
            if (job.job_id === jobID) {
                setJobData(job)
            }
        })
    }

    const cancelJobDetails = () => {
        setJobDetailOpen(false)
        setJobData({})
    }

    useNotifier()

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})

    // add job dialog
    const [showJobDialog, setJobShowDialog] = useState(false)
    const [jobDialogProps, setJobDialogProps] = useState({})

    // Enable below 2 lines to use mock data
    // const [tmp, setRowDatas] = useState([])
    // const rowDatas = rowMockDatas.jobAPIMockDatas.jobs
    const [rowDatas, setRowDatas] = useState([])

    // TODO: enable subJobs once finetune template is finished
    const subJobs = () => {
        const dialogProp = {
            title: '选择作业类型',
            type: 'Next',
            cancelButtonName: '取消',
            confirmButtonName: '下一步'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const refresh = async (params) => {
        setOpenAlert(false)
        setLoading(true)
        if (!params) {
            let current = Math.round(Date.now() / 1000)
            let start = current - pastDay * 24 * 3600
            params = 'end_time=' + current + '&start_time=' + start
        }
        await getHPCJobs.request(params)
        setLoading(false)
    }

    const onNext = (jobType) => {
        const jobDialogProp = {
            title: 'Job Submission',
            jobType: jobType,
            // returnButtonName: '上一步',
            returnButtonName: 'Cancel',
            confirmButtonName: 'Confirm'
        }
        setJobDialogProps(jobDialogProp)
        setJobShowDialog(true)
        setShowDialog(false)
    }

    const onCancel = () => {
        setJobDialogProps({})
        setJobShowDialog(false)
        setShowDialog(false)
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const jobConfirm = async (data) => {
        setJobShowDialog(false)
        await submitJobAPI.request(data)
        await delay(1500)
        refresh()
    }

    const jobCancel = () => {
        // setShowDialog(true)
        setShowDialog(false)
        setJobShowDialog(false)
    }

    useEffect(() => {
        setLoading(true)
        let current = Math.round(Date.now() / 1000)
        let start = current - pastDay * 24 * 3600
        getHPCJobs.request('end_time=' + current + '&start_time=' + start)
    }, [trigger])

    useEffect(() => {
        if (submitJobAPI.data && submitJobAPI.data.result && submitJobAPI.data.result.job_id) {
            setAlertMsg('Success submit the Job: ' + submitJobAPI.data.result.job_id)
            setAlertSeverity('success')
            setOpenAlert(true)
        }
    }, [submitJobAPI.data])

    useEffect(() => {
        if (submitJobAPI.error) {
            let errorMsg = 'Failed submit the job'
            if (submitJobAPI.error.message) {
                errorMsg = submitJobAPI.error.message
            }
            if (submitJobAPI.error.response && submitJobAPI.error.response.data && submitJobAPI.error.response.data.errors) {
                submitJobAPI.error.response.data.errors.map((err) => {
                    errorMsg += ', ' + err.error
                })
            }
            setAlertMsg(errorMsg)
            setAlertSeverity('error')
            setOpenAlert(true)
        }
    }, [submitJobAPI.error])

    useEffect(() => {
        if (getHPCJobs.data) {
            setRowDatas(getHPCJobs.data.jobs)
            setLoading(false)
        }

        getHPCUser.request(userInfo.name)
    }, [getHPCJobs.data])

    useEffect(() => {
        if (getHPCJobs.error) {
            setLoading(false)
        }
    }, [getHPCJobs.error])

    useEffect(() => {
        if (getHPCUser.data) {
            setUserDatas(getHPCUser.data.users[0].associations)
        }
    }, [getHPCUser.data])

    // *********To Here************//

    const stopJob = async (jobIDs) => {
        console.log('stop jobs:', jobIDs)
        jobIDs.forEach(async (jobID) => {
            await stopJobAPI.request(jobID)
        })
        refresh()
    }

    const { confirm } = useConfirm()
    const [anchorEl, setAnchorEl] = useState(null)
    const openPopOver = Boolean(anchorEl)
    const handleClosePopOver = () => {
        setAnchorEl(null)
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1
        }
        if (b[orderBy] > a[orderBy]) {
            return 1
        }
        return 0
    }

    //   type Order = 'asc' | 'desc';
    function getComparator(order, orderBy) {
        if (order === 'desc') {
            return (a, b) => descendingComparator(a, b, orderBy)
        } else {
            return (a, b) => -descendingComparator(a, b, orderBy)
        }
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index])
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0])
            if (order !== 0) {
                return order
            }
            return a[1] - b[1]
        })
        return stabilizedThis.map((el) => el[0])
    }

    const [order, setOrder] = useState('desc')
    const [orderBy, setOrderBy] = useState('job_id')
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = visibleRows.map((n) => ({ job_id: n.job_id }))
            setSelected(newSelected)
            return
        } else {
            setSelected([])
        }
    }

    const getRowID = (jobID, outputDIR) => {
        return (
            <Link
                component='button'
                variant='body2'
                // onClick={() => getJobOutput(jobID, outputDIR)}
                onClick={() => getJobDetails(jobID)}
            >
                {jobID}
            </Link>
        )
    }

    const handleRowSelectClick = (event, jobID) => {
        // const selectedIndex = selected.indexOf(name)
        const selectedIndex = selected.findIndex((selData) => selData.job_id === jobID)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, { job_id: jobID })
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }

        setSelected(newSelected)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const isRowSelected = (jobID) => selected.findIndex((selData) => selData.job_id === jobID) !== -1

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowDatas.length) : 0

    const visibleRows = useMemo(
        () => stableSort(rowDatas, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rowDatas]
    )

    const getShowAppStatus = (org_state) => {
        let tmpArray = []
        if (!Array.isArray(org_state)) {
            tmpArray[0] = org_state
        } else {
            tmpArray = org_state
        }
        let returnChips = null
        tmpArray.map((state) => {
            if (state === 'COMPLETED' || state === 'COMPLETING') {
                returnChips = (
                    <>
                        {returnChips} <Chip label='完成' color='primary' />
                    </>
                )
            } else if (state === 'PENDING') {
                returnChips = (
                    <>
                        {returnChips} <Chip label='等待' color='default' />
                    </>
                )
            } else if (state === 'RUNNING') {
                returnChips = (
                    <>
                        {returnChips} <Chip label='运行' color='success' />{' '}
                    </>
                )
            } else if (state === 'FAILED') {
                returnChips = (
                    <>
                        {returnChips} <Chip label='出错' color='error' />
                    </>
                )
            } else if (state === 'PREEMPTED') {
                returnChips = (
                    <>
                        {returnChips} <Chip label='被抢占' color='secondary' />
                    </>
                )
            } else if (state === 'SUSPEND' || state === 'SUSPENDED') {
                returnChips = (
                    <>
                        {returnChips} <Chip label='暂停' color='default' />
                    </>
                )
            } else if (state === 'CANCELLED') {
                returnChips = (
                    <>
                        {returnChips} <Chip label='停止' color='warning' />
                    </>
                )
            } else {
                returnChips = (
                    <>
                        {returnChips} <Chip label='未知' color='info' />
                    </>
                )
            }
        })
        return returnChips
    }

    const setFilter = (key) => {
        let p = 1
        if (key == 'past1day') {
            setPastDay(1)
        } else if (key == 'past1week') {
            setPastDay(7)
            p = 7
        } else if (key == 'past2week') {
            setPastDay(14)
            p = 14
        }
        let current = Math.round(Date.now() / 1000)
        let start = current - p * 24 * 3600
        let params = 'end_time=' + current + '&start_time=' + start
        if (searchKeyword) {
            params = params + '&job_name=' + searchKeyword
        }
        refresh(params)
    }
    const startSearch = (key) => {
        let current = Math.round(Date.now() / 1000)
        let start = current - pastDay * 24 * 3600
        let params = 'end_time=' + current + '&start_time=' + start + '&job_name=' + key
        setSearchKeyword(key)
        refresh(params)
    }

    return (
        <>
            <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
                <Stack flexDirection='row'>
                    <Grid sx={{ mb: 1.25 }} container direction='row' width={'100%'}>
                        <h1>Job Information</h1>
                        <Box sx={{ flexGrow: 1 }} />
                        <Grid item>
                            <IconButton aria-label='sync' size='small' onClick={() => refresh()}>
                                <SyncIcon fontSize='inherit' />
                            </IconButton>
                            <StyledButton
                                variant='contained'
                                sx={{
                                    color: 'white',
                                    background: theme.palette.secondary.iconBg,
                                    ':hover': { background: theme.palette.secondary.iconHover }
                                }}
                                // onClick={subJobs}
                                onClick={() => onNext('oth')}
                                startIcon={<IconPlus />}
                            >
                                Submit
                            </StyledButton>
                        </Grid>
                    </Grid>
                </Stack>
                <Box sx={{ width: '100%' }}>
                    <Collapse in={openAlert}>
                        <Alert
                            severity={alertSeverity}
                            action={
                                <IconButton
                                    aria-label='close'
                                    color='inherit'
                                    size='small'
                                    onClick={() => {
                                        setOpenAlert(false)
                                    }}
                                >
                                    <CloseIcon fontSize='inherit' />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            {alertMsg}
                        </Alert>
                    </Collapse>
                </Box>
                <Box sx={{ width: '100%' }}>
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        selectRows={selected}
                        stopJob={stopJob}
                        setFilter={setFilter}
                        setSelected={setSelected}
                        startSearch={startSearch}
                    />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={visibleRows.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isRowSelected(row.job_id)
                                    const labelId = `enhanced-table-checkbox-${index}`
                                    return (
                                        <TableRow
                                            hover
                                            // onClick={(event) => handleRowSelectClick(event, row.id, row.name)}
                                            role='checkbox'
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.job_id + '_' + index}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding='checkbox'>
                                                <Checkbox
                                                    color='primary'
                                                    onClick={(event) => handleRowSelectClick(event, row.job_id)}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                    checked={isItemSelected}
                                                />
                                            </TableCell>
                                            <TableCell component='th' id={labelId} scope='row' padding='none'>
                                                {getRowID(row.job_id, row.standard_output)}
                                            </TableCell>
                                            <TableCell align={HeadCells[1].align}>
                                                {row.partition ? <div style={{ whiteSpace: 'nowrap' }}>{row.partition}</div> : '-'}
                                            </TableCell>
                                            <TableCell align={HeadCells[2].align}>{row.name ? row.name : '-'}</TableCell>
                                            <TableCell align={HeadCells[3].align}>{getShowAppStatus(row.state.current)}</TableCell>
                                            <TableCell align={HeadCells[4].align}>{row.state.reason ? row.state.reason : '-'}</TableCell>
                                            <TableCell align={HeadCells[5].align}>
                                                {row.allocation_nodes ? row.allocation_nodes : '-'}
                                            </TableCell>
                                            <TableCell align={HeadCells[6].align}>
                                                {row.time.submission ? new Date(row.time.submission * 1000).toLocaleString() : '-'}
                                            </TableCell>
                                            <TableCell align={HeadCells[7].align}>
                                                {row.time.start ? new Date(row.time.start * 1000).toLocaleString() : '-'}
                                            </TableCell>
                                            <TableCell align={HeadCells[8].align}>{row.account ? row.account : '-'}</TableCell>
                                            <TableCell align={HeadCells[9].align}>{row.user ? row.user : '-'}</TableCell>
                                        </TableRow>
                                    )
                                })}
                                {emptyRows > 0 ? (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component='div'
                        count={rowDatas.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <Popover
                        open={openPopOver}
                        anchorEl={anchorEl}
                        onClose={handleClosePopOver}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                    >
                        <Typography variant='h6' sx={{ pl: 1, pr: 1, color: 'white', background: theme.palette.success.dark }}>
                            Copyed
                        </Typography>
                    </Popover>
                    <ConfirmDialog />
                    <JobDetails showDetails={jobDetailOpen} onCancel={cancelJobDetails} jobData={jobData} />
                </Box>
                {!isLoading && visibleRows.length === 0 && (
                    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                        <Box sx={{ p: 2, height: 'auto' }}>
                            <img
                                style={{ objectFit: 'cover', height: '30vh', width: 'auto' }}
                                src={WorkflowEmptySVG}
                                alt='WorkflowEmptySVG'
                            />
                        </Box>
                        <div>No Jobs</div>
                    </Stack>
                )}
            </MainCard>
            <AppDialog show={showDialog} dialogProps={dialogProps} onCancel={onCancel} onNext={onNext}></AppDialog>
            <JobDialog
                jobShow={showJobDialog}
                jobDialogProps={jobDialogProps}
                userDatas={userDatas}
                // jobCancel={() => setJobShowDialog(false)}
                jobCancel={jobCancel}
                jobConfirm={jobConfirm}
            ></JobDialog>
            {isLoading && (
                <CircularProgress
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        index: 99999
                    }}
                />
            )}
        </>
    )
}

export default HPCJobs
