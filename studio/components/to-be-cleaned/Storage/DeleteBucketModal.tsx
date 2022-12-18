import { FC, useEffect, useState } from 'react'
import TextConfirmModal from 'components/ui/Modals/TextConfirmModal'

interface Props {
  visible: boolean
  bucket: any
  onSelectCancel: () => void
  onSelectDelete: (bucket: any) => void
}

const DeleteBucketModal: FC<Props> = ({
  visible = false,
  bucket = {},
  onSelectCancel,
  onSelectDelete,
}) => {
  const [deleting, setDeleting] = useState(false)
  const [validationInput, setValidationInput] = useState('')

  useEffect(() => {
    setValidationInput('')
    setDeleting(false)
  }, [visible])

  const onConfirmDelete = () => {
    setDeleting(true)
    onSelectDelete(bucket)
  }

  return (
    <TextConfirmModal
      visible={visible}
      title={`确认删除 ${bucket.name}`}
      confirmPlaceholder="输入Bucket的名称"
      onConfirm={onConfirmDelete}
      onCancel={onSelectCancel}
      confirmString={bucket.name}
      loading={deleting}
      text={`将会删除${bucket.name}`}
      alert="无法回复被删除的Bucket"
      confirmLabel={`删除${bucket.name}`}
    />
  )
}

export default DeleteBucketModal
