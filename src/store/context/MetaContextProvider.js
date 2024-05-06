import { useReducer } from 'react'
import PropTypes from 'prop-types'
import metaReducer, { initialState } from '../reducers/metaRedicer'
import MetaContext from './MetaContext'
import Cookies from 'js-cookie'
import axios from 'axios'
import { baseURL } from 'store/constant'
import { SET_TAGS } from 'store/actions'

const MetaContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(metaReducer, initialState)
    return <MetaContext.Provider value={[state]}>{children}</MetaContext.Provider>
}

MetaContextProvider.propTypes = {
    children: PropTypes.any
}

export default MetaContextProvider
