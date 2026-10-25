import { ref, type Ref } from 'vue'
import { useKey } from './useKey'
import { useSwipe } from './useSwipe'
import type { Direction, GameControlActions, GameControlOptions, TargetType } from '../types/2048'

export const useGameControl = (
    boardRef: TargetType,        // 目标1：棋盘
    keyboardRef: TargetType,     // 目标2：键盘
    actions: GameControlActions, // 动作字典
    options: GameControlOptions  // 配置项
) => {
    const { move, reset, undo, redo } = actions
    const { canMove, onMoveSuccess, highlightDuration = 50, resetDebounce = 100, swipeThreshold = 30 } = options

    const activeDir = ref<Direction | null>(null)
    let isResetting = false

    const handleMove = (dir: Direction) => {
        activeDir.value = dir
        const moved = move(dir)

        if (moved && onMoveSuccess) {
            onMoveSuccess()
        }

        setTimeout(() => {
            if (activeDir.value === dir) activeDir.value = null
        }, highlightDuration)
    }

    const handleReset = () => {
        if (!canMove.value || isResetting) return
        isResetting = true
        reset()
        setTimeout(() => {
            isResetting = false
        }, resetDebounce)
    }

    useKey(handleMove, keyboardRef, {
        'ctrl+z': () => { if (canMove.value) undo() },
        'meta+z': () => { if (canMove.value) undo() },
        'ctrl+y': () => { if (canMove.value) redo() },
        'meta+y': () => { if (canMove.value) redo() },
        'r': handleReset
    })

    useSwipe(handleMove, boardRef as Ref<HTMLElement>, { threshold: swipeThreshold })

    return { activeDir, handleMove, handleReset }
}