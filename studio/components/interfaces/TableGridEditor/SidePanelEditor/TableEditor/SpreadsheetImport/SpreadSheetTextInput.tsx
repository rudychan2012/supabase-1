import { FC } from 'react'
import { Input } from 'ui'

interface Props {
  input: string
  onInputChange: (event: any) => void
}

const SpreadSheetTextInput: FC<Props> = ({ input, onInputChange }) => (
  <div className="space-y-10">
    <div>
      <p className="mb-2 text-sm text-scale-1100">
        从电子表格程序（如 Google 表格或 Excel）复制表格并将其粘贴到下面的字段中。第一行应该是表格的标题，标题不应包含连字符 (<code>-</code>) 或下划线 (
        <code>_</code>)以外的任何特殊字符。
      </p>
      <p className="text-xs text-scale-900">
        提示：日期时间列的格式应为 YYYY-MM-DD HH：mm：ss
      </p>
    </div>
    <Input.TextArea
      size="tiny"
      className="font-mono"
      rows={15}
      style={{ resize: 'none' }}
      value={input}
      onChange={onInputChange}
    />
  </div>
)

export default SpreadSheetTextInput
