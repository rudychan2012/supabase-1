import Head from 'next/head'
import { useRouter } from 'next/router'

const Favicons = () => {
  const { basePath } = useRouter()
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${basePath}/favicon/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/favicon/logo.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/favicon/logo.png`}
      />
      <link rel="manifest" href={`${basePath}/favicon/site.webmanifest`} />
      {/* <link rel="mask-icon" href={`${basePath}/favicon/safari-pinned-tab.svg`} color="#333333" /> */}
      <link rel="shortcut icon" href={`${basePath}/favicon/logo.png`} />
      <meta name="msapplication-TileColor" content="#1E1E1E" />
      <meta name="msapplication-config" content={`${basePath}/favicon/browserconfig.xml`} />
      <meta name="theme-color" content="#1E1E1E" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <link rel="icon" type="image/png" href={`${basePath}/favicon/logo.png`} />
      <link rel="apple-touch-icon" href={`${basePath}/favicon/logo.png`} />
    </Head>
  )
}

export default Favicons
