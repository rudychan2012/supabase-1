import { FC, useEffect, useState } from 'react'
import { Modal, Alert, Button } from 'ui'
import ConfirmationModal from 'components/ui/ConfirmationModal'

interface Props {
  visible: boolean
  bucket: any
  onSelectCancel: () => {}
  onSelectSave: () => {}
}

const ToggleBucketPublicModal: FC<Props> = ({
  visible = false,
  bucket = {},
  onSelectCancel = () => {},
  onSelectSave = (bucket: any) => {},
}) => {
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSaving(false)
  }, [visible])

  const onToggleBucketPublic = () => {
    setSaving(true)
    onSelectSave(bucket)
  }

  const header = bucket.public
    ? `确认私有化${bucket.name}`
    : `确认公开化${bucket.name}`

  const alertTitle = bucket.public
    ? `警告: 私有化Bucket`
    : `警告: 公开化Bucket`

  const alertDescription = bucket.public
    ? `这会导致${bucket.name}中的所有文件变成私有化，它们只能通过签名URL访问或使用正确的授权下载`
    : `这会导致${bucket.name}中的所有文件变成公开可访问`

  return (
    <ConfirmationModal
      danger
      visible={visible}
      header={header}
      children={
        <div className="py-4">
          <Modal.Content>
            <Alert title={alertTitle} variant="warning" withIcon>
              {alertDescription}
            </Alert>
          </Modal.Content>
        </div>
      }
      buttonLabel="更新Bucket"
      buttonLoadingLabel="更新Bucket中..."
      onSelectCancel={onSelectCancel}
      onSelectConfirm={onToggleBucketPublic}
    />
  )
}

export default ToggleBucketPublicModal
