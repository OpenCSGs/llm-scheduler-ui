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
                title: '资源管理',
                type: 'item',
                url: '/resources',
                icon: icons.StorageIcon,
                breadcrumbs: true
            },
            {
                id: 'workload',
                title: '任务管理',
                type: 'collapse',
                url: '',
                icon: icons.FitbitIcon,
                breadcrumbs: true,
                children: [
                    {
                        id: 'hpcjobs',
                        title: '作业管理',
                        type: 'item',
                        url: '/hpcjobs',
                        icon: icons.IconCpu,
                        breadcrumbs: true
                    },
                    {
                        id: 'k8sjobs',
                        title: '服务管理',
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
                title: '我的资源',
                type: 'item',
                url: '/jobqueue',
                icon: AccountCircleIcon,
                breadcrumbs: true
            },
            {
                id: 'users',
                title: '组织管理',
                type: 'collapse',
                icon: icons.ManageAccountsIcon,
                breadcrumbs: true,
                hide: !isAdmin,
                children: [
                    {
                        id: 'orgmanage',
                        title: '组织机构',
                        type: 'item',
                        url: '/orgmanage',
                        icon: icons.GroupsIcon,
                        breadcrumbs: true
                    },
                    {
                        id: 'usermanage',
                        title: '全部成员',
                        type: 'item',
                        url: '/usermanage',
                        icon: icons.AccountBoxIcon,
                        breadcrumbs: true
                    },
                    {
                        id: 'qosmanage',
                        title: 'QOS配置',
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
