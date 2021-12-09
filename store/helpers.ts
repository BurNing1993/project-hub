import { Theme } from "./types";

const LOCAL_THEME = 'local_theme'
export function getTheme(): Theme {
    const localTheme = localStorage.getItem(LOCAL_THEME)
    if (localTheme) {
        return localTheme as Theme
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
    }
    return 'light'
}

export function setTheme(theme: Theme) {
    localStorage.setItem(LOCAL_THEME, theme)
    if (theme==='dark') {
        document.documentElement.classList.add('dark')
    }else{
        document.documentElement.classList.remove('dark')
    }
}