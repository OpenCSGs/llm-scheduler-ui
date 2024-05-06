import PropTypes from 'prop-types'

// material-ui
import { styled } from '@mui/material/styles'
import { Box, IconButton, Grid, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import SkeletonChatflowCard from 'ui-component/cards/Skeleton/ChatflowCard'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
    cursor: 'pointer',
    '&:hover': {
        background: theme.palette.card.hover,
        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 20%)'
    },
    maxHeight: '300px',
    maxWidth: '300px',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-line'
}))

// ===========================|| CONTRACT CARD ||=========================== //

const ItemCard = ({ isLoading, data, images, color, onClick, user, onDelete }) => {
    return (
        <>
            {isLoading ? (
                <SkeletonChatflowCard />
            ) : (
                <CardWrapper border={false} content={false} onClick={onClick}>
                    {
                        user && data.owner == user.id
                        &&
                        <div style={{ "float": 'right' }}>
                            <IconButton aria-label="delete" color='error' onClick={onDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    }
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction='column'>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                {color && (
                                    <div
                                        style={{
                                            width: 35,
                                            height: 35,
                                            marginRight: 10,
                                            borderRadius: '50%',
                                            background: color
                                        }}
                                    ></div>
                                )}
                                <Typography
                                    sx={{ fontSize: '1.5rem', fontWeight: 500, overflowWrap: 'break-word', whiteSpace: 'pre-line' }}
                                >
                                    {data.name}
                                </Typography>
                            </div>
                            {user && (
                                <span style={{ fontWeight: 'bold' }}>
                                    Author: {data.author ? data.author : "System"}
                                </span>)
                            }
                            {data.description && (
                                <span style={{ marginTop: 10, overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>
                                    {data.description}
                                </span>
                            )}
                            {images && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        marginTop: 5
                                    }}
                                >
                                    {images.map((img) => (
                                        <div
                                            key={img}
                                            style={{
                                                width: 35,
                                                height: 35,
                                                marginRight: 5,
                                                borderRadius: '50%',
                                                backgroundColor: 'white',
                                                marginTop: 5
                                            }}
                                        >
                                            <img
                                                style={{ width: '100%', height: '100%', padding: 5, objectFit: 'contain' }}
                                                alt=''
                                                src={img}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    )
}

ItemCard.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.object,
    images: PropTypes.array,
    color: PropTypes.string,
    onClick: PropTypes.func,
    user: PropTypes.object,
    onDelete: PropTypes.func
}

export default ItemCard
