import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'

export const PodHeadCells = [
    {
        id: 'podname',
        align: 'left',
        disablePadding: true,
        label: '名称',
        sortable: true
    },
    {
        id: 'namespace',
        align: 'left',
        disablePadding: false,
        label: '命名空间',
        sortable: true
    },
    {
        id: 'state',
        align: 'center',
        disablePadding: false,
        label: '状态',
        sortable: false
    },
    {
        id: 'pod_ip',
        align: 'left',
        disablePadding: false,
        label: 'Pod IP',
        sortable: true
    },
    {
        id: 'lable',
        align: 'left',
        disablePadding: false,
        label: 'Lable',
        sortable: false
    },
    {
        id: 'node',
        align: 'left',
        disablePadding: false,
        label: 'Node',
        sortable: false
    },
    {
        id: 'node_ip',
        align: 'left',
        disablePadding: false,
        label: 'Node IP',
        sortable: false
    },
    {
        id: 'start_time',
        align: 'center',
        disablePadding: false,
        label: 'Creation Time',
        sortable: true
    }
]

const EnhancedPodTableHead = (props) => {
    const { order, orderBy, onRequestSort } = props
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                </TableCell>
                {PodHeadCells.map((headCell) => (
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

export default EnhancedPodTableHead
