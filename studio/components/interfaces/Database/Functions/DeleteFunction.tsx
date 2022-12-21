import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import TextConfirmModal from 'components/ui/Modals/TextConfirmModal'

type DeleteFunctionProps = {
  func?: any
  visible: boolean
  setVisible: (value: boolean) => void
} & any

const DeleteFunction: FC<DeleteFunctionProps> = ({ func, visible, setVisible }) => {
  const { ui, meta } = useStore()
  const [loading, setLoading] = useState(false)
  const { id, name, schema } = func ?? {}

  async function handleDelete() {
    try {
      setLoading(true)
      if (!id) {
        throw Error('Invalid function info')
      }
      const response: any = await meta.functions.del(id)
      if (response.error) {
        throw response.error
      } else {
        ui.setNotification({
          category: 'success',
          message: `Successfully removed ${name}`,
        })
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
    <>
      <TextConfirmModal
        visible={visible}
        onCancel={() => setVisible(!visible)}
        onConfirm={handleDelete}
        title="删除此函数"
        loading={loading}
        confirmLabel={`删除函数${name}`}
        confirmPlaceholder="输入函数名称"
        confirmString={name}
        text={`这将删除schema${schema}下的函数${name}。`}
        alert="此函数一旦删除，您将无法恢复！"
      />
    </>
  )
}

export default observer(DeleteFunction)
