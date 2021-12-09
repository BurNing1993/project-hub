import { useState } from "react"

export type Action = 'add' | 'update'

export interface Props<T> {
    visible: boolean
    action: Action
    content?: Partial<T>
    onCancel: () => void
}

export default function useModalProps<T>() {
    const [visible, setVisible] = useState(false)
    const [action, setAction] = useState<Action>('add')
    const [content, setContent] = useState<Partial<T> | undefined>(undefined)

    const onSave = (action: Action) => (content?: Partial<T>) => {
        setAction(action)
        setContent(content)
        setVisible(true)
    }

    return {
        modalProps: {
            visible,
            action,
            content,
            onCancel: () => setVisible(false)
        },
        onAdd: onSave('add'),
        onEdit: onSave('update'),
    }
}