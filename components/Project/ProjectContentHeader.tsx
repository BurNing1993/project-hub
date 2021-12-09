import React from 'react'
import { useRecoilValue } from 'recoil'
import { Space, Tag, Typography } from 'antd'
import { projectState } from '../../store/atom'
import Head from 'next/head'

const ProjectContentHeader: React.FC = () => {
  const project = useRecoilValue(projectState)
  return project ? (
    <>
      <Head>
        <title>{project.name} - ProjectHub</title>
      </Head>
      <Space>
        <Typography.Text strong style={{ fontSize: '20px' }}>
          {project.name}
        </Typography.Text>
        {project.status === 'closed' && <Tag color="red">Closed</Tag>}
      </Space>
    </>
  ) : (
    <Typography.Text>UNKNOWN</Typography.Text>
  )
}

export default ProjectContentHeader
