import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Pie, Liquid, Column } from '@ant-design/plots'

// material-ui
import { Box, Stack, Typography, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { useTheme } from '@mui/material/styles'
// project imports
import MainCard from 'ui-component/cards/MainCard'
// import Tooltip from '@mui/material/Tooltip'
import { REMOVE_DIRTY, enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'
import { useDispatch } from 'react-redux'

// Hooks
import useApi from 'hooks/useApi'
import dashboardAPI from 'api/dashboard'
// utils
import useNotifier from 'utils/useNotifier'
import config from 'config'

const pieParams = { height: 200, margin: { right: 5 } }
const palette = ['red', 'blue', 'green']

const Dashboard = () => {
    const navigate = useNavigate()

    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const dispatch = useDispatch()
    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const getHPCDashboard = useApi(dashboardAPI.getHPCDashboard)
    const getK8SDashboard = useApi(dashboardAPI.getK8SDashboard)
    const [trigger, setTrigger] = useState(true)
    const [nodes, setNodes] = useState([])
    const [workloads, setWorkloads] = useState([
        ['Status', 'Number', { role: 'style' }],
        ['', 0, '#ddd']
    ])
    const [memory, setMemory] = useState({ total: 0, used: 0 })
    const [gpus, setGpus] = useState({ total: 0, used: 0 })
    const [cpus, setCpus] = useState({ total: 0, used: 0 })
    const [busy, setBusy] = useState({ total: 0, busy: 0 })
    const [tab, setTab] = React.useState('hpc')
    const [k8sMemory, setK8sMemory] = useState({ total: 0, used: 0 })
    const [k8sCPU, setK8sCPU] = useState({ total: 0, used: 0 })

    const handleChange = (event, newValue) => {
        setTab(newValue)
        if (newValue == 'hpc') {
            getHPCDashboard.request()
        } else {
            getK8SDashboard.request()
        }
    }
    useEffect(() => {
        getHPCDashboard.request()
    }, [trigger])

    useEffect(() => {
        if (getHPCDashboard.data) {
            let tNodes = []
            for (let key in getHPCDashboard.data['nodes']) {
                tNodes.push({ type: key, value: getHPCDashboard.data['nodes'][key] })
            }
            setNodes(tNodes)
            let tWorkloads = [['Status', 'Number', { role: 'style' }]]
            for (let key in getHPCDashboard.data['workloads']) {
                tWorkloads.push({ type: key, value: getHPCDashboard.data['workloads'][key] })
            }
            setWorkloads(tWorkloads)
            let tMemory = { total: 0, used: 0 }
            tMemory.total = getHPCDashboard.data['memory']['total']
            tMemory.used = getHPCDashboard.data['memory']['total'] - getHPCDashboard.data['memory']['free']
            setMemory(tMemory)

            let tGpus = { total: 0, used: 0 }
            tGpus.total = getHPCDashboard.data['gpus']['total']
            tGpus.used = getHPCDashboard.data['gpus']['total'] - getHPCDashboard.data['gpus']['free']
            setGpus(tGpus)

            let tCpus = { total: 1, used: 0 }
            tCpus.total = getHPCDashboard.data['cpus']['total']
            tCpus.used = getHPCDashboard.data['cpus']['used']
            setCpus(tCpus)

            let busy = { total: 1, busy: 0 }
            busy.total = getHPCDashboard.data['workingSates']['total']
            busy.busy = getHPCDashboard.data['workingSates']['busy']
            setBusy(busy)
        }
    }, [getHPCDashboard.data])

    useEffect(() => {
        if (getK8SDashboard.data) {
            let cpu = { used: getK8SDashboard.data['totalCpuRequests'], total: getK8SDashboard.data['totalCpuCapacity'] }
            setK8sCPU(cpu)
            let mem = { used: getK8SDashboard.data['totalMemRequests'], total: getK8SDashboard.data['totalMemCapacity'] }
            setK8sMemory(mem)
        }
    }, [getK8SDashboard.data])

    const getColor = (key) => {
        if (key == 'running') {
            return '#1b5e20'
        } else if (key == 'pending') {
            return '#ffeb3b'
        } else if (key == 'suspended') {
            return '#673ab7'
        } else if (key == 'done') {
            return '#e0e0e0'
        } else {
            return '#BDB76B'
        }
    }
    const nodeConfig = {
        data: nodes,
        angleField: 'value',
        colorField: 'type',
        width: 150,
        height: 150,
        legend: false,
        padding: 10,
        color: ['#1b5e20', '#dedede'],
        interactions: [
            {
                type: 'element-selected'
            },
            {
                type: 'element-active'
            }
        ]
    }

    const gpuConfig = {
        percent: gpus.total == 0 ? 0 : gpus.used / gpus.total,
        outline: {
            border: 2,
            distance: 4
        },
        width: 140,
        height: 150,
        wave: {
            length: 100
        },
        statistic: {
            content: {
                style: {
                    fontSize: 13
                }
            }
        }
    }

    const cpuConfig = {
        percent: cpus.total == 0 ? 0 : cpus.used / cpus.total,
        outline: {
            border: 2,
            distance: 4
        },
        shape: 'rect',
        width: 140,
        height: 150,
        wave: {
            length: 100
        },
        statistic: {
            content: {
                style: {
                    fontSize: 13
                }
            }
        }
    }

    const busyConfig = {
        percent: busy.total == 0 ? 0 : busy.busy / busy.total,
        outline: {
            border: 2,
            distance: 4
        },
        shape: 'rect',
        width: 140,
        height: 150,
        wave: {
            length: 100
        },
        statistic: {
            content: {
                style: {
                    fontSize: 13
                }
            }
        }
    }

    const workloadConfig = {
        data: workloads,
        xField: 'type',
        yField: 'value',
        seriesField: '',
        color: ({ type }) => {
            return getColor(type)
        },
        legend: false,
        width: 150,
        height: 150
    }

    const memConfig = {
        percent: memory.total == 0 ? 0 : memory.used / memory.total,
        outline: {
            border: 2,
            distance: 4
        },
        width: 140,
        height: 150,
        wave: {
            length: 100
        },
        statistic: {
            content: {
                style: {
                    fontSize: 13
                }
            }
        }
    }

    const k8sCPUConf = {
        percent: k8sCPU.total == 0 ? 0 : k8sCPU.used / k8sCPU.total,
        outline: {
            border: 2,
            distance: 4
        },
        width: 150,
        height: 200,
        wave: {
            length: 100
        }
    }

    const k8sMemConf = {
        percent: k8sMemory.total == 0 ? 0 : k8sMemory.used / k8sMemory.total,
        outline: {
            border: 2,
            distance: 4
        },
        width: 150,
        height: 200,
        wave: {
            length: 100
        }
    }

    return (
        <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label='lab API tabs example'>
                        <Tab label='HPC Cluster' value='hpc' />
                        {config.FEATURE_TOGGLE_K8S && <Tab label='Kubernetes Cluster' value='k8s' />}
                    </TabList>
                </Box>
                <TabPanel value='hpc'>
                    <Stack direction='row' width='100%' spacing={2} useFlexGap flexWrap='wrap'>
                        <Box flexGrow={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack>
                                <Pie {...nodeConfig} />
                                <Typography align='center'>Node Status</Typography>
                            </Stack>
                        </Box>
                        <Box flexGrow={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack>
                                <Liquid {...gpuConfig} />
                                <Typography align='center'>GPU usage</Typography>
                            </Stack>
                        </Box>
                        <Box flexGrow={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack>
                                <Liquid {...cpuConfig} />
                                <Typography align='center'>CPU usage</Typography>
                            </Stack>
                        </Box>
                    </Stack>
                    <Stack direction='row' width='100%' spacing={2} useFlexGap flexWrap='wrap'>
                        <Box flexGrow={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack>
                                <Column {...workloadConfig} />
                                <Typography align='center'>Workload status</Typography>
                            </Stack>
                        </Box>
                        <Box flexGrow={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack>
                                <Liquid {...memConfig} />
                                <Typography align='center'>Memory usage</Typography>
                            </Stack>
                        </Box>
                        <Box flexGrow={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack>
                                <Liquid {...busyConfig} />
                                <Typography align='center'>Busy nodes</Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </TabPanel>
                <TabPanel value='k8s'>
                    <Stack direction='row' width='100%' spacing={2} useFlexGap flexWrap='wrap'>
                        <Box flexGrow={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack>
                                <Liquid {...k8sCPUConf} />
                                <Typography align='center'>CPU usage</Typography>
                            </Stack>
                        </Box>
                        <Box flexGrow={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack>
                                <Liquid {...k8sMemConf} />
                                <Typography align='center'>Memory usage</Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </TabPanel>
            </TabContext>
        </MainCard>
    )
}

export default Dashboard
