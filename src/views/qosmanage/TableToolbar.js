import { alpha } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { Remove, Add } from '@mui/icons-material'

const TableToolbar = (props) => {
    const { title, operation } = props

    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    borderBottom: '1px solid #efefef'
                }}
            >
                <Typography sx={{ flex: '1 1 auto', fontWeight: 'bold', fontSize: '15px' }} variant='h6' id='tableTitle' component='div'>
                    {title}
                </Typography>

                <Button onClick={() => operation('add_qos')} startIcon={<Add />}>
                    添加QOS
                </Button>
            </Toolbar>
        </>
    )
}

TableToolbar.propTypes = {
    title: PropTypes.string
}

export default TableToolbar
