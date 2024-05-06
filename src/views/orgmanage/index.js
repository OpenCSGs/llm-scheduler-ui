import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { Box, Checkbox, Button, CircularProgress, CssBaseline, Popover, Typography } from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper } from '@mui/material'
import MainCard from 'ui-component/cards/MainCard'
import StyledTreeItem from 'ui-component/treeview/StyledTreeItem'
import EnhancedTableToolbar from './enhancedtabletoolbar'
import EnhancedTableHead from './enhancedtablehead'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from 'ui-component/alert/Alert'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'
import { StyledMenu } from 'ui-component/menu/StyledMenu'
import accountAPI from 'api/useraccount'
import useApi from 'hooks/useApi'
import OrganizationDialog from './OrganizationDialog'
import MoveUsersDialog from './MoveUsersDialog'
import useConfirm from 'hooks/useConfirm'
import ModifyLimitDialog from './ModifyLimitDialog'

export default function OrgManage() {
    const theme = useTheme()
    const { confirm } = useConfirm()
    const drawerWidth = 240
    const customization = useSelector((state) => state.customization)
    const [rowDatas, setRowDatas] = useState([])
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('user')
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [anchorEl, setAnchorEl] = useState(null)
    const openPopOver = Boolean(anchorEl)
    const [isLoading, setIsLoading] = useState(true)
    const getAccounts = useApi(accountAPI.getAccounts)
    const setDefaultAccount = useApi(accountAPI.updateUsers)
    const addAccounts = useApi(accountAPI.addAccounts)
    const deleteAccount = useApi(accountAPI.deleteAccount)
    const setAdmin = useApi(accountAPI.setAdmin)
    const addAssociations = useApi(accountAPI.addAssociations)
    const getLimit = useApi(accountAPI.getAssociation)
    const removeAssociations = useApi(accountAPI.removeAssociations)
    const [trigger, setTrigger] = useState(true)
    const [organizations, setOrganizations] = useState({})
    const [selectedNode, setSelectedNode] = useState('org0')
    const [title, setTitle] = useState(null)
    const [showOrgDialog, setShowOrgDialog] = useState(false)
    const [showMoveUserDialog, setShowMoveUserDialog] = useState(false)
    const [showModifyLimitDialog, setShowModifyLimitDialog] = useState(false)
    const [message, setMessage] = useState({ display: false, content: '', type: 'info' })
    const [moveUserProps, setMoveUserProps] = useState(null)
    const [currentOrg, setCurrentOrg] = useState()
    const [currentGroup, setCurrentGroup] = useState()
    const [currentLimit, setCurrentLimit] = useState()

    useEffect(() => {
        getAccounts.request('with_assocs=true')
    }, [trigger])

    useEffect(() => {
        if (getAccounts.data) {
            let organizations = {}
            let orgs = getAccounts.data.accounts
            for (let org of orgs) {
                if (organizations[org.organization]) {
                    if (!organizations[org.organization][org.name]) {
                        organizations[org.organization][org.name] = org.associations
                    }
                } else {
                    // org.name is the group name
                    organizations[org.organization] = {}
                    organizations[org.organization][org.name] = org.associations
                }
            }
            setOrganizations(organizations)
            // trigger user tables,focus first node
            if (selectedNode && currentOrg && currentGroup) {
                focusNode(selectedNode, currentOrg, currentGroup, organizations)
            } else {
                focusNode('org0', Object.keys(organizations)[0])
            }
            setIsLoading(false)
        }
    }, [getAccounts.data])

    const loopGroup = (org, g, users, orgs) => {
        let localOrgs = organizations
        if (orgs) {
            localOrgs = orgs
        }
        if (!localOrgs[org]) {
            return
        }
        for (let u of localOrgs[org][g]) {
            let index = users.findIndex((e) => e.user === u.user)
            if (index > -1) {
                //merge it
                let oldU = users[index]
                if (oldU.account.indexOf(u.account) == -1) {
                    oldU.account = oldU.account + ',' + u.account
                }
                if (oldU.partition.indexOf(u.partition) == -1) {
                    oldU.partition = oldU.partition + ',' + u.partition
                }
                if (oldU.cluster.indexOf(u.cluster) == -1) {
                    oldU.cluster = oldU.cluster + ',' + u.cluster
                }
            } else {
                // add it
                users.push(u)
            }
        }
    }

    const focusNode = (selectedNode, org, group, orgs) => {
        let users = []
        setSelected([])
        setSelectedNode(selectedNode)
        setPage(0)
        if (group) {
            setTitle('分组: ' + group)
            loopGroup(org, group, users, orgs)
            setRowDatas(users)
            setCurrentGroup(group)
            setCurrentOrg(org)
            if (users.length > 0) {
                getLimit.request('id=' + users[0]['id'])
            }
        } else {
            setTitle('组织: ' + org)
            for (let g in organizations[org]) {
                loopGroup(org, g, users)
            }
            setRowDatas(users)
        }
    }

    useEffect(() => {
        if (getLimit.data) {
            setCurrentLimit(getLimit.data.associations[0])
        }
    }, [getLimit.data])

    useEffect(() => {
        if (getAccounts.error) {
            setIsLoading(false)
        }
    }, [getAccounts.error])

    const handleMessageClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        let newMsg = Object.assign({}, message)
        newMsg.display = false
        setMessage(newMsg)
    }
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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(visibleRows)
            return
        } else {
            setSelected([])
        }
    }

    const handleRowSelectClick = (event, row) => {
        // const selectedIndex = selected.indexOf(name)
        const selectedIndex = selected.findIndex((selData) => selData.user === row.user)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row)
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

    const isRowSelected = (user) => selected.findIndex((selData) => selData.user === user) !== -1

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowDatas.length) : 0

    const visibleRows = useMemo(
        () => stableSort(rowDatas, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rowDatas]
    )

    const addOrg = (orgName, accountName, desc) => {
        setShowOrgDialog(false)
        let data = {
            accounts: [
                {
                    name: accountName,
                    description: desc,
                    organization: orgName
                }
            ]
        }
        addAccounts.request(data)
    }

    useEffect(() => {
        if (addAccounts.data) {
            setMessage({
                display: true,
                content: '新组织添加成功',
                type: 'success'
            })
            setTrigger(!trigger)
        }
    }, [addAccounts.data])

    useEffect(() => {
        if (addAccounts.error) {
            console.log(addAccounts.error)
            setMessage({
                display: true,
                content: '添加组织失败',
                type: 'error'
            })
        }
    }, [addAccounts.error])

    useEffect(() => {
        if (deleteAccount.data) {
            console.log(deleteAccount.data)
            setMessage({
                display: true,
                content: '删除分组成功',
                type: 'success'
            })
            setTrigger(!trigger)
        }
    }, [deleteAccount.data])

    useEffect(() => {
        if (deleteAccount.error) {
            setMessage({
                display: true,
                content: '删除分组失败',
                type: 'error'
            })
        }
    }, [deleteAccount.error])

    useEffect(() => {
        if (setAdmin.data) {
            setMessage({
                display: true,
                content: '设置admin成功',
                type: 'success'
            })
        }
    }, [setAdmin.data])

    useEffect(() => {
        if (setAdmin.error) {
            console.log(setAdmin.error)
            setMessage({
                display: true,
                content: '设置admin失败',
                type: 'error'
            })
        }
    }, [setAdmin.error])

    const tree_operation = (actionId, itemId) => {
        if (actionId == 'delete_group') {
            deleteAccount.request(itemId)
        } else if (actionId == 'add_group') {
            setShowOrgDialog(true)
            setCurrentOrg(itemId)
        }
    }
    const row_operation = (actionId, row) => {
        console.log(actionId, row)
        if (actionId == 'set_admin') {
            let data = {
                users: [
                    {
                        name: row.user,
                        administrator_level: ['Administrator']
                    }
                ]
            }
            setAdmin.request(data)
        }
    }

    const rows_operation = async (actionId, itemId) => {
        let props = {}
        if (actionId == 'remove_memeber') {
            let names = selected.map(function (item) {
                return item['user']
            })
            props = {
                title: '移出成员',
                description: '确定移出: ' + names.toString() + '?',
                confirmButtonName: '确定'
            }
            const isConfirmed = await confirm(props)
            if (isConfirmed) {
                removeMember()
            }
        } else if (actionId == 'add_memeber') {
            props = {
                title: '添加成员',
                existingUsers: rowDatas,
                target: currentGroup
            }
            setMoveUserProps(props)
            setShowMoveUserDialog(true)
        } else if (actionId == 'modify_limits') {
            setShowModifyLimitDialog(true)
        }
    }

    const addMembers = async (associations) => {
        setShowMoveUserDialog(false)
        setMoveUserProps(null)
        setIsLoading(true)
        await addAssociations.request({
            associations: associations
        })

        setIsLoading(false)
    }

    useEffect(() => {
        if (addAssociations.data) {
            setMessage({
                display: true,
                content: '添加成功',
                type: 'success'
            })
            setTrigger(!trigger)
        }
    }, [addAssociations.data])

    const removeMember = async () => {
        setIsLoading(true)
        for (let s of selected) {
            let params = 'account=' + currentGroup + '&user=' + s.user + '&cluster=' + s.cluster
            await removeAssociations.request(params)
        }
        setMessage({
            display: true,
            content: '修改成功',
            type: 'success'
        })
        setTrigger(!trigger)
        setIsLoading(false)
    }

    useEffect(() => {
        if (removeAssociations.error && removeAssociations.error.response) {
            let data = removeAssociations.error.response.data
            setMessage({
                display: true,
                content: '移出失败: ' + data['errors'][0]['error'],
                type: 'error'
            })
        }
    }, [removeAssociations.error])

    const addLimist = (partition, qosList) => {
        let associations = []
        rowDatas.forEach((o) => {
            let account = {
                account: currentGroup,
                cluster: 'cluster-opencsg',
                user: o.user,
                parent_account: 'root',
                partition: partition,
                qos: qosList
            }
            associations.push(account)
        })
        addAssociations.request({
            associations: associations
        })
        setShowModifyLimitDialog(false)
    }

    return (
        <>
            <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <Box
                        component='nav'
                        sx={{
                            width: { sm: drawerWidth },
                            padding: '16px',
                            borderTopLeftRadius: '10px',
                            borderBottomLeftRadius: '10px',
                            borderCollapse: 'collapse',
                            flexShrink: { sm: 0 },
                            border: '1px solid #eee',
                            borderRight: '0px',
                            paddingTop: '30px'
                        }}
                        aria-label='mailbox folders'
                    >
                        <TreeView
                            aria-label='file system navigator'
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                            multiSelect={false}
                            disableSelection={true}
                            selected={selectedNode}
                            sx={{ height: 500, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                        >
                            {Object.keys(organizations).map((orgKey, index) => {
                                return (
                                    <StyledTreeItem
                                        key={'org' + index}
                                        nodeId={'org' + index}
                                        labelText={orgKey}
                                        color='#e3742f'
                                        bgColor='#f4f4f4'
                                        colorForDarkMode='#FFE2B7'
                                        operation={tree_operation}
                                        onClick={() => focusNode('org' + index, orgKey)}
                                        bgColorForDarkMode='#191207'
                                        menuAction={[
                                            { label: '删除组织', key: 'delete_org', type: 'org' },
                                            { label: '添加分组', key: 'add_group', type: 'org' }
                                        ]}
                                    >
                                        {Object.keys(organizations[orgKey]).map((groupKey, index) => {
                                            return (
                                                <StyledTreeItem
                                                    key={'group' + groupKey + index}
                                                    nodeId={'group' + groupKey + index}
                                                    labelText={groupKey}
                                                    color='#e3742f'
                                                    bgColor='#f4f4f4'
                                                    operation={tree_operation}
                                                    colorForDarkMode='#FFE2B7'
                                                    bgColorForDarkMode='#191207'
                                                    onClick={() => focusNode('group' + groupKey + index, orgKey, groupKey)}
                                                    menuAction={[{ label: '删除分组', type: 'group', key: 'delete_group' }]}
                                                ></StyledTreeItem>
                                            )
                                        })}
                                    </StyledTreeItem>
                                )
                            })}

                            <Button
                                variant='outlined'
                                onClick={() => {
                                    setShowOrgDialog(true)
                                }}
                                style={{
                                    borderColor: '#dedfe4',
                                    color: 'rgba(0,0,0,.85)',
                                    marginTop: '10px'
                                }}
                                fullWidth
                            >
                                添加组织
                            </Button>
                        </TreeView>
                    </Box>
                    <Box
                        component='main'
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            borderTopRightRadius: '10px',
                            borderBottomRightRadius: '10px',
                            borderCollapse: 'collapse',
                            border: '1px solid #eee',
                            width: { sm: `calc(100% - ${drawerWidth}px)` }
                        }}
                    >
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            rowsNumber={rowDatas.length}
                            selectRows={selected}
                            currentLimit={currentLimit}
                            isOrgFocused={selectedNode.indexOf('org') > -1}
                            operation={rows_operation}
                            title={title}
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
                                    {visibleRows
                                        .filter((row) => {
                                            return row.user.length != 0
                                        })
                                        .map((row, index) => {
                                            const isItemSelected = isRowSelected(row.user)
                                            const labelId = `enhanced-table-checkbox-${index}`
                                            return (
                                                <TableRow
                                                    hover
                                                    role='checkbox'
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.user}
                                                    selected={isItemSelected}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <TableCell padding='checkbox'>
                                                        <Checkbox
                                                            color='primary'
                                                            onClick={(event) => handleRowSelectClick(event, row)}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            checked={isItemSelected}
                                                        />
                                                    </TableCell>
                                                    <TableCell component='th' id={labelId} scope='row' padding='none'>
                                                        {row.user}
                                                    </TableCell>
                                                    <TableCell>{row.account}</TableCell>
                                                    <TableCell>{row.partition}</TableCell>
                                                    <TableCell>{row.cluster}</TableCell>
                                                    <TableCell align='right'>
                                                        <StyledMenu
                                                            operation={row_operation}
                                                            row={row}
                                                            menuAction={[
                                                                { label: '设为管理员', key: 'set_admin' },
                                                                { label: '变更组织', key: 'change_org' }
                                                            ]}
                                                        />
                                                    </TableCell>
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
                    </Box>
                </Box>
            </MainCard>
            <OrganizationDialog
                show={showOrgDialog}
                onCancel={() => {
                    setShowOrgDialog(false)
                    setCurrentOrg(null)
                }}
                currentOrg={currentOrg}
                onConfirm={addOrg}
            />
            <MoveUsersDialog
                show={showMoveUserDialog}
                onCancel={() => {
                    setShowMoveUserDialog(false)
                    setMoveUserProps(null)
                }}
                currentLimit={currentLimit}
                dialogProps={moveUserProps}
                onConfirm={addMembers}
            />
            <ModifyLimitDialog
                show={showModifyLimitDialog}
                currentLimit={currentLimit}
                onCancel={() => {
                    setShowModifyLimitDialog(false)
                }}
                group={currentGroup}
                onConfirm={addLimist}
            />
            <ConfirmDialog />
            <Snackbar open={message.display} autoHideDuration={3000} onClose={handleMessageClose}>
                <Alert severity={message.type} onClose={handleMessageClose} sx={{ width: '100%' }}>
                    {message.content}
                </Alert>
            </Snackbar>
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
