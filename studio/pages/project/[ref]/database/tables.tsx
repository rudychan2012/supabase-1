import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { isUndefined } from 'lodash'
import { PostgresColumn, PostgresTable } from '@supabase/postgres-meta'
import { Modal } from 'ui'

import { useStore } from 'hooks'

import { DatabaseLayout } from 'components/layouts'
import ConfirmationModal from 'components/ui/ConfirmationModal'
import { TableList, ColumnList } from 'components/interfaces/Database'
import { SidePanelEditor } from 'components/interfaces/TableGridEditor'
import { NextPageWithLayout } from 'types'

const DatabaseTables: NextPageWithLayout = () => {
  const { meta, ui } = useStore()

  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [selectedSchema, setSelectedSchema] = useState('public')
  const [selectedTable, setSelectedTable] = useState<any>()
  const [sidePanelKey, setSidePanelKey] = useState<'column' | 'table'>()

  const [selectedColumnToEdit, setSelectedColumnToEdit] = useState<PostgresColumn>()
  const [selectedTableToEdit, setSelectedTableToEdit] = useState<PostgresTable>()

  const [selectedColumnToDelete, setSelectedColumnToDelete] = useState<PostgresColumn>()
  const [selectedTableToDelete, setSelectedTableToDelete] = useState<PostgresTable>()

  useEffect(() => {
    if (ui.selectedProject?.ref) {
      meta.types.load()
    }
  }, [ui.selectedProject?.ref])

  const onAddTable = () => {
    setSidePanelKey('table')
    setSelectedTableToEdit(undefined)
  }

  const onEditTable = (table: PostgresTable) => {
    setSidePanelKey('table')
    setSelectedTableToEdit(table)
  }

  const onDeleteTable = (table: PostgresTable) => {
    setIsDeleting(true)
    setSelectedTableToDelete(table)
    console.log(table)
  }

  const onAddColumn = () => {
    setSidePanelKey('column')
    setSelectedColumnToEdit(undefined)
  }

  const onEditColumn = (column: PostgresColumn) => {
    setSidePanelKey('column')
    setSelectedColumnToEdit(column)
  }

  const onDeleteColumn = (column: PostgresColumn) => {
    setIsDeleting(true)
    setSelectedColumnToDelete(column)
  }

  const onColumnUpdated = async () => {
    const updatedTable = await meta.tables.loadById(selectedTable.id)
    setSelectedTable(updatedTable)
  }

  const onClosePanel = () => setSidePanelKey(undefined)

  const onConfirmDeleteTable = async () => {
    try {
      if (isUndefined(selectedTableToDelete)) return

      const response: any = await meta.tables.del(selectedTableToDelete.id)
      if (response.error) {
        throw response.error
      } else {
        ui.setNotification({
          category: 'success',
          message: `成功删除 ${selectedTableToDelete.name}.`,
        })
      }
    } catch (error: any) {
      ui.setNotification({
        category: 'error',
        message: `删除 ${selectedTableToDelete?.name} 失败: ${error.message}`,
      })
    } finally {
      setIsDeleting(false)
      setSelectedTableToDelete(undefined)
    }
  }

  const onConfirmDeleteColumn = async () => {
    try {
      if (isUndefined(selectedColumnToDelete)) return

      const response: any = await meta.columns.del(selectedColumnToDelete.id)
      if (response.error) {
        throw response.error
      } else {
        onColumnUpdated()
        ui.setNotification({
          category: 'success',
          message: `成功删除 ${selectedColumnToDelete.name}.`,
        })
      }
    } catch (error: any) {
      ui.setNotification({
        category: 'error',
        message: `删除 ${selectedColumnToDelete?.name} 失败: ${error.message}`,
      })
    } finally {
      setIsDeleting(false)
      setSelectedColumnToDelete(undefined)
    }
  }

  return (
    <>
      <div className="p-4">
        {isUndefined(selectedTable) ? (
          <TableList
            selectedSchema={selectedSchema}
            onSelectSchema={setSelectedSchema}
            onAddTable={onAddTable}
            onEditTable={onEditTable}
            onDeleteTable={onDeleteTable}
            onOpenTable={setSelectedTable}
          />
        ) : (
          <ColumnList
            selectedTable={selectedTable}
            onAddColumn={onAddColumn}
            onEditColumn={onEditColumn}
            onDeleteColumn={onDeleteColumn}
            onSelectBack={() => {setSelectedTable(undefined), setSelectedColumnToDelete(undefined)}}
          />
        )}
      </div>
      <ConfirmationModal
        danger
        visible={isDeleting && !isUndefined(selectedTableToDelete)}
        header={
          <span className="break-words">{`确认删除表 "${selectedTableToDelete?.name}"`}</span>
        }
        children={
          <Modal.Content>
            <p className="py-4 text-sm text-scale-1100">
              您确定要删除所选表格吗？此操作无法撤消。
            </p>
          </Modal.Content>
        }
        buttonLabel="删除"
        buttonLoadingLabel="正在删除"
        onSelectCancel={() => setIsDeleting(false)}
        onSelectConfirm={onConfirmDeleteTable}
      />
      <ConfirmationModal
        danger
        visible={isDeleting && !isUndefined(selectedColumnToDelete)}
        header={`确认删除列 "${selectedColumnToDelete?.name}"`}
        children={
          <Modal.Content>
            <p className="py-4 text-sm text-scale-1100">
              您确定要删除所选列吗？此操作无法撤消。
            </p>
          </Modal.Content>
        }
        buttonLabel="删除"
        buttonLoadingLabel="正在删除"
        onSelectCancel={() => setIsDeleting(false)}
        onSelectConfirm={onConfirmDeleteColumn}
      />
      <SidePanelEditor
        sidePanelKey={sidePanelKey}
        selectedSchema={selectedSchema}
        selectedTable={selectedTable}
        onColumnSaved={onColumnUpdated}
        closePanel={onClosePanel}
        selectedColumnToEdit={selectedColumnToEdit}
        selectedTableToEdit={selectedTableToEdit}
      />
    </>
  )
}

DatabaseTables.getLayout = (page) => <DatabaseLayout title="数据库">{page}</DatabaseLayout>

export default observer(DatabaseTables)
