import SDK from 'casdoor-js-sdk'
import { authConfig, config } from '../../config'
import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from 'ui-component/alert/Alert'
import { useNavigate } from 'react-router-dom'
// Hooks
import useApi from 'hooks/useApi'
import auth from 'api/auth'
import useAuth from 'hooks/useAuth'
import { boolean } from 'yup/lib/locale'

function Copyright(props) {
    return (
        <Typography variant='body2' color='text.secondary' align='center' {...props}>
            {'Copyright © '}
            <Link color='inherit' href='https://portal.opencsg.com/'>
                OpenCSG
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}
export default function Jump() {
    const navigate = useNavigate()
    const signIn = useApi(auth.signIn)
    const { setUserInfo, setIDToken } = useAuth()
    const [errorMsg, setErrorMsg] = useState([])
    const [open, setOpen] = React.useState(false)
    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        signIn.request({ username: data.get('username'), password: data.get('password') })
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }
    useEffect(() => {
        if (signIn.data) {
            setUserInfo(signIn.data.userinfos)
            setIDToken(signIn.data.token)
            navigate(config.defaultPath, { replace: true })
        }
    }, [signIn.data])
    useEffect(() => {
        if (signIn.error) {
            setOpen(true)
            var response = signIn.error.response
            setErrorMsg(response.data.message)
        }
    }, [signIn.error])
    const defaultTheme = createTheme()
    if (!config.ON_PREMISE) {
        const sdk = new SDK(authConfig)
        window.location.href = sdk.getSigninUrl()
        return <></>
    } else {
        return (
            <ThemeProvider theme={defaultTheme}>
                <Container component='main' maxWidth='xs'>
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component='h1' variant='h5'>
                            LLM Scheduler Console
                        </Typography>
                        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                id='username'
                                label='User Name'
                                name='username'
                                autoComplete='username'
                                autoFocus
                            />
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='current-password'
                            />
                            <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
                            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                                Login
                            </Button>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert severity='error' onClose={handleClose} sx={{ width: '100%' }}>
                        {errorMsg}
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        )
    }
}
