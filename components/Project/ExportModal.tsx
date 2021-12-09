import React, { useEffect, useState } from 'react'
import { Modal, Table, Tag, message } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IProject, ProjectStatus } from '../../store/types'
import { selectAllProjectList, selectProjectContentListByIds } from '../../db'
import { exportJsonFile } from '../../utils'

dayjs.extend(relativeTime)

interface Props {
  visible: boolean
  close: () => void
}

const columns: ColumnsType<IProject> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Desc',
    dataIndex: 'desc',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status: ProjectStatus) => (
      <Tag color={status === 'closed' ? 'red' : 'blue'}>{status}</Tag>
    ),
  },
  {
    title: 'Updated',
    dataIndex: 'updateAt',
    render: (date: Date) => dayjs(date).fromNow(),
  },
]

const ExportModal: React.FC<Props> = ({ visible, close }) => {
  const [projectList, setProjectList] = useState<
    (IProject & { key: number })[]
  >([])
  const [selected, setSelected] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  const handleOk = async () => {
    try {
      if (selected.length > 0) {
        setLoading(true)
        const projectContents = await selectProjectContentListByIds(
          selected as number[]
        )
        console.log(projectContents, 'projectContents')
        const data = projectList
          .filter((p) => selected.includes(p.key))
          .map((p) => ({ ...p, key: undefined }))
        exportJsonFile({
          projectList: data,
          projectContentList: projectContents.map((p) => ({
            ...p,
            id: undefined,
          })),
        })
        message.success('Export success!')
        close()
      } else {
        message.warning('Please select some projects!')
        return
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (visible) {
      selectAllProjectList().then((list) => {
        setProjectList(list.map((p) => ({ ...p, key: p.id! })))
      })
    }
  }, [visible])
  return (
    <Modal
      title="Export Project"
      visible={visible}
      onOk={handleOk}
      onCancel={close}
      confirmLoading={loading}
    >
      <Table
        rowSelection={{
          selectedRowKeys: selected,
          onChange: (selectedRowKeys) => setSelected(selectedRowKeys),
        }}
        columns={columns}
        dataSource={projectList}
        pagination={false}
      />
    </Modal>
  )
}

export default ExportModal
