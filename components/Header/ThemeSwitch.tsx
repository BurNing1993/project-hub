import React, { useEffect } from 'react'
import { Switch, version } from 'antd'
import Head from 'next/head'
import { useRecoilState } from 'recoil'
import { themeState } from '../../store/atom'
import { getTheme } from '../../store/helpers'

const ThemeSwitch: React.FC = () => {
  const [theme, setTheme] = useRecoilState(themeState)
  useEffect(() => {
    setTheme(getTheme())
  }, [setTheme])
  return (
    <>
      <Head>
        {theme === 'dark' && (
          <link
            rel="stylesheet"
            href={`https://cdn.jsdelivr.net/npm/antd@${version}/dist/antd.dark.min.css`}
          />
        )}
      </Head>
      <Switch
        checked={theme==='light'}
        checkedChildren="🌞"
        unCheckedChildren="🌙"
        onChange={(t) => setTheme(t ? 'light' : 'dark')}
      />
    </>
  )
}

export default ThemeSwitch
