import client from './client'

const signIn = (user) => client.post('/api/v1/auth/signin', user)

export default {
    signIn
}
