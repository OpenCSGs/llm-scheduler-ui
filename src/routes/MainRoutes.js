import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// project imports
import Loadable from 'ui-component/loading/Loadable'

const MainLayout = Loadable(lazy(() => import('layout/MainLayout')))
const Dashboard = Loadable(lazy(() => import('views/dashboard')))
const Resources = Loadable(lazy(() => import('views/resources')))

const HPCjobs = Loadable(lazy(() => import('views/hpcjobs')))

const K8sjobs = Loadable(lazy(() => import('views/k8sjobs')))

// apikey routing
const JobQueue = Loadable(lazy(() => import('views/jobqueue')))

const OrgManage = Loadable(lazy(() => import('views/orgmanage')))

const UserManage = Loadable(lazy(() => import('views/usermanage')))

const QOSManage = Loadable(lazy(() => import('views/qosmanage')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = (isLoggedIn) => {
    return {
        path: '/',
        element: isLoggedIn ? <MainLayout /> : <Navigate to='/login' />,
        children: [
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/resources',
                element: <Resources />
            },
            {
                path: '/hpcjobs',
                element: <HPCjobs />
            },
            {
                path: '/k8sjobs',
                element: <K8sjobs />
            },
            {
                path: '/jobqueue',
                element: <JobQueue />
            },
            {
                path: '/orgmanage',
                element: <OrgManage />
            },
            {
                path: '/usermanage',
                element: <UserManage />
            },
            {
                path: '/qosmanage',
                element: <QOSManage />
            }
        ]
    }
}

export default MainRoutes
