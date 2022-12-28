import useSWR, {useSWRConfig} from 'swr'
import { FC, useState } from 'react'
import { Button, Form, IconClock, Input, Listbox } from 'ui'

import { useStore } from 'hooks'
import { patch, get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import UpgradeToPro from 'components/ui/UpgradeToPro'
import { convertFromBytes, convertToBytes } from './StorageSettings.utils'
import { StorageSizeUnits, STORAGE_FILE_SIZE_LIMIT_MAX_BYTES } from './StorageSettings.constants'

const StorageSettings: FC<any> = ({ projectRef }) => {
  const { data, error } = useSWR(`${API_URL}/projects/${projectRef}/config/storage`, get)

  if (error || data?.error) {
    return (
      <div className="mx-auto p-6 text-center sm:w-full md:w-3/4">
        <p className="text-sm">加载存储设置时出错</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto p-6 text-center sm:w-full md:w-3/4">
        <p className="text-sm">加载中...</p>
      </div>
    )
  }

  return <StorageConfig config={data} projectRef={projectRef} />
}

const StorageConfig = ({ config, projectRef }: any) => {
  const { mutate } = useSWRConfig()
  const { fileSizeLimit, isFreeTier } = config
  const { value, unit } = convertFromBytes(fileSizeLimit)

  const { ui } = useStore()
  const [selectedUnit, setSelectedUnit] = useState(unit)
  let initialValues = { fileSizeLimit: value, unformattedFileSizeLimit: fileSizeLimit }

  const formattedMaxSizeBytes = `${new Intl.NumberFormat('en-US').format(
    STORAGE_FILE_SIZE_LIMIT_MAX_BYTES
  )} bytes`

  const { value: formattedMaxLimit } = convertFromBytes(
    STORAGE_FILE_SIZE_LIMIT_MAX_BYTES,
    selectedUnit
  )

  const onValidate = (values: any) => {
    const errors = {} as any
    if (values.fileSizeLimit > formattedMaxLimit) {
      errors[
        'fileSizeLimit'
      ] = `单个文件大小上限为 ${formattedMaxLimit.toLocaleString()} ${selectedUnit}.`
    }
    return errors
  }

  const onSubmit = async (values: any) => {
    const errors = onValidate(values)

    if (errors.fileSizeLimit) {
      ui.setNotification({
        category: 'error',
        message: `上传的文件大小必须小于5GB (${formattedMaxSizeBytes})`,
      })
    } else {
      const payload = { fileSizeLimit: convertToBytes(values.fileSizeLimit, selectedUnit) }
      const res = await patch(`${API_URL}/projects/${projectRef}/config/storage`, payload)
      if (res?.error) {
        ui.setNotification({
          category: 'error',
          message: `更新存储设置失败: ${res.error.message}`,
        })
      } else {
        mutate(`${API_URL}/projects/${projectRef}/config/storage`)
        const updatedValue = convertFromBytes(res.fileSizeLimit)
        initialValues = {
          fileSizeLimit: updatedValue.value,
          unformattedFileSizeLimit: res.fileSizeLimit,
        }
        ui.setNotification({ category: 'success', message: '更新存储设置成功' })
      }
    }
  }

  // [Joshen] To be refactored using FormContainer, FormPanel, FormContent etc once
  // Jonny's auth config refactor PR goes in
  return (
    <div className="mx-auto w-[56rem] max-w-4xl px-5 pt-12 pb-20">
      <Form validateOnBlur initialValues={initialValues} validate={onValidate} onSubmit={onSubmit}>
        {({
          values,
          isSubmitting,
          handleReset,
        }: {
          values: any
          isSubmitting: boolean
          handleReset: () => void
        }) => {
          const hasChanges =
            initialValues.unformattedFileSizeLimit !==
            convertToBytes(values.fileSizeLimit, selectedUnit)
          return (
            <>
              <div className="mb-6">
                <h3 className="mb-2 text-xl text-scale-1200">存储设置</h3>
                <div className="text-sm text-scale-900">
                  配置应用的存储设置
                </div>
              </div>
              <div className="space-y-20">
                <div
                  className={[
                    'bg-scale-100 dark:bg-scale-300',
                    'overflow-hidden border-scale-400',
                    'rounded-md border shadow',
                  ].join(' ')}
                >
                  <div className="flex flex-col gap-0 divide-y divide-scale-400">
                    <div className="block grid grid-cols-12 gap-6 px-8 py-8 lg:gap-12">
                      <div className="relative col-span-12 flex flex-col gap-6 lg:col-span-4">
                        <p className="text-sm">上传文件大小限制</p>
                      </div>
                      <div className="relative col-span-12 flex flex-col gap-x-6 gap-y-2 lg:col-span-8">
                        <div className="col-span-12 grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input
                              id="fileSizeLimit"
                              name="fileSizeLimit"
                              type="number"
                              disabled={isFreeTier}
                              step={1}
                              onKeyPress={(event) => {
                                if (event.charCode < 48 || event.charCode > 57) {
                                  event.preventDefault()
                                }
                              }}
                            />
                          </div>
                          <div className="col-span-4">
                            <Listbox
                              disabled={isFreeTier}
                              value={selectedUnit}
                              onChange={setSelectedUnit}
                            >
                              {Object.values(StorageSizeUnits).map((unit: string) => (
                                <Listbox.Option
                                  key={unit}
                                  disabled={isFreeTier}
                                  label={unit}
                                  value={unit}
                                >
                                  <div>{unit}</div>
                                </Listbox.Option>
                              ))}
                            </Listbox>
                          </div>
                        </div>
                        <p className="text-sm text-scale-1100">
                          {selectedUnit !== StorageSizeUnits.BYTES &&
                            `相当于 ${convertToBytes(
                              values.fileSizeLimit,
                              selectedUnit
                            ).toLocaleString()} bytes. `}
                          可以上传的文件大小上限（以字节为单位）为 5 GB (
                          {formattedMaxSizeBytes}).
                        </p>
                      </div>
                    </div>
                  </div>
                  {isFreeTier && (
                    <div className="px-6 pb-6">
                      <UpgradeToPro
                        icon={<IconClock size="large" />}
                        primaryText="Free Plan has a fixed upload file size limit of 50 MB."
                        projectRef={projectRef}
                        secondaryText="Please upgrade to Pro plan for a configurable upload file size limit of up to 5 GB."
                      />
                    </div>
                  )}
                  <div className="border-t border-scale-400" />
                  <div className="flex justify-between py-4 px-8">
                    <div className="flex w-full items-center justify-end gap-2">
                      <div className="flex gap-2">
                        <Button
                          type="default"
                          htmlType="reset"
                          onClick={() => handleReset()}
                          disabled={!hasChanges && hasChanges !== undefined}
                        >
                          取消
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={isSubmitting}
                          disabled={!hasChanges && hasChanges !== undefined}
                        >
                          保存
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }}
      </Form>
    </div>
  )
}

export default StorageSettings
