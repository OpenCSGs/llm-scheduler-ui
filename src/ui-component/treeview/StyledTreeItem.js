import * as React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)'
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit'
        }
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2)
        }
    }
}))

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
    const theme = useTheme()
    const { bgColor, color, operation, menuAction, labelText, colorForDarkMode, bgColorForDarkMode, ...other } = props
    const styleProps = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
        '--tree-view-bg-color': theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode
    }
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (event, actionId) => {
        event.stopPropagation()
        setAnchorEl(null)
        operation(actionId, labelText)
    }

    return (
        <StyledTreeItemRoot
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0
                    }}
                >
                    <Typography variant='body2' sx={{ fontWeight: 'inherit', flexGrow: 1, userSelect: 'none' }}>
                        {labelText}
                    </Typography>
                    <Typography variant='caption' color='inherit'>
                        <div>
                            <IconButton
                                aria-label='more'
                                id='long-button'
                                aria-controls={open ? 'long-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup='true'
                                onClick={handleClick}
                            >
                                <MoreHorizIcon fontSize='small' />
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
                                {menuAction.map((row, index) => {
                                    if (row.key == 'delete_org') {
                                        return (
                                            <Tooltip disableInteractive key={row.key + row.type} title='先删除所有分组才能删除组织'>
                                                <span>
                                                    <MenuItem
                                                        key={row.key + row.type}
                                                        disabled={true}
                                                        onClick={(event) => handleClose(event, row.key)}
                                                    >
                                                        {row.label}
                                                    </MenuItem>
                                                </span>
                                            </Tooltip>
                                        )
                                    } else {
                                        return (
                                            <MenuItem key={row.key + row.type + index} onClick={(event) => handleClose(event, row.key)}>
                                                {row.label}
                                            </MenuItem>
                                        )
                                    }
                                })}
                            </Menu>
                        </div>
                    </Typography>
                </Box>
            }
            style={styleProps}
            {...other}
            ref={ref}
        />
    )
})

export default StyledTreeItem
