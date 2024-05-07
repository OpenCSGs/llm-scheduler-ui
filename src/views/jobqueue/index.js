import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { Box, Tab, Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useTheme } from '@mui/material/styles'

// project imports
import ToolEmptySVG from 'assets/images/tools_empty.svg'
import MainCard from 'ui-component/cards/MainCard'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import QosDetailsDialog from './QosDetailsDialog'

// Hooks
import queueAPI from 'api/jobqueue'
import useApi from 'hooks/useApi'

// icons

// ==============================|| CHATFLOWS ||============================== //

const JobQueue = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [showQOSDialog, setShowQOSDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const getAllQueue = useApi(queueAPI.getAllQueue)
    const getMyQueue = useApi(queueAPI.getMyQueue)
    const [queues, setQueues] = useState([])
    const [myqueues, setMyqueues] = useState([])
    const [trigger, setTrigger] = useState(true)
    const [tab, setTab] = useState('queues')
    const [qosName, setQosName] = useState()

    useEffect(() => {
        getAllQueue.request()
    }, [trigger])

    useEffect(() => {
        if (getAllQueue.data) {
            setQueues(getAllQueue.data.partitions)
        }
    }, [getAllQueue.data])

    useEffect(() => {
        if (getMyQueue.data) {
            setMyqueues(getMyQueue.data.associations)
        }
    }, [getMyQueue.data])

    const handleChange = (event, newValue) => {
        setTab(newValue)
        if (newValue == 'queues') {
            getAllQueue.request()
        } else {
            getMyQueue.request()
        }
    }
    const showDetails = (q) => {
        setQosName(q)
        setShowQOSDialog(true)
    }

    return (
        <>
            <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
                <TabContext value={tab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label='lab API tabs example'>
                            <Tab label='Available Partition' value='queues' />
                            <Tab label='Relationship' value='myqueues' />
                        </TabList>
                    </Box>
                    <TabPanel value='queues'>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Partition Name</TableCell>
                                        <TableCell>Resources Limit</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Grace Time</TableCell>
                                        <TableCell>Node</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {queues &&
                                        queues.map((row, index) => (
                                            <TableRow
                                                key={row.name + '_global_' + index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component='th' scope='row'>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>{row.tres.configured}</TableCell>
                                                <TableCell>{row.priority.tier}</TableCell>
                                                <TableCell>{row.suspend_time.number}</TableCell>
                                                <TableCell>{row.nodes.configured}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value='myqueues'>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User Name</TableCell>
                                        <TableCell align='right'>Partition</TableCell>
                                        <TableCell align='right'>QOS</TableCell>
                                        <TableCell align='right'>Account</TableCell>
                                        <TableCell align='right'>Cluster</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {myqueues &&
                                        myqueues.map((row, index) => (
                                            <TableRow
                                                key={row.name + '_my_' + index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component='th' scope='row'>
                                                    {row.user}
                                                </TableCell>
                                                <TableCell align='right'>{row.partition.toString()}</TableCell>
                                                <TableCell align='right'>
                                                    {row.qos.map((q) => {
                                                        return (
                                                            <Button key={q} onClick={() => showDetails(q)} variant='text'>
                                                                {q}
                                                            </Button>
                                                        )
                                                    })}
                                                </TableCell>
                                                <TableCell align='right'>{row.account.toString()}</TableCell>
                                                <TableCell align='right'>{row.cluster.toString()}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </TabContext>
            </MainCard>
            <QosDetailsDialog
                show={showQOSDialog}
                qosName={qosName}
                onCancel={() => {
                    setShowQOSDialog(false)
                }}
                onConfirm={() => {
                    setShowQOSDialog(false)
                }}
            />
        </>
    )
}

export default JobQueue
