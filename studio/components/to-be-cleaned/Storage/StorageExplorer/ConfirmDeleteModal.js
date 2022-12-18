import { useEffect, useState } from 'react'
import { Modal, Button, Alert } from 'ui'

const ConfirmDeleteModal = ({
  visible = false,
  selectedItemsToDelete = [],
  onSelectCancel = () => {},
  onSelectDelete = () => {},
}) => {
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setDeleting(false)
  }, [visible])

  const multipleFiles = selectedItemsToDelete.length > 1

  const title = multipleFiles
    ? `确认删除${selectedItemsToDelete.length}个对象`
    : selectedItemsToDelete.length === 1
    ? `确认删除${selectedItemsToDelete[0].name}`
    : ``

  const description = multipleFiles
    ? `您确认删除选中的${selectedItemsToDelete.length}个对象?`
    : selectedItemsToDelete.length === 1
    ? `您确认删除${selectedItemsToDelete[0].type.toLowerCase()}?`
    : ``

  const onConfirmDelete = () => {
    setDeleting(true)
    onSelectDelete()
  }

  return (
    <Modal
      visible={visible}
      header={<span className="break-words">{title}</span>}
      size="medium"
      onCancel={onSelectCancel}
      customFooter={
        <div className="flex items-center gap-2">
          <Button type="default" onClick={onSelectCancel}>
            取消
          </Button>
          <Button type="primary" danger loading={deleting} onClick={onConfirmDelete}>
            {deleting ? '删除中' : '删除'}
          </Button>
        </div>
      }
    >
      <Modal.Content>
        <div className="my-4">
          <Alert withIcon variant="danger" title={`该操作不可逆`}>
            {description}
          </Alert>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default ConfirmDeleteModal
