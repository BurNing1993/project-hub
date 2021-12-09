import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LogoImg from '../../public/logo.png'
import styles from './style.module.css'

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <a className={styles.logo}>
        <Image src={LogoImg} alt="logo" />
      </a>
    </Link>
  )
}

export default Logo
