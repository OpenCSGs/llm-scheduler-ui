import { useState } from 'react'
import Cookies from 'js-cookie'

export default function useAuth() {
    let parentDomain = window.location.hostname.substring(window.location.hostname.indexOf('.'))

    const getUserInfo = () => {
        const userInfoString = localStorage.getItem('userinfos')
        if (userInfoString) {
            return JSON.parse(userInfoString)
        }

        return {}
    }

    const [userInfo, setUserInfo] = useState(getUserInfo())

    const saveUserInfo = (userInfo) => {
        delete userInfo['token']
        localStorage.setItem('userinfos', JSON.stringify(userInfo))
        setUserInfo(userInfo)
    }

    const getIDToken = () => {
        const idToken = localStorage.getItem('idToken')
        return idToken
    }

    const [IDToken, setIDToken] = useState(getIDToken())

    const saveIDToken = (idToken) => {
        localStorage.setItem('idToken', idToken)
        setIDToken(idToken)
    }

    const removeDToken = () => {
        localStorage.removeItem('idToken')
        setIDToken(null)
    }

    const saveAuthToken = (authToken) => {
        setIDToken(authToken)
    }

    return {
        setUserInfo: saveUserInfo,
        setIDToken: saveIDToken,
        removeDToken: removeDToken,
        setAuthToken: saveAuthToken,
        getIDToken: getIDToken,
        userInfo,
        IDToken
    }
}
