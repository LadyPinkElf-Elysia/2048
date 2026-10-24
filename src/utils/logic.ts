import { DIRECTION } from "../constents/2048"
import type { Direction, Matrix } from "../types/2048"

export const moveLogic = (matrix: Matrix, direction: Direction,onMerge?: (mergedValue: number) => void): boolean => {
    const rows = matrix.length      //行数
    const cols = matrix[0].length   //列数
    let moved = false               //是否有效移动

    /**方向向量，用来标识某一坐标给定方向的下一个位置*/
    const nexts = {
        up: (r: number, c: number): [next_r: number, next_c: number] => [r + 1, c],
        down: (r: number, c: number): [next_r: number, next_c: number] => [r - 1, c],
        left: (r: number, c: number): [next_r: number, next_c: number] => [r, c + 1],
        right: (r: number, c: number): [next_r: number, next_c: number] => [r, c - 1],
    }

    /**坐标有无越界*/
    const _inRange = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols

    /**下一个非零的，因为0对结果无影响，所以要对结果有影响必是非零的数字导致的，所以找非零数字的位置和值*/
    const _nextNotZero = (r: number, c: number): [row: number, col: number, value: number] | null => {
        let [next_r, next_c] = nexts[direction](r, c)
        if (!_inRange(next_r, next_c)) return null
        while (_inRange(next_r, next_c)) {
            const next_v = matrix[next_r][next_c]
            if (next_v !== 0) {
                return [next_r, next_c, next_v]
            }
            [next_r, next_c] = nexts[direction](next_r, next_c)
        }
        return null
    }

    /**递归函数，解决某一行，列*/
    const _cal = (r: number, c: number) => {
        //如果找到的索引越界就说明找完了
        if (!_inRange(r, c)) return

        //找当前坐标下一个非零数字
        const next = _nextNotZero(r, c)
        if (!next) return

        const [next_r, next_c, next_v] = next
        const v = matrix[r][c]
        //零的话交换值的位置，而且还可以合并值
        if (v == 0) {
            //元组交换
            [matrix[r][c], matrix[next_r][next_c]] = [matrix[next_r][next_c], matrix[r][c]]
            //标记
            moved = true
            //接下来还可以合并
            _cal(r, c)
        }
        else if (v === next_v) {
            matrix[r][c] *= 2
            matrix[next_r][next_c] = 0
            moved = true
            onMerge?.(matrix[r][c])
        }

        //解决当前位置，就开始解决下一个位置的（注意和下一个非零数字的位置有区别）
        const [nr, nc] = nexts[direction](r, c)
        _cal(nr, nc)
    }

    /**开始位置*/
    const starts = {
        up: (i: number): [r: number, c: number] => [0, i],
        down: (i: number): [r: number, c: number] => [rows - 1, i],
        left: (i: number): [r: number, c: number] => [i, 0],
        right: (i: number): [r: number, c: number] => [i, cols - 1],
    }

    const limit = (direction === DIRECTION.up || direction === DIRECTION.down) ? cols : rows

    for (let i = 0; i < limit; i++) {
        const [r, c] = starts[direction](i)
        _cal(r, c)
    }

    return moved
}