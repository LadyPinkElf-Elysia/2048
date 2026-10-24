import type { DIRECTION } from "../constents/2048"

export type Direction = typeof DIRECTION[keyof typeof DIRECTION]

export type Matrix=number[][]

export type Position = [r: number, c: number]

export interface SnapShot {
    matrix: Matrix
    score: number
}

export interface GameForm {
    r: number,
    c: number,
    n: number,
    target:number
}

export interface ActionItem {
    key: string
    label: string
    onClick: () => void
    type?: 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'default'
    icon?: any
    disabled?:boolean
}

export interface StatItem{
    label:string
    value:string|number
    icon?:any
}

export type ShortcutMap = Record<string, (e: KeyboardEvent) => void>