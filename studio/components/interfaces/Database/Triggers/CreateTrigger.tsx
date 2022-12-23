import { FC, useEffect, createContext, useContext } from 'react'
import { makeAutoObservable } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { isEmpty, mapValues, has, without, union } from 'lodash'
import {
  Input,
  SidePanel,
  Checkbox,
  Listbox,
  IconPlayCircle,
  IconPauseCircle,
  IconTerminal,
  Badge,
  Button,
} from 'ui'
import { Dictionary } from 'components/grid'
import { useRouter } from 'next/router'
import SVG from 'react-inlinesvg'

import ChooseFunctionForm from './ChooseFunctionForm'
import FormEmptyBox from 'components/ui/FormBoxEmpty'
import NoTableState from 'components/ui/States/NoTableState'
import { useStore } from 'hooks'

class CreateTriggerFormState {
  id: number | undefined
  originalName: string | undefined
  // @ts-ignore
  activation: { value: string; error?: string }
  // @ts-ignore
  enabledMode: { value: string }
  // @ts-ignore
  events: { value: string[]; error?: string }
  // @ts-ignore
  functionName: { value: string; error?: string }
  // @ts-ignore
  functionSchema: { value: string; error?: string }
  // @ts-ignore
  orientation: { value: string; error?: string }
  // @ts-ignore
  name: { value: string; error?: string }
  // @ts-ignore
  schema: { value: string }
  // @ts-ignore
  table: { value: string }
  // @ts-ignore
  tableId: { value: number; error?: string }

  constructor() {
    makeAutoObservable(this)
    this.reset()
  }

  get requestBody() {
    return {
      id: this.id,
      activation: this.activation.value,
      enabled_mode: this.enabledMode.value,
      events: this.events.value,
      function_name: this.functionName.value,
      function_schema: this.functionSchema.value,
      orientation: this.orientation.value,
      name: this.name.value,
      schema: this.schema.value,
      table: this.table.value,
    }
  }

  reset(trigger?: Dictionary<any>) {
    this.id = trigger?.id
    this.originalName = trigger?.name
    this.activation = { value: trigger?.activation ?? 'BEFORE' }
    this.enabledMode = { value: trigger?.enabled_mode ?? 'ORIGIN' }
    this.events = { value: trigger?.events ?? [] }
    this.functionName = { value: trigger?.function_name ?? '' }
    this.functionSchema = { value: trigger?.function_schema ?? '' }
    this.orientation = { value: trigger?.orientation ?? 'STATEMENT' }
    this.name = { value: trigger?.name ?? '' }
    this.schema = { value: trigger?.schema ?? '' }
    this.table = { value: trigger?.table ?? '' }
    this.tableId = { value: trigger?.table_id ?? '' }
  }

  update(state: Dictionary<any>) {
    this.activation = state.activation
    this.enabledMode = state.enabledMode
    this.events = state.events
    this.functionName = state.functionName
    this.functionSchema = state.functionSchema
    this.orientation = state.orientation
    this.name = state.name
    this.schema = state.schema
    this.table = state.table
    this.tableId = state.tableId
  }
}

interface ICreateTriggerStore {
  chooseFunctionFormVisible: boolean
  loading: boolean
  formState: CreateTriggerFormState
  meta: any
  selectedFunction?: Dictionary<any>[]
  tables: Dictionary<any>[]
  triggerFunctions: Dictionary<any>[]
  onFormChange: ({ key, value }: { key: string; value: any }) => void
  onSelectFunction: (id: number) => void
  setChooseFunctionFormVisible: (value: boolean) => void
  setDefaultSelectedTable: () => void
  setLoading: (value: boolean) => void
  setTables: (value: Dictionary<any>[]) => void
  setTriggerFunctions: (value: Dictionary<any>[]) => void
  validateForm: () => boolean
}

class CreateTriggerStore implements ICreateTriggerStore {
  chooseFunctionFormVisible = false
  loading = false
  formState = new CreateTriggerFormState()
  meta = null
  tables = []
  triggerFunctions = []

  constructor() {
    makeAutoObservable(this)
  }

  get selectedFunction() {
    const func = this.triggerFunctions.find(
      (x: any) =>
        x.name == this.formState.functionName.value &&
        x.schema == this.formState.functionSchema.value
    )
    return func
  }

  get title() {
    return this.formState.id ? `编辑'${this.formState.originalName}'触发器` : '添加新触发器'
  }

  get isEditing() {
    return this.formState.id != undefined
  }

  setChooseFunctionFormVisible = (value: boolean) => {
    this.chooseFunctionFormVisible = value
  }

  // set first table as default selection
  setDefaultSelectedTable = () => {
    if (this.tables?.length != 0) {
      this.formState.table.value = (this.tables[0] as any).name
      this.formState.schema.value = (this.tables[0] as any).schema
      this.formState.tableId.value = (this.tables[0] as any).id
    }
  }

  setLoading = (value: boolean) => {
    this.loading = value
  }

  setTables = (value: Dictionary<any>[]) => {
    this.tables = value as any
    this.setDefaultSelectedTable()
  }

  setTriggerFunctions = (value: Dictionary<any>[]) => {
    this.triggerFunctions = value as any
  }

  onFormChange = ({ key, value }: { key: string; value: any }) => {
    if (has(this.formState, key)) {
      const temp = (this.formState as any)[key]
      // @ts-ignore
      this.formState[key] = { ...temp, value, error: undefined }
    } else {
      // @ts-ignore
      this.formState[key] = { value }
    }
  }

  onSelectFunction = (id: number) => {
    const func = this.triggerFunctions.find((x: any) => x.id == id)
    if (func) {
      this.formState.functionName.value = (func as any).name
      this.formState.functionSchema.value = (func as any).schema
    }
  }

  validateForm = () => {
    let isValidated = true
    const _state = mapValues(this.formState, (x: { value: any }, key: string) => {
      switch (key) {
        case 'name': {
          if (isEmpty(x.value) || hasWhitespace(x.value)) {
            isValidated = false
            return { ...x, error: 'Invalid trigger name' }
          } else {
            return x
          }
        }
        case 'activation': {
          if (isEmpty(x.value)) {
            isValidated = false
            return { ...x, error: 'you have an error' }
          } else {
            return x
          }
        }
        case 'events': {
          if (isEmpty(x.value)) {
            isValidated = false
            return { ...x, error: 'Select at least 1 event' }
          } else {
            return x
          }
        }
        case 'tableId': {
          if (isEmpty(`${x.value}`)) {
            isValidated = false
            return { ...x, error: 'You must choose a table' }
          } else {
            return x
          }
        }
        default:
          return x
      }
    })
    if (!isValidated) {
      this.formState.update(_state)
    }
    return isValidated
  }
}

function hasWhitespace(value: string) {
  return /\s/.test(value)
}

const CreateTriggerContext = createContext<ICreateTriggerStore | null>(null)

type CreateTriggerProps = {
  trigger?: any
  visible: boolean
  setVisible: (value: boolean) => void
} & any

const CreateTrigger: FC<CreateTriggerProps> = ({ trigger, visible, setVisible }) => {
  const { ui, meta } = useStore()
  const _localState = useLocalObservable(() => new CreateTriggerStore())
  _localState.meta = meta as any

  // for the empty 'no tables' state link
  const router = useRouter()
  const { ref } = router.query

  useEffect(() => {
    const fetchTables = async () => {
      await (_localState!.meta as any)!.tables!.load()
      const tables = (_localState!.meta as any)!.tables.list()
      _localState.setTables(tables)
    }
    const fetchFunctions = async () => {
      await (_localState.meta as any).functions.load()
      const triggerFuncs = (_localState!.meta as any)!.functions.listTriggerFunctions()
      _localState.setTriggerFunctions(triggerFuncs)
    }

    fetchTables()
    fetchFunctions()
  }, [])

  useEffect(() => {
    if (trigger) {
      _localState.formState.reset(trigger)
    } else {
      _localState.formState.reset()
      _localState.setDefaultSelectedTable()
    }
  }, [visible, trigger])

  async function handleSubmit() {
    try {
      if (_localState.validateForm()) {
        _localState.setLoading(true)

        const body = _localState.formState.requestBody
        const response: any = _localState.isEditing
          ? await (_localState.meta as any).triggers.update(body.id, body)
          : await (_localState.meta as any).triggers.create(body)

        if (response.error) {
          ui.setNotification({
            category: 'error',
            message: `Failed to create trigger: ${
              response.error?.message ?? 'submit request failed'
            }`,
          })
          _localState.setLoading(false)
        } else {
          ui.setNotification({
            category: 'success',
            message: `${_localState.isEditing ? 'Updated' : 'Created new'} trigger called ${
              response.name
            }`,
          })
          _localState.setLoading(false)
          setVisible(!visible)
        }
      }
    } catch (error: any) {
      ui.setNotification({
        category: 'error',
        message: `Filed to create trigger: ${error.message}`,
      })
      _localState.setLoading(false)
    }
  }

  const hasPublicTables = _localState.tables.length >= 1

  return (
    <>
      <SidePanel
        size="large"
        visible={visible}
        onCancel={() => setVisible(!visible)}
        header={_localState.title}
        hideFooter={!hasPublicTables}
        className={
          _localState.chooseFunctionFormVisible
            ? 'hooks-sidepanel mr-16 transform transition-all duration-300 ease-in-out'
            : 'hooks-sidepanel mr-0 transform transition-all duration-300 ease-in-out'
        }
        loading={_localState.loading}
        onConfirm={handleSubmit}
      >
        {hasPublicTables ? (
          <div className="">
            <CreateTriggerContext.Provider value={_localState}>
              <div className="my-6 space-y-10">
                {_localState.isEditing ? (
                  <div className="space-y-6 px-6">
                    <InputName />
                    <SelectEnabledMode />
                  </div>
                ) : (
                  <>
                    <div className="px-6">
                      <InputName />
                    </div>
                    <SidePanel.Separator />
                    <div className="space-y-12 px-6">
                      <h5>触发触发条件</h5>
                      <ListboxTable />
                      <CheckboxEvents />
                      <ListboxActivation />
                      <SelectOrientation />
                    </div>
                    <SidePanel.Separator />
                    <FunctionForm />
                  </>
                )}
              </div>
              <ChooseFunctionForm
                triggerFunctions={_localState.triggerFunctions}
                visible={_localState.chooseFunctionFormVisible}
                setVisible={_localState.setChooseFunctionFormVisible}
                onChange={(id: number) => _localState.onSelectFunction(id)}
              />
            </CreateTriggerContext.Provider>
          </div>
        ) : (
          <NoTableState message="您需要先创建一个表，然后才能创建触发器" />
        )}
      </SidePanel>
    </>
  )
}

export default observer(CreateTrigger)

const InputName: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)
  return (
    <Input
      id="name"
      label="触发器名称"
      layout="horizontal"
      placeholder="触发器名称"
      value={_localState!.formState.name.value}
      onChange={(e) =>
        _localState!.onFormChange({
          key: 'name',
          value: e.target.value,
        })
      }
      size="small"
      error={_localState!.formState.name.error}
      descriptionText="不要使用空格空格。"
    />
  )
})

const SelectEnabledMode: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)
  return (
    <Listbox
      id="enabled-mode"
      label="启用模式"
      layout="horizontal"
      value={_localState!.formState.enabledMode.value}
      onChange={(value) =>
        _localState!.onFormChange({
          key: 'enabledMode',
          value: value,
        })
      }
      size="small"
      descriptionText="确定触发器是否应该触发。也可用于禁用触发器，但不能将其删除。"
    >
      <Listbox.Option
        addOnBefore={({ active, selected }: any) => {
          return (
            <div className="h-3 w-3 rounded-full border border-green-700 bg-green-900 shadow-sm"></div>
          )
        }}
        value="ORIGIN"
        label="Origin"
      >
        Origin
        <span className="block text-scale-900">这是默认行为</span>
      </Listbox.Option>
      <Listbox.Option
        addOnBefore={({ active, selected }: any) => {
          return (
            <div className="h-3 w-3 rounded-full border border-green-700 bg-green-900 shadow-sm"></div>
          )
        }}
        value="REPLICA"
        label="Replica"
      >
        Replica
        <span className="block text-scale-900">
          仅当会话处于“Replica”模式时才会触发
        </span>
      </Listbox.Option>
      <Listbox.Option
        addOnBefore={({ active, selected }: any) => {
          return (
            <div className="h-3 w-3 rounded-full border border-green-700 bg-green-900 shadow-sm"></div>
          )
        }}
        value="ALWAYS"
        label="Always"
      >
        Always
        <span className="block text-scale-900">
          无论当前replication角色如何，都会触发
        </span>
      </Listbox.Option>
      <Listbox.Option
        addOnBefore={({ active, selected }: any) => {
          return (
            <div className="h-3 w-3 rounded-full border border-red-700 bg-red-900 shadow-sm"></div>
          )
        }}
        value="DISABLED"
        label="Disabled"
      >
        Disabled
        <span className="block text-scale-900">不会触发</span>
      </Listbox.Option>
    </Listbox>
  )
})

const SelectOrientation: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)
  return (
    <Listbox
      id="orientation"
      label="触发方向"
      layout="horizontal"
      value={_localState!.formState.orientation.value}
      onChange={(value) =>
        _localState!.onFormChange({
          key: 'orientation',
          value: value,
        })
      }
      size="small"
      descriptionText="标记触发器是针对每行触发一次，还是针对每个语句触发一次"
    >
      <Listbox.Option value="ROW" label="Row">
        行
        <span className="block text-scale-900">为每条被操作的行触发一次</span>
      </Listbox.Option>
      <Listbox.Option value="STATEMENT" label="Statement">
        语句
        <span className="block text-scale-900">为每个语句触发一次</span>
      </Listbox.Option>
    </Listbox>
  )
})

const ListboxTable: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)

  return (
    <Listbox
      id="table"
      label="表"
      layout="horizontal"
      value={_localState!.formState.tableId.value}
      onChange={(id) => {
        const _table = _localState!.tables.find((x) => x.id === id)
        if (_table) {
          _localState!.onFormChange({
            key: 'table',
            value: _table.name,
          })
          _localState!.onFormChange({
            key: 'schema',
            value: _table.schema,
          })
          _localState!.onFormChange({
            key: 'tableId',
            value: id,
          })
        }
      }}
      size="small"
      error={_localState!.formState.tableId.error}
      descriptionText="这是触发器将监听变更的表。一个触发器只能选择一个表。"
    >
      {_localState!.tables.map((x) => {
        return (
          <Listbox.Option
            id={x.id}
            key={x.id}
            value={x.id}
            label={x.name}
            addOnBefore={() => (
              <div className="flex items-center justify-center rounded bg-scale-1200 p-1 text-scale-100 ">
                <SVG
                  src={'/img/table-editor.svg'}
                  style={{ width: `16px`, height: `16px`, strokeWidth: '1px' }}
                  preProcessor={(code) =>
                    code.replace(/svg/, 'svg class="m-auto text-color-inherit"')
                  }
                />
              </div>
            )}
          >
            <div className="flex flex-row items-center space-x-1">
              <p>{x.name}</p>
              <p className="text-sm text-scale-1000">{x.schema}</p>
            </div>
          </Listbox.Option>
        )
      })}
    </Listbox>
  )
})

const CheckboxEvents: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)
  return (
    // @ts-ignore
    <Checkbox.Group
      name="events"
      label="事件"
      id="events"
      labelOptional="将触发触发器的事件类型"
      layout="horizontal"
      descriptionText="这些是触发器监听的事件，只有上面选择的事件才会在您选择的表上触发触发器。"
      size="small"
      onChange={(e) => {
        const temp = _localState!.formState.events.value
        const value = e.target.checked
          ? union(temp, [e.target.value])
          : without(temp, e.target.value)
        _localState!.onFormChange({
          key: 'events',
          value: value,
        })
      }}
      error={_localState!.formState.events.error}
    >
      <Checkbox
        value="INSERT"
        label="Insert"
        description={'表上的任意插入操作'}
        checked={_localState!.formState.events.value.includes('INSERT')}
      />
      <Checkbox
        value="UPDATE"
        label="Update"
        description="表中任意列的任意更新操作"
        checked={_localState!.formState.events.value.includes('UPDATE')}
      />
      <Checkbox
        value="DELETE"
        label="Delete"
        description="任意删除操作"
        checked={_localState!.formState.events.value.includes('DELETE')}
      />
    </Checkbox.Group>
  )
})

const ListboxActivation: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)
  return (
    <Listbox
      id="activation"
      label="触发器类型"
      descriptionText="这决定了你的钩子何时触发"
      onChange={(_value) => {
        _localState!.onFormChange({
          key: 'activation',
          value: _value,
        })
      }}
      value={_localState!.formState.activation.value}
      layout="horizontal"
      size="small"
      error={_localState!.formState.activation.error}
    >
      <Listbox.Option
        id={'before'}
        value={'BEFORE'}
        label={'事件开始前'}
        addOnBefore={() => (
          <div className="flex  items-center justify-center rounded bg-scale-1200 p-1 text-scale-100 ">
            <IconPauseCircle strokeWidth={2} size="small" />
          </div>
        )}
      >
        <div className="flex flex-col">
          <span>{'before'}</span>
          <span className="block text-scale-900">
            在试图操作之前触发
          </span>
        </div>
      </Listbox.Option>
      <Listbox.Option
        id={'after'}
        value={'AFTER'}
        label={'事件结束后'}
        addOnBefore={() => (
          <div className="flex  items-center justify-center rounded bg-green-1200 p-1 text-scale-100 ">
            <IconPlayCircle strokeWidth={2} size="small" />
          </div>
        )}
      >
        <div className="flex flex-col">
          <span>{'after'}</span>
          <span className="block text-scale-900">
            操作完成后触发
          </span>
        </div>
      </Listbox.Option>
    </Listbox>
  )
})

const FunctionForm: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)

  return (
    <div className="space-y-4">
      <div className="space-y-6 px-6">
        <h5>要触发的函数</h5>
      </div>
      <div className="px-6">
        {isEmpty(_localState!.formState.functionName.value) ? (
          <FunctionEmpty />
        ) : (
          <FunctionWithArguments />
        )}
      </div>
    </div>
  )
})

const FunctionEmpty: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)
  return (
    <button
      type="button"
      onClick={() => _localState!.setChooseFunctionFormVisible(true)}
      className="relative w-full
        rounded

        border
                  border-scale-600 bg-scale-200 px-5
                  py-1
                  shadow-sm
                  transition-all
                  hover:border-scale-700 hover:bg-scale-300
                  dark:bg-scale-400 dark:hover:bg-scale-500

                  "
    >
      <FormEmptyBox
        icon={<IconTerminal size={14} strokeWidth={2} />}
        text="选择要触发的函数"
      />
    </button>
  )
})

const FunctionWithArguments: FC = observer(({}) => {
  const _localState = useContext(CreateTriggerContext)

  return (
    <>
      <div
        className="


              relative

              flex
              w-full items-center
              justify-between space-x-3 rounded
              border


              border-scale-200 px-5
              py-4 shadow-sm transition-shadow dark:border-scale-500"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-scale-1200 text-scale-100 focus-within:bg-opacity-10">
            <IconTerminal size="small" strokeWidth={2} width={14} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-scale-1000">{_localState!.formState.functionName.value}</p>
            <div>
              <Badge>{_localState!.formState.functionSchema.value}</Badge>
            </div>
          </div>
        </div>
        <Button type="default" onClick={() => _localState!.setChooseFunctionFormVisible(true)}>
          更改函数
        </Button>
      </div>
    </>
  )
})
