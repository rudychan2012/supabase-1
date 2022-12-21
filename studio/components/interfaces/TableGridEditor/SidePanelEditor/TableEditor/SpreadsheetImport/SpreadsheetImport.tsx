import { useCallback, useState, FC, useEffect } from 'react'
import { debounce, includes } from 'lodash'
import { SidePanel, Tabs, IconArrowRight, IconChevronRight } from 'ui'

import { useStore } from 'hooks'
import ActionBar from '../../ActionBar'
import SpreadSheetTextInput from './SpreadSheetTextInput'
import SpreadSheetFileUpload from './SpreadSheetFileUpload'
import SpreadsheetPreview from './SpreadsheetPreview'
import { SpreadsheetData } from './SpreadsheetImport.types'
import {
  acceptedFileExtension,
  parseSpreadsheet,
  parseSpreadsheetText,
} from './SpreadsheetImport.utils'
import { UPLOAD_FILE_TYPES, EMPTY_SPREADSHEET_DATA } from './SpreadsheetImport.constants'

interface Props {
  debounceDuration?: number
  headers?: string[]
  rows?: any[]
  visible: boolean
  saveContent: (prefillData: any) => void
  closePanel: () => void
}

const SpreadsheetImport: FC<Props> = ({
  debounceDuration = 250,
  headers = [],
  rows = [],
  saveContent,
  closePanel,
  visible = false,
}) => {
  const { ui } = useStore()

  useEffect(() => {
    if (visible) {
      if (headers.length === 0) {
        resetSpreadsheetImport()
      }
    }
  }, [visible])

  const [input, setInput] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [parseProgress, setParseProgress] = useState<number>(0)
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>({
    headers: headers,
    rows: rows,
    rowCount: 0,
    columnTypeMap: {},
  })
  const [errors, setErrors] = useState<any>([])
  const [expandedErrors, setExpandedErrors] = useState<string[]>([])

  const onProgressUpdate = (progress: number) => {
    setParseProgress(progress)
  }

  const onFileUpload = async (event: any) => {
    setParseProgress(0)
    event.persist()
    const [file] = event.target.files || event.dataTransfer.files
    if (!file || !includes(UPLOAD_FILE_TYPES, file?.type) || !acceptedFileExtension(file)) {
      ui.setNotification({
        category: 'info',
        message: '不好意思！我们只接受CSV或TSV文件类型，请上传另一个文件。',
      })
    } else {
      setUploadedFile(file)
      const { headers, rowCount, columnTypeMap, errors, previewRows } = await parseSpreadsheet(
        file,
        onProgressUpdate
      )
      if (errors.length > 0) {
        ui.setNotification({
          error: errors,
          category: 'error',
          message: `在${errors.length} 行数据上检测到一些问题。请在内容预览下方查看的更多详细信息。`,
          duration: 4000,
        })
      }

      setErrors(errors)
      setSpreadsheetData({ headers, rows: previewRows, rowCount, columnTypeMap })
    }
    event.target.value = ''
  }

  const resetSpreadsheetImport = () => {
    setInput('')
    setSpreadsheetData(EMPTY_SPREADSHEET_DATA)
    setUploadedFile(null)
    setErrors([])
    setExpandedErrors([])
  }

  const readSpreadsheetText = async (text: string) => {
    if (text.length > 0) {
      const { headers, rows, columnTypeMap, errors } = await parseSpreadsheetText(text)
      if (errors.length > 0) {
        ui.setNotification({
          error: errors,
          category: 'error',
          message: `在${errors.length} 行数据上检测到一些问题。请在内容预览下方查看的更多详细信息。`,
          duration: 4000,
        })
      }
      setErrors(errors)
      setSpreadsheetData({ headers, rows, rowCount: rows.length, columnTypeMap })
    } else {
      setSpreadsheetData(EMPTY_SPREADSHEET_DATA)
    }
  }

  const handler = useCallback(debounce(readSpreadsheetText, debounceDuration), [])
  const onInputChange = (event: any) => {
    setInput(event.target.value)
    handler(event.target.value)
  }

  const onSelectExpandError = (key: string) => {
    if (expandedErrors.includes(key)) {
      setExpandedErrors(expandedErrors.filter((error) => error !== key))
    } else {
      setExpandedErrors(expandedErrors.concat([key]))
    }
  }

  return (
    <SidePanel
      size="large"
      visible={visible}
      align="right"
      header="向新表添加内容"
      onCancel={() => closePanel()}
      customFooter={
        <ActionBar
          backButtonLabel="取消"
          applyButtonLabel="保存"
          closePanel={closePanel}
          applyFunction={() => {
            saveContent({
              file: uploadedFile,
              ...spreadsheetData,
            })
          }}
        />
      }
    >
      <SidePanel.Content>
        <div className="flex flex-col">
          <Tabs block type="pills">
            <Tabs.Panel id="fileUpload" label="上传CSV">
              <SpreadSheetFileUpload
                parseProgress={parseProgress}
                uploadedFile={uploadedFile}
                onFileUpload={onFileUpload}
                removeUploadedFile={resetSpreadsheetImport}
              />
            </Tabs.Panel>
            <Tabs.Panel id="pasteText" label="粘贴文本">
              <SpreadSheetTextInput input={input} onInputChange={onInputChange} />
            </Tabs.Panel>
          </Tabs>
        </div>

        {spreadsheetData.headers.length > 0 && (
          <div className="space-y-5 py-5">
            <div className="space-y-2">
              <div className="flex flex-col space-y-1">
                <p>内容预览</p>
                <p className="text-scale-1000">
                  您的表将包含 {spreadsheetData.rowCount.toLocaleString()} 行和以下 {spreadsheetData.headers.length} 列。
                </p>
                <p className="text-scale-1000">
                  下面是表格的预览（最多前 20 列和前 20 行）。
                </p>
              </div>
              <SpreadsheetPreview headers={spreadsheetData.headers} rows={spreadsheetData.rows} />
            </div>
            {errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <p>电子表格中发现的问题</p>
                  <p className="text-scale-1000">
                    尽管以下行存在问题，您仍然可以创建表。
                  </p>
                </div>
                <div className="space-y-2">
                  {errors.map((error: any, idx: number) => {
                    const key = `import-error-${idx}`
                    const isExpanded = expandedErrors.includes(key)
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconChevronRight
                            className={`transform cursor-pointer ${isExpanded ? 'rotate-90' : ''}`}
                            size={14}
                            onClick={() => onSelectExpandError(key)}
                          />
                          <p className="w-14">Row: {error.row}</p>
                          <p>{error.message}</p>
                          {error.data?.__parsed_extra && (
                            <>
                              <IconArrowRight size={14} />
                              <p>Extra field(s):</p>
                              {error.data?.__parsed_extra.map((value: any, i: number) => (
                                <code key={i} className="text-sm">{value}</code>
                              ))}
                            </>
                          )}
                        </div>
                        {isExpanded && (
                          <SpreadsheetPreview
                            headers={spreadsheetData.headers}
                            rows={[error.data]}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </SidePanel.Content>
    </SidePanel>
  )
}

export default SpreadsheetImport
