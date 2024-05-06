const JobTab = (props) => {
    const { jobData } = props
    return (
        <table className='table table-hover'>
            <tbody>
                <tr>
                    <td align='right' style={{ width: 140, paddingRight: 10 }}>
                        Cluster:
                    </td>
                    <td> {jobData.cluster}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Job ID:
                    </td>
                    <td>{jobData.job_id}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Job Name:
                    </td>
                    <td>{jobData.name}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Account:
                    </td>
                    <td>{jobData.account}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Partition:
                    </td>
                    <td>{jobData.partition}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        QoS:
                    </td>
                    <td>{jobData.qos}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Allocating Node:
                    </td>
                    <td>{jobData.allocating_node}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Execution Node:
                    </td>
                    <td>{jobData.nodes}</td>
                </tr>
                {jobData.command ? (
                    <tr>
                        <td align='right' style={{ paddingRight: 10 }}>
                            Command:
                        </td>
                        <td>{jobData.command}</td>
                    </tr>
                ) : null}
                <tr>
                    <td align='right'>Job State:</td>
                    <td>{jobData.job_state}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        CPUs:
                    </td>
                    <td>{jobData.cpus ? jobData.cpus.number : null}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Node Count:
                    </td>
                    <td>{jobData.node_count ? jobData.node_count.number : null}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Tasks:
                    </td>
                    <td>{jobData.tasks ? jobData.tasks.number : null}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Memory Per CPU:
                    </td>
                    <td>{jobData.memory_per_cpu ? jobData.memory_per_cpu.number : null}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Tres Req Str:
                    </td>
                    <td>{jobData.tres_req_str}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        tres_per_task:
                    </td>
                    <td>{jobData.tres_per_task}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Current Working Directory:
                    </td>
                    <td>{jobData.current_working_directory}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Flags:
                    </td>
                    <td>
                        {jobData.flags
                            ? jobData.flags.map((flag) => {
                                  return flag + '\n'
                              })
                            : null}
                    </td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Group Name:
                    </td>
                    <td>{jobData.group_name}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Standard Error:
                    </td>
                    <td>{jobData.standard_error}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Standard Input:
                    </td>
                    <td>{jobData.standard_input}</td>
                </tr>
                <tr>
                    <td align='right' style={{ paddingRight: 10 }}>
                        Standard Output:
                    </td>
                    <td>{jobData.standard_output}</td>
                </tr>
                {jobData.submit_time ? (
                    jobData.submit_time.number ? (
                        <tr>
                            <td align='right' style={{ paddingRight: 10 }}>
                                Submit Time:
                            </td>
                            <td>{new Date(jobData.submit_time.number * 1000).toLocaleString()}</td>
                        </tr>
                    ) : null
                ) : null}
                {jobData.start_time ? (
                    jobData.start_time.number != 0 ? (
                        <tr>
                            <td align='right' style={{ paddingRight: 10 }}>
                                Start Time:
                            </td>
                            <td>{new Date(jobData.start_time.number * 1000).toLocaleString()}</td>
                        </tr>
                    ) : null
                ) : null}
                {jobData.end_time ? (
                    jobData.end_time.number != 0 ? (
                        <tr>
                            <td align='right' style={{ paddingRight: 10 }}>
                                End Time:
                            </td>
                            <td>{new Date(jobData.end_time.number * 1000).toLocaleString()}</td>
                        </tr>
                    ) : null
                ) : null}
                {jobData.suspend_time ? (
                    jobData.suspend_time.number != 0 ? (
                        <tr>
                            <td align='right' style={{ paddingRight: 10 }}>
                                Suspend Time:
                            </td>
                            <td>{new Date(jobData.suspend_time.number * 1000).toLocaleString()}</td>
                        </tr>
                    ) : null
                ) : null}
            </tbody>
        </table>
    )
}

export default JobTab
