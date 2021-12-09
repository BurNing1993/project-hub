import { Form, Input, Modal, Select } from 'antd'
import React, { useEffect } from 'react'
import { useProjectContent } from '../../store/hooks'
import { ProjectContent, ProjectContentStatus } from '../../store/types'
import { Props } from '../../hooks/useModalProps'
import BraftEditor, { ControlType } from 'braft-editor'
import 'braft-editor/dist/index.css'

const controls: ControlType[] = [
  'undo',
  'redo',
  'separator',
  'headings',
  'text-align',
  'bold',
  'italic',
  'underline',
  'text-color',
  'separator',
  'list-ol',
  'list-ul',
  'emoji',
  'separator',
  'link',
  'clear',
  'fullscreen',
]

const projectContentStatusList: {
  label: string
  value: ProjectContentStatus
}[] = [
  {
    label: 'todo',
    value: 'todo',
  },
  {
    label: 'inProgress',
    value: 'inProgress',
  },
  {
    label: 'done',
    value: 'done',
  },
]

const AddProjectContentModal: React.FC<Props<ProjectContent>> = ({
  visible,
  onCancel,
  content,
  action,
}) => {
  const [form] = Form.useForm()
  const { confirmSaveProjectContent } = useProjectContent()
  useEffect(() => {
    if (action === 'update') {
      form.setFieldsValue({
        ...content,
        content: BraftEditor.createEditorState(content?.content)
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        ...content,
        content: BraftEditor.createEditorState(content?.content),
      })
    }
  }, [content, action, form])

  const handleOk = () => {
    form.submit()
  }
  const onFinish = async (values: ProjectContent) => {
    const data = { ...content, ...values, content: (values.content as any).toHTML() }
    await confirmSaveProjectContent(data, action)
    onCancel()
  }
  return (
    <Modal
      title={`${action === 'add' ? 'Add' : 'Edit'} ProjectContent`}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width="1000px"
    >
      <Form
        form={form}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="title"
          name="title"
          rules={[{ required: true, message: 'Please input title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="status" name="status">
          <Select>
            {projectContentStatusList.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="content" name="content">
          <BraftEditor className="editor" controls={controls} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddProjectContentModal
