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
    
    watch(sourceMatrix, (newMatrix) => {
        if (!newMatrix || newMatrix.length === 0) {
            tiles.value = []
            return
        }

        const newTiles: Tile[] = []
        const oldPool = tiles.value.map(t => ({ ...t }))
        const usedIds = new Set<number>()
        const dir = direction.value
        const rows = newMatrix.length
        const cols = newMatrix[0].length

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const val = newMatrix[r][c]
                if (val === 0) continue

                // 1. 绝对没动的（优先级最高）
                let bestMatch = oldPool.find(t => t.r === r && t.c === c && t.val === val && !usedIds.has(t.id))

                // 2. 滑动过来的
                if (!bestMatch) {
                    let minDist = Infinity
                    for (const old of oldPool) {
                        if (old.val === val && !usedIds.has(old.id)) {
                            if (old.r !== r && old.c !== c) continue;
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
                }

                if (bestMatch) {
                    usedIds.add(bestMatch.id)
                    newTiles.push({ id: bestMatch.id, val, r, c })
                } else {
                    // 3. 纯新生成的
                    newTiles.push({ id: nextId++, val, r, c })
                }
            }
        }
        
        tiles.value = newTiles
    }, { immediate: true, deep: true })

    return { tiles }
}