import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    TextField,
    Dialog,
    Select,
    MenuItem,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    OutlinedInput
} from '@mui/material'
import { StyledButton } from 'ui-component/button/StyledButton'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'
import { useTheme } from '@mui/material/styles'
import useAuth from 'hooks/useAuth'

// utils
import useNotifier from 'utils/useNotifier'

const JobDialog = ({ jobShow, jobDialogProps, userDatas, jobCancel, jobConfirm }) => {
    const portalElement = document.getElementById('portal')
    const { userInfo } = useAuth()
    // console.log("jobshow:" + jobShow)
    // console.log(jobDialogProps)

    // console.log(`userDatas is: ${JSON.stringify(userDatas)}`)

    const dupRemove = (array, key) => {
        let tmpArray = ['<USE DEFAULT>']
        try {
            array.forEach((element) => {
                tmpArray.push(element[key])
            })
        } catch (error) {
            console.log(`dupRemove error with message: ${error}`)
        }
        return [...new Set(tmpArray)]
    }

    const accountList = dupRemove(userDatas, 'account')
    const partitionList = dupRemove(userDatas, 'partition')
    // console.log(`accountList is ${JSON.stringify(accountList)} , partitionList is ${JSON.stringify(partitionList)}`)

    useNotifier()
    const [jobName, setJobName] = useState('')
    const [jobCMD, setJobCMD] = useState('')
    const [otherOpt, setOtherOpt] = useState('')
    const [llmName, setllmName] = useState('')
    const [baseModel, setBaseModel] = useState('')
    const [trainPara, setTrainPara] = useState('')
    const [trainTemp, setTrainTemp] = useState('')

    // 高级参数
    const [account, setAccount] = useState('<USE DEFAULT>')
    const [qos, setQos] = useState('<USE DEFAULT>')
    const [partition, setPartition] = useState('<USE DEFAULT>')
    const [standard_input, setStandardInput] = useState('')
    const [nodes, setNodes] = useState('')
    const [tasks_per_node, setTasksPerNode] = useState('')
    const [cpus_per_task, setCpusPerTask] = useState('')
    const [memory_per_cpu, setMemoryPerCpu] = useState('2000M')
    const [current_working_directory, setCurrentWorkingDirectory] = useState(``)
    const theme = useTheme()

    const handleSelectChange = (event) => {
        setllmName(event.target.value)
    }

    const handleTemplateChange = (event) => {
        setTrainTemp(event.target.value)
    }

    const addParmToOtherOpt = (key, value, orgString) => {
        if (value && value !== '<USE DEFAULT>') {
            orgString = `${orgString} ${key}=${value}`
            // console.log("inner otherOpt:" + orgString + " key:" + key + " value:" + value)
        }
        return orgString
    }

    const parseArgs = (str) => {
        return str.split(' ').reduce((acc, arg) => {
            const [key, value] = arg.split('=')
            acc[key] = value
            return acc
        }, {})
    }

    useEffect(() => {
        // setJobName('')
        // setJobCMD('')
        // setOtherOpt('')
        setllmName('')
        setTrainTemp('')
        setTrainPara('')
        setBaseModel('')
        setCurrentWorkingDirectory(
            `${process.env.REACT_APP_OUTPUT_LOCATION}/${userInfo.name}/output-${Math.random().toString(36).slice(-8)}`
        )
    }, [jobDialogProps])

    const submitJobConfirm = () => {
        //submit jobs
        const dataBody = {
            job: {
                tasks: 1,
                standard_output: 'starcloud-job-%j.out',
                standard_error: 'starcloud-job-%j.err',
                name: jobName,
                environment: ['PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin']
            },
            script: '#!/bin/bash\n' + jobCMD
        }
        let orgString = ''
        orgString = addParmToOtherOpt('account', account, orgString)
        orgString = addParmToOtherOpt('qos', qos, orgString)
        orgString = addParmToOtherOpt('partition', partition, orgString)
        orgString = addParmToOtherOpt('standard_input', standard_input, orgString)
        orgString = addParmToOtherOpt('nodes', nodes, orgString)
        orgString = addParmToOtherOpt('tasks_per_node', tasks_per_node, orgString)
        orgString = addParmToOtherOpt('cpus_per_task', cpus_per_task, orgString)
        orgString = addParmToOtherOpt('memory_per_cpu', memory_per_cpu, orgString)
        orgString = addParmToOtherOpt('current_working_directory', current_working_directory, orgString)
        orgString = `${orgString} ${otherOpt}`
        const parsedArgs = parseArgs(orgString)
        // console.log("final parsedArgs: " + JSON.stringify(parsedArgs))

        Object.keys(parsedArgs).map(function (key) {
            dataBody.job[key] = parsedArgs[key]
        })

        //TODO: finetune in docker
        if (trainTemp === 1) {
            dataBody.script = '#!/bin/bash\nsrun /home/test/ChatGLM-6B/ptuning/train.sh '
            dataBody.job.name = 'chatglm-6b-finetune'
        }

        // inference jobs
        if (jobDialogProps.jobType === 'inf') {
            switch (llmName) {
                // {1}: chatglm-6b
                // {2}: chatglm-6b-int4
                // {3}: chatglm2-6b
                // {4}: chatglm2-6b-int4
                // {5}: MOSS
                // {6}: Llama2-7B-Chat
                // {7}: midjourney
                // {8}: chatglm3-6b
                case 1:
                    dataBody.script =
                        '#!/bin/bash\nsrun docker run -v /models/chatglm-6b:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 '
                    dataBody.job.name = 'chatglm-6b-inference'
                    break
                case 2:
                    dataBody.script =
                        '#!/bin/bash\nsrun docker run -v /models/chatglm-6b-int4:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 '
                    dataBody.job.name = 'chatglm-6b-int4-inference'
                    break
                case 3:
                    dataBody.script =
                        '#!/bin/bash\nsrun docker run -v /models/chatglm2-6b:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 '
                    dataBody.job.name = 'chatglm2-6b-inference'
                    break
                case 4:
                    dataBody.script =
                        '#!/bin/bash\nsrun docker run -v /models/chatglm2-6b-int4:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 '
                    dataBody.job.name = 'chatglm2-6b-int4-inference'
                    break
                case 5:
                    dataBody.script = '#!/bin/bash\nsrun ls /models/MOSS'
                    dataBody.job.name = 'moss-inference'
                    break
                case 6:
                    dataBody.script = '#!/bin/bash\nsrun ls /models/Llama2-7B-Chat'
                    dataBody.job.name = 'llama2-7B-Chat-inference'
                    break
                case 7:
                    dataBody.script = '#!/bin/bash\nsrun ls /models/midjourney-inference'
                    dataBody.job.name = 'midjourney-inference'
                    break
                case 8:
                    dataBody.script =
                        '#!/bin/bash\nsrun docker run -v /models/chatglm3-6b:/model registry.jihulab.com/opencsg/llmscheduler/chatglm-inference:v1 '
                    dataBody.job.name = 'chatglm3-6b-inference'
                    break
                default:
                    dataBody.script = '#!/bin/bash\nsrun docker --version'
                    dataBody.job.name = 'errorJob'
            }
        }

        console.log('job submit body: ' + JSON.stringify(dataBody))
        jobConfirm(dataBody)
    }

    const returnPage = () => {
        jobCancel()
    }

    const component =
        jobShow && jobDialogProps.jobType == 'oth' ? (
            <Dialog
                fullWidth
                maxWidth='md'
                open={jobShow}
                onClose={jobCancel}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                    {jobDialogProps.title}-自定义作业
                </DialogTitle>
                <DialogContent>
                    <Box
                        component='form'
                        sx={{
                            '& .MuiTextField-root': { m: 2, width: '26ch' }
                        }}
                        noValidate
                        autoComplete='off'
                    >
                        <div>
                            <Stack sx={{ position: 'relative' }} direction='row'>
                                <Typography variant='overline'>基本参数：</Typography>
                            </Stack>
                            <TextField
                                id='myJobCMDHelperText'
                                label='运行命令'
                                helperText='*必填项，输入作业运行命令, e.g: sleep 30'
                                required
                                variant='standard'
                                value={jobCMD}
                                onChange={(e) => setJobCMD(e.target.value)}
                            />
                            <TextField
                                id='myJobNameHelperText'
                                label='作业名称'
                                helperText='输入作业名称，e.g: myJob'
                                variant='standard'
                                value={jobName}
                                onChange={(e) => setJobName(e.target.value)}
                            />
                        </div>
                        <br />
                        <div>
                            <Stack sx={{ position: 'relative' }} direction='row'>
                                <Typography variant='overline'>高级参数（选填）：</Typography>
                            </Stack>
                            <TextField
                                id='PartitionHelperText'
                                label='Partition'
                                select
                                value={partition}
                                onChange={(e) => setPartition(e.target.value)}
                                helperText='输入提交作业到哪个作业组分区（partition）'
                                variant='standard'
                            >
                                {partitionList.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id='AccountHelperText'
                                label='Account'
                                select
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                helperText='输入用户组账户名称（Account）'
                                variant='standard'
                            >
                                {accountList.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id='QoSHelperText'
                                label='QoS'
                                helperText='输入QoS'
                                variant='standard'
                                value={qos}
                                onChange={(e) => setQos(e.target.value)}
                            />
                            <TextField
                                id='NodeHelperText'
                                label='节点数量'
                                helperText='并行运行作业的节点数量，default=1'
                                variant='standard'
                                value={nodes}
                                onChange={(e) => setNodes(e.target.value)}
                            />
                            <TextField
                                id='TasksHelperText'
                                label='每节点任务数'
                                helperText='每个节点上并行运行的任务数，default=1'
                                variant='standard'
                                value={tasks_per_node}
                                onChange={(e) => setTasksPerNode(e.target.value)}
                            />
                            <TextField
                                id='CPUHelperText'
                                label='每任务CPU数'
                                helperText='每个任务上运行的CPU核，默认占满。e.g: 2'
                                variant='standard'
                                value={cpus_per_task}
                                onChange={(e) => setCpusPerTask(e.target.value)}
                            />
                            <TextField
                                id='memory_per_cpu'
                                label='每CPU内存占用'
                                helperText='每个CPU核允许的内存占用，默认占满。e.g: 1G/500M'
                                variant='standard'
                                value={memory_per_cpu}
                                onChange={(e) => setMemoryPerCpu(e.target.value)}
                            />
                            <TextField
                                id='otherOpt'
                                label='其它参数'
                                helperText="其它作业参数, e.g: required_nodes=['m1','m2'] maximum_cpus=3 tres_per_node=gres/gpu:0"
                                variant='standard'
                                value={otherOpt}
                                onChange={(e) => setOtherOpt(e.target.value)}
                            />
                        </div>
                        <br />
                        <div>
                            <Stack sx={{ position: 'relative' }} direction='row'>
                                <Typography variant='overline'>数据（选填）：</Typography>
                            </Stack>
                            <TextField
                                id='standard_input'
                                label='输入数据'
                                helperText='输入数据路径'
                                variant='standard'
                                value={standard_input}
                                onChange={(e) => setStandardInput(e.target.value)}
                            />
                            <TextField
                                id='current_working_directory'
                                label='作业输出文件夹'
                                helperText='作业输出文件夹路径（同current_working_directory）e.g: /tmp'
                                variant='standard'
                                value={current_working_directory}
                                onChange={(e) => setCurrentWorkingDirectory(e.target.value)}
                            />
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <StyledButton
                        variant='contained'
                        onClick={() => returnPage()}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }}
                    >
                        {jobDialogProps.returnButtonName}
                    </StyledButton>
                    <StyledButton
                        disabled={!jobCMD}
                        variant='contained'
                        onClick={() => submitJobConfirm()}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }}
                    >
                        {jobDialogProps.confirmButtonName}
                    </StyledButton>
                </DialogActions>
                <ConfirmDialog />
            </Dialog>
        ) : jobShow && jobDialogProps.jobType === 'inf' ? (
            <Dialog
                fullWidth
                maxWidth='md'
                open={jobShow}
                onClose={jobCancel}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                    {jobDialogProps.title}-大模型推理
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>
                                选择大模型
                                <span style={{ color: 'red' }}>&nbsp;*</span>
                            </Typography>
                        </Stack>
                        {/* <InputLabel id="demo-simple-select-label">选择大模型</InputLabel> */}
                        <Select
                            labelId='demo-simple-select-label'
                            fullWidth
                            id='demo-simple-select'
                            value={llmName}
                            label={llmName}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={1}>chatglm-6b</MenuItem>
                            <MenuItem value={2}>chatglm-6b-int4</MenuItem>
                            <MenuItem value={3}>chatglm2-6b</MenuItem>
                            <MenuItem value={4}>chatglm2-6b-int4</MenuItem>
                            <MenuItem value={5}>MOSS</MenuItem>
                            <MenuItem value={6}>Llama2-7B-Chat</MenuItem>
                            <MenuItem value={7}>midjourney</MenuItem>
                            <MenuItem value={8}>chatglm3-6b</MenuItem>
                            <MenuItem value={99}> &nbsp; </MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography sx={{ fontSize: 12, m: 1 }}>其它参数, e.g: partition=low qos=default account=default</Typography>
                        </Stack>
                        <OutlinedInput
                            id='otherOpt'
                            type='string'
                            fullWidth
                            placeholder='作业运行参数，比如作业组，资源等特殊需求.'
                            multiline={true}
                            // rows={3}
                            value={otherOpt}
                            name='otherOpt'
                            onChange={(e) => setOtherOpt(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <StyledButton
                        variant='contained'
                        onClick={() => returnPage()}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }}
                    >
                        {jobDialogProps.returnButtonName}
                    </StyledButton>
                    <StyledButton
                        disabled={!llmName}
                        variant='contained'
                        onClick={() => submitJobConfirm()}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }}
                    >
                        {jobDialogProps.confirmButtonName}
                    </StyledButton>
                </DialogActions>
                <ConfirmDialog />
            </Dialog>
        ) : jobShow && jobDialogProps.jobType == 'tra' ? (
            <Dialog
                fullWidth
                maxWidth='md'
                open={jobShow}
                onClose={jobCancel}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                    {jobDialogProps.title}-大模型训练
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>
                                选择训练模版
                                <span style={{ color: 'red' }}>&nbsp;*</span>
                            </Typography>
                        </Stack>
                        <Select
                            labelId='template-select-label'
                            fullWidth
                            id='template-select'
                            value={trainTemp}
                            label='trainTemp'
                            onChange={handleTemplateChange}
                        >
                            <MenuItem value={1}>模型分布式多机多卡微调</MenuItem>
                            <MenuItem value={2}>模型单机多卡微调</MenuItem>
                            {/* <MenuItem value={99}> &nbsp; </MenuItem> */}
                        </Select>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>
                                模型
                                <span style={{ color: 'red' }}>&nbsp;*</span>
                            </Typography>
                        </Stack>
                        <OutlinedInput
                            id='baseModel'
                            type='string'
                            fullWidth
                            placeholder='输入BaseModel在环境中的位置. e.g: /root/models/chatglm-6b'
                            multiline={false}
                            // rows={3}
                            value={baseModel}
                            name='baseModel'
                            onChange={(e) => setBaseModel(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>训练参数</Typography>
                        </Stack>
                        <OutlinedInput
                            id='trainPara'
                            type='string'
                            fullWidth
                            placeholder='大模型训练相关参数调整'
                            multiline={false}
                            // rows={3}
                            value={trainPara}
                            name='trainPara'
                            onChange={(e) => setTrainPara(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography sx={{ fontSize: 12, m: 1 }}>其它参数, e.g: partition=low qos=default account=default</Typography>
                        </Stack>
                        <OutlinedInput
                            id='otherOpt'
                            type='string'
                            fullWidth
                            placeholder='作业运行参数，比如作业组，资源等特殊需求.'
                            multiline={true}
                            // rows={3}
                            value={otherOpt}
                            name='otherOpt'
                            onChange={(e) => setOtherOpt(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <StyledButton
                        variant='contained'
                        onClick={() => returnPage()}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }}
                    >
                        {jobDialogProps.returnButtonName}
                    </StyledButton>
                    <StyledButton
                        disabled={!(trainTemp && baseModel)}
                        variant='contained'
                        onClick={() => submitJobConfirm()}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }}
                    >
                        {jobDialogProps.confirmButtonName}
                    </StyledButton>
                </DialogActions>
                <ConfirmDialog />
            </Dialog>
        ) : null

    return createPortal(component, portalElement)
}

JobDialog.propTypes = {
    jobShow: PropTypes.bool,
    jobDialogProps: PropTypes.object,
    userDatas: PropTypes.array,
    jobCancel: PropTypes.func,
    jobConfirm: PropTypes.func
}

export default JobDialog
