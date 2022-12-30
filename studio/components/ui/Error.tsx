import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from 'ui'

export default function EmptyPageState({ error }: any) {
  useEffect(() => {
    console.error('Error', error)
  }, [])

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center space-y-6">
      <div className="flex w-[320px] flex-col items-center justify-center space-y-3">
        <h4 className="text-lg">出了点问题 🤕</h4>
        <p className="text-center text-sm text-scale-1100">
          很抱歉，请稍后重试，如果问题仍然存在，请随时与我们联系。
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/projects">
          <a>
            <Button>返回</Button>
          </a>
        </Link>
        <Link href="/support/new">
          <a>
            <Button type="secondary">反馈问题</Button>
          </a>
        </Link>
      </div>
      <p className="text-sm text-scale-1100">
        Error: [{error?.code}] {error?.message}
      </p>
    </div>
  )
}
