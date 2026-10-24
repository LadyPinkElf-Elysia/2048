import { onBeforeUnmount, onMounted, ref } from "vue"
import type { Direction, ShortcutMap } from "../types/2048"

export const useKey = (handleMove: (direction: Direction) => void,shortcuts: ShortcutMap={}) => {
    const activeDir = ref<Direction | null>(null)

    const keyMap: Record<string, Direction> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right'
    }

    const getComboKey = (e: KeyboardEvent): string => {
        const keys: string[] = []
        if (e.ctrlKey) keys.push('ctrl')
        if (e.metaKey) keys.push('meta')
        if (e.altKey) keys.push('alt')
        if (e.shiftKey) keys.push('shift')
        
        const mainKey = e.key.toLowerCase()
        // 排除纯修饰键单独按下的情况，避免生成 "ctrl+control" 这种鬼东西
        if (!['control', 'meta', 'alt', 'shift'].includes(mainKey)) {
            keys.push(mainKey)
        }
        
        return keys.join('+') // 例如：Ctrl+Z -> "ctrl+z"，Shift+ArrowUp -> "shift+arrowup"
    }

    const handleKeydown = (e: KeyboardEvent): void => {
        if (e.repeat) return
        const combo = getComboKey(e)

        // 🌟 1. 优先匹配快捷键字典
        if (shortcuts[combo]) {
            e.preventDefault()
            shortcuts[combo](e)
            return
        }

        // 🌟 2. 只要带有功能修饰键，且没被上面的 shortcuts 拦截，就绝不作为移动指令
        if (e.ctrlKey || e.metaKey || e.altKey) return 
        
        // 🌟 4. 常规方向键处理
        const dir = keyMap[e.key]
        if (dir) {
            e.preventDefault()
            activeDir.value = dir
            handleMove(dir)
        }
    }

    const handleKeyup = (e: KeyboardEvent): void => {
        const dir = keyMap[e.key]
        if (dir) {
            activeDir.value = null
        }
    }

    const handleBlur = () => {
        activeDir.value = null
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown)
        window.addEventListener('keyup', handleKeyup)
        window.addEventListener('blur', handleBlur)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown)
        window.removeEventListener('keyup', handleKeyup)
        window.removeEventListener('blur', handleBlur)
    })

    return {
        activeDir
    }
}