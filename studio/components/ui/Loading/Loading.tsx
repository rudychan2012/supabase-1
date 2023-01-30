import React, { FC } from 'react'
import Lottie from 'lottie-react'
import loadingAnim from './Loading.anim.json'

interface Props {}

const Connecting: FC<Props> = () => (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <div className="w-32">
      {/*<Lottie loop={true} autoplay={true} animationData={loadingAnim} />*/}
        <img className="w-full h-hull" src="/img/loading.svg" alt=""/>
    </div>
  </div>
)

export default Connecting
