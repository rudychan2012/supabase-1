import { FC, useEffect } from 'react'
import { IconHelpCircle } from 'ui'
import * as Tooltip from '@radix-ui/react-tooltip'

import { usePrevious } from 'hooks'
import SqlEditor from 'components/ui/SqlEditor'

interface Props {
  operation: string
  definition: string
  check: string
  onUpdatePolicyUsing: (using: string | undefined) => void
  onUpdatePolicyCheck: (check: string | undefined) => void
}

const PolicyDefinition: FC<Props> = ({
  operation = '',
  definition = '',
  check = '',
  onUpdatePolicyUsing,
  onUpdatePolicyCheck,
}) => {
  const showUsing = (operation: string) =>
    ['SELECT', 'UPDATE', 'DELETE', 'ALL'].includes(operation) || !operation
  const showCheck = (operation: string) => ['INSERT', 'UPDATE', 'ALL'].includes(operation)

  const previousOperation = usePrevious(operation) || ''
  useEffect(() => {
    if (showUsing(previousOperation) && !showUsing(operation)) onUpdatePolicyUsing(undefined)
    if (showCheck(previousOperation) && !showCheck(operation)) onUpdatePolicyCheck(undefined)
  }, [operation])

  return (
    <div className="space-y-4">
      {showUsing(operation) && (
        <div className="flex space-x-12">
          <div className="flex w-1/3 flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <label className="text-base text-scale-1100" htmlFor="policy-name">
                USING 表达式
              </label>
              <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger>
                  <IconHelpCircle className="text-scale-1100" size={16} strokeWidth={1.5} />
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow className="radix-tooltip-arrow" />
                  <div
                    className={[
                      'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                      'w-[300px] space-y-2 border border-scale-200',
                    ].join(' ')}
                  >
                    <p className="text-xs text-scale-1200">
                      如果启用了行级安全性，则此表达式将被添加到有关该表的查询中。
                    </p>
                    <p className="text-xs text-scale-1200">
                      表达式返回 true 的行将是可见的。表达式返回 false 或 null 的任何行将对用户不可见（在 SELECT 中），并且不可用于修改（在 UPDATE 或 DELETE 中）。
                    </p>
                    <p className="text-xs text-scale-1200">
                      Such rows are silently suppressed - no error is reported.
                    </p>
                  </div>
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
            <p className="text-sm text-scale-900">
              提供返回布尔值的 SQL 条件表达式。
            </p>
          </div>
          <div className={`w-2/3 ${showCheck(operation) ? 'h-32' : 'h-56'}`}>
            <SqlEditor defaultValue={definition} onInputChange={onUpdatePolicyUsing} />
          </div>
        </div>
      )}
      {showCheck(operation) && (
        <div className="flex space-x-12">
          <div className="flex w-1/3 flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <label className="text-base text-scale-1100" htmlFor="policy-name">
                WITH CHECK 表达式
              </label>
              <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger>
                  <IconHelpCircle className="text-scale-1100" size={16} strokeWidth={1.5} />
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow className="radix-tooltip-arrow" />
                  <div
                    className={[
                      'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                      'w-[300px] space-y-2 border border-scale-200',
                    ].join(' ')}
                  >
                    <p className="text-xs text-scale-1200">
                      如果启用了行级安全性，则此表达式将用于针对表的 INSERT 和 UPDATE 查询。
                    </p>
                    <p className="text-xs text-scale-1200">
                      仅允许表达式计算结果为 true 的行。如果对于插入的任何记录或更新产生的任何记录，表达式的计算结果为 false 或 null，将抛出错误。
                    </p>
                    <p className="text-xs text-scale-1200">
                      请注意，此表达式是针对可能的新的行数据而不是表原有的内容。
                    </p>
                  </div>
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
            <p className="text-sm text-scale-900">
              提供返回布尔值的 SQL 条件表达式。
            </p>
          </div>
          <div className={`w-2/3 ${showUsing(operation) ? 'h-32' : 'h-56'}`}>
            <SqlEditor defaultValue={check} onInputChange={onUpdatePolicyCheck} />
          </div>
        </div>
      )}
    </div>
  )
}

export default PolicyDefinition
