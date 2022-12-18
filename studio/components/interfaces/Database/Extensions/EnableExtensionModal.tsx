import { FC, useEffect, useState } from 'react'
import { Button, Input, Form, Modal, Listbox, IconPlus, IconDatabase } from 'ui'
import { PostgresExtension, PostgresSchema } from '@supabase/postgres-meta'

import { useStore } from 'hooks'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'

interface Props {
  visible: boolean
  extension: PostgresExtension
  onCancel: () => void
}

const EnableExtensionModal: FC<Props> = ({ visible, extension, onCancel }) => {
  const { ui, meta } = useStore()
  const [defaultSchema, setDefaultSchema] = useState()
  const [fetchingSchemaInfo, setFetchingSchemaInfo] = useState(false)

  const schemas = meta.schemas.list()

  // [Joshen] Worth checking in with users - whether having this schema selection
  // might be confusing, and if we should have a tooltip to explain that schemas
  // are just concepts of namespace, you can use that extension no matter where it's
  // installed in

  useEffect(() => {
    let cancel = false

    if (visible) {
      const checkExtensionSchema = async () => {
        if (!cancel) {
          setFetchingSchemaInfo(true)
          setDefaultSchema(undefined)
        }
        const res = await meta.query(
          `select * from pg_available_extension_versions where name = '${extension.name}'`
        )
        if (!res.error && !cancel) setDefaultSchema(res[0].schema)
        setFetchingSchemaInfo(false)
      }
      checkExtensionSchema()
    }

    return () => {
      cancel = true
    }
  }, [visible])

  const validate = (values: any) => {
    const errors: any = {}
    if (values.schema === 'custom' && !values.name) errors.name = '必填项'
    return errors
  }

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true)
    if (values.schema === 'custom') {
      const { error } = await meta.query(`create schema if not exists ${values.name}`)
      if (error) {
        return ui.setNotification({
          error,
          category: 'error',
          message: `创建schema: ${error.message}失败`,
        })
      }
    }

    const schema = defaultSchema
      ? defaultSchema
      : values.schema === 'custom'
      ? values.name
      : values.schema

    const { error } = await meta.extensions.create({
      schema,
      name: extension.name,
      version: extension.default_version,
      cascade: true,
    })
    if (error) {
      ui.setNotification({
        error,
        category: 'error',
        message: `起停 ${extension.name.toUpperCase()}失败: ${error.message}`,
      })
    } else {
      ui.setNotification({
        category: 'success',
        message: `${extension.name.toUpperCase()} 已启用`,
      })
    }

    setSubmitting(false)
    onCancel()
  }

  return (
    <Modal
      closable
      hideFooter
      visible={visible}
      onCancel={onCancel}
      size="small"
      header={
        <div className="flex items-baseline gap-2">
          <h5 className="text-sm text-scale-1200">确认启用</h5>
          <code className="text-xs">{extension.name}</code>
        </div>
      }
    >
      <Form
        initialValues={{
          name: extension.name, // Name of new schema, if creating new
          schema: 'extensions',
        }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values }: any) => {
          return (
            <div className="space-y-4 py-4">
              <Modal.Content>
                {fetchingSchemaInfo ? (
                  <div className="space-y-2">
                    <ShimmeringLoader />
                    <div className="w-3/4">
                      <ShimmeringLoader />
                    </div>
                  </div>
                ) : defaultSchema ? (
                  <Input
                    disabled
                    id="schema"
                    name="schema"
                    value={defaultSchema}
                    label="选择一个schema以启用扩展"
                    descriptionText={`扩展必须被安装在${defaultSchema}.`}
                  />
                ) : (
                  <Listbox
                    size="small"
                    name="schema"
                    label="选择一个schema以启用扩展"
                  >
                    <Listbox.Option
                      key="custom"
                      id="custom"
                      label={`创建一个新schema "${extension.name}"`}
                      value="custom"
                      addOnBefore={() => <IconPlus size={16} strokeWidth={1.5} />}
                    >
                      创建新schema "{extension.name}"
                    </Listbox.Option>
                    <Modal.Separator />
                    {/* @ts-ignore */}
                    {schemas.map((schema: PostgresSchema) => {
                      return (
                        <Listbox.Option
                          key={schema.id}
                          id={schema.name}
                          label={schema.name}
                          value={schema.name}
                          addOnBefore={() => <IconDatabase size={16} strokeWidth={1.5} />}
                        >
                          {schema.name}
                        </Listbox.Option>
                      )
                    })}
                  </Listbox>
                )}
              </Modal.Content>

              {values.schema === 'custom' && (
                <Modal.Content>
                  <Input id="name" name="name" label="Schema 名称" />
                </Modal.Content>
              )}

              <Modal.Separator />
              <Modal.Content>
                <div className="flex items-center justify-end space-x-2">
                  <Button type="default" disabled={isSubmitting} onClick={() => onCancel()}>
                    取消
                  </Button>
                  <Button htmlType="submit" disabled={isSubmitting} loading={isSubmitting}>
                    启用扩展
                  </Button>
                </div>
              </Modal.Content>
            </div>
          )
        }}
      </Form>
    </Modal>
  )
}

export default EnableExtensionModal
