function createData(id, name, url, description, deployed, deployDate) {
    return { id, name, url, description, deployed, deployDate }
}

const nodeAPIMockData = {
    "nodes": [{
        "reason": "reason",
        "slurmd_start_time": 6,
        "features": ["features", "features"],
        "hostname": "hostname",
        "cores": 1,
        "reason_changed_at": 3,
        "reservation": "reservation",
        "tres": "tres",
        "cpu_binding": 5,
        "state": ["INVALID", "INVALID"],
        "sockets": 5,
        "energy": {
            "current_watts": {
                "number": 9,
                "set": false,
                "infinite": true
            },
            "base_consumed_energy": 3,
            "last_collected": 7,
            "consumed_energy": 2,
            "previous_consumed_energy": 4,
            "average_watts": 9
        },
        "partitions": ["partitions", "partitions"],
        "gres_drained": "gres_drained",
        "weight": 3,
        "version": "version",
        "gres_used": "gres_used",
        "mcs_label": "mcs_label",
        "real_memory": 6,
        "burstbuffer_network_address": "burstbuffer_network_address",
        "port": 9,
        "name": "name",
        "resume_after": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "temporary_disk": 3,
        "tres_used": "tres_used",
        "effective_cpus": 7,
        "external_sensors": {
            "current_watts": 1,
            "temperature": {
                "number": 9,
                "set": false,
                "infinite": true
            },
            "energy_update_time": 1,
            "consumed_energy": {
                "number": 9,
                "set": false,
                "infinite": true
            }
        },
        "boards": 0,
        "alloc_cpus": 1,
        "active_features": ["active_features", "active_features"],
        "reason_set_by_user": "reason_set_by_user",
        "free_mem": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "alloc_idle_cpus": 2,
        "extra": "extra",
        "operating_system": "operating_system",
        "power": {
            "current_watts": 1,
            "total_energy": 6,
            "lowest_watts": 4,
            "new_maximum_watts": 7,
            "new_job_time": 5,
            "state": 9,
            "time_start_day": 9,
            "peak_watts": 1,
            "maximum_watts": {
                "number": 9,
                "set": false,
                "infinite": true
            }
        },
        "architecture": "architecture",
        "owner": "owner",
        "cluster_name": "cluster_name",
        "address": "address",
        "cpus": 2,
        "tres_weighted": 6.778324963048013,
        "gres": "gres",
        "threads": 6,
        "boot_time": 6,
        "alloc_memory": 6,
        "specialized_memory": 8,
        "specialized_cpus": "specialized_cpus",
        "specialized_cores": 5,
        "last_busy": 6,
        "comment": "comment",
        "next_state_after_reboot": ["INVALID", "INVALID"],
        "cpu_load": {
            "number": 9,
            "set": false,
            "infinite": true
        }
    }, {
        "reason": "reason",
        "slurmd_start_time": 6,
        "features": ["features", "features"],
        "hostname": "hostname",
        "cores": 1,
        "reason_changed_at": 3,
        "reservation": "reservation",
        "tres": "tres",
        "cpu_binding": 5,
        "state": ["INVALID", "INVALID"],
        "sockets": 5,
        "energy": {
            "current_watts": {
                "number": 9,
                "set": false,
                "infinite": true
            },
            "base_consumed_energy": 3,
            "last_collected": 7,
            "consumed_energy": 2,
            "previous_consumed_energy": 4,
            "average_watts": 9
        },
        "partitions": ["partitions", "partitions"],
        "gres_drained": "gres_drained",
        "weight": 3,
        "version": "version",
        "gres_used": "gres_used",
        "mcs_label": "mcs_label",
        "real_memory": 6,
        "burstbuffer_network_address": "burstbuffer_network_address",
        "port": 9,
        "name": "name",
        "resume_after": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "temporary_disk": 3,
        "tres_used": "tres_used",
        "effective_cpus": 7,
        "external_sensors": {
            "current_watts": 1,
            "temperature": {
                "number": 9,
                "set": false,
                "infinite": true
            },
            "energy_update_time": 1,
            "consumed_energy": {
                "number": 9,
                "set": false,
                "infinite": true
            }
        },
        "boards": 0,
        "alloc_cpus": 1,
        "active_features": ["active_features", "active_features"],
        "reason_set_by_user": "reason_set_by_user",
        "free_mem": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "alloc_idle_cpus": 2,
        "extra": "extra",
        "operating_system": "operating_system",
        "power": {
            "current_watts": 1,
            "total_energy": 6,
            "lowest_watts": 4,
            "new_maximum_watts": 7,
            "new_job_time": 5,
            "state": 9,
            "time_start_day": 9,
            "peak_watts": 1,
            "maximum_watts": {
                "number": 9,
                "set": false,
                "infinite": true
            }
        },
        "architecture": "architecture",
        "owner": "owner",
        "cluster_name": "cluster_name",
        "address": "address",
        "cpus": 2,
        "tres_weighted": 6.778324963048013,
        "gres": "gres",
        "threads": 6,
        "boot_time": 6,
        "alloc_memory": 6,
        "specialized_memory": 8,
        "specialized_cpus": "specialized_cpus",
        "specialized_cores": 5,
        "last_busy": 6,
        "comment": "comment",
        "next_state_after_reboot": ["INVALID", "INVALID"],
        "cpu_load": {
            "number": 9,
            "set": false,
            "infinite": true
        }
    }],
    "meta": {
        "Slurm": {
            "release": "release",
            "version": {
                "major": 0,
                "minor": 1,
                "micro": 6
            }
        },
        "plugin": {
            "name": "name",
            "type": "type"
        }
    },
    "warnings": [{
        "warning": "warning",
        "description": "description",
        "source": "source"
    }, {
        "warning": "warning",
        "description": "description",
        "source": "source"
    }],
    "errors": [{
        "description": "description",
        "source": "source",
        "error": "error",
        "error_number": 0
    }, {
        "description": "description",
        "source": "source",
        "error": "error",
        "error_number": 0
    }]
}

const jobAPIMockDatas = {
    "meta": {
        "Slurm": {
            "release": "release",
            "version": {
                "major": 0,
                "minor": 1,
                "micro": 6
            }
        },
        "plugin": {
            "name": "name",
            "type": "type"
        }
    },
    "warnings": [{
        "warning": "warning",
        "description": "description",
        "source": "source"
    }, {
        "warning": "warning",
        "description": "description",
        "source": "source"
    }],
    "jobs": [{
        "container": "container",
        "cluster": "cluster",
        "time_minimum": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "memory_per_tres": "memory_per_tres",
        "scheduled_nodes": "scheduled_nodes",
        "minimum_switches": 4,
        "qos": "qos",
        "resize_time": 5,
        "eligible_time": 7,
        "exclusive": ["true", "true"],
        "cpus_per_tres": "cpus_per_tres",
        "preemptable_time": 7,
        "tasks": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "system_comment": "system_comment",
        "federation_siblings_active": "federation_siblings_active",
        "tasks_per_tres": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "tasks_per_core": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "accrue_time": 0,
        "dependency": "dependency",
        "group_name": "group_name",
        "profile": ["NOT_SET", "NOT_SET"],
        "priority": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "tres_per_job": "tres_per_job",
        "failed_node": "failed_node",
        "derived_exit_code": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "maximum_switch_wait_time": 3,
        "core_spec": 1,
        "mcs_label": "mcs_label",
        "required_nodes": "required_nodes",
        "tres_bind": "tres_bind",
        "user_id": 6,
        "selinux_context": "selinux_context",
        "exit_code": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "federation_origin": "federation_origin",
        "container_id": "container_id",
        "shared": ["none", "none"],
        "tasks_per_board": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "user_name": "user1",
        "flags": ["KILL_INVALID_DEPENDENCY", "KILL_INVALID_DEPENDENCY"],
        "standard_input": "standard_input",
        "admin_comment": "admin_comment",
        "cores_per_socket": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "job_state": "SUSPEND",
        "tasks_per_node": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "current_working_directory": "current_working_directory",
        "standard_error": "standard_error",
        "array_job_id": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "cluster_features": "cluster_features",
        "partition": "job_group1",
        "threads_per_core": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "tres_alloc_str": "tres_alloc_str",
        "memory_per_cpu": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "cpu_frequency_minimum": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "node_count": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "power": {
            "flags": ["EQUAL_POWER", "EQUAL_POWER"]
        },
        "deadline": 2,
        "mail_type": ["BEGIN", "BEGIN"],
        "memory_per_node": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "state_reason": "state_reason",
        "het_job_offset": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "end_time": "",
        "sockets_per_board": 9,
        "nice": 1,
        "last_sched_evaluation": 1,
        "tres_per_node": "tres_per_node",
        "burst_buffer": "burst_buffer",
        "licenses": "licenses",
        "excluded_nodes": "excluded_nodes",
        "array_max_tasks": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "het_job_id": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "sockets_per_node": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "prefer": "prefer",
        "time_limit": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "minimum_cpus_per_node": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "tasks_per_socket": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "batch_host": "batch_host",
        "max_cpus": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "job_size_str": ["job_size_str", "job_size_str"],
        "hold": true,
        "cpu_frequency_maximum": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "features": "features",
        "het_job_id_set": "het_job_id_set",
        "state_description": "state_description",
        "show_flags": ["ALL", "ALL"],
        "array_task_id": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "minimum_tmp_disk_per_node": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "tres_req_str": "tres_req_str",
        "burst_buffer_state": "burst_buffer_state",
        "cron": "cron",
        "allocating_node": "allocating_node",
        "tres_per_socket": "tres_per_socket",
        "array_task_string": "array_task_string",
        "submit_time": "2023-08-05 8:16:06",
        "oversubscribe": true,
        "wckey": "wckey",
        "max_nodes": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "batch_flag": true,
        "start_time": "2023-08-05 8:17:06",
        "name": "LLM Training",
        "preempt_time": 6,
        "contiguous": true,
        "job_resources": {
            "nodes": "nodes",
            "allocated_nodes": ["", ""],
            "allocated_cpus": 7,
            "allocated_hosts": 1,
            "allocated_cores": 4
        },
        "billable_tres": {
            "number": 5.025004791520295,
            "set": false,
            "infinite": true
        },
        "federation_siblings_viable": "federation_siblings_viable",
        "cpus_per_task": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "batch_features": "batch_features",
        "thread_spec": 5,
        "cpu_frequency_governor": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "gres_detail": ["gres_detail", "gres_detail"],
        "network": "network",
        "restart_cnt": 9,
        "resv_name": "resv_name",
        "extra": "extra",
        "delay_boot": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "reboot": true,
        "cpus": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "standard_output": "standard_output",
        "pre_sus_time": 1,
        "suspend_time": 9,
        "association_id": 6,
        "command": "command",
        "tres_freq": "tres_freq",
        "requeue": true,
        "tres_per_task": "tres_per_task",
        "mail_user": "mail_user",
        "nodes": "nodes",
        "group_id": 3,
        "job_id": 1,
        "comment": "comment",
        "account": "account"
    }, {
        "container": "container",
        "cluster": "cluster",
        "time_minimum": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "memory_per_tres": "memory_per_tres",
        "scheduled_nodes": "scheduled_nodes",
        "minimum_switches": 4,
        "qos": "qos",
        "resize_time": 5,
        "eligible_time": 7,
        "exclusive": ["true", "true"],
        "cpus_per_tres": "cpus_per_tres",
        "preemptable_time": 7,
        "tasks": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "system_comment": "system_comment",
        "federation_siblings_active": "federation_siblings_active",
        "tasks_per_tres": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "tasks_per_core": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "accrue_time": 0,
        "dependency": "dependency",
        "group_name": "group_name",
        "profile": ["NOT_SET", "NOT_SET"],
        "priority": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "tres_per_job": "tres_per_job",
        "failed_node": "failed_node",
        "derived_exit_code": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "maximum_switch_wait_time": 3,
        "core_spec": 1,
        "mcs_label": "mcs_label",
        "required_nodes": "required_nodes",
        "tres_bind": "tres_bind",
        "user_id": 6,
        "selinux_context": "selinux_context",
        "exit_code": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "federation_origin": "federation_origin",
        "container_id": "container_id",
        "shared": ["none", "none"],
        "tasks_per_board": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "user_name": "user2",
        "flags": ["KILL_INVALID_DEPENDENCY", "KILL_INVALID_DEPENDENCY"],
        "standard_input": "standard_input",
        "admin_comment": "admin_comment",
        "cores_per_socket": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "job_state": "RUNNING",
        "tasks_per_node": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "current_working_directory": "current_working_directory",
        "standard_error": "standard_error",
        "array_job_id": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "cluster_features": "cluster_features",
        "partition": "job_group2",
        "threads_per_core": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "tres_alloc_str": "tres_alloc_str",
        "memory_per_cpu": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "cpu_frequency_minimum": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "node_count": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "power": {
            "flags": ["EQUAL_POWER", "EQUAL_POWER"]
        },
        "deadline": 2,
        "mail_type": ["BEGIN", "BEGIN"],
        "memory_per_node": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "state_reason": "state_reason",
        "het_job_offset": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "end_time": "",
        "sockets_per_board": 9,
        "nice": 1,
        "last_sched_evaluation": 1,
        "tres_per_node": "tres_per_node",
        "burst_buffer": "burst_buffer",
        "licenses": "licenses",
        "excluded_nodes": "excluded_nodes",
        "array_max_tasks": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "het_job_id": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "sockets_per_node": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "prefer": "prefer",
        "time_limit": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "minimum_cpus_per_node": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "tasks_per_socket": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "batch_host": "batch_host",
        "max_cpus": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "job_size_str": ["job_size_str", "job_size_str"],
        "hold": true,
        "cpu_frequency_maximum": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "features": "features",
        "het_job_id_set": "het_job_id_set",
        "state_description": "state_description",
        "show_flags": ["ALL", "ALL"],
        "array_task_id": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "minimum_tmp_disk_per_node": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "tres_req_str": "tres_req_str",
        "burst_buffer_state": "burst_buffer_state",
        "cron": "cron",
        "allocating_node": "allocating_node",
        "tres_per_socket": "tres_per_socket",
        "array_task_string": "array_task_string",
        "submit_time": "2023-08-05 18:16:06",
        "oversubscribe": true,
        "wckey": "wckey",
        "max_nodes": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "batch_flag": true,
        "start_time": "2023-08-05 18:17:06",
        "name": "LLM Inference",
        "preempt_time": 6,
        "contiguous": true,
        "job_resources": {
            "nodes": "nodes",
            "allocated_nodes": ["", ""],
            "allocated_cpus": 7,
            "allocated_hosts": 1,
            "allocated_cores": 4
        },
        "billable_tres": {
            "number": 5.025004791520295,
            "set": false,
            "infinite": true
        },
        "federation_siblings_viable": "federation_siblings_viable",
        "cpus_per_task": {
            "number": 5,
            "set": false,
            "infinite": true
        },
        "batch_features": "batch_features",
        "thread_spec": 5,
        "cpu_frequency_governor": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "gres_detail": ["gres_detail", "gres_detail"],
        "network": "network",
        "restart_cnt": 9,
        "resv_name": "resv_name",
        "extra": "extra",
        "delay_boot": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "reboot": true,
        "cpus": {
            "number": 9,
            "set": false,
            "infinite": true
        },
        "standard_output": "standard_output",
        "pre_sus_time": 1,
        "suspend_time": 9,
        "association_id": 6,
        "command": "command",
        "tres_freq": "tres_freq",
        "requeue": true,
        "tres_per_task": "tres_per_task",
        "mail_user": "mail_user",
        "nodes": "nodes",
        "group_id": 3,
        "job_id": 2,
        "comment": "comment",
        "account": "account"
    }],
    "errors": [{
        "description": "description",
        "source": "source",
        "error": "error",
        "error_number": 0
    }, {
        "description": "description",
        "source": "source",
        "error": "error",
        "error_number": 0
    }]
}

const rowMockDatas = [
    createData(
        '66b331c5e2e1',
        'AutoGPT',
        '',
        // 'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e1',
        'Use AutoGPT - Autonomous agent with chain of thoughts for self-guided task completion',
        0,
        ''
    ),
    createData(
        '66b331c5e2e2',
        'BabyAGI',
        'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e2',
        'Use BabyAGI to create tasks and reprioritize for a given objective',
        1,
        '2023-08-05 18:16:06'
    ),
    createData(
        '66b331c5e2e3',
        'HuggingFace LLM Chain',
        'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e3',
        'Simple LLM Chain using HuggingFace Inference API on falcon-7b-instruct model',
        2,
        '2023-08-15 09:11:09'
    ),
    createData(
        '66b331c5e2e4',
        'Antonym',
        'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e4',
        'Output antonym of given user input using few-shot prompt template built with examples',
        1,
        '2023-09-01 08:30:06'
    ),
    createData(
        '66b331c5e2e5',
        'Multiple VectorDB',
        'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e5',
        'Use the agent to choose between multiple different vector databases, with the ability to use other tools',
        2,
        '2023-09-02 10:22:06'
    ),
    createData(
        '66b331c5e2e6',
        'OpenAI Agent',
        '',
        // 'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e6',
        'An agent that uses OpenAI Function Calling functionality to pick the tool and args to call',
        0,
        ''
    ),
    createData(
        '66b331c5e2e7',
        'Prompt Chaining',
        'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e7',
        'Use output from a chain as prompt for another chain',
        1,
        '2023-09-03 13:42:16'
    ),
    createData(
        '66b331c5e2e8',
        'Simple Conversation Chain',
        'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e8',
        'Basic example of Conversation Chain with built-in memory - works exactly like ChatGPT',
        2,
        '2023-09-04 11:11:34'
    ),
    createData(
        '66b331c5e2e9',
        'MRKLAgent',
        'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e2e9',
        'An agent that uses the React Framework to decide what action to take',
        2,
        '2023-09-05 13:38:01'
    ),
    createData(
        '66b331c5e210',
        'Github Repo QnA',
        '',
        // 'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e210',
        'Github repo QnA using conversational retrieval QA chain',
        0,
        ''
    ),
    createData(
        '66b331c5e211',
        'Translator',
        '',
        // 'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e211',
        'Language translation using LLM Chain with a Chat Prompt Template and Chat Model',
        0,
        ''
    ),
    createData(
        '66b331c5e212',
        'SQL DB Chain',
        'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e212',
        'Answer questions over a SQL database',
        9,
        '2023-09-03 16:31:53'
    ),
    createData(
        '66b331c5e213',
        'Metadata Filter Upsert',
        '',
        // 'http://localhost:3000/api/v1/prediction/261a43bc-170a-4d79-9fba-66b331c5e213',
        'Upsert multiple files with metadata filters and feed into conversational retrieval QA chain',
        0,
        ''
    )
]

// export default rowMockDatas

export default {
    rowMockDatas,
    nodeAPIMockData,
    jobAPIMockDatas
}
