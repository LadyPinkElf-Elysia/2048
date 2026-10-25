import { onBeforeUnmount, onMounted } from "vue"
import type { Direction, EventListenerItem, ShortcutMap, TargetType } from "../types/2048"

export const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)

// 🌟 格式化快捷键文本（自动把 'ctrl' 替换为 'Cmd'，把 'alt' 替换为 'Option' 等）
export const formatShortcut = (shortcut: string): string => {
    if (!shortcut) return ''
    if (isMac) {
        return shortcut
            .replace(/ctrl/gi, 'Cmd')
            .replace(/alt/gi, 'Option')
            .replace(/shift/gi, 'Shift')
    }
    return shortcut
        .replace(/ctrl/gi, 'Ctrl')
        .replace(/alt/gi, 'Alt')
        .replace(/shift/gi, 'Shift')
}

export const useKey = (handleMove: (direction: Direction) => void, target: TargetType, shortcuts: ShortcutMap = {}) => {
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

    const handleKeydown: EventListener = (e): void => {
        const kbEvent = e as KeyboardEvent
        const target = kbEvent.target as HTMLElement
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable) return

        if (kbEvent.repeat) return

        const combo = getComboKey(kbEvent)

        if (shortcuts[combo]) {
            e.preventDefault()
            shortcuts[combo]()
            return
        }

        // 🌟 2. 只要带有功能修饰键，且没被上面的 shortcuts 拦截，就绝不作为移动指令
        if (kbEvent.ctrlKey || kbEvent.metaKey || kbEvent.altKey) return

        // 🌟 4. 常规方向键处理
        const dir = keyMap[kbEvent.key]
        if (dir) {
            e.preventDefault()
            handleMove(dir)
        }
    }

    const listeners: EventListenerItem[] = [
        { type: 'keydown', handler: handleKeydown },
    ]

    onMounted(() => {
        const el = target.value as HTMLElement
        if (!el) return
        listeners.forEach((item) => {
            el.addEventListener(item.type, item.handler)
        })
    })

    onBeforeUnmount(() => {
        const el = target.value as HTMLElement 
        if (!el) return
        listeners.forEach((item) => {
            el.removeEventListener(item.type, item.handler)
        })
    })
}