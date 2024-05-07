import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect, useReducer, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'

import { Checkbox, Grid, Item, Dialog, DialogActions, DialogContent, DialogTitle, InputBase, Typography } from '@mui/material'
import { StyledButton } from 'ui-component/button/StyledButton'

import { useTheme } from '@mui/material/styles'

// Hooks
import accountAPI from 'api/useraccount'
import useApi from 'hooks/useApi'

const MoveUsersDialog = ({ show, dialogProps, currentLimit, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')
    const theme = useTheme()

    const dispatch = useDispatch()
    const getUsers = useApi(accountAPI.getUsers)

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const [orgName, setOrgName] = useState('')
    const [accountName, setAccountName] = useState('')
    const [availableUsers, setAvailableUsers] = useState([])
    const [qos, setQos] = useState()
    const [partition, setPartition] = useState()
    const [desc, setDesc] = useState('')
    const [numSelected, setNumSelected] = useState(0)
    const [searchKeyword, setSearchKeyword] = useState()
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)

    useEffect(() => {
        if (show) {
            setNumSelected(0)
            setSearchKeyword()
            getUsers.request()
            if (currentLimit) {
                if (currentLimit.qos.length > 0) {
                    setQos(currentLimit.qos[0])
                }
                if (currentLimit.partition) {
                    setPartition(currentLimit.partition)
                }
            }
        }
    }, [show])

    useEffect(() => {
        if (getUsers.data) {
            let allUsers = getUsers.data.users
            let existingUsers = dialogProps.existingUsers
            let availables = []
            for (let u of allUsers) {
                let index = existingUsers.findIndex((e) => e.user === u.name)
                if (index == -1) {
                    availables.push(u)
                }
            }
            setAvailableUsers(availables)
        }
    }, [getUsers.data])

    const handleSelectAllClick = (event) => {
        let checked = false
        if (event.target.checked) {
            checked = true
        }
        let number = 0
        availableUsers
            .filter((row) => {
                if (searchKeyword) {
                    return row.name.indexOf(searchKeyword) > -1
                }
                return true
            })
            .forEach((o) => {
                o.checked = checked
                if (checked) {
                    number++
                } else {
                    number--
                }
            })
        setNumSelected(number < 0 ? 0 : number)
        forceUpdate()
    }

    const handleRowSelectClick = (event, row) => {
        row.checked = !row.checked
        if (row.checked) {
            setNumSelected(numSelected + 1)
        } else {
            setNumSelected(numSelected - 1)
        }
        forceUpdate()
    }

    const handleUsers = () => {
        let associations = []
        let p = 'normal'
        if (partition) {
            p = partition
        }
        let q = 'default'
        if (qos) {
            q = qos
        }
        availableUsers.forEach((o) => {
            if (o.checked) {
                let account = {
                    account: dialogProps.target,
                    cluster: 'cluster-opencsg',
                    user: o.name,
                    parent_account: 'root',
                    partition: p,
                    qos: [q]
                }
                associations.push(account)
            }
        })
        onConfirm(associations)
    }

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem', borderBottom: '1px solid #efefef' }} id='alert-dialog-title'>
                {dialogProps && dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} columns={16} style={{ marginLeft: '-8px' }}>
                    <Grid item xs={8} style={{ border: '1px solid #efefef' }}>
                        <Paper
                            component='form'
                            sx={{
                                p: '2px 4px',
                                marginTop: '5px',
                                border: '1px solid #efefef',
                                display: 'flex',
                                alignItems: 'center',
                                width: 400
                            }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder='Search User'
                                inputProps={{ 'aria-label': 'search user' }}
                                onChange={(event) => {
                                    setSearchKeyword(event.target.value)
                                }}
                            />
                            <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {availableUsers.length > 0 && (
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label='sticky table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding='checkbox'>
                                                    <Checkbox
                                                        color='primary'
                                                        indeterminate={numSelected > 0 && numSelected < availableUsers.length}
                                                        onChange={handleSelectAllClick}
                                                        inputProps={{ 'aria-label': 'select all desserts' }}
                                                    />
                                                </TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>User Name</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {availableUsers
                                                .filter((row) => {
                                                    if (searchKeyword) {
                                                        return row.name.indexOf(searchKeyword) > -1
                                                    }
                                                    return true
                                                })
                                                .map((row, index) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`
                                                    return (
                                                        <TableRow hover role='checkbox' tabIndex={-1} key={row.name}>
                                                            <TableCell padding='checkbox'>
                                                                <Checkbox
                                                                    color='primary'
                                                                    onClick={(event) => handleRowSelectClick(event, row)}
                                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                                    checked={row.checked || false}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{row.name}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                            {availableUsers.length == 0 && (
                                <div style={{ height: 220, textAlign: 'center', paddingTop: '100px' }}>No Users</div>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={8} style={{ border: '1px solid #efefef', borderLeftWidth: '0px', borderRightWidth: '1px' }}>
                        <Typography
                            sx={{ flex: '1 1 auto', paddingTop: '16px', fontSize: '15px' }}
                            variant='h6'
                            id='tableTitle'
                            component='div'
                        >
                            Current QOS: <b>{qos || '-'}</b>, Partition: <b>{partition || '-'}</b>
                        </Typography>
                        <Typography
                            sx={{ flex: '1 1 auto', paddingBottom: '16px', fontSize: '15px' }}
                            variant='h6'
                            id='tableTitle'
                            component='div'
                        >
                            Add following users to: {dialogProps.target} ({numSelected})
                        </Typography>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {availableUsers &&
                                availableUsers
                                    .filter((row) => {
                                        return row.checked
                                    })
                                    .map((row, index) => (
                                        <Grid
                                            style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                                            item
                                            xs={2}
                                            sm={4}
                                            md={4}
                                            key={index}
                                        >
                                            {row.name}
                                        </Grid>
                                    ))}
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <StyledButton
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                    variant='contained'
                    onClick={onCancel}
                >
                    Cancel
                </StyledButton>
                <StyledButton
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                    disabled={numSelected == 0}
                    variant='contained'
                    onClick={handleUsers}
                >
                    OK
                </StyledButton>
            </DialogActions>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

MoveUsersDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default MoveUsersDialog
