import { useRouter } from 'next/router'
import ProductEmptyState from '../../to-be-cleaned/ProductEmptyState'

interface Props {
  message: string
}

const NoTableState: React.FC<Props> = ({ message }) => {
  const router = useRouter()
  const { ref } = router.query

  return (
    <ProductEmptyState
      title="未找到public表"
      ctaButtonLabel="创建新表"
      onClickCta={() => {
        router.push(`/project/${ref}/editor`)
      }}
    >
      <p className="text-sm text-scale-1100">{message}</p>
    </ProductEmptyState>
  )
}

export default NoTableState
