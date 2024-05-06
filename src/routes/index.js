import { useRoutes } from 'react-router-dom'

// routes
import MainRoutes from './MainRoutes'
import AuthRoutes from './AuthRoutes'
import config from 'config'

// Hooks
import useAuth from 'hooks/useAuth'

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { getIDToken } = useAuth()
    const idToken = getIDToken()
    const isLoggedIn = idToken ? true : false
    return useRoutes([MainRoutes(isLoggedIn), AuthRoutes], config.basename)
}
