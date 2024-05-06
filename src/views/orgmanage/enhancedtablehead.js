import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'
import { useEffect, useState, useMemo } from 'react'

export const HeadCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: '用户名',
        sortable: true
    },

    {
        id: 'accounts',
        align: 'left',
        disablePadding: false,
        label: '用户组',
        sortable: true
    },
    {
        id: 'partitions',
        align: 'left',
        disablePadding: false,
        label: '可用队列',
        sortable: false
    },
    {
        id: 'cluster',
        align: 'left',
        disablePadding: false,
        label: '集群',
        sortable: true
    },
    {
        id: 'operation',
        align: 'right',
        disablePadding: false,
        label: '操作',
        sortable: false
    }
]

const EnhancedTableHead = (props) => {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding='checkbox'>
                    <Checkbox
                        color='primary'
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {HeadCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sortable ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{headCell.label}</span>
                                {orderBy === headCell.id ? (
                                    <Box component='span' sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{headCell.label}</span>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

export default EnhancedTableHead
