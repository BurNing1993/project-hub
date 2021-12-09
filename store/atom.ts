import { atom } from "recoil";
import { setTheme } from "./helpers";
import { IProject, ProjectContent, Theme } from "./types";

export const themeState = atom<Theme>({
    key: 'themeState',
    default: 'light',
    effects_UNSTABLE: [
        ({ onSet }) => {
            onSet((newValue) => setTheme(newValue))
        }
    ]
})

export const projectListState = atom<IProject[]>({
    key: 'projectList',
    default: []
})

export const projectContentState = atom<ProjectContent[]>({
    key: 'projectContentState',
    default: []
})

// current project
export const projectState = atom<IProject|undefined>({
    key: 'projectState',
    default: undefined
})