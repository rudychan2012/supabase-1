import { sortBy, concat } from 'lodash'
import { PostgresDataTypeOption } from './SidePanelEditor.types'

export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'
export const NUMERICAL_TYPES = ['int2', 'int4', 'int8', 'float4', 'float8', 'numeric']
export const JSON_TYPES = ['json', 'jsonb']
export const TEXT_TYPES = ['text', 'varchar']

export const TIMESTAMP_TYPES = ['timestamp', 'timestamptz']
export const DATE_TYPES = ['date']
export const TIME_TYPES = ['time', 'timetz']
export const DATETIME_TYPES = concat(TIMESTAMP_TYPES, DATE_TYPES, TIME_TYPES)

export const OTHER_DATA_TYPES = ['uuid', 'bool']
export const POSTGRES_DATA_TYPES = sortBy(
  concat(NUMERICAL_TYPES, JSON_TYPES, TEXT_TYPES, DATETIME_TYPES, OTHER_DATA_TYPES)
)

export const POSTGRES_DATA_TYPE_OPTIONS: PostgresDataTypeOption[] = [
  {
    name: 'int2',
    description: '带符号的两字节整数',
    type: 'number',
  },
  {
    name: 'int4',
    description: '带符号的四字节整数',
    type: 'number',
  },
  {
    name: 'int8',
    description: '带符号的八字节整数',
    type: 'number',
  },
  {
    name: 'float4',
    description: '单精度浮点数（4 字节）',
    type: 'number',
  },
  {
    name: 'float8',
    description: '双精度浮点数（8 字节）',
    type: 'number',
  },
  {
    name: 'numeric',
    description: '可选精度的精确数值',
    type: 'number',
  },
  {
    name: 'json',
    description: '文本 JSON 数据',
    type: 'json',
  },
  {
    name: 'jsonb',
    description: '二进制 JSON 数据，已分解',
    type: 'json',
  },
  {
    name: 'text',
    description: '变长字符串',
    type: 'text',
  },
  {
    name: 'varchar',
    description: '变长字符串',
    type: 'text',
  },
  {
    name: 'uuid',
    description: '通用唯一标识符',
    type: 'text',
  },
  {
    name: 'date',
    description: '日历日期（年、月、日）',
    type: 'time',
  },
  {
    name: 'time',
    description: '一天中的时间（无时区）',
    type: 'time',
  },
  {
    name: 'timetz',
    description: '一天中的时间，包括时区',
    type: 'time',
  },
  {
    name: 'timestamp',
    description: '日期和时间（无时区）',
    type: 'time',
  },
  {
    name: 'timestamptz',
    description: '日期和时间，包括时区',
    type: 'time',
  },
  {
    name: 'bool',
    description: '逻辑布尔值(true/false)',
    type: 'bool',
  },
]
