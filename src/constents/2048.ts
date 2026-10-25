export const DIRECTION = {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right'
} as const

export const gen_2_p = 0.9

export const PAGES={
    Config:'config',
    Game:'game'
}as const

export const ROW_OPTIONS = Array.from({ length: 7 }, (_, i) => i + 3)
export const COL_OPTIONS = Array.from({ length: 7 }, (_, i) => i + 3)
export const N_OPTIONS = Array.from({ length: 3 }, (_, i) => i + 2)
export const TARGET_OPTIONS = Array.from({ length: 6 }, (_, i) => Math.pow(2, 11 + i))