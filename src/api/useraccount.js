import client from './client'
import { slurmDBContext, slurmContext } from 'store/constant'

const getAccounts = (params) => client.get(slurmDBContext + `/accounts?${params}`)
const addAccounts = (data) => client.post(slurmDBContext + '/accounts', data)
const deleteAccount = (account) => client.delete(slurmDBContext + `/account/${account}`)
const setAdmin = (data) => client.post('/api/v1/users/set_admins', data)
const getUsers = () => client.get(slurmDBContext + '/users')
const updateUsers = (data) => client.post(slurmDBContext + '/users', data)
const getQOS = () => client.get(slurmDBContext + '/qos')
const addQOS = (data) => client.post(slurmDBContext + '/qos', data)
const removeQOS = (name) => client.delete(slurmDBContext + `/qos/${name}`)
const getPartitions = () => client.get(slurmContext + '/partitions')
const getAssociation = (params) => client.get(slurmDBContext + '/associations?' + params)
const addAssociations = (data) => client.post(slurmDBContext + '/associations', data)
const removeAssociations = (params) => client.delete(slurmDBContext + '/associations?' + params)

export default {
    getAccounts,
    addAccounts,
    deleteAccount,
    setAdmin,
    getUsers,
    updateUsers,
    getQOS,
    addQOS,
    removeQOS,
    getPartitions,
    getAssociation,
    addAssociations,
    removeAssociations
}
