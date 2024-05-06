import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import { Box, Button, styled, Dialog, DialogActions, DialogContent, DialogTitle, Stack, OutlinedInput } from '@mui/material'
import { StyledButton } from 'ui-component/button/StyledButton'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'

// utils
import useNotifier from 'utils/useNotifier'

const AppDialog = ({ show, dialogProps, onCancel, onNext }) => {
    const portalElement = document.getElementById('portal')
    const theme = useTheme()

    useNotifier()
    const [jobType, setJobType] = useState('')

    useEffect(() => {
        setJobType('')
    }, [dialogProps])

    const BootstrapButton = styled(Button)(({ theme, color = 'primary' }) => ({
        boxShadow: 'none',
        textTransform: 'none',
        color: 'white',
        backgroundColor: theme.palette[color].main,
        '&:hover': {
            backgroundColor: theme.palette[color].main,
            backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
        },
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        // backgroundColor: '#0063cc',
        borderColor: '#0063cc',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.4rem rgba(0,123,255,.5)',
        },
    }));

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
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <Box direction="row" spacing={2}>
                    <BootstrapButton style={{ margin: 20 }}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }}
                        disableRipple variant='contained' size="large" onClick={() => { setJobType('inf'); }}>
                        大模型推理
                    </BootstrapButton>
                    <BootstrapButton style={{ margin: 20 }}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }} disableRipple variant='contained' size="large" onClick={() => { setJobType('tra'); }}>
                        大模型对比
                    </BootstrapButton>
                    <BootstrapButton style={{ margin: 20 }}
                        sx={{
                            color: 'white',
                            background: theme.palette.secondary.iconBg,
                            ':hover': { background: theme.palette.secondary.iconHover }
                        }}
                        disableRipple variant='contained' size="large" onClick={() => { setJobType('oth'); }}>
                        自定义作业
                    </BootstrapButton>
                </Box>
            </DialogContent>
            <DialogActions>
                <StyledButton
                    variant='contained'
                    onClick={onCancel}
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                >
                    {dialogProps.cancelButtonName}
                </StyledButton>
                <StyledButton
                    disabled={!jobType}
                    variant='contained'
                    onClick={() => onNext(jobType)}
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                >
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

AppDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onNext: PropTypes.func
}

export default AppDialog
