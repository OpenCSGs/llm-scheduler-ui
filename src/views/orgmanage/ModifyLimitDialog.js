import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect, useCallback, useMemo } from 'react'

import {
    Box,
    MenuItem,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Checkbox,
    FormLabel,
    FormGroup
} from '@mui/material'
import { StyledButton } from 'ui-component/button/StyledButton'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'

import { useTheme } from '@mui/material/styles'

// Hooks
import accountAPI from 'api/useraccount'
import useApi from 'hooks/useApi'

const ModifyLimitDialog = ({ show, currentLimit, group, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')
    const theme = useTheme()

    const getPartitions = useApi(accountAPI.getPartitions)
    const getQOS = useApi(accountAPI.getQOS)
    const [qos, setQos] = useState('')
    const [partition, setPartition] = useState('')

    const [qosList, setQosList] = useState([])
    const [partitionList, setPartitionList] = useState([])
    const [selectedQos, setSelectedQos] = useState([])

    useEffect(() => {
        if (show) {
            getPartitions.request()
            getQOS.request()
            if (currentLimit) {
                if (currentLimit.qos.length > 0) {
                    setQos(currentLimit.qos[0])
                }
                setPartition(currentLimit.partition)
            }
        }
    }, [show])

    useEffect(() => {
        if (getQOS.data) {
            let list = getQOS.data.qos
            for (let q of list) {
                q.checked = false
            }
            setQosList(list)
        }
    }, [getQOS.data])

    useEffect(() => {
        if (getPartitions.data) {
            setPartitionList(getPartitions.data.partitions)
        }
    }, [getPartitions.data])

    const selectQos = (event, row) => {
        row['checked'] = !row['checked']
        if (row['checked']) {
            selectedQos.push(row.name)
        } else {
            selectedQos.splice(selectedQos.indexOf(row.name), 1)
        }
        setSelectedQos(selectedQos)
        let newObj = Object.assign([], qosList)
        setQosList(newObj)
    }

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
                分配队列和QOS: {group}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        id='PartitionHelperText'
                        label='Partition'
                        required
                        select
                        value={partition}
                        onChange={(e) => setPartition(e.target.value)}
                        helperText='select partition'
                        variant='standard'
                    >
                        {partitionList.map((row, index) => (
                            <MenuItem key={row.name + '_' + index} value={row.name}>
                                {row.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        id='PartitionHelperText'
                        label='QOS'
                        required
                        select
                        value={qos}
                        onChange={(e) => setQos(e.target.value)}
                        helperText='Select QOS'
                        variant='standard'
                    >
                        {qosList &&
                            qosList.map((row, index) => {
                                return (
                                    <MenuItem key={row.name + '_' + index} value={row.name}>
                                        {row.name}
                                    </MenuItem>
                                )
                            })}
                    </TextField>
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
                    Cancel
                </StyledButton>
                <StyledButton
                    sx={{
                        color: 'white',
                        background: theme.palette.secondary.iconBg,
                        ':hover': { background: theme.palette.secondary.iconHover }
                    }}
                    disabled={!qos || !partition}
                    variant='contained'
                    onClick={() => onConfirm(partition, [qos])}
                >
                    OK
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

ModifyLimitDialog.propTypes = {
    show: PropTypes.bool,
    group: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default ModifyLimitDialog
