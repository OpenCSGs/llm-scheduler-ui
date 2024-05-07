import { alpha } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { Remove, Add } from '@mui/icons-material'

const EnhancedTableToolbar = (props) => {
    const { numSelected, rowsNumber, currentLimit, operation, title, isOrgFocused } = props

    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    borderBottom: '1px solid #efefef',
                    ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) })
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }} variant='h6' id='tableTitle' component='div'>
                    {title}
                </Typography>

                {!isOrgFocused && (
                    <>
                        <Button disabled={rowsNumber == 0} sx={{ flex: '1 1 auto' }} onClick={() => operation('modify_limits')}>
                            {currentLimit
                                ? 'Partition: ' + (currentLimit['partition'] || '--') + ' QOS:' + (currentLimit['qos'] || '--')
                                : 'QOS'}
                        </Button>
                        <Button disabled={numSelected == 0} onClick={() => operation('remove_memeber')} startIcon={<Remove />}>
                            Remove Member
                        </Button>
                        <Button onClick={() => operation('add_memeber')} startIcon={<Add />}>
                            Add Member
                        </Button>
                    </>
                )}
            </Toolbar>
        </>
    )
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number,
    rowsNumber: PropTypes.number,
    rows_operation: PropTypes.func,
    title: PropTypes.string,
    isOrgFocused: PropTypes.bool
}

export default EnhancedTableToolbar
