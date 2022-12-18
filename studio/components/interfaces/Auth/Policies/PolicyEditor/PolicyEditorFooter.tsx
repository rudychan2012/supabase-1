import { FC } from 'react'
import { Button } from 'ui'

interface Props {
  showTemplates: boolean
  onViewTemplates: () => void
  onReviewPolicy: () => void
}

const PolicyEditorFooter: FC<Props> = ({ showTemplates, onViewTemplates, onReviewPolicy }) => (
  <div className="flex w-full items-center justify-end gap-2 border-t px-6 py-4 dark:border-dark">
    {showTemplates && (
      <Button type="default" onClick={onViewTemplates}>
        查看templates
      </Button>
    )}
    <Button type="primary" onClick={onReviewPolicy}>
      审查
    </Button>
  </div>
)

export default PolicyEditorFooter
