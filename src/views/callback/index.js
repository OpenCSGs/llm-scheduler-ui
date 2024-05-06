import { AuthCallback } from 'casdoor-react-sdk'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authConfig, config } from '../../config'
import SDK from 'casdoor-js-sdk'
import { baseURL } from 'store/constant'

// Hooks
import useAuth from 'hooks/useAuth'

export default function Callback() {
    const navigate = useNavigate()
    const { userInfo, setUserInfo, setIDToken } = useAuth()

    return (
        <AuthCallback
            sdk={new SDK(authConfig)}
            serverUrl={baseURL}
            saveTokenFromResponse={(res) => {
                // @ts-ignore
                // save token
                setUserInfo(res.userinfos)
                setIDToken(res.token)
                navigate(config.defaultPath, { replace: true })
            }}
            isGetTokenSuccessful={(res) => {
                // @ts-ignore
                // according to the data returned by the server,
                // determine whether the `token` is successfully obtained through `code` and `state`.
                return res.success === true
            }}
        />
    )
}
