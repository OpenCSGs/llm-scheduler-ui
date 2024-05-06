import client from './client'
import { slurmContext, slurmDBContext } from 'store/constant'

const getHPCJobs = (params) => client.get(`/api/v1/jobs/list?${params}`)

const getSpecificJob = (jobid) => client.get(slurmContext + `/job/${jobid}`)

const getHPCUser = (username) => client.get(slurmDBContext + `/user/${username}?with_assocs`)

const submitJob = (dataBody) => client.post(slurmContext + `/job/submit`, dataBody)

const stopJob = (jobid) => client.delete(slurmContext + `/job/${jobid}`)

const getJobOutput = (jobid, filepath) => client.get(`/api/v1/hpc/job_output/${jobid}?filepath=${filepath}`)

const getHPCJobFileList = (outputDIR) => client.get(`/api/v1/hpc/filelist?output_dir=${outputDIR}`)

const getK8SPods = (namespace) => client.get(`/api/v1/k8s/workload/pods/?namespace=${namespace}`)

const getK8SDeploy = (namespace) => client.get(`/api/v1/k8s/workload/deployments/?namespace=${namespace}`)

const getK8SSvs = (namespace) => client.get(`/api/v1/k8s/workload/services/?namespace=${namespace}`)

const getK8SNs = () => client.get(`/api/v1/k8s/workload/namespaces`)

export default {
    getHPCJobs,
    getK8SPods,
    getK8SDeploy,
    getK8SSvs,
    getK8SNs,
    getSpecificJob,
    submitJob,
    stopJob,
    getJobOutput,
    getHPCUser,
    getHPCJobFileList
}
