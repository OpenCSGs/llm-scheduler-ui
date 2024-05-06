import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'
import { cloneDeep } from 'lodash'

import { Box, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Stack, OutlinedInput } from '@mui/material'
import { StyledButton } from 'ui-component/button/StyledButton'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'

import { useTheme } from '@mui/material/styles'

// Hooks
import useConfirm from 'hooks/useConfirm'
import useApi from 'hooks/useApi'

// utils
import useNotifier from 'utils/useNotifier'
import { generateRandomGradient } from 'utils/genericHelper'

const OrganizationDialog = ({ show, currentOrg, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')
    const theme = useTheme()

    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()
    const { confirm } = useConfirm()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const [orgName, setOrgName] = useState()
    const [accountName, setAccountName] = useState('')
    const [desc, setDesc] = useState('')
    useEffect(() => {
        if (show && currentOrg) {
            setOrgName(currentOrg)
        }
    }, [show])
    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {currentOrg ? '添加分组到: ' + currentOrg : '添加组织'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    {!currentOrg && (
                        <TextField
                            id='orgName'
                            type='string'
                            required
                            fullWidth
                            label='组织名称'
                            helperText='新建组织'
                            variant='standard'
                            value={orgName}
                            name='orgName'
                            onChange={(e) => setOrgName(e.target.value)}
                        />
                    )}
                    <TextField
                        id='accountName'
                        required
                        type='string'
                        fullWidth
                        label={currentOrg ? '创建新的分组' : '初始化分组'}
                        helperText={currentOrg ? '' : '组织创建的时候需要携带创建一个初始化分组,并保证唯一性'}
                        variant='standard'
                        value={accountName}
                        defaultValue='default'
                        name='accountName'
                        onChange={(e) => setAccountName(e.target.value)}
                    />
                    <TextField
                        id='desc'
                        required
                        type='string'
                        fullWidth
                        label='分组描述'
                        variant='standard'
                        value={desc}
                        name='desc'
                        onChange={(e) => setDesc(e.target.value)}
                    />
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
                    取消
                </StyledButton>
                <StyledButton
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                    disabled={!orgName || !accountName || !desc}
                    variant='contained'
                    onClick={() => onConfirm(orgName, accountName, desc)}
                >
                    确认
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

OrganizationDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default OrganizationDialog
