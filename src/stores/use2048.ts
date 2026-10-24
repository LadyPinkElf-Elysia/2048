import { computed, ref, toRaw } from "vue"
import { defineStore } from "pinia"
import { gen_2_p } from "../constents/2048"
import type { Matrix, SnapShot, GameForm, Position, Direction } from "../types/2048"
import { moveLogic } from "../utils/logic"

const createZeroMatrix = (r: number, c: number): Matrix => Array.from({ length: r }, () => Array(c).fill(0))

const copy = <T>(data: T): T => structuredClone(toRaw(data))

export const createDefaultForm = () => ({ r: 4, c: 4, n: 2 })

export const use2048 = defineStore('use2048', () => {
    const matrix = ref<Matrix>([])
    const score = ref<number>(0)
    const snapShot = ref<SnapShot[]>([])
    const currentIndex = ref(-1)
    const gameForm = ref<GameForm>(createDefaultForm())
    let isLocked = false

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
        // 1. 如果矩阵还没初始化，或者还有空位，绝对没输
        if (matrix.value.length === 0 || emptyCells.value.length > 0) return false

        const rows = matrix.value.length
        const cols = matrix.value[0].length

        // 2. 如果没有空位了，检查是否有相邻相同的数字
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const v = matrix.value[r][c]
                // 检查右边是否有相同的
                if (c < cols - 1 && v === matrix.value[r][c + 1]) return false
                // 检查下边是否有相同的
                if (r < rows - 1 && v === matrix.value[r + 1][c]) return false
            }
        }

        // 3. 既没空位，也没有可合并的，真死局
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

        matrix.value[r][c] = rng2() < gen_2_p ? 2 : 4
    }

    const move = (direction: Direction): boolean => {
        if (isLocked) return false
        if (matrix.value.length === 0 || isLost.value) return false

        isLocked = true
        setTimeout(() => { isLocked = false }, 100)

        const moved = moveLogic(matrix.value, direction, (val) => { score.value += val })

        if (moved) {
            addTile()
            save()
        }
        return moved
    }

    const save = (): void => {
        if (currentIndex.value < snapShot.value.length - 1) {
            snapShot.value.splice(currentIndex.value + 1)
        }
        snapShot.value.push({ matrix: copy(matrix.value), score: score.value })
        currentIndex.value++
    }

    const goto = (n: number): void => {
        if (n < 0 || n >= snapShot.value.length) return
        currentIndex.value = n
        const state = snapShot.value[currentIndex.value]
        matrix.value = copy(state.matrix)
        score.value = state.score
    }

    const undo = (): void => goto(currentIndex.value - 1)

    const redo = (): void => goto(currentIndex.value + 1)

    const init = (): void => {
        matrix.value = createZeroMatrix(gameForm.value.r, gameForm.value.c)
        score.value = 0
        snapShot.value = []
        currentIndex.value = -1
        for (let i = 1; i <= gameForm.value.n; i++) {
            addTile()
        }
        save()
    }

    return {
        matrix, score, gameForm,
        emptyCells, isLost, canUndo, canRedo,
        move, init, undo, redo
    }
})