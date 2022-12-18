import { Button, Modal } from 'ui'
import { useState } from 'react'
import SqlEditor from 'components/ui/SqlEditor'

const ReviewEmptyState = () => {
  return (
    <div className="my-10 flex items-center justify-center space-x-2 opacity-50">
      <p>策略没有变化</p>
    </div>
  )
}

const StoragePoliciesReview = ({
  policyStatements = [],
  onSelectBack = () => {},
  onSelectSave = () => {},
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const onSavePolicy = () => {
    setIsSaving(true)
    onSelectSave()
  }

  return (
    <>
      <Modal.Content>
        <div className="space-y-6 py-8">
          <div className="flex items-center justify-between space-y-8 space-x-4">
            <div className="flex flex-col">
              <p className="text-sm text-scale-1100">
                这些是将用于创建策略的SQL语句。附加到策略名称末尾的后缀(<code>[hashString]_[number]</code>)仅用作每个策略的唯一标识符。
              </p>
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '25rem' }}>
            {policyStatements.length === 0 && <ReviewEmptyState />}
            {policyStatements.map((policy, idx) => {
              let formattedSQLStatement = policy.statement || ''
              return (
                <div key={`policy_${idx}`} className="space-y-2">
                  <span>{policy.description}</span>
                  <div className="h-40">
                    <SqlEditor readOnly defaultValue={formattedSQLStatement} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal.Content>
      <div className="flex w-full items-center justify-end gap-2 border-t px-6 py-4 dark:border-dark">
        <Button type="default" onClick={onSelectBack}>
          返回编辑
        </Button>
        {policyStatements.length > 0 && (
          <Button type="primary" onClick={onSavePolicy} loading={isSaving}>
            保存策略
          </Button>
        )}
      </div>
    </>
  )
}

export default StoragePoliciesReview
