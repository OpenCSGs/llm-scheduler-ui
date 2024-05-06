import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { Grid, Stack, IconButton } from '@mui/material'
import { Tab, Box, Table, TableContainer, TablePagination } from '@mui/material'
import { Paper, FormControl, Select, MenuItem, OutlinedInput } from '@mui/material'
import { useTheme } from '@mui/material/styles'


// project imports
import MainCard from 'ui-component/cards/MainCard'
import { StyledButton } from 'ui-component/button/StyledButton'
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg'
import SyncIcon from '@mui/icons-material/Sync'
import { TabContext, TabList, TabPanel } from '@mui/lab'

// Hooks
import useApi from 'hooks/useApi'

// utils
import useNotifier from 'utils/useNotifier'

// icons
import { IconPlus } from '@tabler/icons'

import EnhancedPodTableHead from '../k8sjobs/enhancedpodtablehead'
import PodTableBody from '../k8sjobs/podtablebody'
import DeployTableBody from './deploytablebody'
import ServiceTableBody from './servicetablebody'
import EnhancedDeployTableHead from '../k8sjobs/enhanceddeploytablehead'
import EnhancedServiceTableHead from '../k8sjobs/enhancedservicetablehead'
import AppDialog from './AppDialog'
import JobDialog from './JobDialog'
import jobAPI from 'api/jobs'

// ==============================|| K8SJobs ||============================== //

const K8SJobs = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [isLoading, setLoading] = useState(false)
    const [trigger, setTrigger] = useState(true)

    // *********************Code for K8SJobs*******************************//

    const getK8SPods = useApi(jobAPI.getK8SPods)
    const getK8SSvs = useApi(jobAPI.getK8SSvs)
    const getK8SDeploy = useApi(jobAPI.getK8SDeploy)
    const getK8SNs = useApi(jobAPI.getK8SNs)
    const submitJobAPI = useApi(jobAPI.submitJob)

    // handle job output dialog
    const [open, setOpen] = useState(false);
    const descriptionElementRef = useRef(null);
    const [tab, setTab] = useState('Pods');
    const [nameSpace, setNameSpace] = useState('全部命名空间');
    const [nameSpaces, setNameSpaces] = useState([]);
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})

    // add job dialog
    const [showJobDialog, setJobShowDialog] = useState(false)
    const [jobDialogProps, setJobDialogProps] = useState({})
    const [rowPodDatas, setrowPodDatas] = useState([])
    const [rowDepDatas, setrowDepDatas] = useState([])
    const [rowSvsDatas, setrowSvsDatas] = useState([])

    const handleTabChange = (event, newValue, nameSpaceSelected) => {
        setTab(newValue);
        if (nameSpaceSelected == '全部命名空间') {
            nameSpaceSelected = ''
        }
        if (newValue == 'Deployments') {
            getK8SDeploy.request(nameSpaceSelected)
        } else if (newValue == 'Pods') {
            getK8SPods.request(nameSpaceSelected)
        } else if (newValue == 'Services') {
            getK8SSvs.request(nameSpaceSelected)
        }
    }

    const handleNameSpaceChange = (event) => {

        setNameSpace(event.target.value)
        handleTabChange(null, tab, event.target.value)
    }

    const handleClose = () => {
        setOpen(false);
        setJobOutput('')
    };

    useNotifier()

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

    const refresh = async () => {
        setLoading(true)
        handleTabChange(null, tab, nameSpace)
        setLoading(false)
    }

    const onNext = (jobType) => {
        const jobDialogProp = {
            title: '提交作业',
            jobType: jobType,
            returnButtonName: '上一步',
            confirmButtonName: '确认'
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

    const jobConfirm = async (data) => {
        setJobShowDialog(false)
        await submitJobAPI.request(data)
        refresh()
    }

    const jobCancel = () => {
        setShowDialog(true)
        setJobShowDialog(false)
    }

    useEffect(() => {
        getK8SNs.request()
        handleTabChange(null, tab, nameSpace)
    }, [trigger])

    useEffect(() => {
        if (getK8SPods.data) {
            setrowPodDatas(getK8SPods.data)
        }
    }, [getK8SPods.data])

    useEffect(() => {
        if (getK8SDeploy.data) {
            setrowDepDatas(getK8SDeploy.data)
        }
    }, [getK8SDeploy.data])

    useEffect(() => {
        if (getK8SSvs.data) {
            setrowSvsDatas(getK8SSvs.data)
        }
    }, [getK8SSvs.data])

    useEffect(() => {
        if (getK8SNs.data) {
            setNameSpaces(getK8SNs.data)
        }
    }, [getK8SNs.data])

    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    // *********To Here************//


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

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowPodDatas.length) : 0

    const podVisibleRows = useMemo(
        () => stableSort(rowPodDatas, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rowPodDatas]
    )

    const depVisibleRows = useMemo(
        () => stableSort(rowDepDatas, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rowDepDatas]
    )

    const svsVisibleRows = useMemo(
        () => stableSort(rowSvsDatas, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rowSvsDatas]
    )

    return (
        <>
            <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
                <Stack flexDirection='row'>
                    <h1>服务信息</h1>
                    <Grid sx={{ mb: 1.25 }} container direction='row' width={'80%'}>
                        <Box sx={{ flexGrow: 1 }} />
                        <Grid item>
                            <IconButton aria-label="sync" size="small" onClick={refresh}>
                                <SyncIcon fontSize="inherit" />
                            </IconButton>
                            <StyledButton
                                variant='contained'
                                sx={{
                                    color: 'white',
                                    background: theme.palette.secondary.iconBg,
                                    ':hover': { background: theme.palette.secondary.iconHover }
                                }}
                                onClick={subJobs}
                                startIcon={<IconPlus />}
                            >
                                服务部署
                            </StyledButton>
                        </Grid>
                    </Grid>
                </Stack>
                <TabContext value={tab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Stack flexDirection='row'>
                            <TabList onChange={(event, value) => {
                                handleTabChange(event, value, nameSpace)
                            }}
                                aria-label="k8s workloads tabs">
                                <Tab label="Services" value="Services" />
                                <Tab label="Deployments" value="Deployments" />
                                <Tab label="Pods" value="Pods" />
                            </TabList>
                            <FormControl direction='row'
                                sx={{ minWidth: 140, mt: 0.5, left: 50 }}
                                align="center"
                                size="small">
                                <Select
                                    value={nameSpace}
                                    onChange={handleNameSpaceChange}
                                    input={<OutlinedInput />}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="全部命名空间">
                                        全部命名空间
                                    </MenuItem>
                                    {nameSpaces.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Box>
                    <TabPanel value="Pods">
                        {getK8SPods.data && podVisibleRows.length > 0 ? (
                            <Box sx={{ width: '100%' }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
                                        <EnhancedPodTableHead
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}
                                        />
                                        <PodTableBody
                                            visibleRows={podVisibleRows}
                                            emptyRows={emptyRows}
                                        />
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component='div'
                                    count={rowPodDatas.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Box>
                        ) : (
                            ''
                        )}
                        {!isLoading && (podVisibleRows.length === 0) && (
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                                <Box sx={{ p: 2, height: 'auto' }}>
                                    <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt='WorkflowEmptySVG' />
                                </Box>
                                <div>还没有Pods</div>
                            </Stack>
                        )}
                    </TabPanel>
                    <TabPanel value="Deployments">
                        {getK8SDeploy.data && podVisibleRows.length > 0 ? (
                            <Box sx={{ width: '100%' }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
                                        <EnhancedDeployTableHead
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}
                                        />
                                        <DeployTableBody
                                            visibleRows={depVisibleRows}
                                            emptyRows={emptyRows}
                                        />
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component='div'
                                    count={rowPodDatas.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Box>
                        ) : (
                            ''
                        )}
                        {!isLoading && (podVisibleRows.length === 0) && (
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                                <Box sx={{ p: 2, height: 'auto' }}>
                                    <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt='WorkflowEmptySVG' />
                                </Box>
                                <div>还没有Deployment</div>
                            </Stack>
                        )}
                    </TabPanel>
                    <TabPanel value="Services">
                        {getK8SSvs.data && podVisibleRows.length > 0 ? (
                            <Box sx={{ width: '100%' }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
                                        <EnhancedServiceTableHead
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}
                                        />
                                        <ServiceTableBody
                                            visibleRows={svsVisibleRows}
                                            emptyRows={emptyRows}
                                        />
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component='div'
                                    count={rowPodDatas.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Box>
                        ) : (
                            ''
                        )}
                        {!isLoading && (podVisibleRows.length === 0) && (
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                                <Box sx={{ p: 2, height: 'auto' }}>
                                    <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt='WorkflowEmptySVG' />
                                </Box>
                                <div>还没有Services</div>
                            </Stack>
                        )}
                    </TabPanel>
                </TabContext>
            </MainCard >
            <AppDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={onCancel}
                onNext={onNext}
            ></AppDialog>
            <JobDialog
                jobShow={showJobDialog}
                jobDialogProps={jobDialogProps}
                // jobCancel={() => setJobShowDialog(false)}
                jobCancel={jobCancel}
                jobConfirm={jobConfirm}
            ></JobDialog>
        </>
    )
}

export default K8SJobs
