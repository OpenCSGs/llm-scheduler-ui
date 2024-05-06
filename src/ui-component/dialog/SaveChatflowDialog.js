import { createPortal } from 'react-dom'
import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

import { Button, Dialog, DialogActions, DialogContent, OutlinedInput, DialogTitle, FormGroup, FormControlLabel, Checkbox, FormLabel, FormControl } from '@mui/material'
import { StyledButton } from 'ui-component/button/StyledButton'
import MetaContext from 'store/context/MetaContext'

const SaveChatflowDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')

    const [chatflowName, setChatflowName] = useState('')
    const [isReadyToSave, setIsReadyToSave] = useState(false)
    const [selected, setSelected] = useState([])
    const [metaData] = useContext(MetaContext)
    const [tags, setTags] = useState([])

    useEffect(() => {
        if (dialogProps.data) {
            let metatags = metaData.tags
            setChatflowName(dialogProps.data.name)
            if (dialogProps.data.tags) {
                let selectedTemp = dialogProps.data.tags.split(",")
                for (const tag of metatags) {
                    if (selectedTemp.indexOf(tag.label) > -1) {
                        tag.selected = true
                    } else {
                        tag.selected = false
                    }
                }
                setSelected(selectedTemp)
            } else {
                for (const tag of metatags) {
                    tag.selected = false
                }
                setSelected([])
            }
            setTags(metatags)
        }
    }, [dialogProps])

    useEffect(() => {
        if (chatflowName) setIsReadyToSave(true)
        else setIsReadyToSave(false)
    }, [chatflowName])

    const handleChange = (event, tag) => {
        tag.selected = !tag.selected
        if (tag.selected) {
            selected.push(tag.label)
        } else {
            let index = selected.indexOf(tag.label)
            selected.splice(index, 1);
        }
        setSelected(selected)
        let newObj = Object.assign([], tags);
        setTags(newObj)
        console.log(selected)
    }

    const component = show ? (
        <Dialog
            open={show}
            fullWidth
            maxWidth='xs'
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <OutlinedInput
                    sx={{ mt: 1 }}
                    id='chatflow-name'
                    type='text'
                    fullWidth
                    placeholder='My New Chatflow'
                    value={chatflowName}
                    onChange={(e) => setChatflowName(e.target.value)}
                />

                <FormControl
                    required
                    error={selected.length == 0}
                    component="fieldset"
                    sx={{ m: 1 }}
                    variant="standard"
                >
                    <FormLabel component="legend">标签</FormLabel>
                    <FormGroup sx={{ display: 'grid', 'grid-template-columns': '150px auto' }}>
                        {tags && tags.map((tag, index) => {
                            return (<FormControlLabel key={index} checked={tag.selected} onChange={(e) => handleChange(e, tag)} control={<Checkbox />} label={tag.label} />)
                        })}
                    </FormGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{dialogProps.cancelButtonName}</Button>
                <StyledButton disabled={!chatflowName || selected.length == 0} variant='contained' onClick={() => onConfirm(chatflowName, selected)}>
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

SaveChatflowDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default SaveChatflowDialog
