import { alpha } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DoDisturb, ArrowCircleUp } from '@mui/icons-material'
import useConfirm from 'hooks/useConfirm'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'

const EnhancedTableToolbar = (props) => {
    const { numSelected, selectRows, closeNode, openNode, setSelected } = props
    const { confirm } = useConfirm()

    const getShowAppNames = () => {
        let allNames = ''
        if (selectRows) {
            selectRows.forEach((d) => {
                allNames += ',' + d.name
            })
        }
        if (allNames.length > 0) {
            allNames = allNames.substring(1)
        }
        return allNames
    }

    const closeNodes = async () => {
        let names = getShowAppNames()
        const confirmPayload = {
            title: '关闭',
            description: `确认要关闭${names}吗?`,
            confirmButtonName: '确定',
            cancelButtonName: '取消'
        }
        const isConfirmed = await confirm(confirmPayload)
        if (isConfirmed) {
            selectRows.forEach((item) => {
                closeNode(item)
            })
            setSelected([])
        }
    }

    const openNodes = async () => {
        let names = getShowAppNames()
        const confirmPayload = {
            title: '打开',
            description: `确认要打开${names}吗?`,
            confirmButtonName: '确定',
            cancelButtonName: '取消'
        }
        const isConfirmed = await confirm(confirmPayload)
        console.log('isConfirmed', isConfirmed, selectRows)
        if (isConfirmed) {
            selectRows.forEach((item) => {
                openNode(item)
            })
            setSelected([])
        }
    }

    return (
        <>
            {/* <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) })
                }}
            >
                {numSelected > 0 ? (
                    <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
                        {numSelected} 条被选择
                    </Typography>
                ) : (
                    <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
                        未选择条目
                    </Typography>
                )}
                {numSelected > 0 && (
                    <>
                        <Tooltip title='关闭'>
                            <IconButton color='error' onClick={() => closeNodes()}>
                                <DoDisturb />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='打开'>
                            <IconButton color='primary' onClick={() => openNodes()}>
                                <ArrowCircleUp />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar> */}
            <ConfirmDialog />
        </>
    )
}

export default EnhancedTableToolbar
