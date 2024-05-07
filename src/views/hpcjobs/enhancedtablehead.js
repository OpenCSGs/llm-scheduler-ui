import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'

export const HeadCells = [
    {
        id: 'jobid',
        align: 'left',
        disablePadding: true,
        label: 'Job ID',
        sortable: true
    },
    {
        id: 'partition',
        align: 'left',
        disablePadding: false,
        label: 'Queues',
        sortable: true
    },
    {
        id: 'jobname',
        align: 'left',
        disablePadding: false,
        label: 'Job Name',
        sortable: true
    },
    {
        id: 'status',
        align: 'left',
        disablePadding: false,
        label: 'Job Status',
        sortable: false
    },
    {
        id: 'reason',
        align: 'left',
        disablePadding: false,
        label: 'State Reason',
        sortable: false
    },
    {
        id: 'hostNum',
        align: 'center',
        disablePadding: false,
        label: 'Resource',
        sortable: false
    },
    {
        id: 'submitted',
        align: 'center',
        disablePadding: false,
        label: 'Submission Time',
        sortable: true
    },
    {
        id: 'started',
        align: 'center',
        disablePadding: false,
        label: 'Start Time',
        sortable: true
    },
    {
        id: 'usergroup',
        align: 'center',
        disablePadding: false,
        label: 'Account',
        sortable: true
    },
    {
        id: 'user',
        align: 'center',
        disablePadding: false,
        label: 'Submission User',
        sortable: true
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
                        checked={rowCount > 0 && numSelected === rowCount}
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
