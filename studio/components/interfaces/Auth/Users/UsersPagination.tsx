import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Button } from 'ui'

import { PageContext } from 'pages/project/[ref]/auth/users'

const UsersPagination = () => {
  const PageState: any = useContext(PageContext)

  function onNext() {
    PageState.fetchData(PageState.page + 1)
  }

  function onPrevious() {
    PageState.fetchData(PageState.page - 1)
  }

  return (
    <nav className="flex items-center justify-between overflow-hidden" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-xs text-scale-900">
          显示
          <span className="px-1 font-medium text-scale-1100">{PageState.totalUsers}</span>
          条结果中的
          <span className="px-1 font-medium text-scale-1100">{PageState.fromRow}</span>
          到
          <span className="px-1 font-medium text-scale-1100">{PageState.toRow}</span>
          条
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        {PageState.hasPrevious && (
          <Button type="secondary" disabled={!PageState.hasPrevious} onClick={onPrevious}>
            上一页
          </Button>
        )}
        {PageState.hasNext && (
          <Button type="secondary" disabled={!PageState.hasNext} className="ml-3" onClick={onNext}>
            下一页
          </Button>
        )}
      </div>
    </nav>
  )
}

export default observer(UsersPagination)
