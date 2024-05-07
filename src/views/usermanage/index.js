import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useTheme } from '@mui/material/styles'
import { StyledMenu } from 'ui-component/menu/StyledMenu'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from 'ui-component/alert/Alert'
import TableToolbar from './TableToolbar'

// project imports
import MainCard from 'ui-component/cards/MainCard'

// Hooks
import accountAPI from 'api/useraccount'
import useApi from 'hooks/useApi'

// icons

// ==============================|| CHATFLOWS ||============================== //

const JobQueue = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const setAdmin = useApi(accountAPI.setAdmin)
    const getUsers = useApi(accountAPI.getUsers)
    const [users, setUsers] = useState([])
    const [trigger, setTrigger] = useState(true)
    const [message, setMessage] = useState({ display: false, content: '', type: 'info' })
    const [searchKeyword, setSearchKeyword] = useState()

    useEffect(() => {
        getUsers.request()
    }, [trigger])

    useEffect(() => {
        if (getUsers.data) {
            setUsers(getUsers.data.users)
        }
    }, [getUsers.data])

    const handleMessageClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        let newMsg = Object.assign({}, message)
        newMsg.display = false
        setMessage(newMsg)
    }

    const row_operation = (actionId, row) => {
        console.log(actionId, row)
        if (actionId == 'set_admin') {
            let data = {
                users: [
                    {
                        name: row.name,
                        administrator_level: ['Administrator']
                    }
                ]
            }
            setAdmin.request(data)
        } else if (actionId == 'set_normal_user') {
            let data = {
                users: [
                    {
                        name: row.name,
                        administrator_level: ['None']
                    }
                ]
            }
            setAdmin.request(data)
        }
    }

    useEffect(() => {
        if (setAdmin.error) {
            setMessage({
                display: true,
                content: '用户角色修改失败',
                type: 'error'
            })
        }
    }, [setAdmin.error])

    useEffect(() => {
        if (setAdmin.data) {
            setMessage({
                display: true,
                content: '用户角色修改成功',
                type: 'success'
            })
            setTrigger(!trigger)
        }
    }, [setAdmin.data])

    return (
        <>
            <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
                <TableToolbar title='用户列表' setSearchKeyword={setSearchKeyword} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Number</TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell align='center'>Role</TableCell>
                                <TableCell align='right'>Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                                .filter((row) => {
                                    if (searchKeyword) {
                                        return row.name.indexOf(searchKeyword) > -1
                                    }
                                    return true
                                })
                                .map((row, index) => (
                                    <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell component='th' scope='row'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {row.administrator_level.toString().indexOf('Administrator') > -1
                                                ? 'Administrator'
                                                : 'Normal User'}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <StyledMenu
                                                operation={row_operation}
                                                row={row}
                                                menuAction={[
                                                    { label: 'Set as admin', key: 'set_admin' },
                                                    { label: 'Set as normal user', key: 'set_normal_user' }
                                                ]}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
            <Snackbar open={message.display} autoHideDuration={3000} onClose={handleMessageClose}>
                <Alert severity={message.type} onClose={handleMessageClose} sx={{ width: '100%' }}>
                    {message.content}
                </Alert>
            </Snackbar>
        </>
    )
}

export default JobQueue
