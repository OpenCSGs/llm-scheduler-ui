export const authConfig = {
    serverUrl: process.env.REACT_APP_ENDPOINT,
    clientId: process.env.REACT_APP_CLIENTID,
    organizationName: process.env.REACT_APP_ORGNAME,
    appName: process.env.REACT_APP_APPNAME,
    redirectPath: '/callback', // in accordance with casdoor configuration
    signinPath: '/api/v1/auth/signin'
}

export const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    basename: '',
    defaultPath: '/dashboard',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12,
    ON_PREMISE: JSON.parse(process.env.REACT_APP_ON_PREMISE | true),
    FEATURE_TOGGLE_K8S: JSON.parse(process.env.REACT_APP_FEATURE_TOGGLE_K8S | false)
}

export default config
