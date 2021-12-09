import { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { DraggableLocation } from 'react-beautiful-dnd'
import { useRouter } from 'next/router'
import { projectListState, projectContentState, projectState } from './atom'
import { projectContentMapState } from './selectors'
import {
    insertProject, insertProjectContent,
    selectProjectContentList, selectProjectList,
    bulkUpdateProjectContent, updateProject as updateDbProject, updateProjectContent,
    deleteProjectContent as deleteDbProjectContent, deleteProjectById
} from '../db'
import { IProject, ProjectContentStatus, ProjectContent, ProjectStatus, Action } from './types'


export function useProjectList() {
    const [status, setStatus] = useState<ProjectStatus>('open')
    const [loading, setLoading] = useState(false)
    const [projectList, setProjectList] = useRecoilState(projectListState)
    const addProject = async (project: IProject) => {
        const id = await insertProject(project)
        project.id = id as number
        setProjectList([project, ...projectList])
        return id
    }
    const getProjectList = useCallback(async (status: ProjectStatus = 'open') => {
        try {
            setLoading(true)
            const list = await selectProjectList(status)
            setProjectList(list)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }, [])

    const updateProjectStatus = async (id: number, newStatus: ProjectStatus) => {
        const index = projectList.findIndex(item => item.id === id)
        if (index !== -1) {
            await updateDbProject(id, { status: newStatus })
            await getProjectList(status)
        }
    }
    const updateProject = async (project: IProject) => {
        const index = projectList.findIndex(item => item.id === project.id!)
        if (index !== -1) {
            await updateDbProject(project.id!, { ...project })
            await getProjectList(status)
        }
    }

    const deleteProject = async (id: number) => {
        await deleteProjectById(id)
        await getProjectList(status)
    }

    useEffect(() => {
        getProjectList(status)
    }, [status, getProjectList])


    return {
        status,
        setStatus,
        loading,
        projectList,
        addProject,
        getProjectList,
        updateProjectStatus,
        updateProject,
        deleteProject
    }
}

export function useProjectContent() {
    const router = useRouter()
    const { pid } = router.query
    const [projectId, setProjectId] = useState(0)
    const [projectContentList, setProjectContentList] = useRecoilState(projectContentState)
    const setProject = useSetRecoilState(projectState)
    const projectContentMap = useRecoilValue(projectContentMapState)

    const confirmSaveProjectContent = async (projectContent: ProjectContent, action: Action) => {
        if (action === 'add') {
            const statusProjectContentList = projectContentMap.get(projectContent.status)
            let index = 0
            if (statusProjectContentList && statusProjectContentList.length > 0) {
                const indexList = statusProjectContentList.map(item => item.index)
                index = Math.max(...indexList) + 1
            }
            projectContent.index = index
            projectContent.updateAt = new Date()
            const id = await insertProjectContent(projectContent)
            projectContent.id = id as number
            setProjectContentList([projectContent, ...projectContentList])
        } else {
            projectContent.updateAt = new Date()
            await updateProjectContent(projectContent)
            const index = projectContentList.findIndex(item => projectContent.id != undefined && item.id === projectContent.id)
            if (index !== -1) {
                setProjectContentList(list => list.slice(0, index).concat(projectContent).concat(list.slice(index + 1)))
            }
        }
    }

    const getProjectContent = useCallback(async (pid: number) => {
        try {
            const data = await selectProjectContentList(pid)
            setProject(data.project)
            setProjectContentList(data.list)
        } catch (error) {
            console.error(error);
        }
    }, [])

    const onDarg = async (source: DraggableLocation, destination: DraggableLocation) => {
        const sourceId = source.droppableId as ProjectContentStatus
        const sourceIndex = source.index
        const destinationId = destination.droppableId as ProjectContentStatus
        const destinationIndex = destination.index
        if (sourceId === destinationId) {
            const sourceList = projectContentMap.get(sourceId)!
            if (sourceIndex != undefined && destinationIndex != undefined && sourceIndex !== destinationIndex) { // 交换数据index
                const sourceData = sourceList[sourceIndex]
                const destinationData = sourceList[destinationIndex]
                let newSourceIndex = destinationData.index
                let newDestinationIndex = sourceData.index
                const newSourceData = {
                    ...sourceData,
                    index: newSourceIndex
                }
                const newDestinationData = {
                    ...destinationData,
                    index: newDestinationIndex
                }
                updateStoreProjectContent(newSourceData)
                updateStoreProjectContent(newDestinationData)
                await bulkUpdateProjectContent([newSourceData, newDestinationData])
            }
        } else {
            const sourceList = projectContentMap.get(sourceId)!
            const destinationList = projectContentMap.get(destinationId)!
            console.log(sourceList, destinationList);
            if (sourceIndex != undefined && destinationIndex != undefined) {
                const sourceData = sourceList[sourceIndex]
                const destinationDataList = destinationList.slice(destinationIndex)
                    .map((item) => ({ ...item, index: item.index + 1 }))
                const sourceDataList = sourceList.slice(sourceIndex)
                    .map((item) => ({ ...item, index: item.index - 1 }))
                const newSourceData = {
                    ...sourceData,
                    status: destinationId,
                    index: destinationIndex
                }
                const dataList = sourceDataList.concat(newSourceData).concat(destinationDataList)
                dataList.forEach(item => {
                    updateStoreProjectContent(item)
                })
                await bulkUpdateProjectContent(dataList)
            }
        }
    }

    const updateStoreProjectContent = async (newData: ProjectContent) => {
        const index = projectContentList.findIndex(item => item.id === newData.id)
        if (index !== -1) {
            setProjectContentList(list => list.slice(0, index).concat(newData).concat(list.slice(index + 1)))
        }
    }

    const deleteProjectContent = async (projectContent: ProjectContent) => {
        await deleteDbProjectContent(projectContent)
        const index = projectContentList.findIndex(item => item.id === projectContent.id)
        if (index !== -1) {
            setProjectContentList(list => list.slice(0, index).concat(list.slice(index + 1)))
        }
    }

    useEffect(() => {
        const done = projectContentMap.get('done')?.length || 0
        const todo = projectContentMap.get('todo')?.length || 0
        const inProgress = projectContentMap.get('inProgress')?.length || 0
        const total = done + todo + inProgress
        let percent = 0
        let success = 0
        if (total > 0) {
            percent = Math.round(100 * (done + inProgress) / total)
            success = Math.round(100 * (done) / total)
        }
        let progress: Record<string, number> = {
            done,
            todo,
            inProgress,
            percent,
            success,
        }
        if (projectId) {
            updateDbProject(projectId, { progress }).catch(err => {
                console.error(err);
            })
        }
    }, [projectContentMap, pid])


    useEffect(() => {
        if (projectId) {
            getProjectContent(projectId).catch(err => {
                console.error(err);
            })
        }
    }, [projectId, getProjectContent])
    
    useEffect(() => {
        if (pid) {
            let projectId = Number(pid)
            if (!Number.isNaN(projectId)) {
                setProjectId(projectId)
            }
        }
    }, [pid])

    return {
        pid: projectId,
        confirmSaveProjectContent,
        getProjectContent,
        deleteProjectContent,
        onDarg
    }
}
