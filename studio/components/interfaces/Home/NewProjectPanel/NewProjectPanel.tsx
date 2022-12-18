import Link from 'next/link'
import { FC } from 'react'
import SVG from 'react-inlinesvg'
import { useRouter } from 'next/router'
import { Button, IconKey, IconArchive, IconExternalLink, IconCode, IconActivity } from 'ui'

import Panel from 'components/ui/Panel'
import APIKeys from './APIKeys'
import GetStartedHero from './GetStartedHero'

interface Props {}

const NewProjectPanel: FC<Props> = ({}) => {
  const router = useRouter()
  const { ref } = router.query

  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-20">
      <div className="col-span-12">
        <div className="flex flex-col space-y-20">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-xl text-scale-1200">欢迎来到您的新应用</h3>
              <p className="text-base text-scale-1100">
                您的应用已完成初始化，对应的API都已设置好并可以使用。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 flex flex-col justify-center space-y-8 lg:col-span-7">
              <div className="space-y-2">
                <h3 className="text-xl text-scale-1200">
                  从构建数据库开始
                </h3>
                <p className="text-base text-scale-1100">
                  通过创建表格和插入数据开始构建您的应用程序。我们的表编辑器使 Postgres 像电子表格一样易于使用，但如果您需要更多东西，还可以使用我们的 SQL 编辑器。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/project/${ref}/editor`}>
                  <a>
                    <Button
                      type="default"
                      icon={
                        <SVG
                          src="/img/table-editor.svg"
                          style={{ width: `${14}px`, height: `${14}px` }}
                          preProcessor={(code) =>
                            code.replace(/svg/, 'svg class="m-auto text-color-inherit"')
                          }
                        />
                      }
                    >
                      表编辑器
                    </Button>
                  </a>
                </Link>
                <Link href={`/project/${ref}/sql`}>
                  <a>
                    <Button
                      type="default"
                      icon={
                        <SVG
                          src="/img/sql-editor.svg"
                          style={{ width: `${14}px`, height: `${14}px` }}
                          preProcessor={(code) =>
                            code.replace(/svg/, 'svg class="m-auto text-color-inherit"')
                          }
                        />
                      }
                    >
                      SQL 编辑器
                    </Button>
                  </a>
                </Link>
                <Link href="https://supabase.com/docs/guides/database">
                  <a target="_blank" rel="noreferrer">
                    <Button type="default" icon={<IconExternalLink size={14} />}>
                      关于数据库
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <GetStartedHero />
            </div>
          </div>

          <div className="flex h-full flex-col justify-between space-y-6">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-xl text-scale-1200">探索我们的其他产品</h3>
              <p className="text-base text-scale-1100">
                Supabase 提供构建产品所需的所有后端功能。您可以完全使用它，也可以只使用您需要的功能。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 md:gap-4 md:gap-y-0 xl:grid-cols-3">
              <Panel>
                <Panel.Content className="flex flex-col space-y-4 md:px-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded bg-scale-600 p-1.5 text-scale-1000 shadow-sm">
                      <IconKey strokeWidth={2} size={16} />
                    </div>
                    <h5>认证</h5>
                  </div>
                  <div className="flex flex-grow md:min-h-[50px] xl:min-h-[75px]">
                    <p className="text-sm text-scale-1000">
                      一个完整的用户管理系统，无需任何额外工具即可运行。
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/project/${ref}/auth/users`}>
                      <a>
                        <Button type="default">探索认证</Button>
                      </a>
                    </Link>
                    <Link href="https://supabase.com/docs/guides/auth">
                      <a target="_blank" rel="noreferrer">
                        <Button
                          className="translate-y-[1px]"
                          icon={<IconExternalLink size={14} />}
                          type="default"
                        >
                          关于认证
                        </Button>
                      </a>
                    </Link>
                  </div>
                </Panel.Content>
              </Panel>

              <Panel>
                <Panel.Content className="flex flex-col space-y-4 md:px-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded bg-scale-600 p-1.5 text-scale-1000 shadow-sm">
                      <IconArchive strokeWidth={2} size={16} />
                    </div>
                    <h5>贮存</h5>
                  </div>
                  <div className="flex md:min-h-[50px] xl:min-h-[75px]">
                    <p className="text-sm text-scale-1000">
                      为多存储桶，任意大小和任意类型的文件提供存储和管理服务。
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/project/${ref}/storage/buckets`}>
                      <a>
                        <Button type="default">探索存储</Button>
                      </a>
                    </Link>
                    <Link href="https://supabase.com/docs/guides/storage">
                      <a target="_blank" rel="noreferrer">
                        <Button
                          className="translate-y-[1px]"
                          icon={<IconExternalLink size={14} />}
                          type="default"
                        >
                          关于存储
                        </Button>
                      </a>
                    </Link>
                  </div>
                </Panel.Content>
              </Panel>

              {/*<Panel>*/}
              {/*  <Panel.Content className="flex flex-col space-y-4 md:px-3">*/}
              {/*    <div className="flex items-center space-x-3">*/}
              {/*      <div className="rounded bg-scale-600 p-1.5 text-scale-1000 shadow-sm">*/}
              {/*        <IconCode strokeWidth={2} size={16} />*/}
              {/*      </div>*/}
              {/*      <h5>Edge Functions</h5>*/}
              {/*    </div>*/}
              {/*    <div className="flex md:min-h-[50px] xl:min-h-[75px]">*/}
              {/*      <p className="text-sm text-scale-1000">*/}
              {/*        Write custom code without deploying or scaling servers, with fast deploy times*/}
              {/*        and low latency.*/}
              {/*      </p>*/}
              {/*    </div>*/}
              {/*    <div className="flex items-center space-x-2">*/}
              {/*      <Link href={`/project/${ref}/functions`}>*/}
              {/*        <a>*/}
              {/*          <Button type="default">Explore Functions</Button>*/}
              {/*        </a>*/}
              {/*      </Link>*/}
              {/*      <Link href="https://supabase.com/docs/guides/functions">*/}
              {/*        <a target="_blank" rel="noreferrer">*/}
              {/*          <Button*/}
              {/*            className="translate-y-[1px]"*/}
              {/*            icon={<IconExternalLink size={14} />}*/}
              {/*            type="default"*/}
              {/*          >*/}
              {/*            About Functions*/}
              {/*          </Button>*/}
              {/*        </a>*/}
              {/*      </Link>*/}
              {/*    </div>*/}
              {/*  </Panel.Content>*/}
              {/*</Panel>*/}

              <Panel>
                <Panel.Content className="flex flex-col space-y-4 md:px-3">
                  <div className="flex items-center space-x-4">
                    <div className="rounded bg-scale-600 p-1.5 text-scale-1000 shadow-sm">
                      <IconActivity strokeWidth={2} size={16} />
                    </div>
                    <h5>Realtime</h5>
                  </div>
                  <div className="flex md:min-h-[50px] xl:min-h-[75px]">
                    <p className="text-sm text-scale-1000">
                      通过 websockets 监听您使用了realtime的 PostgreSQL 数据库。
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href="https://supabase.com/docs/guides/realtime">
                      <a target="_blank" rel="noreferrer">
                        <Button
                          className="translate-y-[1px]"
                          icon={<IconExternalLink size={14} />}
                          type="default"
                        >
                          关于 Realtime
                        </Button>
                      </a>
                    </Link>
                  </div>
                </Panel.Content>
              </Panel>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl text-scale-1200">连接到您的新应用</h3>
            <p className="text-base text-scale-1100 lg:max-w-sm">
              使用您的 API 密钥，通过{' '}
              <Link href="https://supabase.com/docs/reference">
                <a className="text-brand-900">Supabase 客户端库</a>
              </Link>{' '}
              与您的数据库交互。
            </p>
            <p className="text-base text-scale-1100 lg:max-w-sm">
              可以在项目的 API 设置中找到有关应用密钥的更多信息。
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/project/${ref}/settings/api`}>
              <a>
                <Button type="default">查看API设置</Button>
              </a>
            </Link>
            <Link href="https://supabase.com/docs/guides/api">
              <a target="_blank" rel="noreferrer">
                <Button className="translate-y-[1px]" type="default" icon={<IconExternalLink />}>
                  关于API
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <APIKeys />
      </div>
    </div>
  )
}

export default NewProjectPanel
