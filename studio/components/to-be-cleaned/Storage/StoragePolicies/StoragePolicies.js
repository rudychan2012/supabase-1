import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { IconLoader } from 'ui'
import { find, get, isEmpty, filter } from 'lodash'

import { useStore } from 'hooks'
import { formatPoliciesForStorage } from '../Storage.utils'
import StoragePoliciesPlaceholder from './StoragePoliciesPlaceholder'
import StoragePoliciesBucketRow from './StoragePoliciesBucketRow'
import StoragePoliciesEditPolicyModal from './StoragePoliciesEditPolicyModal'
import ConfirmModal from 'components/ui/Dialogs/ConfirmDialog'
import { useStorageStore } from 'localStores/storageExplorer/StorageExplorerStore'

import { PolicyEditorModal } from 'components/interfaces/Auth/Policies'

const StoragePolicies = () => {
  const { ui, meta } = useStore()
  const storageStore = useStorageStore()
  const { loaded, buckets } = storageStore

  const roles = meta.roles.list((role) => !meta.roles.systemRoles.includes(role.name))

  const [policies, setPolicies] = useState([])
  const [selectedPolicyToEdit, setSelectedPolicyToEdit] = useState({})
  const [selectedPolicyToDelete, setSelectedPolicyToDelete] = useState({})
  const [isEditingPolicyForBucket, setIsEditingPolicyForBucket] = useState({})

  // Only use storage policy editor when creating new policies for buckets
  const showStoragePolicyEditor =
    isEmpty(selectedPolicyToEdit) &&
    !isEmpty(isEditingPolicyForBucket) &&
    get(isEditingPolicyForBucket, ['bucket'], '').length > 0

  const showGeneralPolicyEditor = !isEmpty(isEditingPolicyForBucket) && !showStoragePolicyEditor

  // Policies under storage.objects
  const storageObjectsPolicies = filter(policies, { table: 'objects' })
  const formattedStorageObjectPolicies = formatPoliciesForStorage(buckets, storageObjectsPolicies)
  const ungroupedPolicies = get(
    find(formattedStorageObjectPolicies, { name: 'Ungrouped' }),
    ['policies'],
    []
  )

  // Policies under storage.buckets
  const storageBucketPolicies = filter(policies, { table: 'buckets' })

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    if (meta) {
      await meta.policies.load()
      const storagePolicies =
        meta?.policies.list((policy) => policy.schema === 'storage', {
          allSchemas: true,
        }) ?? []
      setPolicies(storagePolicies)
    }
  }

  const onSelectPolicyAdd = (bucketName = '', table = '') => {
    setSelectedPolicyToEdit({})
    setIsEditingPolicyForBucket({ bucket: bucketName, table })
  }

  const onSelectPolicyEdit = (policy, bucketName = '', table = '') => {
    setIsEditingPolicyForBucket({ bucket: bucketName, table })
    setSelectedPolicyToEdit(policy)
  }

  const onCancelPolicyEdit = () => {
    setIsEditingPolicyForBucket({})
  }

  const onSelectPolicyDelete = (policy) => setSelectedPolicyToDelete(policy)
  const onCancelPolicyDelete = () => setSelectedPolicyToDelete({})

  const onSavePolicySuccess = async () => {
    ui.setNotification({ category: 'success', message: '保存策略成功!' })
    await fetchPolicies()
    onCancelPolicyEdit()
  }

  /*
    Functions that involve the CRUD for policies
    For each API call within the Promise.all, return true if an error occurred, else return false
  */
  const onCreatePolicies = async (payloads) => {
    return await Promise.all(
      payloads.map(async (payload) => {
        const res = await meta.policies.create(payload)
        if (res.error) {
          ui.setNotification({
            category: 'error',
            message: `添加策略错误: ${res.error.message}`,
          })
          return true
        }
        return false
      })
    )
  }

  const onCreatePolicy = async (payload) => {
    const res = await meta.policies.create(payload)
    if (res.error) {
      ui.setNotification({
        category: 'error',
        message: `添加策略错误: ${res.error.message}`,
      })
      return true
    }
    return false
  }

  const onUpdatePolicy = async (payload) => {
    const res = await meta.policies.update(payload.id, payload)
    if (res.error) {
      ui.setNotification({
        category: 'error',
        message: `更新策略错误: ${res.error.message}`,
      })
      return true
    }
    return false
  }

  const onDeletePolicy = async () => {
    const res = await meta.policies.del(selectedPolicyToDelete.id)
    if (res.error) {
      ui.setNotification({
        category: 'error',
        message: `删除策略失败: ${res.error.message}`,
      })
    } else {
      ui.setNotification({ category: 'success', message: '删除策略成功!' })
    }
    setSelectedPolicyToDelete({})
    await fetchPolicies()
  }

  return (
    <div className="flex min-h-full w-full flex-col">
      <h3 className="text-xl">存储策略</h3>
      <p className="mt-2 text-sm text-scale-1100">
        定义用户允许的操作的策略来保护您存放在Bucket中的文件。
      </p>

      {!loaded ? (
        <div className="flex h-full items-center justify-center">
          <IconLoader className="animate-spin" size={16} />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {buckets.length === 0 && <StoragePoliciesPlaceholder />}

          {/* Sections for policies grouped by buckets */}
          {buckets.map((bucket) => {
            const bucketPolicies = get(
              find(formattedStorageObjectPolicies, { name: bucket.name }),
              ['policies'],
              []
            )
            return (
              <StoragePoliciesBucketRow
                key={bucket.name}
                table="objects"
                label={bucket.name}
                bucket={bucket}
                policies={bucketPolicies}
                onSelectPolicyAdd={onSelectPolicyAdd}
                onSelectPolicyEdit={onSelectPolicyEdit}
                onSelectPolicyDelete={onSelectPolicyDelete}
              />
            )
          })}

          <div className="!mb-4 w-full border-b border-gray-600" />
          <p className="text-sm text-scale-1000">
            您也可以直接为storage schema下的表编写策略，以实现更好的控制
          </p>

          {/* Section for policies under storage.objects that are not tied to any buckets */}
          <StoragePoliciesBucketRow
            table="objects"
            label="storage.objects下的其他策略"
            policies={ungroupedPolicies}
            onSelectPolicyAdd={onSelectPolicyAdd}
            onSelectPolicyEdit={onSelectPolicyEdit}
            onSelectPolicyDelete={onSelectPolicyDelete}
          />

          {/* Section for policies under storage.buckets */}
          <StoragePoliciesBucketRow
            table="buckets"
            label="storage.buckets下的策略"
            policies={storageBucketPolicies}
            onSelectPolicyAdd={onSelectPolicyAdd}
            onSelectPolicyEdit={onSelectPolicyEdit}
            onSelectPolicyDelete={onSelectPolicyDelete}
          />
        </div>
      )}

      {/* Only used for adding policies to buckets */}
      <StoragePoliciesEditPolicyModal
        visible={showStoragePolicyEditor}
        bucketName={isEditingPolicyForBucket.bucket}
        roles={roles}
        onSelectCancel={onCancelPolicyEdit}
        onCreatePolicies={onCreatePolicies}
        onSaveSuccess={onSavePolicySuccess}
      />

      {/* Adding policies to objets/buckets table or editting any policy uses the general policy editor */}
      <PolicyEditorModal
        visible={showGeneralPolicyEditor}
        schema="storage"
        roles={roles}
        table={isEditingPolicyForBucket.table}
        target={isEditingPolicyForBucket.bucket}
        selectedPolicyToEdit={selectedPolicyToEdit}
        onSelectCancel={onCancelPolicyEdit}
        onCreatePolicy={onCreatePolicy}
        onUpdatePolicy={onUpdatePolicy}
        onSaveSuccess={onSavePolicySuccess}
      />

      <ConfirmModal
        danger
        visible={!isEmpty(selectedPolicyToDelete)}
        title="确认删除策略"
        description={`该操作不可逆！您确定要删除该策略吗"${selectedPolicyToDelete.name}"`}
        buttonLabel="删除"
        buttonLoadingLabel="删除中..."
        onSelectCancel={onCancelPolicyDelete}
        onSelectConfirm={onDeletePolicy}
      />
    </div>
  )
}

export default observer(StoragePolicies)
