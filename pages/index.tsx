import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import {
  EllipsisOutlined,
  FieldTimeOutlined,
  ProjectOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import {
  List,
  Typography,
  Skeleton,
  Row,
  Col,
  Space,
  Dropdown,
  Menu,
  Button,
  Tag,
  Card,
  Modal,
  Progress,
  Tooltip,
  Upload,
} from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { RcFile } from 'antd/lib/upload'
import useSize from '../hooks/useSize'
import { useProjectList } from '../store/hooks'
import { IProject, ProjectStatus } from '../store/types'
import ProjectModal from '../components/Project/ProjectModal'
import ExportModal from '../components/Project/ExportModal'
import useModalProps from '../hooks/useModalProps'

dayjs.extend(relativeTime)

const projectStatus: { key: ProjectStatus; tab: React.ReactNode }[] = [
  {
    key: 'open',
    tab: (
      <Typography.Text>
        <ProjectOutlined />
        Open
      </Typography.Text>
    ),
  },
  {
    key: 'closed',
    tab: (
      <Typography.Text>
        <HistoryOutlined />
        Closed
      </Typography.Text>
    ),
  },
]

const Home: NextPage = () => {
  const size = useSize()
  const [visible, setVisible] = useState(false)
  const [file, setFile] = useState<RcFile | null>(null)
  const { modalProps, onAdd, onEdit } = useModalProps<IProject>()
  const {
    status,
    setStatus,
    projectList,
    loading,
    updateProjectStatus,
    deleteProject,
    importProject,
  } = useProjectList()

  useEffect(() => {
    if (file) {
      importProject(file)
    }
  }, [file])

  const onUpdateProjectStatus = async (project: IProject) => {
    await updateProjectStatus(
      project.id!,
      project.status === 'open' ? 'closed' : 'open'
    )
  }

  const onDelete = (project: IProject) => {
    Modal.confirm({
      title: 'Delete',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Space direction="vertical">
          <Typography.Text>{`Confirm delete project ${project.name}?`}</Typography.Text>
          <Typography.Text strong type="danger">
            This operation is irreversible!
          </Typography.Text>
        </Space>
      ),
      onOk: () => deleteProject(project.id!),
    })
  }

  return (
    <>
      <Row justify="center">
        <Col xs={24} sm={18} md={16} lg={12} xl={8}>
          <Card
            className="project-list"
            size="small"
            tabBarExtraContent={
              <Dropdown.Button
                type="primary"
                onClick={() => onAdd()}
                overlay={
                  <Menu>
                    <Menu.Item
                      key="export"
                      icon={<ExportOutlined />}
                      onClick={() => setVisible(true)}
                    >
                      Export
                    </Menu.Item>
                    <Upload
                      beforeUpload={(file) => {
                        setFile(file)
                        return false
                      }}
                      showUploadList={false}
                      accept="application/json"
                    >
                      <Menu.Item key="import" icon={<ImportOutlined />}>
                        Import
                      </Menu.Item>
                    </Upload>
                  </Menu>
                }
              >
                New Project
              </Dropdown.Button>
            }
            tabList={projectStatus}
            activeTabKey={status}
            onTabChange={(key) => {
              setStatus(key as ProjectStatus)
            }}
          >
            {loading ? (
              <Skeleton active />
            ) : (
              <List
                size={size}
                dataSource={projectList}
                renderItem={(item) => (
                  <List.Item>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div className="project-item">
                        <Link href={'/project/' + item.id}>
                          <a title="go project" className="project-link">
                            <Typography.Text style={{ fontSize: '18px' }}>
                              <ScheduleOutlined
                                style={{ marginRight: '4px' }}
                              />
                              {item.name}
                              {item.status === 'closed' && (
                                <Tag color="red" style={{ marginLeft: '4px' }}>
                                  Closed
                                </Tag>
                              )}
                            </Typography.Text>
                            <Typography.Text>{item.desc}</Typography.Text>
                          </a>
                        </Link>
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item
                                key="edit"
                                onClick={() => onEdit(item)}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item
                                key="close"
                                onClick={() => onUpdateProjectStatus(item)}
                              >
                                {item.status === 'open' ? 'Close' : 'Reopen'}
                              </Menu.Item>
                              <Menu.Item
                                key="delete"
                                onClick={() => onDelete(item)}
                              >
                                <Typography.Text type="danger">
                                  Delete
                                </Typography.Text>
                              </Menu.Item>
                            </Menu>
                          }
                        >
                          <Button
                            type="text"
                            icon={<EllipsisOutlined />}
                          ></Button>
                        </Dropdown>
                      </div>
                      <Tooltip
                        title={
                          item.progress &&
                          `${item.progress.done} done / ${item.progress.inProgress} in progress / ${item.progress.todo} to do`
                        }
                      >
                        <Progress
                          percent={item.progress ? item.progress.percent : 0}
                          success={{
                            percent: item.progress ? item.progress.success : 0,
                          }}
                        />
                      </Tooltip>
                      <Typography.Text type="secondary">
                        <FieldTimeOutlined style={{ marginRight: '5px' }} />
                        Updated {dayjs(item.updateAt).fromNow()}
                      </Typography.Text>
                    </Space>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
      <ProjectModal {...modalProps} />
      <ExportModal visible={visible} close={() => setVisible(false)} />
    </>
  )
}

export default Home
