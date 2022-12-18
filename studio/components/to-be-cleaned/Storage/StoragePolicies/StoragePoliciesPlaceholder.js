import { IconArchive } from 'ui'
import Panel from 'components/ui/Panel'

const StoragePoliciesPlaceholder = ({ guiHeight }) => (
  <Panel
    title={[
      <div key="storagePlaceholder" className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-4">
          <IconArchive size="small" />
          <h4>Bucket策略</h4>
        </div>
      </div>,
    ]}
  >
    <div className="p-4 px-6">
      <p className="text-sm text-scale-1100">创建一个Bucket以开始编写使用策略!</p>
    </div>
  </Panel>
)

export default StoragePoliciesPlaceholder
