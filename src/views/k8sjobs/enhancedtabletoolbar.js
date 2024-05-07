import { alpha } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import FilterListIcon from '@mui/icons-material/FilterList'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import useConfirm from 'hooks/useConfirm'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'

const EnhancedTableToolbar = (props) => {
    const { numSelected, selectRows, stopJob, setSelected } = props
    const { confirm } = useConfirm()

    const getShowAppNames = () => {
        let allNames = ''
        if (selectRows) {
            selectRows.forEach((d) => {
                allNames += ',' + d.job_id
            })
        }
        if (allNames.length > 0) {
            allNames = allNames.substring(1)
        }
        return allNames
    }


    const stopApps = async () => {
        let names = getShowAppNames()
        const confirmPayload = {
            title: '停止',
            description: `确认要停止${numSelected}个作业"${names}"吗?`,
            confirmButtonName: '停止'
            // cancelButtonName: '取消'
        }
        const isConfirmed = await confirm(confirmPayload)
        console.log('isConfirmed', isConfirmed, selectRows)
        if (isConfirmed) {
            let jobids = []
            selectRows.forEach((item) => {
                jobids.push(item.job_id)
            })
            stopJob(jobids)
            setSelected([])
        }
    }


    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) })
                }}
            >
                {numSelected > 0 ? (
                    <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
                        No selected items
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <>
                        {/* <Tooltip title='暂停'>
                            <IconButton color='primary' onClick={() => susApps()}>
                                <PauseCircleFilledIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='启动'>
                            <IconButton color='primary' onClick={() => resumeApps()}>
                                <PlayCircleFilledIcon />
                            </IconButton>
                        </Tooltip> */}
                        <Tooltip title='停止'>
                            <IconButton color='primary' onClick={() => stopApps()}>
                                <StopCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <Tooltip title='过滤功能更新中'>
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
            <ConfirmDialog />
        </>
    )
}

export default EnhancedTableToolbar
