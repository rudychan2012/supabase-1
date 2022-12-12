import { NextApiRequest, NextApiResponse } from 'next'

import apiWrapper from 'lib/api/apiWrapper'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req

    switch (method) {
        case 'GET':
            return handleGetAll(req, res)
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
    }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
    // Platform specific endpoint
    return res.status(200).json([{
        actions: [
            'analytics:Read',
            'auth:Execute',
            'billing:Read',
            'billing:Write',
            'write:Create',
            'write:Delete',
            'functions:Read',
            'functions:Write',
            'infra:Execute',
            'read:Read',
            'sql:Read:Select',
            'sql:Write:Delete',
            'sql:Write:Insert',
            'sql:Write:Update',
            'storage:Admin:Read',
            'storage:Admin:Write',
            'tenant:Sql:Admin:Read',
            'tenant:Sql:Admin:Write',
            'tenant:Sql:CreateTable',
            'tenant:Sql:Write:Delete',
            'tenant:Sql:Write:Insert',
            'tenant:Sql:Query',
            'tenant:Sql:Read:Select',
            'tenant:Sql:Write:Update',
            'write:Update',
        ],
        resources: ['projects', 'reboot', 'tables', 'back_ups', 'custom_config_postgrest', 'custom_config_gotrue', 'triggers', 'functions', 'extensions', 'publications', 'physical_backups', 'auth.users', 'policies', 'user_content', 'logflare', 'service_api_keys', 'queue_job.projects.update_jwt', 'field.jwt_secret'],
        condition: null,
        organization_id: 1
    }])
}
