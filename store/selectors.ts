import { selector } from "recoil";
import { projectContentState } from "./atom";
import { ProjectContent, ProjectContentStatus } from "./types";

export const projectContentMapState = selector<Map<ProjectContentStatus, ProjectContent[]>>({
    key: 'projectContentStatusState',
    get: ({ get }) => {
        const projectContentMap = new Map<ProjectContentStatus, ProjectContent[]>()
        const list = get(projectContentState)
        const statusList: ProjectContentStatus[] = ['todo', 'inProgress', 'done']
        statusList.forEach(status => {
            projectContentMap.set(status, list.filter(item => item.status === status).sort((a, b) => a.index - b.index))
        })
        return projectContentMap
    }
})

// export const currentProjectState = selector<IProject | undefined>({
//     key: 'currentProjectState',
//     get: async ({ get }) => {
//         const list = get(projectListState)
//         const currentProjectId = get(currentProjectIdState)
//         let data = list.find(item => item.id === currentProjectId)
//         if (!data) {
//             const data = await getProject(currentProjectId)
//         }
//         return data
//     }
// })