import Cookies from 'js-cookie'
// assets
import LineStyleOutlinedIcon from '@mui/icons-material/LineStyleOutlined'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import GroupsIcon from '@mui/icons-material/Groups'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import SocialDistanceIcon from '@mui/icons-material/SocialDistance'
import StorageIcon from '@mui/icons-material/Storage'
import FitbitIcon from '@mui/icons-material/Fitbit'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import {
    IconBabyCarriage,
    IconBuildingFactory2,
    IconBuildingStore,
    IconContainer,
    IconCpu,
    IconHierarchy,
    IconKey,
    IconTool,
    IconServer2,
    IconSettingsAutomation
} from '@tabler/icons'
// constant
const icons = {
    IconCpu,
    IconContainer,
    IconHierarchy,
    IconBuildingStore,
    IconKey,
    IconTool,
    IconBuildingFactory2,
    IconBabyCarriage,
    LineStyleOutlinedIcon,
    ManageAccountsIcon,
    GroupsIcon,
    AccountBoxIcon,
    SocialDistanceIcon,
    IconServer2,
    StorageIcon,
    FitbitIcon,
    IconSettingsAutomation,
    AccountCircleIcon
}
import config from 'config'

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = () => {
    let userInfo = JSON.parse(localStorage.getItem('userinfos'))
    let isAdmin = userInfo.isAdmin
    let db = {
        id: 'dashboard',
        title: '',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'item',
                url: '/dashboard',
                icon: icons.LineStyleOutlinedIcon,
                breadcrumbs: true
            },
            {
                id: 'resources',
                title: 'Resources',
                type: 'item',
                url: '/resources',
                icon: icons.StorageIcon,
                breadcrumbs: true
            },
            {
                id: 'workload',
                title: 'Tasks Management',
                type: 'collapse',
                url: '',
                icon: icons.FitbitIcon,
                breadcrumbs: true,
                children: [
                    {
                        id: 'hpcjobs',
                        title: 'Jobs',
                        type: 'item',
                        url: '/hpcjobs',
                        icon: icons.IconCpu,
                        breadcrumbs: true
                    },
                    {
                        id: 'k8sjobs',
                        title: 'Services',
                        type: 'item',
                        url: '/k8sjobs',
                        icon: icons.IconContainer,
                        breadcrumbs: true,
                        hide: !isAdmin || !config.FEATURE_TOGGLE_K8S
                    }
                ]
            },
            {
                id: 'tools',
                title: 'My Resources',
                type: 'item',
                url: '/jobqueue',
                icon: AccountCircleIcon,
                breadcrumbs: true
            },
            {
                id: 'users',
                title: 'Organization Management',
                type: 'collapse',
                icon: icons.ManageAccountsIcon,
                breadcrumbs: true,
                hide: !isAdmin,
                children: [
                    {
                        id: 'orgmanage',
                        title: 'Organization',
                        type: 'item',
                        url: '/orgmanage',
                        icon: icons.GroupsIcon,
                        breadcrumbs: true
                    },
                    {
                        id: 'usermanage',
                        title: 'Members',
                        type: 'item',
                        url: '/usermanage',
                        icon: icons.AccountBoxIcon,
                        breadcrumbs: true
                    },
                    {
                        id: 'qosmanage',
                        title: 'QOS',
                        type: 'item',
                        url: '/qosmanage',
                        icon: icons.IconSettingsAutomation,
                        breadcrumbs: true
                    }
                ]
            }
        ]
    }
    let res = {
        ...db
    }
    return res
}

export default dashboard
