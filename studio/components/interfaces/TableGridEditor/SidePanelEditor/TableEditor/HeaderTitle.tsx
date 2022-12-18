import { FC } from 'react'
import { PostgresTable } from '@supabase/postgres-meta'

interface Props {
  schema: string
  table: PostgresTable
  isDuplicating: boolean
}

const HeaderTitle: FC<Props> = ({ schema, table, isDuplicating }) => {
  if (!table) {
    return (
      <>
        在 <code>{schema}</code> 中创建新表
      </>
    )
  }
  if (isDuplicating) {
    return (
      <>
        复制表 <code>{table.name}</code>
      </>
    )
  }
  return (
    <>
      更新表 <code>{table.name}</code>
    </>
  )
}

export default HeaderTitle
