import { alpha } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputBase, Paper } from '@mui/material'

const TableToolbar = (props) => {
    const { title, setSearchKeyword } = props

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

                <Paper
                    component='form'
                    sx={{
                        p: '2px 4px',
                        marginTop: '5px',
                        border: '1px solid #efefef',
                        display: 'flex',
                        alignItems: 'center',
                        width: 400
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder='Search User'
                        inputProps={{ 'aria-label': 'search user' }}
                        onChange={(event) => {
                            setSearchKeyword(event.target.value)
                        }}
                    />
                    <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Toolbar>
        </>
    )
}

TableToolbar.propTypes = {
    title: PropTypes.string,
    setSearchKeyword: PropTypes.func
}

export default TableToolbar
