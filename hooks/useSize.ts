import { Grid } from 'antd'
import { ListSize } from 'antd/lib/list'
import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

export default function useSize() {
    const screens = useBreakpoint()
    const [size, setSize] = useState<ListSize>('default')
    useEffect(() => {
        const breakpoint = Object.entries(screens)
            .filter((screen) => screen[1])
            .map((screen) => screen[0])
        if (breakpoint.includes('xs')) {
            setSize('small')
        } else {
            setSize('default')
        }
    }, [screens])
    return size
}