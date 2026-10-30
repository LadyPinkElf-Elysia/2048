import type { DIRECTION } from "@/constents/2048"
import type { Ref } from "vue"

export type Direction=keyof typeof DIRECTION

export type Matrix = number[][]

export type Position = [r: number, c: number]

export interface SnapShot {
    matrix: Matrix
    score: number
}

export interface GameForm {
    r: number,
    c: number,
    n: number,
    target: number
}

export interface ActionItem {
    key: string
    label: string
    onClick: () => void
    type?: 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'default'
    icon?: any
    disabled?: boolean
    shortcut?: string
}

export interface StatItem {
    label: string
    value: string | number
    icon?: any
}

export type TargetType = Ref<Window | HTMLElement | null>

export type ShortcutMap = Record<string, () => void>

export interface SwipeOptions {
    threshold?: number
}

export interface EventListenerItem<T extends string = string> {
    type: T
    handler: EventListener
    options?: AddEventListenerOptions | boolean
}

export interface GameControlActions {
    move: (dir: Direction) => boolean
    reset: () => void
    undo: () => void
    redo: () => void
}

// 🌟 2. 纯粹的配置项（状态与回调）
export interface GameControlOptions {
    canMove: Ref<boolean>
    onMoveSuccess?: () => void
    highlightDuration?: number // 高亮时间，默认 50
    resetDebounce?: number     // 防抖时间，默认 100
    swipeThreshold?: number    // 滑动阈值，默认 30
}

export interface Tile {
    id: number
    val: number
    r: number
    c: number
}
