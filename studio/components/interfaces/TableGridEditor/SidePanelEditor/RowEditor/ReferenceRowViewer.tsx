import React, { FC, useEffect, useState } from 'react'
import { SidePanel, IconLoader, IconXCircle } from 'ui'
import { PostgresRelationship } from '@supabase/postgres-meta'

import ActionBar from '../ActionBar'
import InputField from './InputField'
import { RowField } from './RowEditor.types'
import { generateRowFieldsWithoutColumnMeta } from './RowEditor.utils'

interface Props {
  visible: boolean
  referenceRow?: { loading: boolean; foreignKey: any; row: any }
  closePanel: () => void
}

const ReferenceRowViewer: FC<Props> = ({ visible, referenceRow, closePanel }) => {
  const loading = referenceRow?.loading ?? true
  const foreignKey: PostgresRelationship = referenceRow?.foreignKey ?? undefined
  const row = referenceRow?.row ?? undefined
  const [rowFields, setRowFields] = useState<RowField[]>([])

  useEffect(() => {
    if (visible) {
      if (!foreignKey) {
        setRowFields([])
      } else if (row) {
        const rowFields = generateRowFieldsWithoutColumnMeta(row)
        setRowFields(rowFields)
      }
    }
  }, [visible, referenceRow])

  return (
    <SidePanel
      visible={visible}
      size="large"
      header={
        <div>
          从{' '}
          <code className="text-sm">
            {foreignKey?.target_table_schema ?? ''}.{foreignKey?.target_table_name ?? ''}
          </code>
          查看关联行
        </div>
      }
      hideFooter={false}
      onCancel={closePanel}
      customFooter={<ActionBar hideApply backButtonLabel="关闭" closePanel={closePanel} />}
    >
      <SidePanel.Content>
        <div className="py-6">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <IconLoader className="animate-spin" />
              <p className="text-sm text-scale-1100">加载参考行</p>
            </div>
          ) : !row ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <IconXCircle />
              <p className="text-sm text-scale-1100">
                无法在 {foreignKey?.target_table_schema}.
                {foreignKey?.target_table_name}中找到相应的行
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {rowFields.map((field: RowField) => {
                return <InputField key={field.id} field={field} isEditable={false} errors={{}} />
              })}
            </div>
          )}
        </div>
      </SidePanel.Content>
    </SidePanel>
  )
}

export default ReferenceRowViewer
