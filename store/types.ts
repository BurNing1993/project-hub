export type Theme = 'light' | 'dark'

export type ProjectStatus = 'open' | 'closed'
export type Action = 'add' | 'update'
export type ProjectContentStatus = 'todo' | 'inProgress' | 'done'

export interface IProject {
    id?: number,
    name: string,
    desc: string,
    status: ProjectStatus,
    progress: Record<string, number>,
    updateAt: Date,
}
export interface ProjectContent {
    id?: number,
    pid: number,
    title: string,
    content: string,
    index: number,
    status: ProjectContentStatus,
    updateAt: Date,
}
