import { useEffect, useState } from 'react'
import { Modal, Button, Input, Space } from 'ui'

const MoveItemsModal = ({
  bucketName = '',
  visible = false,
  selectedItemsToMove = [],
  onSelectCancel = () => {},
  onSelectMove = () => {},
}) => {
  const [moving, setMoving] = useState(false)
  const [newPath, setNewPath] = useState('')

  useEffect(() => {
    setMoving(false)
    setNewPath('')
  }, [visible])

  const multipleFiles = selectedItemsToMove.length > 1

  const title = multipleFiles
    ? `移动${bucketName}中的${selectedItemsToMove.length}个文件`
    : selectedItemsToMove.length === 1
    ? `移动${bucketName}中的${selectedItemsToMove[0].name}`
    : ``

  const description = `输入要将文件移动到的目标路径${
    multipleFiles ? 's' : ''
  } to.`

  const onConfirmMove = (event) => {
    if (event) {
      event.preventDefault()
    }
    setMoving(true)
    const formattedPath = newPath[0] === '/' ? newPath.slice(1) : newPath
    onSelectMove(formattedPath)
  }

  return (
    <Modal
      visible={visible}
      header={title}
      description={description}
      size="medium"
      onCancel={onSelectCancel}
      customFooter={
        <div className="flex items-center gap-2">
          <Button type="default" onClick={onSelectCancel}>
            取消
          </Button>
          <Button type="primary" loading={moving} onClick={onConfirmMove}>
            {moving ? '移动文件中...' : '移动文件'}
          </Button>
        </div>
      }
    >
      <Modal.Content>
        <form className="my-4">
          <div className="relative flex items-center">
            <Input
              autoFocus
              label={`Path to new directory in ${bucketName}`}
              type="text"
              className="w-full"
              placeholder="e.g folder1/subfolder2"
              value={newPath}
              descriptionText="留空以将对象移动到Bucket的根目录"
              onChange={(event) => setNewPath(event.target.value)}
            />
          </div>

          <button className="hidden" type="submit" onClick={onConfirmMove} />
        </form>
      </Modal.Content>
    </Modal>
  )
}

export default MoveItemsModal
