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
                QOS详情
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
                            <Typography variant='overline'>基本参数：</Typography>
                        </Stack>
                        <TextField
                            id='name'
                            required
                            type='string'
                            fullWidth
                            label='QOS 名称'
                            helperText='名称不能重复'
                            variant='standard'
                            value={name}
                            name='name'
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            id='description'
                            type='string'
                            fullWidth
                            label='描述'
                            helperText='qos描述信息'
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
                            label='优先级'
                            helperText='值越小, 优先级越高, 最小值 1'
                            variant='standard'
                            value={priority}
                            name='priority'
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </div>
                    <div>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>抢占策略：</Typography>
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
                            label='宽限时间'
                            helperText='指定作业在被选择为抢占后执行的时间段。只有在PreemptMode=CANCEL时才会使用此选项。即没有抢占延迟。一旦选择了一个作业进行抢占，其结束时间被设置为当前时间加上本字段。单位：秒，默认值为零'
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
                            label='抢占豁免时间'
                            helperText='指定作业在考虑抢占之前的最小运行时间。与GraceTime不同，这适用于所有PreemptMode的值。-1的时间表示禁用该选项，相当于0。单位：秒'
                            variant='standard'
                            value={PreemptExemptTime}
                            name='PreemptExemptTime'
                            onChange={(e) => setPreemptExemptTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>作业限制：</Typography>
                        </Stack>
                        <TextField
                            id='GrpJobs'
                            type='number'
                            fullWidth
                            label='最大同时作业运行数'
                            helperText='QOS能够同时运行的作业总数。一旦达到此限制，新的作业将被排队，但只有在前面的作业完成后，才能允许运行该组中的新作业'
                            variant='standard'
                            value={GrpJobs}
                            name='GrpJobs'
                            onChange={(e) => setGrpJobs(e.target.value)}
                        />
                        <TextField
                            id='GrpWall'
                            type='number'
                            fullWidth
                            label='最长挂钟时间总数'
                            helperText='QOS能够分配的运行作业的最长挂钟时间总数的上限。一旦达到此限制，该QOS中的未来作业将被排队，直到它们能够在限制范围内运行。此使用情况会按照PriorityDecayHalfLife的速率进行衰减,单位： mins'
                            variant='standard'
                            value={GrpWall}
                            name='GrpWall'
                            onChange={(e) => setGrpWall(e.target.value)}
                        />

                        <TextField
                            id='MaxWallDurationPerJob'
                            type='number'
                            fullWidth
                            label='单个作业最长挂钟时间'
                            helperText='每个作业的最长挂钟时间，单位：mins'
                            variant='standard'
                            value={MaxWallDurationPerJob}
                            name='MaxWallDurationPerJob'
                            onChange={(e) => setMaxWallDurationPerJob(e.target.value)}
                        />

                        <TextField
                            id='MaxJobsPerAccount'
                            type='number'
                            fullWidth
                            label='单group最大同时运行作业数'
                            helperText='每个group同时运行作业数量的上限'
                            variant='standard'
                            value={MaxJobsPerAccount}
                            name='MaxJobsPerAccount'
                            onChange={(e) => setMaxJobsPerAccount(e.target.value)}
                        />
                        <TextField
                            id='MaxJobsPerUser'
                            type='number'
                            fullWidth
                            label='单用户同时运行作业数'
                            helperText='每个用户同时运行作业数量的上限'
                            variant='standard'
                            value={MaxJobsPerUser}
                            name='MaxJobsPerUser'
                            onChange={(e) => setMaxJobsPerUser(e.target.value)}
                        />

                        <TextField
                            id='MaxSubmitJobsPerAccount'
                            type='number'
                            fullWidth
                            label='单group提交作业数峰值'
                            helperText='单group能够同时运行和排队的作业数量的上限，超出将不被允许提交，直到上限解除'
                            variant='standard'
                            value={MaxSubmitJobsPerAccount}
                            name='MaxSubmitJobsPerAccount'
                            onChange={(e) => setMaxSubmitJobsPerAccount(e.target.value)}
                        />

                        <TextField
                            id='MaxSubmitJobsPerUser'
                            type='number'
                            fullWidth
                            label='单用户最大提交作业数'
                            helperText='单用户能够同时运行和排队的作业数量的上限，超出将不被允许提交，直到上限解除'
                            variant='standard'
                            value={MaxSubmitJobsPerUser}
                            name='MaxSubmitJobsPerUser'
                            onChange={(e) => setMaxSubmitJobsPerUser(e.target.value)}
                        />
                        <TextField
                            id='GrpTRES'
                            type='string'
                            fullWidth
                            label='最大资源总数'
                            helperText='该QOS在任何给定时间能够使用的TRES（资源消耗）总数的上限。一旦达到此限制，新的作业将被排队，但只有在该组释放出资源后才允许运行。例如：cpu=4,mem=40000,gres/gpu=50'
                            variant='standard'
                            value={GrpTRES}
                            name='GrpTRES'
                            onChange={(e) => setGrpTRES(e.target.value)}
                        />
                        <TextField
                            id='MaxTRESPerAccount'
                            type='string'
                            fullWidth
                            label='单group资源消耗峰值'
                            helperText='每个组能够使用的TRES（资源消耗）数量的最大上限，例如cpu=4,mem=200,node=3'
                            variant='standard'
                            value={MaxTRESPerAccount}
                            name='MaxTRESPerAccount'
                            onChange={(e) => setMaxTRESPerAccount(e.target.value)}
                        />
                        <TextField
                            id='MaxTRESPerJob'
                            type='string'
                            fullWidth
                            label='单作业资源消耗峰值'
                            helperText='每个作业能够使用的TRES（资源消耗）数量的最大上限，例如cpu=4,mem=200,node=3'
                            variant='standard'
                            value={MaxTRESPerJob}
                            name='MaxTRESPerJob'
                            onChange={(e) => setMaxTRESPerJob(e.target.value)}
                        />
                        <TextField
                            id='MaxTRESPerNode'
                            type='string'
                            fullWidth
                            label='单节点资源消耗峰值'
                            helperText='每个节点能够使用的TRES（资源消耗）数量的最大上限，例如cpu=4,mem=200'
                            variant='standard'
                            value={MaxTRESPerNode}
                            name='MaxTRESPerNode'
                            onChange={(e) => setMaxTRESPerNode(e.target.value)}
                        />
                        <TextField
                            id='MaxTRESPerUser'
                            type='string'
                            fullWidth
                            label='单用户资源消耗峰值'
                            helperText='每个用户在任何给定时间能够分配的TRES（资源消耗）数量的最大上限，例如cpu=4,mem=20000,gres/gpu=20'
                            variant='standard'
                            value={MaxTRESPerUser}
                            name='MaxTRESPerUser'
                            onChange={(e) => setMaxTRESPerUser(e.target.value)}
                        />
                        <TextField
                            id='UsageFactor'
                            type='number'
                            fullWidth
                            label='资源消耗计算因子'
                            helperText='一个浮点数，用于计算作业的TRES（资源消耗）使用量（例如，RawUsage、TRESMins、TRESRunMins）。例如，如果usagefactor为2，则对于每个TRESBillingUnit秒作业运行的时间将计为2。如果usagefactor为0.5，则每秒只计为一半的时间。设置为0表示作业不会产生时间上的使用量，默认：1.0'
                            variant='standard'
                            value={UsageFactor}
                            name='UsageFactor'
                            onChange={(e) => setUsageFactor(e.target.value)}
                        />
                        <TextField
                            id='UsageThreshold'
                            type='number'
                            fullWidth
                            label='QOS利用率阈值'
                            helperText='一个浮点数，表示qos最低公平份额的阈值，达到此阈值以下的qos将无法运行作业。如果qos的使用量低于此阈值，并且有待处理的作业或提交新作业，则这些作业将被暂停，直到使用量再次超过阈值为止,取值范围：0~1,例如0.88，默认：0'
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
                    关闭
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
