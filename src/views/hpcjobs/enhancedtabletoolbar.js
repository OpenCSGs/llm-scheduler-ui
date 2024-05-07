import { useEffect, useState, useMemo } from 'react'
import { alpha } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { MenuItem, Menu } from '@mui/material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FilterListIcon from '@mui/icons-material/FilterList'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import useConfirm from 'hooks/useConfirm'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputBase, Paper } from '@mui/material'

const EnhancedTableToolbar = (props) => {
    const { numSelected, selectRows, stopJob, setFilter, setSelected, startSearch } = props
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

    const stopJobs = async () => {
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

    const [filterValue, setFilterValue] = useState('past1day')
    const [searchKey, setSearchKeyword] = useState('')

    const handleChange = (event) => {
        setAnchorEl(null)
        setFilterValue(event.target.value)
        setFilter(event.target.value)
    }

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (event, actionId) => {
        event.stopPropagation()
        setAnchorEl(null)
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
                        {numSelected} 条被选择
                    </Typography>
                ) : (
                    <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
                        未选择条目
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
                            <IconButton color='primary' onClick={() => stopJobs()}>
                                <StopCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <IconButton onClick={handleClick}>
                            <FilterListIcon />
                        </IconButton>
                        <Menu
                            id='long-menu'
                            MenuListProps={{
                                'aria-labelledby': 'long-button'
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '20ch'
                                }
                            }}
                        >
                            <MenuItem key='past1day'>
                                <FormControl>
                                    <FormLabel id='demo-controlled-radio-buttons-group'>时间</FormLabel>
                                    <RadioGroup
                                        aria-labelledby='demo-controlled-radio-buttons-group'
                                        name='controlled-radio-buttons-group'
                                        value={filterValue}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value='past1day' control={<Radio />} label='Past one day jobs' />
                                        <FormControlLabel value='past1week' control={<Radio />} label='Past one week jobs' />
                                        <FormControlLabel value='past2week' control={<Radio />} label='Past two weeks jobs' />
                                    </RadioGroup>
                                </FormControl>
                            </MenuItem>
                            <MenuItem key='search'>
                                <Paper
                                    component='form'
                                    sx={{
                                        p: '2px 4px',
                                        border: '1px solid #efefef',
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 300
                                    }}
                                >
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder='Input Job Name'
                                        inputProps={{ 'aria-label': 'search job' }}
                                        value={searchKey}
                                        onChange={(event) => {
                                            setSearchKeyword(event.target.value)
                                        }}
                                    />
                                    <IconButton onClick={() => startSearch(searchKey)} type='button' sx={{ p: '10px' }} aria-label='search'>
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
            <ConfirmDialog />
        </>
    )
}

export default EnhancedTableToolbar
