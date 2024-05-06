import { lazy } from 'react'

// project imports
import Loadable from 'ui-component/loading/Loadable'
import MinimalLayout from 'layout/MinimalLayout'

// canvas routing
const Login = Loadable(lazy(() => import('views/login')))
const Callback = Loadable(lazy(() => import('views/callback')))

// ==============================|| CANVAS ROUTING ||============================== //

const AuthRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/callback',
            element: <Callback />
        }
    ]
}

export default AuthRoutes