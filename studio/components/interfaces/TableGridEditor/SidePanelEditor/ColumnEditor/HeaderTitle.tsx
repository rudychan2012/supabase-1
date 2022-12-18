import { PostgresTable, PostgresColumn } from '@supabase/postgres-meta'

interface Props {
  table: PostgresTable
  column: PostgresColumn
}

// Need to fix for new column later
const HeaderTitle: React.FC<Props> = ({ table, column }) => {
  if (!column) {
    return (
      <>
        向 <code>{table.name}</code> 添加列
      </>
    )
  }
  return (
    <>
      在 <code>{column.table}</code> 中更新列 <code>{column.name}</code>
    </>
  )
}

export default HeaderTitle
