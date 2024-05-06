import PropTypes from 'prop-types'
import { DataGrid } from '@mui/x-data-grid'
import { IconPlus } from '@tabler/icons'
import { Button } from '@mui/material'

export const Grid = ({ columns, rows, style, onRowUpdate, addNewRow }) => {
    const handleProcessRowUpdate = (newRow) => {
        onRowUpdate(newRow)
        return newRow
    }

    return (
        <>
            <Button variant='outlined' onClick={addNewRow} startIcon={<IconPlus />}>
                增加
            </Button>
            {rows && columns && (
                <div style={{ marginTop: 10, height: 300, width: '100%', ...style }}>
                    <DataGrid
                        processRowUpdate={handleProcessRowUpdate}
                        onProcessRowUpdateError={(error) => console.error(error)}
                        rows={rows}
                        columns={columns}
                    />
                </div>
            )}
        </>
    )
}

Grid.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    style: PropTypes.any,
    addNewRow: PropTypes.func,
    onRowUpdate: PropTypes.func
}
