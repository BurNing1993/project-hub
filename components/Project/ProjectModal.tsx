import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Modal } from 'antd'
import { useProjectList } from '../../store/hooks'
import { IProject } from '../../store/types'
import { Props } from '../../hooks/useModalProps'

const Header: React.FC<Props<IProject>> = ({
  visible,
  close,
  action,
  content,
}) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const { addProject, updateProject } = useProjectList()
  const handleOk = () => {
    form.submit()
  }
  const onFinish = async (values: any) => {
    const projectData: IProject = {
      progress: { todo: 0, inProgress: 0, done: 0 },
      ...content,
      ...values,
      updateAt: new Date(),
    }
    if (action === 'add') {
      projectData.status = 'open'
      const id = await addProject(projectData)
      close()
      router.push(`/project/${id}`)
    } else {
      updateProject(projectData)
      close()
    }
  }

  useEffect(() => {
    if (action === 'update') {
      form.setFieldsValue(content)
    } else {
      form.resetFields()
    }
  }, [content, action, form])

  return (
    <Modal
      title={`${action === 'add' ? 'New' : 'Edit'} Project`}
      visible={visible}
      onOk={handleOk}
      onCancel={close}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="name"
          name="name"
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="desc" name="desc">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Header
