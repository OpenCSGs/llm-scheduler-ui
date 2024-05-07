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
// project imports
import MainCard from 'ui-component/cards/MainCard'
import TableToolbar from './TableToolbar'
import AddQOSDialog from './AddQOSDialog'
import useConfirm from 'hooks/useConfirm'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'

// Hooks
import accountAPI from 'api/useraccount'
import useApi from 'hooks/useApi'

// icons

// ==============================|| CHATFLOWS ||============================== //

const QOSManage = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const { confirm } = useConfirm()
    const getQos = useApi(accountAPI.getQOS)
    const postQOS = useApi(accountAPI.addQOS)
    const removeQOS = useApi(accountAPI.removeQOS)
    const [qos, setQos] = useState([])
    const [trigger, setTrigger] = useState(true)
    const [message, setMessage] = useState({ display: false, content: '', type: 'info' })
    const [showQOSDialog, setShowQOSDialog] = useState(false)
    const [editRow, setEditRow] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        getQos.request()
    }, [trigger])

    useEffect(() => {
        if (getQos.data) {
            setQos(getQos.data.qos)
        }
    }, [getQos.data])

    const handleMessageClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        let newMsg = Object.assign({}, message)
        newMsg.display = false
        setMessage(newMsg)
    }

    const row_operation = async (actionId, row) => {
        if (actionId == 'modify_qos') {
            setEditRow(row)
            setShowQOSDialog(true)
        } else if (actionId == 'delete_qos') {
            let props = {
                title: 'Delete QOS',
                description: 'Be careful to ensure that this QOS is not being used. Determine the deletion QOS: ' + row.name + '? ',
                confirmButtonName: 'Yes'
            }
            const isConfirmed = await confirm(props)
            if (isConfirmed) {
                removeQOS.request(row.name)
            }
        }
    }

    const operation = (actionId, row) => {
        console.log(actionId, row)
        if (actionId == 'add_qos') {
            setEditRow(null)
            setShowQOSDialog(true)
        }
    }

    const addQos = (data, isEdit) => {
        let qos = {
            qos: [data]
        }
        setIsEditing(isEdit)
        setShowQOSDialog(false)
        postQOS.request(qos)
    }

    useEffect(() => {
        if (removeQOS.data) {
            setMessage({
                display: true,
                content: 'Succeed to delete QOS',
                type: 'success'
            })
            setTrigger(!trigger)
        }
    }, [removeQOS.data])

    useEffect(() => {
        if (removeQOS.error) {
            let data = removeQOS.error.response.data
            setMessage({
                display: true,
                content: 'Failed to delete qos：' + data['errors'][0]['error'],
                type: 'error'
            })
        }
    }, [removeQOS.error])

    useEffect(() => {
        if (postQOS.data) {
            let msg = 'Succeed to add QOS'
            if (isEditing) {
                msg = 'Updated QOS'
            }
            setMessage({
                display: true,
                content: msg,
                type: 'success'
            })
            setTrigger(!trigger)
        }
    }, [postQOS.data])

    useEffect(() => {
        if (postQOS.error) {
            let data = postQOS.error.response.data
            setMessage({
                display: true,
                content: 'Failed to add QOS' + data['errors'][0]['error'],
                type: 'error'
            })
        }
    }, [postQOS.error])

    const generateTresStr = (tres) => {
        let res = []
        for (let t of tres) {
            res.push(t['type'] + '=' + t['count'])
        }
        return res.toString()
    }

    return (
        <>
            <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
                <TableToolbar title='QOS list' operation={operation} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Number</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align='center'>Res</TableCell>
                                <TableCell align='center'>Priority</TableCell>
                                <TableCell align='center'>Description</TableCell>
                                <TableCell align='right'>Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {qos.map((row, index) => (
                                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell component='th' scope='row'>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align='center'>{generateTresStr(row.limits.max.tres.per.user) || '-'}</TableCell>
                                    <TableCell align='center'>{row.priority.number}</TableCell>
                                    <TableCell align='center'>{row.description || '-'}</TableCell>
                                    <TableCell align='right'>
                                        <StyledMenu
                                            operation={row_operation}
                                            row={row}
                                            menuAction={[
                                                { label: 'Modify', key: 'modify_qos' },
                                                { label: 'Delete', key: 'delete_qos' }
                                            ]}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
            <AddQOSDialog
                show={showQOSDialog}
                row_data={editRow}
                onCancel={() => {
                    setShowQOSDialog(false)
                    setEditRow(null)
                }}
                onConfirm={addQos}
            />
            <ConfirmDialog />
            <Snackbar open={message.display} autoHideDuration={3000} onClose={handleMessageClose}>
                <Alert severity={message.type} onClose={handleMessageClose} sx={{ width: '100%' }}>
                    {message.content}
                </Alert>
            </Snackbar>
        </>
    )
}

export default QOSManage
