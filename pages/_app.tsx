import type { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'
import { version, Layout } from 'antd'
import { RecoilRoot } from 'recoil'
import Header from '../components/Header'
import '../styles/globals.css'

const { Content } = Layout

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Head>
        <title>ProjectHub</title>
        <meta name="description" content="PM app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href={`https://cdn.jsdelivr.net/npm/antd@${version}/dist/antd.min.css`}
          // href={`https://cdn.jsdelivr.net/npm/antd@${version}/dist/antd.dark.min.css`}
        />
      </Head>
      <div>
        <Header />
        <Content className="main">
          <Component {...pageProps} />
        </Content>
      </div>
    </RecoilRoot>
  )
}

export default MyApp
