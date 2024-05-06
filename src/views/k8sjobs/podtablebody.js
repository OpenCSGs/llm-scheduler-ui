import React, { useState } from 'react'
// material-ui
import { TableBody, TableCell, TableRow, Checkbox } from '@mui/material'
import { PodHeadCells } from './enhancedpodtablehead'

const PodTableBody = (props) => {
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
                        <TableCell align={PodHeadCells[1].align}>
                            {row.namespace ? (
                                <div style={{ whiteSpace: 'nowrap' }}>
                                    {row.namespace}
                                </div>
                            ) : (
                                '-'
                            )}
                        </TableCell>
                        <TableCell align={PodHeadCells[2].align}>{row.status ? row.status : '-'}</TableCell>
                        <TableCell align={PodHeadCells[3].align}>{row.pod_ip ? row.pod_ip : '-'}</TableCell>
                        <TableCell align={PodHeadCells[4].align}>{row.labels ? Object.keys(row.labels).map(function (key) {
                            return "" + key + "=" + row.labels[key];
                        }).join(" ") : '-'}</TableCell>
                        <TableCell align={PodHeadCells[5].align}>{row.node_name ? row.node_name : '-'}</TableCell>
                        <TableCell align={PodHeadCells[6].align}>{row.node_ip ? row.node_ip : '-'}</TableCell>
                        <TableCell align={PodHeadCells[7].align}>{row.start_time ? row.start_time : '-'}</TableCell>
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

export default PodTableBody
