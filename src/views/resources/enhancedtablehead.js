import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
// import Checkbox from '@mui/material/Checkbox'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'

export const HeadCells = [
    {
        id: 'name',
        align: 'center',
        disablePadding: true,
        label: 'Host Name',
        sortable: true
    },
    {
        id: 'coreNum',
        align: 'left',
        disablePadding: false,
        label: 'Cores',
        sortable: true
    },
    {
        id: 'cpus',
        align: 'left',
        disablePadding: false,
        label: 'CPUs',
        sortable: false
    },
    {
        id: 'gpus',
        align: 'left',
        disablePadding: false,
        label: 'GPUs',
        sortable: false
    },
    {
        id: 'cpuload',
        align: 'right',
        disablePadding: false,
        label: 'cpu loads',
        sortable: false
    },
    {
        id: 'mem',
        align: 'right',
        disablePadding: false,
        label: 'Memory',
        sortable: true
    },
    {
        id: 'weight',
        align: 'right',
        disablePadding: false,
        label: 'Weight',
        sortable: true
    },
    {
        id: 'status',
        align: 'right',
        disablePadding: false,
        label: 'State',
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
                {/* <TableCell padding='checkbox'>
                    <Checkbox
                        color='primary'
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell> */}
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
