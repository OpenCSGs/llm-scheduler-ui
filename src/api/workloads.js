import client from './client'

const applyWorkloads = (data) => client.post('/api/v1/k8s/workload/workloads/', data)

export default {
    applyWorkloads,
}