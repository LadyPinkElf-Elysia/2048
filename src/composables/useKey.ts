import { onBeforeUnmount, onMounted } from "vue"
import type { Direction, EventListenerItem, ShortcutMap, TargetType } from "@/types/2048"

export const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)

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
        if (!['control', 'meta', 'alt', 'shift'].includes(mainKey)) {
            keys.push(mainKey)
        }

        return keys.join('+')
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

        if (kbEvent.ctrlKey || kbEvent.metaKey || kbEvent.altKey) return

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