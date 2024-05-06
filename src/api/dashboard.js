import client from './client'

const getHPCDashboard = () => client.get('/api/v1/dashboard/hpc')
const getK8SDashboard = () => client.get('/api/v1/dashboard/k8s')

export default {
    getHPCDashboard,
    getK8SDashboard
}