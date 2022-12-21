import { DragEvent, useRef, useState, FC } from 'react'
import { Button, IconLoader, IconFileText } from 'ui'
import SparkBar from 'components/ui/SparkBar'

interface Props {
  parseProgress: number
  uploadedFile: any
  onFileUpload: (event: any) => void
  removeUploadedFile: () => void
}

const SpreadSheetFileUpload: FC<Props> = ({
  parseProgress,
  uploadedFile,
  onFileUpload,
  removeUploadedFile,
}) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false)
  const uploadButtonRef = useRef(null)

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (event.type === 'dragover' && !isDraggedOver) {
      setIsDraggedOver(true)
    } else if (event.type === 'dragleave' || event.type === 'drop') {
      setIsDraggedOver(false)
    }
    event.stopPropagation()
    event.preventDefault()
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    onDragOver(event)
    onFileUpload(event)
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="mb-2 text-sm text-scale-1100">
          上传 CSV 或 TSV 文件。第一行应该是表格的标题，标题不应包含连字符（
          <span className="text-code">-</span>) 或下划线 (<span className="text-code">_</span>
          )以外的任何特殊字符。
        </p>
        <p className="text-xs text-scale-900">
          提示：日期时间列的格式应为 YYYY-MM-DD HH：mm：ss
        </p>
      </div>
      {!uploadedFile ? (
        <div
          className={`flex h-48 cursor-pointer items-center justify-center rounded-md border border-dashed dark:border-gray-500 ${
            isDraggedOver ? 'bg-gray-500' : ''
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragOver}
          onDrop={onDrop}
          onClick={() => (uploadButtonRef.current as any)?.click()}
        >
          <p>
            拖放，或 <span className="text-green-1000">浏览</span> 您的文件
          </p>
        </div>
      ) : (
        <div className="flex h-32 flex-col items-center justify-center space-y-2 rounded-md border border-dashed dark:border-gray-500">
          <div className="flex items-center space-x-2">
            <IconFileText size={14} strokeWidth={1.5} />
            <h3 className="text-base text-scale-1200">{uploadedFile.name}</h3>
          </div>
          {parseProgress === 100 ? (
            <Button type="outline" onClick={removeUploadedFile}>
              删除文件
            </Button>
          ) : (
            <div className="flex w-3/5 items-center space-x-2">
              <IconLoader className="h-4 w-4 animate-spin" />
              <SparkBar
                value={parseProgress}
                max={100}
                type={'horizontal'}
                barClass={'bg-green-500'}
                labelBottom="Parsing file..."
                labelTop={`${parseProgress}%`}
              />
            </div>
          )}
        </div>
      )}
      <input ref={uploadButtonRef} className="hidden" type="file" onChange={onFileUpload} />
    </div>
  )
}

export default SpreadSheetFileUpload
