import { useState } from 'react'
import { NextPage } from 'next'
import router from 'next/router'
import { observer } from 'mobx-react-lite'
import { isUndefined } from 'lodash'
import { PostgresTable } from '@supabase/postgres-meta'

import { useStore, withAuth } from 'hooks'
import { TableEditorLayout } from 'components/layouts'
import { EmptyState, SidePanelEditor } from 'components/interfaces/TableGridEditor'
import ConfirmationModal from 'components/ui/ConfirmationModal'

const Editor: NextPage = () => {
  const { meta, ui } = useStore()
  const projectRef = ui.selectedProject?.ref
  const [sidePanelKey, setSidePanelKey] = useState<'row' | 'column' | 'table'>()
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isDuplicating, setIsDuplicating] = useState<boolean>(false)
  const [selectedSchema, setSelectedSchema] = useState<string>('public')
  const [selectedTableToEdit, setSelectedTableToEdit] = useState<PostgresTable>()
  const [selectedTableToDelete, setSelectedTableToDelete] = useState<PostgresTable>()

  const onAddTable = () => {
    setSidePanelKey('table')
    setIsDuplicating(false)
    setSelectedTableToEdit(undefined)
  }

  const onEditTable = (table: PostgresTable) => {
    setSidePanelKey('table')
    setIsDuplicating(false)
    setSelectedTableToEdit(table)
  }

  const onDeleteTable = (table: PostgresTable) => {
    setIsDeleting(true)
    setSelectedTableToDelete(table)
  }

  const onDuplicateTable = (table: PostgresTable) => {
    setSidePanelKey('table')
    setIsDuplicating(true)
    setSelectedTableToEdit(table)
  }

  const onClosePanel = () => {
    setSidePanelKey(undefined)
  }

  const onConfirmDeleteTable = async () => {
    try {
      await meta.tables.del(selectedTableToDelete!.id)
      setIsDeleting(false)
      ui.setNotification({
        category: 'success',
        message: `成功删除${selectedTableToDelete!.name}`,
      })
    } catch (error: any) {
      ui.setNotification({
        category: 'error',
        message: `删除${selectedTableToDelete!.name}失败`,
      })
    }
  }

  return (
    <TableEditorLayout
      selectedSchema={selectedSchema}
      onSelectSchema={setSelectedSchema}
      onAddTable={onAddTable}
      onEditTable={onEditTable}
      onDeleteTable={onDeleteTable}
      onDuplicateTable={onDuplicateTable}
    >
      <EmptyState selectedSchema={selectedSchema} onAddTable={onAddTable} />
      {/* On this page it'll only handle tables */}
      <ConfirmationModal
        danger
        visible={isDeleting && !isUndefined(selectedTableToDelete)}
        header={
          <span className="break-words">{`确认删除表 "${selectedTableToDelete?.name}"`}</span>
        }
        description={`您确定要删除所选表格吗？此操作无法撤消`}
        buttonLabel="删除"
        buttonLoadingLabel="正在删除"
        onSelectCancel={() => setIsDeleting(false)}
        onSelectConfirm={onConfirmDeleteTable}
      />
      <SidePanelEditor
        selectedSchema={selectedSchema}
        isDuplicating={isDuplicating}
        selectedTableToEdit={selectedTableToEdit}
        sidePanelKey={sidePanelKey}
        closePanel={onClosePanel}
        onTableCreated={(table: any) => router.push(`/project/${projectRef}/editor/${table.id}`)}
      />
    </TableEditorLayout>
  )
}

export default withAuth(observer(Editor))
