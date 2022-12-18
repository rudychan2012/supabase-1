import { FC } from 'react'
import { isUndefined } from 'lodash'
import { Button, IconArrowRight, IconLink } from 'ui'

import { ColumnField } from '../SidePanelEditor.types'
import InformationBox from 'components/ui/InformationBox'
import { getForeignKeyUIState } from './ColumnEditor.utils'
import { PostgresRelationship } from '@supabase/postgres-meta'

interface Props {
  column: ColumnField
  originalForeignKey: PostgresRelationship | undefined
  onSelectEditRelation: () => void
  onSelectRemoveRelation: () => void
}

const ColumnForeignKey: FC<Props> = ({
  column,
  originalForeignKey,
  onSelectEditRelation = () => {},
  onSelectRemoveRelation = () => {},
}) => {
  const hasNoForeignKey = isUndefined(originalForeignKey) && isUndefined(column?.foreignKey)
  if (hasNoForeignKey) {
    return (
      <Button type="default" onClick={onSelectEditRelation}>
        添加外键关联
      </Button>
    )
  }

  const foreignKeyUIState = getForeignKeyUIState(originalForeignKey, column?.foreignKey)

  switch (foreignKeyUIState) {
    case 'Add':
      return (
        <ColumnForeignKeyAdded
          columnName={column.name}
          foreignKey={column.foreignKey}
          onSelectEditRelation={onSelectEditRelation}
          onSelectRemoveRelation={onSelectRemoveRelation}
        />
      )
    case 'Remove':
      return (
        <ColumnForeignKeyRemoved
          columnName={column.name}
          originalForeignKey={originalForeignKey}
          onSelectEditRelation={onSelectEditRelation}
        />
      )
    case 'Update':
      return (
        <ColumnForeignKeyUpdated
          columnName={column.name}
          originalForeignKey={originalForeignKey}
          updatedForeignKey={column.foreignKey}
          onSelectEditRelation={onSelectEditRelation}
          onSelectRemoveRelation={onSelectRemoveRelation}
        />
      )
    case 'Info':
      return (
        <ColumnForeignKeyInformation
          columnName={column.name}
          foreignKey={column.foreignKey}
          onSelectEditRelation={onSelectEditRelation}
          onSelectRemoveRelation={onSelectRemoveRelation}
        />
      )
    default:
      return <div />
  }
}

export default ColumnForeignKey

// Just to break the components into smaller ones, we can create separate files for these

const ColumnForeignKeyInformation: FC<{
  columnName: string
  foreignKey?: PostgresRelationship
  onSelectEditRelation: () => void
  onSelectRemoveRelation: () => void
}> = ({ columnName, foreignKey, onSelectEditRelation, onSelectRemoveRelation }) => {
  return (
    <InformationBox
      block
      icon={<IconLink />}
      title={
        <div className="flex items-center justify-between text-scale-900">
          <div className="space-y-2">
            <span>此列具有以下外键关联：</span>
            <div className="flex items-center space-x-2">
              <span className="text-code">{columnName}</span>
              <IconArrowRight size={14} strokeWidth={2} />
              <span className="text-code">
                {foreignKey?.target_table_schema}.{foreignKey?.target_table_name}.
                {foreignKey?.target_column_name}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button type="outline" onClick={onSelectEditRelation}>
              编辑关联
            </Button>
            <Button type="outline" onClick={onSelectRemoveRelation}>
              删除
            </Button>
          </div>
        </div>
      }
    />
  )
}

const ColumnForeignKeyAdded: FC<{
  columnName: string
  foreignKey?: PostgresRelationship
  onSelectEditRelation: () => void
  onSelectRemoveRelation: () => void
}> = ({ columnName, foreignKey, onSelectEditRelation, onSelectRemoveRelation }) => {
  return (
    <InformationBox
      block
      icon={<IconLink />}
      title={
        <div className="flex items-center justify-between text-scale-1100">
          <div className="space-y-2">
            <span>
              以下外键关联将{' '}
              <span className="text-brand-900">被添加</span>:
            </span>
            <div className="flex items-center space-x-2 text-scale-1200">
              <span className={`${columnName.length > 0 ? 'text-code' : ''} max-w-xs truncate`}>
                {columnName || '本列'}
              </span>
              <IconArrowRight size={14} strokeWidth={2} />
              <span className="max-w-xs truncate text-code">
                {foreignKey?.target_table_schema}.{foreignKey?.target_table_name}.
                {foreignKey?.target_column_name}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button type="outline" onClick={onSelectEditRelation}>
              编辑关联
            </Button>
            <Button type="outline" onClick={onSelectRemoveRelation}>
              删除
            </Button>
          </div>
        </div>
      }
    />
  )
}

const ColumnForeignKeyRemoved: FC<{
  columnName: string
  originalForeignKey?: PostgresRelationship
  onSelectEditRelation: () => void
}> = ({ columnName, originalForeignKey, onSelectEditRelation }) => {
  return (
    <InformationBox
      block
      icon={<IconLink />}
      title={
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p>
              以下外键关联将被{' '}
              <span className="text-amber-900">从这一列删除：</span>
            </p>
            <div className="flex items-center space-x-2">
              <code className="text-sm">{columnName}</code>
              <IconArrowRight size={14} strokeWidth={2} />
              <code className="text-sm">
                {originalForeignKey?.target_table_schema}.{originalForeignKey?.target_table_name}.
                {originalForeignKey?.target_column_name}
              </code>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button type="outline" onClick={onSelectEditRelation}>
              编辑关联
            </Button>
          </div>
        </div>
      }
    />
  )
}

const ColumnForeignKeyUpdated: FC<{
  columnName: string
  originalForeignKey?: PostgresRelationship
  updatedForeignKey?: PostgresRelationship
  onSelectEditRelation: () => void
  onSelectRemoveRelation: () => void
}> = ({
  columnName,
  originalForeignKey,
  updatedForeignKey,
  onSelectEditRelation,
  onSelectRemoveRelation,
}) => {
  return (
    <InformationBox
      block
      icon={<IconLink />}
      title={
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p>
              外键关联将被 <span className="text-brand-900">更新</span> 为：
            </p>
            <div className="flex items-start space-x-2">
              <code className="text-sm">{columnName}</code>
              <IconArrowRight className="mt-1" size={14} strokeWidth={2} />
              <div className="flex flex-col space-y-2">
                <p className="line-through">
                  <code className="text-sm">
                    {originalForeignKey?.target_table_schema}.
                    {originalForeignKey?.target_table_name}.{originalForeignKey?.target_column_name}
                  </code>
                </p>
                <code className="text-sm">
                  {updatedForeignKey?.target_table_schema}.{updatedForeignKey?.target_table_name}.
                  {updatedForeignKey?.target_column_name}
                </code>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button type="outline" onClick={onSelectEditRelation}>
              编辑关联
            </Button>
            <Button type="outline" onClick={onSelectRemoveRelation}>
              删除
            </Button>
          </div>
        </div>
      }
    />
  )
}
