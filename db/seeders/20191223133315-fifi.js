'use strict';

const _ = require('lodash');
const { account_number, username: created_by } = require('../../src/connectors/users/mock').MOCK_USERS.fifi;

const opts = {
    returning: true
};

const systems = [
    // connected
    'b84f4322-a0b8-4fb9-a8dc-8abb9ee16bc0',
    '355986a3-5f37-40f7-8f36-c3ac928ce190',
    'd5174274-4307-4fac-84fd-da2c3497657c',

    // disconnected
    'a9b3af62-8404-4b2a-9084-9ed37da6baf1',
    '36828b63-38f3-4b9a-ad08-0b7812e5df57',
    'baaad5ad-1b8e-457e-ad43-39d1aea40d4d',
    'e4a0a6ff-0f01-4659-ad9d-44150ade51dd',
    '88d0ba73-0015-4e7d-a6d6-4b530cbfb4ad',
    '8728dbf3-6500-44bb-a55c-4909a48673ed',

    // no_receptor
    'bd91d212-91ae-4813-a406-d2af96fbeb52',
    '881256d7-8f99-4073-be6d-67ee42ba9af8',
    '64ee45db-6f2b-4862-bc9a-40aea8f5ecbe',
    '34360dba-a2e7-4788-b9a2-44246a865c7e',
    '3fec343b-ecc0-4049-9e30-e4dc2bae9f62',

    // no_source
    '95c5ee0d-9599-475f-a8ef-c838545b9a73',
    '6f6a889d-6bac-4d53-9bc1-ef75bc1a55ff',
    '938c5ce7-481f-4b82-815c-2973ca76a0ef',
    '2a708189-4b48-4642-9443-64bda5f38e5f',

    // no_executor
    '9574cba7-b9ce-4725-b392-e959afd3e69a',
    '750c60ee-b67e-4ccd-8d7f-cb8aed2bdbf4',

    // connected
    '35e9b452-e405-499c-9c6e-120010b7b465'
];

exports.up = async q => {
    const remediations = await q.bulkInsert('remediations', [{
        id: '0ecb5db7-2f1a-441b-8220-e5ce45066f50',
        name: 'FiFI playbook',
        auto_reboot: true,
        account_number,
        created_by,
        created_at: '2019-12-23T08:19:36.641Z',
        updated_by: created_by,
        updated_at: '2019-12-23T08:19:36.641Z'
    }, {
        id: '249f142c-2ae3-4c3f-b2ec-c8c5881f6927',
        name: 'FiFI playbook 2',
        auto_reboot: true,
        account_number,
        created_by,
        created_at: '2019-12-23T18:19:36.641Z',
        updated_by: created_by,
        updated_at: '2019-12-23T18:19:36.641Z'
    }, {
        id: '249f142c-2ae3-4c3f-b2ec-c8c5881f8561',
        name: 'FiFI playbook 3',
        auto_reboot: true,
        account_number,
        created_by,
        created_at: '2020-01-23T18:19:36.641Z',
        updated_by: created_by,
        updated_at: '2020-01-23T18:19:36.641Z'
    }], opts);

    const issues = await q.bulkInsert('remediation_issues', [{
        remediation_id: remediations[0].id,
        issue_id: 'advisor:network_bond_opts_config_issue|NETWORK_BONDING_OPTS_DOUBLE_QUOTES_ISSUE'
    }, {
        remediation_id: remediations[0].id,
        issue_id: 'vulnerabilities:CVE-2017-17712'
    }, {
        remediation_id: remediations[0].id,
        issue_id: 'ssg:rhel7|standard|xccdf_org.ssgproject.content_rule_service_autofs_disabled'
    }, {
        remediation_id: remediations[2].id,
        issue_id: 'test:ping'
    }], opts);

    await q.bulkInsert('remediation_issue_systems', _.flatMap(systems, system_id => issues.map(({ id }) => ({
        system_id,
        remediation_issue_id: id
    }))));

    const playbook_runs = await q.bulkInsert('playbook_runs', [{
        id: '88d0ba73-0015-4e7d-a6d6-4b530cbfb5bc',
        status: 'running',
        remediation_id: remediations[2].id,
        created_by,
        created_at: '2019-12-23T08:19:36.641Z',
        updated_at: '2019-12-23T08:19:36.641Z'
    }], opts);

    const playbook_run_executors = await q.bulkInsert('playbook_run_executors', [{
        id: '66d0ba73-0015-4e7d-a6d6-4b530cbfb5bd',
        executor_id: '77c0ba73-1015-4e7d-a6d6-4b530cbfb5bd',
        executor_name: 'executor-1',
        receptor_node_id: 'Job-1',
        receptor_job_id: '65c0ba21-1015-4e7d-a6d6-4b530cbfb5bd',
        status: 'running',
        updated_at: '2019-12-23T08:20:36.641Z',
        playbook: '---\n' +
        '# Red Hat Insights has recommended one or more actions for you, a system administrator, to review and if you\n' +
        '# deem appropriate, deploy on your systems running Red Hat software. Based on the analysis, we have automatically\n' +
        '# generated an Ansible Playbook for you. Please review and test the recommended actions and the Playbook as\n' +
        '# they may contain configuration changes, updates, reboots and/or other changes to your systems. Red Hat is not\n' +
        '# responsible for any adverse outcomes related to these recommendations or Playbooks.\n' +
        '#\n' +
        '# FiFI playbook 3\n' +
        '# https://cloud.redhat.com/insights/remediations/249f142c-2ae3-4c3f-b2ec-c8c5881f8561\n' +
        '# Generated by Red Hat Insights on Wed, 12 Feb 2020 18:21:15 GMT\n' +
        '\n' +
        '# Fixes test:ping\n' +
        '# Identifier: (test:ping,fix)\n' +
        '# Version: unknown\n' +
        '- name: ping\n' +
        '  hosts: "355986a3-5f37-40f7-8f36-c3ac928ce190.example.com"\n' +
        '  tasks:\n' +
        '    - ping:\n' +
        '\n' +
        '- name: run insights\n' +
        '  hosts: "355986a3-5f37-40f7-8f36-c3ac928ce190.example.com"\n' +
        '  become: True\n' +
        '  gather_facts: False\n' +
        '  tasks:\n' +
        '    - name: run insights\n' +
        '      command: insights-client\n' +
        '      changed_when: false',
        playbook_run_id: playbook_runs[0].id
    }, {
        id: '55c0ba73-0215-4e7d-a6d6-4b530cbfb5bd',
        executor_id: '21a0ba73-1035-4e7d-b6d6-4b530cbfb5bd',
        executor_name: 'executor-2',
        receptor_node_id: 'Job-2',
        receptor_job_id: '42d0ba73-0015-4e7d-a6d6-4b530cbfb5bd',
        status: 'running',
        updated_at: '2019-12-23T08:20:36.641Z',
        playbook: '---\n' +
        '# Red Hat Insights has recommended one or more actions for you, a system administrator, to review and if you\n' +
        '# deem appropriate, deploy on your systems running Red Hat software. Based on the analysis, we have automatically\n' +
        '# generated an Ansible Playbook for you. Please review and test the recommended actions and the Playbook as\n' +
        '# they may contain configuration changes, updates, reboots and/or other changes to your systems. Red Hat is not\n' +
        '# responsible for any adverse outcomes related to these recommendations or Playbooks.\n' +
        '#\n' +
        '# FiFI playbook 3\n' +
        '# https://cloud.redhat.com/insights/remediations/249f142c-2ae3-4c3f-b2ec-c8c5881f8561\n' +
        '# Generated by Red Hat Insights on Wed, 12 Feb 2020 18:21:15 GMT\n' +
        '\n' +
        '# Fixes test:ping\n' +
        '# Identifier: (test:ping,fix)\n' +
        '# Version: unknown\n' +
        '- name: ping\n' +
        '  hosts: "355986a3-5f37-40f7-8f36-c3ac928ce190.example.com"\n' +
        '  tasks:\n' +
        '    - ping:\n' +
        '\n' +
        '- name: run insights\n' +
        '  hosts: "355986a3-5f37-40f7-8f36-c3ac928ce190.example.com"\n' +
        '  become: True\n' +
        '  gather_facts: False\n' +
        '  tasks:\n' +
        '    - name: run insights\n' +
        '      command: insights-client\n' +
        '      changed_when: false',
        playbook_run_id: playbook_runs[0].id
    }], opts);

    await q.bulkInsert('playbook_run_systems', [{
        id: 'a8c4bbeb-dbcf-4fdb-94bc-19e45e961cb1',
        system_id: '7b136dd2-4824-43cf-af6c-ad0ee42f9f97',
        system_name: 'system-1',
        status: 'running',
        sequence: 1,
        console: 'These are the logs for console-5',
        updated_at: '2019-12-23T18:19:36.641Z',
        playbook_run_executor_id: playbook_run_executors[0].id
    }, {
        id: 'efe54a46-9b23-478e-977c-a5553742e725',
        system_id: '3590ba1a-e0df-4092-9c23-bca863b28573',
        system_name: 'system-2',
        status: 'running',
        sequence: 13,
        console: 'These are the logs for console-6',
        updated_at: '2019-12-23T18:19:36.641Z',
        playbook_run_executor_id: playbook_run_executors[0].id
    }, {
        id: 'c35e6a09-520f-4326-85bd-aaf595b822c5',
        system_id: 'a68f36f4-b9b1-4eae-b0ad-dc528bf6b16f',
        system_name: 'system-3',
        status: 'running',
        sequence: 267,
        console: 'These are the logs for console-7',
        updated_at: '2019-12-23T18:19:36.641Z',
        playbook_run_executor_id: playbook_run_executors[1].id
    }], opts);
};