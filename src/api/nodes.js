import client from './client'
import { slurmContext } from 'store/constant'

const getHPCNodes = () => client.get(slurmContext + '/nodes')

const getK8sNodes = () => client.get('/api/v1/k8s/nodes')

const getSpecificNode = (name) => client.get(slurmContext + `/nodes/${name}`)

const updateNode = (name, body) => client.post(slurmContext + `/nodes/${name}`, body)

export default {
    getHPCNodes,
    getK8sNodes,
    getSpecificNode,
    updateNode
}
