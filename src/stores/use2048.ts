import { computed, ref, toRaw } from "vue"
import { defineStore } from "pinia"
import { gen_2_p, MAX_SNAPSHOTS, PROD_DEBOUNCE_MS, TILE_2, TILE_4 } from "../constents/2048"
import type { Matrix, SnapShot, GameForm, Position, Direction } from "../types/2048"
import { moveLogic } from "../utils/logic"

const createZeroMatrix = (r: number, c: number): Matrix => Array.from({ length: r }, () => Array(c).fill(0))

const copy = <T>(data: T): T => structuredClone(toRaw(data))

export const createDefaultForm = (): GameForm => ({ r: 4, c: 4, n: 2, target: 2048 })

export const use2048 = defineStore('use2048', () => {
    const matrix = ref<Matrix>([])
    const score = ref<number>(0)
    const snapShot = ref<SnapShot[]>([])
    const currentIndex = ref(-1)
    const gameForm = ref<GameForm>(createDefaultForm())

    const hasWon = ref(false)          
    const isKeepPlaying = ref(false)   

    let lastMoveTime = 0

    /**收集当前空格子*/
    const emptyCells = computed<Position[]>(() => {
        const cells: Position[] = []
        for (let r = 0; r < matrix.value.length; r++) {
            for (let c = 0; c < matrix.value[r].length; c++) {
                if (matrix.value[r][c] === 0) {
                    cells.push([r, c])
                }
            }
        }
        return cells
    })

    const isLost = computed(() => {
        if (matrix.value.length === 0 || emptyCells.value.length > 0) return false

        const rows = matrix.value.length
        const cols = matrix.value[0].length

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const v = matrix.value[r][c]
                if (c < cols - 1 && v === matrix.value[r][c + 1]) return false
                if (r < rows - 1 && v === matrix.value[r + 1][c]) return false
            }
        }
        return true
    })

    const canUndo = computed(() => currentIndex.value > 0)
    const canRedo = computed(() => currentIndex.value < snapShot.value.length - 1)

    /**在空格子生成数字，写两个随机源rng1,rng2用来测试*/
    const addTile = (rng1: () => number = Math.random, rng2: () => number = Math.random): void => {
        const cells = emptyCells.value
        if (cells.length === 0) return

        const idx = Math.floor(rng1() * cells.length)
        const [r, c] = cells[idx]

        matrix.value[r][c] = rng2() < gen_2_p ? TILE_2 : TILE_4
    }

    const move = (direction: Direction): boolean => {
        const now = Date.now()
        // 🔑 开发环境 0ms，生产环境防抖 50ms
        const debounceTime = import.meta.env.DEV ? 0 : PROD_DEBOUNCE_MS
        
        if (now - lastMoveTime < debounceTime) return false
        if (matrix.value.length === 0 || isLost.value || hasWon.value) return false

        lastMoveTime = now

        const moved = moveLogic(matrix.value, direction, (val) => { score.value += val })

        if (moved) {
            addTile()
            save()
            if (!isKeepPlaying.value) {
                const maxVal = Math.max(...matrix.value.flat())
                if (maxVal >= gameForm.value.target) {
                    hasWon.value = true
                }
            }
        }
        return moved
    }

    const save = (): void => {
        // 如果在历史记录中间产生了新动作，截断后面的记录
        if (currentIndex.value < snapShot.value.length - 1) {
            snapShot.value.splice(currentIndex.value + 1)
        }
        
        snapShot.value.push({ matrix: copy(matrix.value), score: score.value })
        
        if (snapShot.value.length > MAX_SNAPSHOTS) {
            snapShot.value.shift() 
        } else {
            currentIndex.value++
        }
    }

    const goto = (n: number): void => {
        if (n < 0 || n >= snapShot.value.length) return
        currentIndex.value = n
        const state = snapShot.value[currentIndex.value]
        matrix.value = copy(state.matrix)
        score.value = state.score
    }

    const undo = (): void => {
        if (hasWon.value || isLost.value) return
        goto(currentIndex.value - 1)
    }

    const redo = (): void => {
        if (hasWon.value || isLost.value) return
        goto(currentIndex.value + 1)
    }

    const init = (): void => {
        matrix.value = createZeroMatrix(gameForm.value.r, gameForm.value.c)
        score.value = 0
        snapShot.value = []
        currentIndex.value = -1
        hasWon.value = false
        isKeepPlaying.value = false
        for (let i = 1; i <= gameForm.value.n; i++) {
            addTile()
        }
        save()
    }

    const keepPlaying = () => {
        hasWon.value = false
        isKeepPlaying.value = true
    }

    return {
        matrix, score, gameForm,
        emptyCells, isLost, canUndo, canRedo,
        hasWon, keepPlaying,
        move, init, undo, redo
    }
})