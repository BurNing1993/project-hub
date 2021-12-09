import React from 'react'
import { Typography } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import LogoImg from '../../public/logo.png'
import styles from './style.module.css'

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <a className={styles.logo}>
        <Image src={LogoImg} alt="logo" className={styles.logoImg} />
        <Typography.Text strong style={{ fontSize: '18px', marginLeft: '4px' }}>
          ProjectHub
        </Typography.Text>
      </a>
    </Link>
  )
}

export default Logo
