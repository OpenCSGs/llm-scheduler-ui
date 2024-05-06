import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// material-ui
import { Grid, Stack, Tab } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import { TabContext, TabList, TabPanel } from '@mui/lab'
// import Tooltip from '@mui/material/Tooltip'
import { REMOVE_DIRTY, enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'
import { useDispatch } from 'react-redux'

// Hooks
import useApi from 'hooks/useApi'

import nodesAPI from 'api/nodes'

// utils
import useNotifier from 'utils/useNotifier'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
// import Checkbox from '@mui/material/Checkbox'
import { Popover, Typography } from '@mui/material'
import useConfirm from 'hooks/useConfirm'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'

import EnhancedTableToolbar from './enhancedtabletoolbar'
import EnhancedTableHead from './enhancedtablehead'
import { HeadCells } from './enhancedtablehead'
import config from 'config'

// ==============================|| Resources ||============================== //

const Resources = () => {
    const navigate = useNavigate()

    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [isLoading, setLoading] = useState(false)
    const [images, setImages] = useState({})
    const [trigger, setTrigger] = useState(true)
    const [exportedApps, setexportedApps] = useState([])
    const [rowDatas, setRowDatas] = useState([])

    const dispatch = useDispatch()
    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const getHPCNodes = useApi(nodesAPI.getHPCNodes)
    const getK8sNodes = useApi(nodesAPI.getK8sNodes)
    const updateNode = useApi(nodesAPI.updateNode)
    const [tab, setTab] = React.useState('hpc')

    const handleChange = (event, newValue) => {
        setTab(newValue)
        if (newValue == 'hpc') {
            getHPCNodes.request()
        } else {
            getK8sNodes.request()
        }
    }

    useEffect(() => {
        getHPCNodes.request()
    }, [trigger])

    useEffect(() => {
        if (getHPCNodes.data) {
            setRowDatas(getHPCNodes.data.nodes)
        }
    }, [getHPCNodes.data])

    useEffect(() => {
        if (getK8sNodes.data) {
            setRowDatas(getK8sNodes.data.nodes)
        }
    }, [getK8sNodes.data])

    // const rowDatas = rowMockDatas.nodes
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

    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('name')
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
            const newSelected = visibleRows.map((n) => ({ name: n.name }))
            setSelected(newSelected)
            return
        } else {
            setSelected([])
        }
    }

    const handleRowSelectClick = (event, name) => {
        // const selectedIndex = selected.indexOf(name)
        const selectedIndex = selected.findIndex((selData) => selData.name === name)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, { name: name })
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

    const isRowSelected = (name) => selected.findIndex((selData) => selData.name === name) !== -1

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowDatas.length) : 0

    const visibleRows = useMemo(
        () => stableSort(rowDatas, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rowDatas]
    )

    const closeNode = (data) => {
        if (data.name) {
            const updateBody = {
                state: ['DOWN']
            }
            updateNode.request(data.name, updateBody)
        }
    }
    const openNode = (data) => {
        if (data.name) {
            const updateBody = {
                state: ['IDLE']
            }
            updateNode.request(data.name, updateBody)
        }
    }

    return (
        <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label='lab API tabs example'>
                        <Tab label='HPC资源' value='hpc' />
                        {config.FEATURE_TOGGLE_K8S && <Tab label='Kubernetes资源' value='k8s' />}
                    </TabList>
                </Box>
                <TabPanel value='hpc'>
                    {getHPCNodes.data && visibleRows.length > 0 && (
                        <Box sx={{ width: '100%' }}>
                            <EnhancedTableToolbar
                                numSelected={selected.length}
                                selectRows={selected}
                                setSelected={setSelected}
                                closeNode={closeNode}
                                openNode={openNode}
                            />
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onSelectAllClick={handleSelectAllClick}
                                        onRequestSort={handleRequestSort}
                                        rowCount={rowDatas.length}
                                    />
                                    <TableBody>
                                        {visibleRows.map((row, index) => {
                                            const isItemSelected = isRowSelected(row.name)
                                            const labelId = `enhanced-table-checkbox-${index}`
                                            return (
                                                <TableRow
                                                    hover
                                                    // onClick={(event) => handleRowSelectClick(event, row.id, row.name)}
                                                    role='checkbox'
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.name}
                                                    selected={isItemSelected}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    {/* <TableCell padding='checkbox'>
                                                        <Checkbox
                                                            color='primary'
                                                            onClick={(event) => handleRowSelectClick(event, row.name)}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            checked={isItemSelected}
                                                        />
                                                    </TableCell> */}
                                                    <TableCell
                                                        align={HeadCells[0].align}
                                                        component='th'
                                                        id={labelId}
                                                        scope='row'
                                                        padding='none'
                                                    >
                                                        {row.hostname}
                                                    </TableCell>
                                                    <TableCell>{row.cores}</TableCell>
                                                    <TableCell>{row.cpus}</TableCell>
                                                    <TableCell>{row.gres || '-'}</TableCell>
                                                    <TableCell align='right'>{row.cpu_load}</TableCell>
                                                    <TableCell align='right'>{row.real_memory} MB</TableCell>
                                                    <TableCell align='right'>{row.weight}</TableCell>
                                                    <TableCell align='right'>{row.state.toString()}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
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
                                    已复制
                                </Typography>
                            </Popover>
                            <ConfirmDialog />
                        </Box>
                    )}
                </TabPanel>
                <TabPanel value='k8s'>
                    {getK8sNodes.data && visibleRows.length > 0 && (
                        <Box sx={{ width: '100%' }}>
                            <EnhancedTableToolbar
                                numSelected={selected.length}
                                selectRows={selected}
                                setSelected={setSelected}
                                closeNode={closeNode}
                                openNode={openNode}
                            />
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onSelectAllClick={handleSelectAllClick}
                                        onRequestSort={handleRequestSort}
                                        rowCount={rowDatas.length}
                                    />
                                    <TableBody>
                                        {visibleRows.map((row, index) => {
                                            const isItemSelected = isRowSelected(row.name)
                                            const labelId = `enhanced-table-checkbox-${index}`
                                            return (
                                                <TableRow
                                                    hover
                                                    // onClick={(event) => handleRowSelectClick(event, row.id, row.name)}
                                                    role='checkbox'
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.name}
                                                    selected={isItemSelected}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    {/* <TableCell padding='checkbox'>
                                                        <Checkbox
                                                            color='primary'
                                                            onClick={(event) => handleRowSelectClick(event, row.name)}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            checked={isItemSelected}
                                                        />
                                                    </TableCell> */}
                                                    <TableCell
                                                        align={HeadCells[0].align}
                                                        component='th'
                                                        id={labelId}
                                                        scope='row'
                                                        padding='none'
                                                    >
                                                        {row.hostname}
                                                    </TableCell>
                                                    <TableCell>{row.cores}</TableCell>
                                                    <TableCell>{row.cpus}</TableCell>
                                                    <TableCell>{row.gres}</TableCell>
                                                    <TableCell align={HeadCells[4].align}>{row.real_memory} MB</TableCell>
                                                    <TableCell align={HeadCells[5].align}>-</TableCell>
                                                    <TableCell align={HeadCells[6].align}>{row.state.toString()}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={7} />
                                            </TableRow>
                                        )}
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
                                    已复制
                                </Typography>
                            </Popover>
                            <ConfirmDialog />
                        </Box>
                    )}
                </TabPanel>
            </TabContext>
        </MainCard>
    )
}

export default Resources
