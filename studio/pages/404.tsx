import { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from 'ui'

import { useStore } from 'hooks'

const Error404: NextPage = ({}) => {
  const { ui } = useStore()
  const { theme } = ui

  const [show404, setShow404] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      setShow404(true)
    }, 500)
  }, [])

  return (
    <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center">
      <div className="absolute top-0 mx-auto w-full max-w-7xl px-8 pt-6 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between sm:h-10">
          <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
            <div className="flex w-full items-center justify-between md:w-auto">
              <a href="/projects">
                <Image
                  src={theme == 'dark' ? '/img/supabase-dark.svg' : '/img/supabase-light.svg'}
                  alt="supabase"
                  height={24}
                  width={120}
                />
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div
        className={`absolute select-none opacity-[5%] filter transition duration-200 ${
          show404 ? 'blur-sm' : 'blur-none'
        }`}
      >
        <h1 style={{ fontSize: '28rem' }}>404</h1>
      </div>
      <div
        className={`flex flex-col items-center justify-center space-y-6 transition ${
          show404 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex w-[380px] flex-col items-center justify-center space-y-3 text-center">
          <h3 className="text-xl">您在查找什么？ 🔍</h3>
          <p className="text-scale-1100">我们找不到您要查找的页面！</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/project/default">
            <a>
              <Button size="small">返回</Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error404
