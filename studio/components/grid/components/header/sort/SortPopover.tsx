import React, { FC } from 'react'
import { Button, IconList, IconChevronDown, Popover } from 'ui'

import { useUrlState } from 'hooks'
import SortRow from './SortRow'
import { useTrackedState } from 'components/grid/store'
import { DropdownControl } from 'components/grid/components/common'
import { formatSortURLParams } from 'components/grid/SupabaseGrid.utils'

const SortPopover: FC = () => {
  const [{ sort: sorts }]: any = useUrlState({ arrayKeys: ['sort'] })
  const btnText =
    (sorts || []).length > 0
      ? `通过 ${sorts.length} 条规则排序`
      : '排序'

  return (
    <Popover size="large" align="start" className="sb-grid-sort-popover" overlay={<Sort />}>
      <Button
        as="span"
        type={(sorts || []).length > 0 ? 'link' : 'text'}
        icon={
          <div className="text-scale-1000">
            <IconList strokeWidth={1.5} />
          </div>
        }
      >
        {btnText}
      </Button>
    </Popover>
  )
}
export default SortPopover

const Sort: FC = () => {
  const state = useTrackedState()

  const [{ sort: sorts }, setParams] = useUrlState({ arrayKeys: ['sort'] })
  const formattedSorts = formatSortURLParams(sorts as string[])

  const columns = state?.table?.columns!.filter((x) => {
    const found = formattedSorts.find((y) => y.column == x.name)
    return !found
  })

  const dropdownOptions =
    columns?.map((x) => {
      return { value: x.name, label: x.name }
    }) || []

  function onAddSort(columnName: string | number) {
    setParams((prevParams) => {
      const existingSorts = (prevParams?.sort ?? []) as string[]
      return {
        ...prevParams,
        sort: existingSorts.concat([`${columnName}:asc`]),
      }
    })
  }

  return (
    <div className="space-y-2 py-2">
      {formattedSorts.map((sort, index) => (
        <SortRow key={sort.column} index={index} columnName={sort.column} sort={sort} />
      ))}
      {formattedSorts.length === 0 && (
        <div className="space-y-1 px-3">
          <h5 className="text-sm text-scale-1100">没有应用于此表的排序</h5>
          <p className="text-xs text-scale-900">在下面添加一列以对视图进行排序</p>
        </div>
      )}

      <Popover.Separator />
      <div className="px-3">
        {columns && columns.length > 0 ? (
          <DropdownControl
            options={dropdownOptions}
            onSelect={onAddSort}
            side="bottom"
            align="start"
          >
            <Button
              as="span"
              type="text"
              iconRight={<IconChevronDown />}
              className="sb-grid-dropdown__item-trigger"
            >
              {`选择${formattedSorts.length > 0 ? '另一' : '一'}列来排序`}
            </Button>
          </DropdownControl>
        ) : (
          <p className="text-sm text-scale-1100">已添加所有列</p>
        )}
      </div>
    </div>
  )
}
