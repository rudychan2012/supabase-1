import { FC, useEffect, useState } from 'react'
import { Modal, Alert, Button, Input, Toggle } from 'ui'

interface Props {
  visible: boolean
  onSelectCancel: () => {}
  onSelectSave: (bucketName: string, isPublic: boolean) => {}
}

const CreateBucketModal: FC<Props> = ({
  visible = false,
  onSelectCancel = () => {},
  onSelectSave = () => {},
}) => {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [bucketName, setBucketName] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    setError('')
    setBucketName('')
    setSaving(false)
    setIsPublic(false)
  }, [visible])

  const onCreateBucket = (event: React.MouseEvent<HTMLElement>) => {
    if (event) {
      event.preventDefault()
    }

    if (bucketName.length === 0) {
      onSelectCancel()
    } else {
      if (bucketName.includes(' ')) {
        return setError('Bucket名称不应该包含空格')
      }
      if (bucketName.match(/[:;'"/?!#$%^&*()+_{}\[\]|\s]/g)) {
        return setError('仅允许(.)和(-)')
      }
      if (bucketName !== bucketName.toLowerCase()) {
        return setError('仅允许小写字母')
      }
      setError('')
      setSaving(true)
      onSelectSave(bucketName, isPublic)
    }
  }

  return (
    <Modal
      visible={visible}
      header="创建存储Bucket"
      size="medium"
      onCancel={onSelectCancel}
      customFooter={
        <div className="flex items-center gap-2">
          <Button type="default" onClick={onSelectCancel}>
            取消
          </Button>
          <Button type="primary" disabled={saving} loading={saving} onClick={onCreateBucket}>
            {saving ? '创建Bucket中...' : '创建Bucket'}
          </Button>
        </div>
      }
    >
      <form className="space-y-6 py-4">
        <Modal.Content>
          <div className="relative flex items-center">
            <Input
              autoFocus
              label="bucket名称"
              labelOptional="Bucket一旦创建就不可以修改名称"
              descriptionText={
                <p className="text-scale-1000">
                  仅允许中文，小写英文字母，数字和(.)以及(-)
                </p>
              }
              layout="vertical"
              error={error}
              type="text"
              className="w-full"
              placeholder="e.g new-bucket"
              value={bucketName}
              onChange={(event) => setBucketName(event.target.value)}
            />
          </div>
        </Modal.Content>
        <Modal.Separator />
        <Modal.Content>
          <div className="space-y-4">
            <Toggle
              name="isPublic"
              label="公开Bucket"
              descriptionText="任何人都可以在无需鉴权的前提下，访问该Bucket中的对象"
              layout="flex"
              size="medium"
              onChange={() => setIsPublic(!isPublic)}
            />
            {isPublic && (
              <Alert title="公开的buckets未启用保护" variant="warning" withIcon>
                <p className="mb-2">
                  用户在未鉴权的情况下，对公开Bucket中的对象只读
                </p>
                <p>
                  其他操作（如对象上传和删除）仍需要行级别安全 （RLS） 策略
                </p>
              </Alert>
            )}
          </div>
        </Modal.Content>
        <button className="hidden" type="submit" onClick={onCreateBucket} />
      </form>
    </Modal>
  )
}

export default CreateBucketModal
