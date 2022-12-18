import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import TextConfirmModal from 'components/ui/Modals/TextConfirmModal'

type DeleteTriggerProps = {
  trigger?: any
  visible: boolean
  setVisible: (value: boolean) => void
} & any

const DeleteTrigger: FC<DeleteTriggerProps> = ({ store, trigger, visible, setVisible }) => {
  const { ui, meta } = useStore()
  const [loading, setLoading] = useState(false)
  const { id, name, schema } = trigger ?? {}

  async function handleDelete() {
    try {
      setLoading(true)
      if (!id) {
        throw Error('Invalid trigger info')
      }
      const response: any = await meta.triggers.del(id)
      if (response.error) {
        throw response.error
      } else {
        ui.setNotification({ category: 'success', message: `Successfully removed ${name}` })
        setVisible(false)
      }
    } catch (error: any) {
      ui.setNotification({
        category: 'error',
        message: `Failed to delete ${name}: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TextConfirmModal
      visible={visible}
      onCancel={() => setVisible(!visible)}
      onConfirm={handleDelete}
      title="删除这个触发器"
      loading={loading}
      confirmLabel={`删除触发器 ${name}`}
      confirmPlaceholder="输入触发器名称"
      confirmString={name}
      text={`这将删除您${schema} schema中名为 ${name} 的触发器。`}
      alert="一旦删除，您将无法恢复此触发器!"
    />
  )
}

export default observer(DeleteTrigger)
