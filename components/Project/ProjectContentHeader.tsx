import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Space, Tag, Typography } from 'antd'
import { projectListState } from '../../store/atom'
import { IProject } from '../../store/types'
import { getProject } from '../../db'

const ProjectContentHeader: React.FC = () => {
  const router = useRouter()
  const { pid } = router.query
  const [project, setProject] = useState<IProject | undefined>(undefined)
  const projectList = useRecoilValue(projectListState)
  useEffect(() => {
    let projectId = Number(pid)
    if (pid && !Number.isNaN(projectId)) {
      let data = projectList.find((item) => item.id == projectId)
      if (data) {
        setProject(data)
      } else {
        getProject(projectId)
          .then((result) => setProject(result))
          .catch((err) => {
            console.error(err)
          })
      }
    }
  }, [pid, projectList, setProject])

  return project ? (
    <Space>
      <Typography.Text strong style={{ fontSize: '20px' }}>
        {project.name}
      </Typography.Text>
      {project.status === 'closed' && <Tag color="red">Closed</Tag>}
    </Space>
  ) : (
    <Typography.Text>UNKNOWN</Typography.Text>
  )
}

export default ProjectContentHeader
