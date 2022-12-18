import { useState } from 'react'
import { partition } from 'lodash'
import { observer } from 'mobx-react-lite'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import Telemetry from 'lib/telemetry'
import { useOptimisticSqlSnippetCreate, checkPermissions, useStore } from 'hooks'
import { SQL_TEMPLATES } from 'components/interfaces/SQLEditor/SQLEditor.constants'
import CardButton from 'components/ui/CardButton'

const TabWelcome = observer(() => {
  const { ui } = useStore()
  const [sql, quickStart] = partition(SQL_TEMPLATES, { type: 'template' })
  const canCreateSQLSnippet = checkPermissions(PermissionAction.CREATE, 'user_content', {
    resource: { type: 'sql', owner_id: ui.profile?.id },
    subject: { id: ui.profile?.id },
  })
  const handleNewQuery = useOptimisticSqlSnippetCreate(canCreateSQLSnippet)

  return (
    <div className="block h-full space-y-8 overflow-y-auto p-6">
      <div>
        <div className="mb-4">
          <h1 className="text-scale-1200 mb-3 text-xl">脚本</h1>
          <p className="text-scale-1100 text-sm">在您的数据库上快速运行的脚本。</p>
          <p className="text-scale-1100 text-sm">
            点击任意脚本填写查询框，修改脚本，再点击
            <span className="text-code">运行</span>.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {sql.map((x) => (
            <SqlCard
              key={x.title}
              title={x.title}
              description={x.description}
              sql={x.sql}
              onClick={(sql, title) => {
                handleNewQuery({ sql, name: title })
                Telemetry.sendEvent('scripts', 'script_clicked', x.title)
              }}
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-scale-1200 mb-3 text-xl">快速开始</h1>
          <p className="text-scale-1100 text-sm">
            虽然我们处于测试阶段，但我们希望提供一种快速探索 Supabase 的方法。当我们构建导入器时，请查看这些简单的入门模板。
          </p>
          <p className="text-scale-1100 text-sm">
            点击任意脚本填写查询框，修改脚本，再点击
            <span className="text-code">运行</span>.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {quickStart.map((x) => (
            <SqlCard
              key={x.title}
              title={x.title}
              description={x.description}
              sql={x.sql}
              onClick={(sql, title) => {
                handleNewQuery({ sql, name: title })
                Telemetry.sendEvent('quickstart', 'quickstart_clicked', x.title)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

export default TabWelcome

const SqlCard = ({ title, description, sql, onClick }) => {
  const [loading, setLoading] = useState(false)

  function handleOnClick() {
    setLoading(true)
    onClick(sql, title)
  }
  return (
    <CardButton
      onClick={() => handleOnClick()}
      title={title}
      footer={<span className="text-scale-1100 text-sm">{description}</span>}
    />
  )
}
