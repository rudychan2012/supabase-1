import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Badge, Button, IconLoader, IconMonitor, IconServer, Modal } from 'ui'

import { Project } from 'types'
import { useStore } from 'hooks'
import ShimmerLine from 'components/ui/ShimmerLine'
import pingPostgrest from 'lib/pingPostgrest'

interface Props {
  project: Project
}

const ConnectingState: FC<Props> = ({ project }) => {
  const { app } = useStore()
  const checkProjectConnectionIntervalRef = useRef<number>()

  const [showHelperButton, setShowHelperButton] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Show helper button if still connecting after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHelperButton(true), 30000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!project.restUrl) return

    // Check project connection status every 4 seconds
    // pingPostgrest timeouts in 2s, wait for another 2s before checking again
    checkProjectConnectionIntervalRef.current = window.setInterval(testProjectConnection, 4000)
    return () => {
      clearInterval(checkProjectConnectionIntervalRef.current)
    }
  }, [project])

  const testProjectConnection = async () => {
    const result = await pingPostgrest(project.restUrl!, project.ref, {
      kpsVersion: project.kpsVersion,
    })
    if (result) {
      clearInterval(checkProjectConnectionIntervalRef.current)
      app.onProjectPostgrestStatusUpdated(project.id, 'ONLINE')
    }
  }

  return (
    <>
      <div className="mx-auto my-16 w-full max-w-7xl space-y-16">
        <div className="mx-6 space-y-16">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
            <h1 className="text-3xl">{project.name}</h1>
            <div>
              <Badge color="brand">
                <div className="flex items-center gap-2">
                  <IconLoader className="animate-spin" size={12} />
                  <span>正在连接应用</span>
                </div>
              </Badge>
            </div>
          </div>
          <div className="flex h-[500px] items-center justify-center rounded border border-scale-400 bg-scale-300 p-8">
            <div className="w-[420px] space-y-4">
              <div className="mx-auto flex max-w-[300px] items-center justify-center space-x-4 lg:space-x-8">
                <IconMonitor className="text-scale-1100" size={50} strokeWidth={1.5} />
                <ShimmerLine active />
                <IconServer className="text-scale-1100" size={50} strokeWidth={1.5} />
              </div>

              <div className="space-y-1">
                <p className="text-center">正在连接到 {project.name}</p>
                <p
                  className="cursor-pointer text-center text-sm text-scale-1100 opacity-60 transition hover:opacity-100"
                  // onClick={() => setShowModal(true)}
                >
                  这可能需要几分钟时间
                </p>
              </div>

              {/*<div className="flex flex-col items-center">*/}
              {/*  {showHelperButton && (*/}
              {/*    <Button type="default" onClick={() => setShowModal(true)}>*/}
              {/*      还在连接？*/}
              {/*    </Button>*/}
              {/*  )}*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        header={
          <div className="flex items-baseline gap-2">
            <h5 className="text-sm text-scale-1200">检查数据库的运行状况</h5>
          </div>
        }
        size="medium"
        hideFooter
        closable
      >
        <div className="py-4">
          <Modal.Content>
            <div className="space-y-4">
              <p className="text-sm text-scale-1200">
                您的项目可能面临资源限制，因此无法连接。您可以通过检查您的{' '}
                <span className="text-brand-1000">
                  <Link href={`/project/${project.ref}/settings/database`}>
                    <a>数据库的运行状况</a>
                  </Link>
                </span>{' '}
                或剩余的每日磁盘 IO 预算，通过{' '}
                <span className="text-brand-1000">
                  <Link href={`/project/${project.ref}/reports`}>
                    <a>定制的应用报告</a>
                  </Link>
                </span>
                。
              </p>
              <p className="text-sm text-scale-1200">
                如果您的项目面临资源限制，您可以{' '}
                <span className="text-brand-1000">
                  <Link href={`/project/${project.ref}/reports`}>
                    <a>升级</a>
                  </Link>
                </span>{' '}
                您的项目到Pro，以访问更大的计算容量。
              </p>
              <p className="text-sm text-scale-1200">
                但是，如果项目此后仍无法连接，则可以打开支持{' '}
                <span className="text-brand-1000">
                  <Link href={`/support/new?ref=${project.ref}`}>在这里</Link>
                </span>
                。
              </p>
            </div>
          </Modal.Content>
        </div>
      </Modal>
    </>
  )
}

export default observer(ConnectingState)
