import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from 'ui'
import { observer } from 'mobx-react-lite'

import { useStore } from 'hooks'
import { auth, STORAGE_KEY } from 'lib/gotrue'

const Error500: NextPage = () => {
  const router = useRouter()
  const { ui } = useStore()
  const { theme } = ui

  const onClickLogout = async () => {
    // await auth.signOut()
    // localStorage.removeItem(STORAGE_KEY)
    await router.push(`${process.env.NEXT_PUBLIC_MEMFIRE_CLOUD_API_URL}/project`)
    // router.reload()
  }

  return (
    <div className="relative mx-auto flex flex-1 w-full flex-col items-center justify-center space-y-6">
      <div className="absolute top-0 mx-auto w-full max-w-7xl px-8 pt-6 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between sm:h-10">
          <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
            <div className="flex w-full items-center justify-between md:w-auto">
              <a href="/project/default">
                <Image
                  src={theme == 'dark' ? '/img/supabase-dark.svg' : '/img/memfire-logo-light.svg'}
                  alt=""
                  height={24}
                  width={120}
                />
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex w-[320px] flex-col items-center justify-center space-y-3">
        <h4 className="text-lg">出了点问题 🤕</h4>
        <p className="text-center">
          很抱歉，请稍后重试，如果问题仍然存在，请随时与我们联系。
        </p>
      </div>
      <div className="flex items-center space-x-4">
        {router.pathname !== '/project/default' ? (
          <Link href='/project/default'>
            <a>
              <Button>返回</Button>
            </a>
          </Link>
        ) : (
          <Button onClick={onClickLogout}>返回</Button>
        )}
        <Link href="https://community.memfiredb.com/category/2/memfiredb%E7%94%A8%E6%88%B7%E9%97%AE%E7%AD%94">
          <a>
            <Button type="secondary">提交反馈</Button>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default observer(Error500)
