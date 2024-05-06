import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useAuth from 'hooks/useAuth'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Box,
    ButtonBase,
    Avatar,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography
} from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import Transitions from 'ui-component/extended/Transitions'
import { BackdropLoader } from 'ui-component/loading/BackdropLoader'
import AboutDialog from 'ui-component/dialog/AboutDialog'

// assets
import { IconLogout, IconSettings, IconFileExport, IconFileDownload, IconInfoCircle, IconUserCircle } from '@tabler/icons'

import { SET_MENU } from 'store/actions'

import './index.css'

// ==============================|| User MENU ||============================== //

const UserSection = ({ username, handleLogout }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const customization = useSelector((state) => state.customization)

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [aboutDialogOpen, setAboutDialogOpen] = useState(false)
    const [avatarImg, setAvatarImg] = useState('')
    const [showName, setShowName] = useState('')

    const anchorRef = useRef(null)
    const uploadRef = useRef(null)
    const { userInfo } = useAuth()

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    // const handleExportDB = async () => {
    //     setOpen(false)
    //     try {
    //         const response = await databaseApi.getExportDatabase()
    //         const exportItems = response.data
    //         let dataStr = JSON.stringify(exportItems)
    //         let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    //         let exportFileDefaultName = `DB.json`

    //         let linkElement = document.createElement('a')
    //         linkElement.setAttribute('href', dataUri)
    //         linkElement.setAttribute('download', exportFileDefaultName)
    //         linkElement.click()
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }

    // const handleFileUpload = (e) => {
    //     if (!e.target.files) return

    //     const file = e.target.files[0]
    //     const reader = new FileReader()
    //     reader.onload = async (evt) => {
    //         if (!evt?.target?.result) {
    //             return
    //         }
    //         const { result } = evt.target

    //         if (result.includes(`"chatmessages":[`) && result.includes(`"chatflows":[`) && result.includes(`"apikeys":[`)) {
    //             dispatch({ type: SET_MENU, opened: false })
    //             setLoading(true)

    //             try {
    //                 await databaseApi.createLoadDatabase(JSON.parse(result))
    //                 setLoading(false)
    //                 navigate('/', { replace: true })
    //                 navigate(0)
    //             } catch (e) {
    //                 console.error(e)
    //                 setLoading(false)
    //             }
    //         } else {
    //             alert('Incorrect Flowise Database Format')
    //         }
    //     }
    //     reader.readAsText(file)
    // }

    const prevOpen = useRef(open)
    useEffect(() => {
        if (userInfo) {
            if (userInfo.photo) {
                setAvatarImg(userInfo.photo)
            }
            setShowName(userInfo.username || userInfo.name || userInfo.phone)
        }
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }
        prevOpen.current = open
    }, [open])

    return (
        <>
            <ButtonBase ref={anchorRef} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Avatar
                    variant='rounded'
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        '&:hover': {
                            background: theme.palette.secondary.dark,
                            color: theme.palette.secondary.light
                        }
                    }}
                    onClick={handleToggle}
                    color='inherit'
                    src={avatarImg}
                >
                    {/* <IconUserCircle stroke={1.5} size='1.3rem' /> */}
                </Avatar>
            </ButtonBase>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 2 }}>
                                            {showName && (
                                                <Box sx={{ p: 2, verticalAlign: 'center' }}>
                                                    <Typography component='span' variant='h4'>
                                                        您好，{showName}！
                                                    </Typography>
                                                </Box>
                                            )}
                                            {/* <Divider /> */}
                                            {/* <List
                                                component='nav'
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 250,
                                                    minWidth: 200,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    onClick={() => {
                                                        setOpen(false)
                                                        uploadRef.current.click()
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <IconFileDownload stroke={1.5} size='1.3rem' />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant='body2'>Load Database</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    onClick={handleExportDB}
                                                >
                                                    <ListItemIcon>
                                                        <IconFileExport stroke={1.5} size='1.3rem' />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant='body2'>Export Database</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    onClick={() => {
                                                        setOpen(false)
                                                        // setAboutDialogOpen(true)
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <IconInfoCircle stroke={1.5} size='1.3rem' />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant='body2'>User Profile</Typography>} />
                                                </ListItemButton>
                                                {localStorage.getItem('username') && (
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                        onClick={handleLogout}
                                                    >
                                                        <ListItemIcon>
                                                            <IconLogout stroke={1.5} size='1.3rem' />
                                                        </ListItemIcon>
                                                        <ListItemText primary={<Typography variant='body2'>注销</Typography>} />
                                                    </ListItemButton>
                                                )}
                                            </List> */}
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
            {/* <input ref={uploadRef} type='file' hidden accept='.json' onChange={(e) => handleFileUpload(e)} /> */}
            <BackdropLoader open={loading} />
            {/* <AboutDialog show={aboutDialogOpen} onCancel={() => setAboutDialogOpen(false)} /> */}
        </>
    )
}

UserSection.propTypes = {
    username: PropTypes.string,
    handleLogout: PropTypes.func
}

export default UserSection
