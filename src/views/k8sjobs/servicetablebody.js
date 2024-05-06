import React, { useState } from 'react'
// material-ui
import { TableBody, TableCell, TableRow, Checkbox } from '@mui/material'
import { ServiceHeadCells } from './enhancedservicetablehead'

const ServiceTableBody = (props) => {
    const { visibleRows, emptyRows } = props
    // console.log(visibleRows)
    const [selected, setSelected] = useState([])

    const isRowSelected = (name) => selected.findIndex((selData) => selData.name === name) !== -1

    const handlePodRowSelectClick = (event, name) => {
        // const selectedIndex = selected.indexOf(name)
        const selectedIndex = selected.findIndex((selData) => selData.name === name)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, { name: name })
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }
        setSelected(newSelected)
    }
    return (
        <TableBody>
            {visibleRows.map((row, index) => {
                const isItemSelected = isRowSelected(row.name)
                const labelId = `enhanced-table-checkbox-${index}`
                return (
                    <TableRow
                        hover
                        // onClick={(event) => handlePodRowSelectClick(event, row.id, row.name)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                    >
                        <TableCell padding='checkbox'>
                        </TableCell>
                        <TableCell component='th' id={labelId} scope='row' padding='none'>
                            {row.name}
                        </TableCell>
                        <TableCell align={ServiceHeadCells[1].align}>
                            {row.namespace ? (
                                <div style={{ whiteSpace: 'nowrap' }}>
                                    {row.namespace}
                                </div>
                            ) : (
                                '-'
                            )}
                        </TableCell>
                        <TableCell align={ServiceHeadCells[2].align}>{row.type ? row.type : '-'}</TableCell>
                        <TableCell align={ServiceHeadCells[3].align}>{row.cluster_ip ? row.cluster_ip : '-'}</TableCell>
                        <TableCell align={ServiceHeadCells[4].align}>{row.external_ip ? row.external_ip : '-'}</TableCell>
                        <TableCell align={ServiceHeadCells[5].align}>{row.labels ? Object.keys(row.labels).map(function (key) {
                            return "" + key + "=" + row.labels[key];
                        }).join(" ") : '-'}</TableCell>
                        <TableCell align={ServiceHeadCells[6].align}>{row.ports ? JSON.stringify(row.ports) : '-'}</TableCell>
                        <TableCell align={ServiceHeadCells[7].align}>{row.created_at ? row.created_at : '-'}</TableCell>
                    </TableRow>
                )
            })}
            {emptyRows > 0 ? (
                <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                </TableRow>
            ) : null}
        </TableBody>
    )
}

export default ServiceTableBody
