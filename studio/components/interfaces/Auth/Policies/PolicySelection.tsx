import { FC } from 'react'
import { IconEdit, IconGrid, Modal } from 'ui'
import CardButton from 'components/ui/CardButton'

interface Props {
  description: string
  onViewTemplates: () => void
  onViewEditor: () => void
}

const PolicySelection: FC<Props> = ({
  description = '',
  onViewTemplates = () => {},
  onViewEditor = () => {},
}) => {
  return (
    <Modal.Content>
      <div className="space-y-6 py-8">
        <div>
          <p className="text-sm text-scale-1100">{description}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-1">
          <CardButton
            title="快速上手"
            description="从模板创建策略"
            icon={
              <div className="flex">
                <div
                  className="
                  flex h-8 w-8 items-center
                  justify-center
                  rounded bg-scale-1200 text-scale-100  
                "
                >
                  <IconGrid size={14} strokeWidth={2} />
                </div>
              </div>
            }
            onClick={onViewTemplates}
          />
          <CardButton
            title="完全定制"
            description="从头开始创建策略"
            icon={
              <div className="flex">
                <div
                  className="
                  flex h-8 w-8 items-center
                  justify-center
                  rounded bg-scale-1200 text-scale-100  
                "
                >
                  <IconEdit size={14} strokeWidth={2} />
                </div>
              </div>
            }
            onClick={onViewEditor}
          />
        </div>
        <p className="text-sm text-scale-1100">
          不知道什么事策略？查看我们的资源{' '}
          <a
            target="_blank"
            className="text-brand-900 transition-colors hover:text-brand-1200"
            href="https://supabase.com/docs/guides/auth#policies"
          >
            here
          </a>
          。
        </p>
      </div>
    </Modal.Content>
  )
}

export default PolicySelection
