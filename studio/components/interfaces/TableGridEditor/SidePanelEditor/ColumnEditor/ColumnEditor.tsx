import { FC, useEffect, useState } from 'react'
import { isUndefined, isEmpty } from 'lodash'
import { Dictionary } from 'components/grid'
import { Checkbox, SidePanel, Input, Button, IconExternalLink } from 'ui'
import {
  PostgresColumn,
  PostgresRelationship,
  PostgresTable,
  PostgresType,
} from '@supabase/postgres-meta'

import ActionBar from '../ActionBar'
import HeaderTitle from './HeaderTitle'
import ColumnType from './ColumnType'
import ColumnForeignKey from './ColumnForeignKey'
import ColumnDefaultValue from './ColumnDefaultValue'
import { ForeignKeySelector } from '..'
import {
  generateColumnField,
  generateColumnFieldFromPostgresColumn,
  getColumnForeignKey,
  validateFields,
  generateCreateColumnPayload,
  generateUpdateColumnPayload,
} from './ColumnEditor.utils'
import { TEXT_TYPES } from '../SidePanelEditor.constants'
import { ColumnField, CreateColumnPayload, UpdateColumnPayload } from '../SidePanelEditor.types'
import Link from 'next/link'

interface Props {
  column?: PostgresColumn
  selectedTable: PostgresTable
  tables: PostgresTable[]
  enumTypes: PostgresType[]
  visible: boolean
  closePanel: () => void
  saveChanges: (
    payload: CreateColumnPayload | UpdateColumnPayload,
    foreignKey: Partial<PostgresRelationship> | undefined,
    isNewRecord: boolean,
    configuration: { columnId: string | undefined },
    resolve: any
  ) => void
  updateEditorDirty: () => void
}

const ColumnEditor: FC<Props> = ({
  column,
  selectedTable,
  tables = [],
  enumTypes = [],
  visible = false,
  closePanel = () => {},
  saveChanges = () => {},
  updateEditorDirty = () => {},
}) => {
  const isNewRecord = isUndefined(column)
  const originalForeignKey = column ? getColumnForeignKey(column, selectedTable) : undefined

  const [errors, setErrors] = useState<Dictionary<any>>({})
  const [columnFields, setColumnFields] = useState<ColumnField>()
  const [isEditingRelation, setIsEditingRelation] = useState<boolean>(false)

  useEffect(() => {
    if (visible) {
      setErrors({})
      const columnFields = isNewRecord
        ? generateColumnField()
        : generateColumnFieldFromPostgresColumn(column!, selectedTable)
      setColumnFields(columnFields)
    }
  }, [visible])

  if (!columnFields) return null

  const onUpdateField = (changes: Partial<ColumnField>) => {
    const isTextBasedColumn = TEXT_TYPES.includes(columnFields.format)
    if (!isTextBasedColumn && changes.defaultValue === '') {
      changes.defaultValue = null
    }

    const updatedColumnFields = { ...columnFields, ...changes } as ColumnField
    setColumnFields(updatedColumnFields)
    updateEditorDirty()

    const updatedErrors = { ...errors }
    for (const key of Object.keys(changes)) {
      delete updatedErrors[key]
    }
    setErrors(updatedErrors)
  }

  const saveColumnForeignKey = (
    foreignKeyConfiguration: { table: PostgresTable; column: PostgresColumn } | undefined
  ) => {
    onUpdateField({
      foreignKey: !isUndefined(foreignKeyConfiguration)
        ? {
            id: 0,
            constraint_name: '',
            source_schema: selectedTable.schema,
            source_table_name: selectedTable.name,
            source_column_name: columnFields?.name || column?.name || '',
            target_table_schema: foreignKeyConfiguration.table.schema,
            target_table_name: foreignKeyConfiguration.table.name,
            target_column_name: foreignKeyConfiguration.column.name,
          }
        : undefined,
      ...(!isUndefined(foreignKeyConfiguration) && {
        format: foreignKeyConfiguration.column.format,
        defaultValue: null,
      }),
    })
    setIsEditingRelation(false)
  }

  const onSaveChanges = (resolve: () => void) => {
    if (columnFields) {
      const errors = validateFields(columnFields)
      setErrors(errors)

      if (isEmpty(errors)) {
        const payload = isNewRecord
          ? generateCreateColumnPayload(selectedTable.id, columnFields)
          : generateUpdateColumnPayload(column!, selectedTable, columnFields)
        const foreignKey = columnFields.foreignKey
          ? { ...columnFields.foreignKey, source_column_name: columnFields.name }
          : undefined
        const configuration = { columnId: column?.id }
        saveChanges(payload, foreignKey, isNewRecord, configuration, resolve)
      } else {
        resolve()
      }
    }
  }

  return (
    <SidePanel
      size="large"
      key="ColumnEditor"
      visible={visible}
      // @ts-ignore
      onConfirm={(resolve: () => void) => onSaveChanges(resolve)}
      // @ts-ignore
      header={<HeaderTitle table={selectedTable} column={column} />}
      onCancel={closePanel}
      customFooter={
        <ActionBar
          backButtonLabel="取消"
          applyButtonLabel="保存"
          closePanel={closePanel}
          applyFunction={(resolve: () => void) => onSaveChanges(resolve)}
        />
      }
      onInteractOutside={(event) => {
        const isToast = (event.target as Element)?.closest('#toast')
        if (isToast) {
          event.preventDefault()
        }
      }}
    >
      <SidePanel.Content>
        <div className="space-y-10 py-6">
          <Input
            label="名称"
            layout="horizontal"
            type="text"
            error={errors.name}
            value={columnFields?.name ?? ''}
            onChange={(event: any) => onUpdateField({ name: event.target.value })}
          />
          <Input
            label="描述"
            placeholder="可选的"
            layout="horizontal"
            type="text"
            value={columnFields?.comment ?? ''}
            onChange={(event: any) => onUpdateField({ comment: event.target.value })}
          />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8 md:col-start-5">
              <Checkbox
                label="是主键"
                description="主键是可以用作表中一行数据唯一标识符的一列或一组列。"
                checked={columnFields?.isPrimaryKey ?? false}
                onChange={() => onUpdateField({ isPrimaryKey: !columnFields?.isPrimaryKey })}
              />
            </div>
          </div>
        </div>
      </SidePanel.Content>

      <SidePanel.Separator />

      <SidePanel.Content>
        <div className="space-y-10 py-6">
          <ColumnForeignKey
            column={columnFields}
            originalForeignKey={originalForeignKey}
            onSelectEditRelation={() => setIsEditingRelation(true)}
            onSelectRemoveRelation={() => onUpdateField({ foreignKey: undefined })}
          />
        </div>
      </SidePanel.Content>
      <SidePanel.Separator />
      <SidePanel.Content>
        <div className="space-y-10 py-6">
          <ColumnType
            value={columnFields?.format ?? ''}
            enumTypes={enumTypes}
            error={errors.format}
            disabled={!isUndefined(columnFields?.foreignKey)}
            description={
              <Link href="https://supabase.com/docs/guides/database/tables#data-types">
                <a target="_blank" rel="noreferrer">
                  <Button
                    as="span"
                    type="text"
                    size="small"
                    className="text-scale-1000 hover:text-scale-1200"
                    icon={<IconExternalLink size={14} strokeWidth={2} />}
                  >
                    了解有关数据类型的更多信息
                  </Button>
                </a>
              </Link>
            }
            onOptionSelect={(format: string) => onUpdateField({ format, defaultValue: null })}
          />

          {isUndefined(columnFields.foreignKey) && (
            <div className="grid grid-cols-12 gap-4">
              {columnFields.format.includes('int') && (
                <div className="col-span-12 md:col-span-8 md:col-start-5">
                  <Checkbox
                    label="Is Identity"
                    description="自动为列分配一个连续的唯一编号"
                    checked={columnFields.isIdentity}
                    onChange={() => {
                      const isIdentity = !columnFields.isIdentity
                      const isArray = isIdentity ? false : columnFields.isArray
                      onUpdateField({ isIdentity, isArray })
                    }}
                  />
                </div>
              )}
              {!columnFields.isPrimaryKey && (
                <div className="col-span-12 md:col-span-8 md:col-start-5">
                  <Checkbox
                    label="定义为数组"
                    description="允许将列定义为可变长度的多维数组"
                    checked={columnFields.isArray}
                    onChange={() => {
                      const isArray = !columnFields.isArray
                      const isIdentity = isArray ? false : columnFields.isIdentity
                      onUpdateField({ isArray, isIdentity })
                    }}
                  />
                </div>
              )}
            </div>
          )}
          <ColumnDefaultValue
            columnFields={columnFields}
            enumTypes={enumTypes}
            onUpdateField={onUpdateField}
          />
          {!columnFields.isPrimaryKey && (
            <>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8 md:col-start-5">
                  <Checkbox
                    label="允许可为空"
                    description="如果未提供值，则允许该列采用 NULL 值"
                    checked={columnFields.isNullable}
                    onChange={() => onUpdateField({ isNullable: !columnFields.isNullable })}
                  />
                </div>
                <div className="col-span-12 md:col-span-8 md:col-start-5">
                  <Checkbox
                    label="是唯一的"
                    description="强制列中的值跨行唯一"
                    checked={columnFields.isUnique}
                    onChange={() => onUpdateField({ isUnique: !columnFields.isUnique })}
                  />
                </div>
              </div>
            </>
          )}

          <ForeignKeySelector
            tables={tables}
            column={columnFields}
            visible={isEditingRelation}
            closePanel={() => setIsEditingRelation(false)}
            saveChanges={saveColumnForeignKey}
          />
        </div>
      </SidePanel.Content>
    </SidePanel>
  )
}

export default ColumnEditor
