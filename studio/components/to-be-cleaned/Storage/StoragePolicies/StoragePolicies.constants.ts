/**
 * ----------------------------------------------------------------
 * PostgreSQL policy templates for the storage dashboard
 * ----------------------------------------------------------------
 * id: Unique identifier for the monaco editor to dynamically refresh
 * templateName: As a display for a more descriptive title for the policy
 * description: Additional details about the template and how to make it yours
 * statement: SQL statement template for the policy
 *
 * name: Actual policy name that will be used in the editor
 * definition: Actual policy definition that will be used in the editor
 * allowedOperations: Operations to create policies for
 */

export const STORAGE_POLICY_TEMPLATES = [
  {
    id: 'policy-1',
    templateName: '允许匿名用户访问公共文件夹下的JPG格式图片',
    description:
      '此策略使用原生的postgres函数，函数来源于auth schema和storage schema',
    name: 'Give anon users access to JPG images in folder',
    statement: `
CREATE POLICY "policy_name"
ON storage.objects FOR {operation} {USING | WITH CHECK} (
  -- restrict bucket
  bucket_id = {bucket_name}
  -- allow access to only jpg file
  AND storage."extension"(name) = 'jpg'
  -- in the public folder
  AND LOWER((storage.foldername(name))[1]) = 'public'
  -- to anonymous users
  AND auth.role() = 'anon'
);
    `.trim(),
    definition: `bucket_id = {bucket_id} AND storage."extension"(name) = 'jpg' AND LOWER((storage.foldername(name))[1]) = 'public' AND auth.role() = 'anon'`,
    allowedOperations: [],
  },
  {
    id: 'policy-2',
    templateName: '仅授予用户对自己的名为uid的顶级文件夹的访问权限',
    description:
      '例如：ID为d7bed83c-44a0-4a4f-925f-efc384ea1e50的用户将能够访问文件夹d7bed83c-44a0-4a4f-925f-efc384ea1e50下的任何内容',
    name: 'Give users access to own folder',
    statement: `
CREATE POLICY "policy_name"
ON storage.objects FOR {operation} {USING | WITH CHECK} (
    -- restrict bucket
    bucket_id = {bucket_name}
    and auth.uid()::text = (storage.foldername(name))[1]
);
    `.trim(),
    definition: `bucket_id = {bucket_id} AND auth.uid()::text = (storage.foldername(name))[1]`,
    allowedOperations: [],
  },
  {
    id: 'policy-3',
    templateName: '仅向通过身份验证的用户授予用户对文件夹的访问权限',
    description:
      '此策略仅当用户通过身份验证时才允许用户访问文件夹（例如私有）',
    name: 'Give users authenticated access to folder',
    statement: `
CREATE POLICY "policy_name"
ON storage.objects FOR {operation} {USING | WITH CHECK} (
    -- restrict bucket
    bucket_id = {bucket_name}
    AND (storage.foldername(name))[1] = 'private'
    AND auth.role() = 'authenticated'
);
    `.trim(),
    definition: `bucket_id = {bucket_id} AND (storage.foldername(name))[1] = 'private' AND auth.role() = 'authenticated'`,
    allowedOperations: [],
  },
  {
    id: 'policy-4',
    templateName: '仅向特定用户授予对admin/assets文件夹的访问权限',
    description:
      '此策略向应用的所有通过身份验证的用户授予对文件夹“public”的读取访问权限',
    name: 'Give access to a folder',
    statement: `
CREATE POLICY "policy_name"
ON storage.objects FOR {operation} {USING | WITH CHECK} (
	  -- restrict bucket
    bucket_id = {bucket_name}
    AND (storage.foldername(name))[1] = 'admin' AND (storage.foldername(name))[2] = 'assets'
    AND auth.uid()::text = 'd7bed83c-44a0-4a4f-925f-efc384ea1e50'
);
    `.trim(),
    definition: `bucket_id = {bucket_id} AND (storage.foldername(name))[1] = 'admin' AND (storage.foldername(name))[2] = 'assets' AND auth.uid()::text = 'd7bed83c-44a0-4a4f-925f-efc384ea1e50'`,
    allowedOperations: [],
  },
  {
    id: 'policy-5',
    templateName: '授权单个文件给用户',
    description: '此策略向特定用户授予对特定文件的访问权限',
    name: 'Give access to a file to user',
    statement: `
CREATE POLICY "policy_name"
ON storage.objects FOR {operation} {USING | WITH CHECK} (
	  -- restrict bucket
    bucket_id = {bucket_name}
    AND name = 'admin/assets/Costa Rican Frog.jpg'
    AND auth.uid()::text = 'd7bed83c-44a0-4a4f-925f-efc384ea1e50'
);
    `.trim(),
    definition: `bucket_id = {bucket_id} AND name = 'admin/assets/Costa Rican Frog.jpg' AND auth.uid()::text = 'd7bed83c-44a0-4a4f-925f-efc384ea1e50'`,
    allowedOperations: [],
  },
]
