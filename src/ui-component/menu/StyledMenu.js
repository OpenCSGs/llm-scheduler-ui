import { useState } from 'react'
import * as React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export const StyledMenu = ({ operation, menuAction, row }) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (event, actionId) => {
        event.stopPropagation()
        setAnchorEl(null)
        operation(actionId, row)
    }

    return (
        <>
            <IconButton
                aria-label='more'
                id='long-button'
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleClick}
            >
                <MoreVertIcon fontSize='small' />
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
                {menuAction.map((row) => {
                    return (
                        <MenuItem key={row.key} onClick={(event) => handleClose(event, row.key)}>
                            {row.label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}

StyledMenu.propTypes = {
    operation: PropTypes.func,
    menuAction: PropTypes.array
}
