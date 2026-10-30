import type { Direction, Matrix } from "../types/2048"

const inRange = (r: number, c: number, matrix: Matrix) =>
    r >= 0 && r < matrix.length && c >= 0 && c < matrix[0].length

type MoveDelta = readonly [dr: number, dc: number]

const nextMoveDelta = {
    "up": [1, 0] as MoveDelta,
    "down": [-1, 0] as MoveDelta,
    "left": [0, 1] as MoveDelta,
    "right": [0, -1] as MoveDelta,
} as const

const nextNotZeroCell = (
    r: number, c: number, direction: Direction, matrix: Matrix
): [next_r: number, next_c: number, next_v: number] | null => {
    const [dr, dc] = nextMoveDelta[direction]
    for (
        let next_r = r + dr, next_c = c + dc;
        inRange(next_r, next_c, matrix);
        next_r += dr, next_c += dc
    ) {
        const next_v = matrix[next_r][next_c]
        if (next_v !== 0) {
            return [next_r, next_c, next_v]
        }
    }
    return null
}

const moveGroup = (
    r: number, c: number, direction: Direction, matrix: Matrix
): {groupMoved:boolean,groupScore:number} => {
    let groupMoved=false
    let groupScore=0
    const [dr, dc] = nextMoveDelta[direction]

    while (inRange(r, c, matrix)) {
        const next = nextNotZeroCell(r, c, direction, matrix)

        if (!next) break

        const [next_r, next_c, next_v] = next
        const v = matrix[r][c]

        if (v === 0) {
            matrix[r][c] = next_v
            matrix[next_r][next_c] = v

            groupMoved = true

            continue
        }
        else if (v === next_v) {
            matrix[r][c] *= 2
            matrix[next_r][next_c] = 0

            groupMoved = true
            groupScore+=matrix[r][c]
        }

        r+=dr
        c+=dc
    }

    return {groupMoved,groupScore}
}

export const moveLogic=(matrix:Matrix,direction:Direction):{moved:boolean,moveScore:number}=>{
    const rows=matrix.length
    const cols=matrix[0].length

    let moved=false
    let moveScore=0

    const starts = {
        up: (i: number): [r: number, c: number] => [0, i],
        down: (i: number): [r: number, c: number] => [rows - 1, i],
        left: (i: number): [r: number, c: number] => [i, 0],
        right: (i: number): [r: number, c: number] => [i, cols - 1],
    }

    const limit = (direction === 'up' || direction === 'down') ? cols : rows

    for (let i = 0; i < limit; i++) {
        const [r, c] = starts[direction](i)
        
        const { groupMoved, groupScore } = moveGroup(r, c, direction, matrix)
        
        if (groupMoved) moved = true
        moveScore += groupScore
    }

    return { moved, moveScore }
}
