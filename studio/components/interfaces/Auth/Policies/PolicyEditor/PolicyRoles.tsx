import { FC } from 'react'
import { PostgresRole } from '@supabase/postgres-meta'

import MultiSelect from 'components/ui/MultiSelect'

interface Props {
  roles: PostgresRole[]
  selectedRoles: string[]
  onUpdateSelectedRoles: (roles: string[]) => void
}

const PolicyRoles: FC<Props> = ({ roles, selectedRoles, onUpdateSelectedRoles }) => {
  // @ts-ignore
  const formattedRoles = roles.map((role) => {
    return {
      id: role.id,
      name: role.name,
      value: role.name,
      disabled: false,
    }
  })

  return (
    <div className="flex space-x-12">
      <div className="flex w-1/3 flex-col space-y-2">
        <label className="text-scale-1100 text-base" htmlFor="policy-name">
          目标角色
        </label>
        <p className="text-scale-900 text-sm">对所选的角色应用策略</p>
      </div>
      <div className="relative w-2/3">
        <MultiSelect
          options={formattedRoles}
          value={selectedRoles}
          placeholder="如果没有选择默认应用到所有角色(public)"
          searchPlaceholder="搜索角色"
          onChange={onUpdateSelectedRoles}
        />
      </div>
    </div>
  )
}

export default PolicyRoles
