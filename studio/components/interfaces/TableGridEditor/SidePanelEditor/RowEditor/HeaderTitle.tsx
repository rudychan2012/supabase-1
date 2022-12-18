import { FC } from 'react'

interface Props {
  isNewRecord: boolean
  tableName?: string
}

const HeaderTitle: FC<Props> = ({ isNewRecord, tableName }) => {
  let header = `${isNewRecord ? '向' : '从'} `

  return (
    <>
      {header}
      {tableName && <span className="text-code">{tableName}</span>}
      {`${isNewRecord ? '新增' : '中更新'}行`}
    </>
  )
}

export default HeaderTitle
