import Dexie, { Table } from 'dexie';
import { IProject, ProjectContent, ProjectStatus } from '../store/types'

class DataBase extends Dexie {
    projects!: Table<IProject>;
    projectContents!: Table<ProjectContent>;

    constructor() {
        super('DataBase');
        this.version(2).stores({
            projects: '++id, name, desc, status ,progress ,updateAt',
            projectContents: '++id, pid, title, content, status ,index , updateAt',
        });
    }
}

const db = new DataBase();

// 项目
export function insertProject(project: IProject) {
    return db.projects.add(project)
}

export function selectAllProjectList() {
    return db.projects.reverse().sortBy('updateAt')
}

export function selectProjectList(status: ProjectStatus = 'open') {
    // .orderBy('updateAt').reverse()
    return db.projects.where('status').equals(status).reverse().sortBy('updateAt')
}

export function updateProjectUpdateTime(id: number) {
    return db.projects.update(id, { updateAt: new Date() })
}

export function updateProject(id: number, project: Partial<IProject>) {
    return db.projects.update(id, { ...project, updateAt: new Date() })
}

export function getProject(id: number) {
    return db.projects.get(id)
}

export function deleteProjectById(id: number) {
    return db.transaction('rw', db.projects, db.projectContents, async () => {
        await db.projects.delete(id)
        const contents = await db.projectContents.where('pid').equals(id).toArray()
        await db.projectContents.bulkDelete(contents.map(c => c.id!))
    })
}

// 详情列表
export async function insertProjectContent(projectContent: ProjectContent) {
    return db.transaction('rw', db.projects, db.projectContents, async () => {
        const id = await db.projectContents.add(projectContent)
        await updateProjectUpdateTime(projectContent.pid)
        return id
    })
}

export function selectProjectContentList(pid: number) {
    return db.transaction('rw', db.projects, db.projectContents, async () => {
        const project = await db.projects.get(pid)
        if (project) {
            const list = await db.projectContents.where('pid').equals(pid).reverse().sortBy('index')
            return {
                project,
                list,
            }
        } else {
            throw 'No Such Project!'
        }
    })
}

export function selectProjectContentListByIds(projectIds: number[]) {
    return db.projectContents.where('pid').anyOf(projectIds).toArray()
}

export async function bulkUpdateProjectContent(list: ProjectContent[]) {
    try {
        if (list.length > 0) {
            await db.projectContents.bulkPut(list)
            const item = list[0]
            await updateProjectUpdateTime(item.pid)
        }
    } catch (error) {
        console.error(error);
    }
}

export async function updateProjectContent(projectContent: ProjectContent) {
    try {
        await db.projectContents.put(projectContent)
        await updateProjectUpdateTime(projectContent.pid)
    } catch (error) {
        console.error(error);
    }
}


export async function deleteProjectContent(projectContent: ProjectContent) {
    try {
        await db.projectContents.delete(projectContent.id!)
        await updateProjectUpdateTime(projectContent.pid)
    } catch (error) {
        console.error(error);
    }
}