import { onBeforeUnmount, onMounted, ref } from "vue"
import type { Direction } from "../types/2048"

export const useKey = (handleMove: (direction: Direction) => void) => {
    const activeDir = ref<Direction | null>(null)

    const keyMap: Record<string, Direction> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right'
    }

    const handleKeydown = (e: KeyboardEvent): void => {
        if (e.ctrlKey || e.metaKey) return
        if (e.repeat) return
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

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown)
        window.addEventListener('keyup', handleKeyup)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown)
        window.removeEventListener('keyup', handleKeyup)
    })

    return {
        activeDir
    }
}