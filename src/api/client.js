import axios from 'axios'
import Cookies from 'js-cookie'
import { baseURL } from 'store/constant'

const apiClient = axios.create({
    baseURL: `${baseURL}`,
    headers: {
        'Content-type': 'application/json'
        // 'Connection': 'keep-alive'
    }
})

const logout = () => {
    localStorage.removeItem('idToken')
    window.location.reload()
}

apiClient.interceptors.request.use(function (config) {
    const IDToken = localStorage.getItem('idToken')
    if (IDToken) {
        const userInfo = JSON.parse(localStorage.getItem('userinfos'))
        config.headers['X-SLURM-USER-NAME'] = userInfo.name
        config.headers['X-SLURM-USER-TOKEN'] = IDToken
        config.headers['isAdmin'] = userInfo.isAdmin
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response.status === 401) {
            logout()
        }
        return error
    }
)

export default apiClient
