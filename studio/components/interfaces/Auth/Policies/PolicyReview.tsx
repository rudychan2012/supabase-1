import { Button, Modal } from 'ui'
import { isEmpty } from 'lodash'
import { FC, useState } from 'react'
import SqlEditor from 'components/ui/SqlEditor'
import { PolicyForReview } from './Policies.types'

interface Props {
  policy: PolicyForReview
  onSelectBack: () => void
  onSelectSave: () => void
}

const PolicyReview: FC<Props> = ({
  policy = {},
  onSelectBack = () => {},
  onSelectSave = () => {},
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const onSavePolicy = () => {
    setIsSaving(true)
    onSelectSave()
  }

  let formattedSQLStatement = policy.statement || ''

  return (
    <>
      <Modal.Content>
        <div className="space-y-6 py-8">
          <div className="flex items-center justify-between space-y-8">
            <div className="flex flex-col">
              <p className="text-sm text-scale-1100">
                这是将用于创建策略的SQL语句。
              </p>
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '25rem' }}>
            {isEmpty(policy) ? (
              <div className="my-10 flex items-center justify-center space-x-2 opacity-50">
                <p className="text-base text-scale-1100">
                  本策略没有变化
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span>{policy.description}</span>
                <div className="h-40">
                  <SqlEditor readOnly defaultValue={formattedSQLStatement} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal.Content>
      <div className="flex w-full items-center justify-end gap-2 border-t px-6 py-4 dark:border-dark">
        <Button type="default" onClick={onSelectBack}>
          返回编辑
        </Button>
        <Button type="primary" disabled={isEmpty(policy)} onClick={onSavePolicy} loading={isSaving}>
          保存策略
        </Button>
      </div>
    </>
  )
}

export default PolicyReview
