import { ref, watch, type Ref } from 'vue'
import type { Matrix, Direction } from '../types/2048'

export interface Tile {
    id: number
    val: number
    r: number
    c: number
}

export const useTileAnimation = (sourceMatrix: Ref<Matrix>, direction: Ref<Direction | null>) => {
    let nextId = 0
    const tiles = ref<Tile[]>([])
    let lastMatrix: Matrix = [] 

    watch(sourceMatrix, (newMatrix) => {
        if (!newMatrix || newMatrix.length === 0) {
            tiles.value = []
            lastMatrix = []
            return
        }

        const newTiles: Tile[] = []
        const oldPool = tiles.value.map(t => ({ ...t }))
        const usedIds = new Set<number>()
        const dir = direction.value
        const rows = newMatrix.length
        const cols = newMatrix[0].length

        // 🔑 核心修复：生成按照方向优先级的遍历顺序
        const positions: { r: number, c: number }[] = []
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                positions.push({ r: i, c: j })
            }
        }

        if (dir === 'right') {
            positions.sort((a, b) => b.c - a.c) // 从右往左
        } else if (dir === 'left') {
            positions.sort((a, b) => a.c - b.c) // 从左往右
        } else if (dir === 'down') {
            positions.sort((a, b) => b.r - a.r) // 从下往上
        } else if (dir === 'up') {
            positions.sort((a, b) => a.r - b.r) // 从上往下
        }

        for (const { r, c } of positions) {
            const val = newMatrix[r][c]
            if (val === 0) continue

            // 1. 优先锁定绝对不动的方块（节省计算，且防止干扰）
            if (lastMatrix[r] && lastMatrix[r][c] === val) {
                const exactMatch = oldPool.find(t => t.r === r && t.c === c && t.val === val && !usedIds.has(t.id))
                if (exactMatch) {
                    usedIds.add(exactMatch.id)
                    newTiles.push({ id: exactMatch.id, val, r, c })
                    continue
                }
            }

            // 2. 寻找合法的滑动旧方块
            let bestMatch: Tile | null = null
            let minDist = Infinity

            for (const old of oldPool) {
                if (old.val === val && !usedIds.has(old.id)) {
                    // 必须在同一行或同一列
                    if (old.r !== r && old.c !== c) continue;

                    // 方向合法性校验
                    if (dir === 'left' && old.c <= c) continue;
                    if (dir === 'right' && old.c >= c) continue;
                    if (dir === 'up' && old.r <= r) continue;
                    if (dir === 'down' && old.r >= r) continue;

                    const dist = Math.abs(old.r - r) + Math.abs(old.c - c)
                    if (dist < minDist) {
                        minDist = dist
                        bestMatch = old
                    }
                }
            }

            if (bestMatch) {
                usedIds.add(bestMatch.id)
                newTiles.push({ id: bestMatch.id, val, r, c })
            } else {
                // 3. 找不到任何合法的来源，必然是原地生成
                newTiles.push({ id: nextId++, val, r, c })
            }
        }

        // 为了保持 DOM 顺序与渲染一致，恢复正常的坐标顺序
        newTiles.sort((a, b) => a.r === b.r ? a.c - b.c : a.r - b.r)

        tiles.value = newTiles
        lastMatrix = JSON.parse(JSON.stringify(newMatrix))
    }, { immediate: true, deep: true })

    return { tiles }
}