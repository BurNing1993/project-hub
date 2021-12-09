import React, { useEffect } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd'
import { useRecoilValue } from 'recoil'
import dynamic from 'next/dynamic'
import {
  Card,
  Row,
  Col,
  Button,
  Dropdown,
  Menu,
  Modal,
  Typography,
  Space,
} from 'antd'
import {
  PlusOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  ProfileOutlined,
  CarryOutOutlined,
  HighlightOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import { CardSize } from 'antd/lib/card'
import useSize from '../../hooks/useSize'
import { projectContentMapState } from '../../store/selectors'
import { useProjectContent } from '../../store/hooks'
import { ProjectContent } from '../../store/types'
import ProjectContentHeader from '../../components/Project/ProjectContentHeader'
import useModalProps from '../../hooks/useModalProps'

const ProjectContentModal = dynamic(import('../../components/Project/ProjectContentModal'),{ssr:false})
const DROP_TYPE = 'drop_type'

const Project: React.FC = () => {
  const size = useSize()
  const { modalProps, onAdd, onEdit } = useModalProps<ProjectContent>()
  const projectContentMap = useRecoilValue(projectContentMapState)
  const { pid, deleteProjectContent, onDarg } =
    useProjectContent()


  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { source, destination } = result
    if (destination) {
      onDarg(source, destination)
    }
  }

  const onDelete = (content: ProjectContent) => {
    Modal.confirm({
      title: 'Delete',
      icon: <ExclamationCircleOutlined />,
      content: `Confirm delete ID.${content.id} item?`,
      onOk: () => deleteProjectContent(content),
    })
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Card title={<ProjectContentHeader />} size={size as CardSize}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            {Array.from(projectContentMap.entries()).map(
              ([key, contentList]) => (
                <Col key={key} xs={24} sm={8}>
                  <Card
                    title={
                      <Space>
                        {key === 'todo' ? (
                          <OrderedListOutlined />
                        ) : key === 'inProgress' ? (
                          <HighlightOutlined />
                        ) : (
                          <CarryOutOutlined />
                        )}
                        <Typography.Text>{key}</Typography.Text>
                        <Typography.Text>
                          ({contentList.length})
                        </Typography.Text>
                      </Space>
                    }
                    size="small"
                    extra={
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => onAdd({ status: key, pid })}
                      ></Button>
                    }
                  >
                    <Droppable key={key} droppableId={key} type={DROP_TYPE}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={{
                            backgroundColor: snapshot.isDraggingOver
                              ? 'grey'
                              : '',
                          }}
                          {...provided.droppableProps}
                          className="droppable-container"
                        >
                          {contentList.map((content, index) => (
                            <Draggable
                              key={content.id}
                              draggableId={'draggable-' + content.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="draggable-container"
                                >
                                  <Card
                                    type="inner"
                                    size="small"
                                    title={
                                      <span>
                                        <ProfileOutlined />
                                        <span style={{ marginLeft: '4px' }}>
                                          {content.title}
                                        </span>
                                      </span>
                                    }
                                    extra={
                                      <Dropdown
                                        overlay={
                                          <Menu>
                                            <Menu.Item
                                              key="edit"
                                              onClick={() => onEdit(content)}
                                            >
                                              Edit
                                            </Menu.Item>
                                            <Menu.Item
                                              key="delete"
                                              onClick={() => onDelete(content)}
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
                                    }
                                  >
                                    <Card.Meta
                                      description={
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: content.content,
                                          }}
                                        ></div>
                                      }
                                    />
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Card>
                </Col>
              )
            )}
          </Row>
        </Card>
      </DragDropContext>
      <ProjectContentModal {...modalProps} />
    </>
  )
}

export default Project
