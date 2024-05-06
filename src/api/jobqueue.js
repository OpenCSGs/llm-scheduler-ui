import client from './client'

import { slurmContext, slurmDBContext } from 'store/constant'

const getMyQueue = () => client.get('/api/v1/jobs/queues')

const getAllQueue = () => client.get(slurmContext + '/partitions')

const getQosInfo = (name) => client.get(slurmDBContext + `/qos/${name}`)

const getSpecificQueue = (name) => client.get(`/api/v1/jobs/queue/${name}`)

export default {
    getAllQueue,
    getMyQueue,
    getQosInfo,
    getSpecificQueue
}
