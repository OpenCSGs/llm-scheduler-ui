import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'
import { cloneDeep } from 'lodash'

import { Box, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Stack, MenuItem } from '@mui/material'
import { StyledButton } from 'ui-component/button/StyledButton'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'

import { useTheme } from '@mui/material/styles'

// Hooks
import useConfirm from 'hooks/useConfirm'
import queueAPI from 'api/jobqueue'
import useApi from 'hooks/useApi'

// utils
import useNotifier from 'utils/useNotifier'
import { generateRandomGradient } from 'utils/genericHelper'

const QosDetailsDialog = ({ show, qosName, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')
    const theme = useTheme()

    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const [name, setName] = useState('')
    const [priority, setPriority] = useState('')
    const [description, setDescription] = useState('')
    const getQosInfo = useApi(queueAPI.getQosInfo)

    const [PreemptMode, setPreemptMode] = useState('DISABLED')
    const preemptModeList = [
        { label: '禁用', value: 'DISABLED' },
        { label: '取消', value: 'CANCEL' },
        { label: 'GANG', value: 'GANG' },
        { label: 'GANG+SUSPEND', value: 'GANG,SUSPEND' },
        { label: '重新排队', value: 'REQUEUE' },
        { label: '暂停', value: 'SUSPEND' },
        { label: 'qos内抢占', value: 'WITHIN' }
    ]
    const [GraceTime, setGraceTime] = useState('')
    const [PreemptExemptTime, setPreemptExemptTime] = useState('')

    const [GrpJobs, setGrpJobs] = useState('')
    const [GrpTRES, setGrpTRES] = useState('')
    const [GrpWall, setGrpWall] = useState('')
    //Maximum wall clock time each job is able to use.
    const [MaxWallDurationPerJob, setMaxWallDurationPerJob] = useState('')

    //The maximum number of jobs an account (or sub-account) can have running at a given time.
    const [MaxJobsPerAccount, setMaxJobsPerAccount] = useState('')
    //The maximum number of jobs a user can have running at a given time.
    const [MaxJobsPerUser, setMaxJobsPerUser] = useState('')
    //The maximum number of jobs a user can have running and pending at a given time.
    const [MaxSubmitJobsPerUser, setMaxSubmitJobsPerUser] = useState('')
    //The maximum number of jobs an account (or sub-account) can have running and pending at a given time.
    const [MaxSubmitJobsPerAccount, setMaxSubmitJobsPerAccount] = useState('')
    //The maximum number of TRES an account can allocate at a given time
    const [MaxTRESPerAccount, setMaxTRESPerAccount] = useState('')
    //The maximum number of TRES each job is able to use.
    const [MaxTRESPerJob, setMaxTRESPerJob] = useState('')
    //The maximum number of TRES each node in a job allocation can use
    const [MaxTRESPerNode, setMaxTRESPerNode] = useState('')
    //The maximum number of TRES a user can allocate at a given time.
    const [MaxTRESPerUser, setMaxTRESPerUser] = useState('')
    //A float that is factored into a job’s TRES usage (e.g. RawUsage, TRESMins, TRESRunMins)
    const [UsageFactor, setUsageFactor] = useState('')
    const [UsageThreshold, setUsageThreshold] = useState('')

    useEffect(() => {
        if (show) {
            getQosInfo.request(qosName)
        }
    }, [show])

    useEffect(() => {
        if (getQosInfo.data) {
            //set the edit data
            let row_data = getQosInfo.data.qos[0]
            if (row_data) {
                setName(row_data.name)
                setDescription(row_data.description)
                setPriority(row_data.priority.number || '')
                setPreemptMode(row_data.preempt.mode.toString())
                setGraceTime(row_data.limits.grace_time)
                setPreemptExemptTime(row_data.preempt.exempt_time.number || '')
                setGrpJobs(row_data.limits.max.active_jobs.count.number || '')
                setGrpTRES(generateTresStr(row_data.limits.max.tres.total))
                setGrpWall(row_data.limits.max.wall_clock.per.qos.number || '')
                setMaxWallDurationPerJob(row_data.limits.max.wall_clock.per.job.number || '')
                setMaxJobsPerAccount(row_data.limits.max.jobs.active_jobs.per.account.number || '')
                setMaxJobsPerUser(row_data.limits.max.jobs.active_jobs.per.user.number || '')
                setMaxSubmitJobsPerUser(row_data.limits.max.jobs.per.user.number || '')
                setMaxSubmitJobsPerAccount(row_data.limits.max.jobs.per.account.number || '')
                setMaxTRESPerAccount(generateTresStr(row_data.limits.max.tres.per.account))
                setMaxTRESPerJob(generateTresStr(row_data.limits.max.tres.per.job))
                setMaxTRESPerNode(generateTresStr(row_data.limits.max.tres.per.node))
                setMaxTRESPerUser(generateTresStr(row_data.limits.max.tres.per.user))
                setUsageFactor(row_data.usage_factor.number || '')
                setUsageThreshold(row_data.usage_threshold.number || '')
            }
        }
    }, [getQosInfo.data])

    const generateTresStr = (tres) => {
        let res = []
        for (let t of tres) {
            res.push(t['type'] + '=' + t['count'])
        }
        return res.toString()
    }

    const parseTres = (tres) => {
        let total = []
        if (tres) {
            let resources = tres.split(',')
            for (let re of resources) {
                let kvs = re.split('=')
                let o = {
                    type: kvs[0],
                    count: kvs[1]
                }
                total.push(o)
            }
        }
        return total
    }

    const confirm = () => {
        let total = parseTres(GrpTRES)
        let perjob = parseTres(MaxTRESPerJob)
        let pernode = parseTres(MaxTRESPerNode)
        let peruser = parseTres(MaxTRESPerUser)
        let peraccount = parseTres(MaxTRESPerAccount)
        let data = {
            name: name,
            description: description,
            priority: {
                set: priority > 0,
                number: priority || 0
            },
            usage_factor: {
                set: UsageFactor > 0,
                number: UsageFactor || 0
            },
            usage_threshold: {
                set: UsageThreshold > 0,
                number: UsageThreshold || 0
            },
            preempt: {
                mode: PreemptMode ? PreemptMode.split(',') : [],
                exempt_time: {
                    set: PreemptExemptTime > 0,
                    number: PreemptExemptTime || 0
                }
            },
            limits: {
                grace_time: GraceTime || 0,
                max: {
                    active_jobs: { count: { number: GrpJobs || 0, set: GrpJobs > 0 } },
                    tres: {
                        total: total,
                        per: {
                            job: perjob,
                            node: pernode,
                            user: peruser,
                            account: peraccount
                        }
                    },
                    jobs: {
                        active_jobs: {
                            per: {
                                account: {
                                    set: MaxJobsPerAccount > 0,
                                    number: MaxJobsPerAccount || 0
                                },
                                user: {
                                    set: MaxJobsPerUser > 0,
                                    number: MaxJobsPerUser || 0
                                }
                            }
                        },
                        per: {
                            account: {
                                set: MaxSubmitJobsPerAccount > 0,
                                number: MaxSubmitJobsPerAccount || 0
                            },
                            user: {
                                set: MaxSubmitJobsPerUser > 0,
                                number: MaxSubmitJobsPerUser || 0
                            }
                        }
                    },
                    wall_clock: {
                        per: {
                            qos: {
                                set: GrpWall > 0,
                                number: GrpWall || 0
                            },
                            job: {
                                set: MaxWallDurationPerJob > 0,
                                number: MaxWallDurationPerJob || 0
                            }
                        }
                    }
                }
            }
        }
        onConfirm(data, row_data != null)
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
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                QOS Details
            </DialogTitle>
            <DialogContent>
                <Box
                    component='form'
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '45ch' }
                    }}
                    noValidate
                    autoComplete='off'
                >
                    <div>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>Basic Info：</Typography>
                        </Stack>
                        <TextField
                            id='name'
                            required
                            type='string'
                            fullWidth
                            label='QOS Name'
                            helperText='Unique Name'
                            variant='standard'
                            value={name}
                            name='name'
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            id='description'
                            type='string'
                            fullWidth
                            label='Description'
                            helperText='qos description'
                            variant='standard'
                            value={description}
                            name='description'
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            id='priority'
                            required
                            type='number'
                            inputProps={{
                                type: 'number',
                                inputMode: 'numeric',
                                pattern: '/^-?d+(?:.d+)?$/g'
                            }}
                            fullWidth
                            label='Priority'
                            helperText='default: 1'
                            variant='standard'
                            value={priority}
                            name='priority'
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </div>
                    <div>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>Preempt Mode: </Typography>
                        </Stack>
                        <TextField
                            id='PreemptMode'
                            type='string'
                            fullWidth
                            select
                            label='抢占模式'
                            helperText='机制用于抢占作业和并行化策略, 请确保PreemptType=preempt/qos 配置在集群conf里。默认: 禁用'
                            variant='standard'
                            value={PreemptMode}
                            name='PreemptMode'
                            onChange={(e) => setPreemptMode(e.target.value)}
                        >
                            {preemptModeList.map((row, index) => {
                                return (
                                    <MenuItem key={row.value + '_' + index} value={row.value}>
                                        {row.label}
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                        <TextField
                            id='GraceTime'
                            type='number'
                            fullWidth
                            label='Grace Time'
                            helperText='Specifies a time period for a job to execute after it is selected to be preempted. This option can be specified by partition or QOS using the slurm.conf file or database respectively'
                            variant='standard'
                            value={GraceTime}
                            name='GraceTime'
                            onChange={(e) => setGraceTime(e.target.value)}
                        />
                        <TextField
                            id='PreemptExemptTime'
                            type='number'
                            InputProps={{ inputProps: { min: '1', max: '604800', step: '1' } }}
                            fullWidth
                            label='Preempt Exempt Time'
                            helperText='Specifies minimum run time of jobs before they are considered for preemption. This is only honored when the PreemptMode is set to REQUEUE or CANCEL. It is specified as a time string: A time of -1 disables the option, equivalent to 0'
                            variant='standard'
                            value={PreemptExemptTime}
                            name='PreemptExemptTime'
                            onChange={(e) => setPreemptExemptTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>Job Limit:</Typography>
                        </Stack>
                        <TextField
                            id='GrpJobs'
                            type='number'
                            fullWidth
                            label='GrpJobs'
                            helperText='The total number of jobs able to run at any given time from an association and its children. If this limit is reached, new jobs will be queued but only allowed to run after previous jobs complete from this group.'
                            variant='standard'
                            value={GrpJobs}
                            name='GrpJobs'
                            onChange={(e) => setGrpJobs(e.target.value)}
                        />
                        <TextField
                            id='GrpWall'
                            type='number'
                            fullWidth
                            label='GrpWall'
                            helperText='The maximum wall clock time running jobs are able to be allocated in aggregate for an association and its children. If this limit is reached, future jobs in this association will be queued until they are able to run inside the limit.'
                            variant='standard'
                            value={GrpWall}
                            name='GrpWall'
                            onChange={(e) => setGrpWall(e.target.value)}
                        />

                        <TextField
                            id='MaxWallDurationPerJob'
                            type='number'
                            fullWidth
                            label='Max Wall Duration Per Job'
                            helperText='The maximum wall clock time any individual job can run for in the given association. If this limit is reached, the job will be denied at submission.'
                            variant='standard'
                            value={MaxWallDurationPerJob}
                            name='MaxWallDurationPerJob'
                            onChange={(e) => setMaxWallDurationPerJob(e.target.value)}
                        />

                        <TextField
                            id='MaxJobsPerAccount'
                            type='number'
                            fullWidth
                            label='Max Jobs Per Account'
                            helperText='The maximum number of jobs an account (or sub-account) can have running at a given time.'
                            variant='standard'
                            value={MaxJobsPerAccount}
                            name='MaxJobsPerAccount'
                            onChange={(e) => setMaxJobsPerAccount(e.target.value)}
                        />
                        <TextField
                            id='MaxJobsPerUser'
                            type='number'
                            fullWidth
                            label='Max Jobs Per User'
                            helperText='The maximum number of jobs a user can have running at a given time.'
                            variant='standard'
                            value={MaxJobsPerUser}
                            name='MaxJobsPerUser'
                            onChange={(e) => setMaxJobsPerUser(e.target.value)}
                        />

                        <TextField
                            id='MaxSubmitJobsPerAccount'
                            type='number'
                            fullWidth
                            label='Max Submit Jobs Per Account'
                            helperText='The maximum number of jobs an account (or sub-account) can have running and pending at a given time.'
                            variant='standard'
                            value={MaxSubmitJobsPerAccount}
                            name='MaxSubmitJobsPerAccount'
                            onChange={(e) => setMaxSubmitJobsPerAccount(e.target.value)}
                        />

                        <TextField
                            id='MaxSubmitJobsPerUser'
                            type='number'
                            fullWidth
                            label='Max Submit Jobs Per User'
                            helperText='The maximum number of jobs a user can have running and pending at a given time.'
                            variant='standard'
                            value={MaxSubmitJobsPerUser}
                            name='MaxSubmitJobsPerUser'
                            onChange={(e) => setMaxSubmitJobsPerUser(e.target.value)}
                        />
                        <TextField
                            id='GrpTRES'
                            type='string'
                            fullWidth
                            label='GrpTRES'
                            helperText='The total count of TRES able to be used at any given time from jobs running from an association and its children. If this limit is reached, new jobs will be queued but only allowed to run after resources have been relinquished from this group.'
                            variant='standard'
                            value={GrpTRES}
                            name='GrpTRES'
                            onChange={(e) => setGrpTRES(e.target.value)}
                        />
                        <TextField
                            id='MaxTRESPerAccount'
                            type='string'
                            fullWidth
                            label='Max TRES Per Account'
                            helperText='The maximum number of TRES an account can allocate at a given time.'
                            variant='standard'
                            value={MaxTRESPerAccount}
                            name='MaxTRESPerAccount'
                            onChange={(e) => setMaxTRESPerAccount(e.target.value)}
                        />
                        <TextField
                            id='MaxTRESPerJob'
                            type='string'
                            fullWidth
                            label='Max TRES Per Job'
                            helperText='The maximum number of TRES each job is able to use. cpu=4,mem=200,node=3'
                            variant='standard'
                            value={MaxTRESPerJob}
                            name='MaxTRESPerJob'
                            onChange={(e) => setMaxTRESPerJob(e.target.value)}
                        />
                        <TextField
                            id='MaxTRESPerNode'
                            type='string'
                            fullWidth
                            label='Max TRES Per Node'
                            helperText='The maximum number of TRES each node in a job allocation can use. cpu=4,mem=200'
                            variant='standard'
                            value={MaxTRESPerNode}
                            name='MaxTRESPerNode'
                            onChange={(e) => setMaxTRESPerNode(e.target.value)}
                        />
                        <TextField
                            id='MaxTRESPerUser'
                            type='string'
                            fullWidth
                            label='Max TRES Per User'
                            helperText='The maximum number of TRES a user can allocate at a given time. cpu=4,mem=20000,gres/gpu=20'
                            variant='standard'
                            value={MaxTRESPerUser}
                            name='MaxTRESPerUser'
                            onChange={(e) => setMaxTRESPerUser(e.target.value)}
                        />
                        <TextField
                            id='UsageFactor'
                            type='number'
                            fullWidth
                            label='Usage Factor'
                            helperText='A float that is factored into a job TRES usage (e.g. RawUsage, TRESMins, TRESRunMins).Default: 1.0'
                            variant='standard'
                            value={UsageFactor}
                            name='UsageFactor'
                            onChange={(e) => setUsageFactor(e.target.value)}
                        />
                        <TextField
                            id='UsageThreshold'
                            type='number'
                            fullWidth
                            label='Usage Threshold'
                            helperText='Required QOS threshold has been breached.'
                            variant='standard'
                            value={UsageThreshold}
                            name='UsageThreshold'
                            onChange={(e) => setUsageThreshold(e.target.value)}
                        />
                    </div>
                </Box>
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
                    Close
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

QosDetailsDialog.propTypes = {
    show: PropTypes.bool,
    qosName: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default QosDetailsDialog
