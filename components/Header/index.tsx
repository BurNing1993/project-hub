import React from 'react'
import { Layout } from 'antd'
import ThemeSwitch from './ThemeSwitch'
import Logo from './Logo'
import styles from './style.module.css'

const { Header } = Layout

const AppHeader: React.FC = () => {
  return (
    <Header className={styles.header}>
      <Logo /> 
      <ThemeSwitch />
    </Header>
  )
}

export default AppHeader
