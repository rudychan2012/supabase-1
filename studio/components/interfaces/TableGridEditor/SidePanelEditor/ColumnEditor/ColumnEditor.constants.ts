import { Dictionary } from 'components/grid'
import { Suggestion } from './ColumnEditor.types'

const defaultTimeBasedExpressions: Suggestion[] = [
  {
    name: 'now()',
    value: 'now()',
    description: '返回当前日期和时间',
  },
  {
    name: "(now() at time zone 'utc')",
    value: "(now() at time zone 'utc')",
    description: '根据指定时区返回当前日期和时间',
  },
]

const defaultTextBasedValues: Suggestion[] = [
  {
    name: '设置为 NULL',
    value: null,
    description: '将默认值设置为 NULL 值',
  },
  {
    name: '设置为空字符串',
    value: '',
    description: '将默认值设置为空字符串',
  },
]

// [Joshen] For now this is a curate mapping, ideally we could look into
// using meta-store's extensions to generate this partially on top of vanilla expressions
export const typeExpressionSuggestions: Dictionary<Suggestion[]> = {
  uuid: [
    {
      name: 'uuid_generate_v4()',
      value: 'uuid_generate_v4()',
      description: '生成版本 4 UUID',
    },
  ],
  time: [...defaultTimeBasedExpressions],
  timetz: [...defaultTimeBasedExpressions],
  timestamp: [...defaultTimeBasedExpressions],
  timestamptz: [...defaultTimeBasedExpressions],
  text: [...defaultTextBasedValues],
  varchar: [...defaultTextBasedValues],
}
