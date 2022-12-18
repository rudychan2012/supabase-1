import { PolicyTemplate } from '../PolicyTemplates/PolicyTemplates.constants'
/**
 * ----------------------------------------------------------------
 * PostgreSQL policy templates for the auth policies page
 * ----------------------------------------------------------------
 * id: Unique identifier for the monaco editor to dynamically refresh
 * templateName: As a display for a more descriptive title for the policy
 * description: Additional details about the template and how to make it yours
 * statement: SQL statement template for the policy
 *
 * name: Actual policy name that will be used in the editor
 * definition: Actual policy using expression that will be used in the editor
 * check: Actual policy with check expression that will be used in the editor
 * command: Operation to create policy for
 */

export const getGeneralPolicyTemplates = (schema: string, table: string): PolicyTemplate[] => [
  {
    id: 'policy-1',
    templateName: 'Enable read access to everyone',
    description:
      '此策略通过 SELECT 操作为所有用户提供对表的读取访问权限。',
    statement: `
CREATE POLICY "policy_name"
ON ${schema}.${table}
FOR SELECT USING (
  true
);`.trim(),
    name: 'Enable read access for all users',
    definition: 'true',
    check: '',
    command: 'SELECT',
    roles: [],
  },
  {
    id: 'policy-2',
    templateName: 'Enable insert access for authenticated users only',
    description: '此策略仅向所有经过身份验证的用户授予对表的插入访问权限。',
    statement: `
CREATE POLICY "policy_name"
ON ${schema}.${table}
FOR INSERT 
TO authenticated 
WITH CHECK (true);`.trim(),
    name: 'Enable insert for authenticated users only',
    definition: '',
    check: 'true',
    command: 'INSERT',
    roles: ['authenticated'],
  },
  {
    id: 'policy-3',
    templateName: 'Enable update access for users based on their email *',
    description:
      '此策略假定您的表具有“邮箱”列，并允许用户更新“邮箱”列与其邮箱匹配的行。',
    statement: `
CREATE POLICY "policy_name"
ON ${schema}.${table}
FOR UPDATE USING (
  auth.email() = email
) WITH CHECK (
  auth.email() = email
);`.trim(),
    name: 'Enable update for users based on email',
    definition: 'auth.email() = email',
    check: 'auth.email() = email',
    command: 'UPDATE',
    roles: [],
  },
  {
    id: 'policy-4',
    templateName: 'Enable delete access for users based on their user ID *',
    description:
      '此策略假定您的表具有“user_id”列，并允许用户删除“user_id”列与其 ID 匹配的行',
    statement: `
CREATE POLICY "policy_name"
ON ${schema}.${table}
FOR DELETE USING (
  auth.uid() = user_id
);`.trim(),
    name: 'Enable delete for users based on user_id',
    definition: 'auth.uid() = user_id',
    check: '',
    command: 'DELETE',
    roles: [],
  },
]
