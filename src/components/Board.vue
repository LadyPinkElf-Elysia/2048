<script setup lang="ts">
import { computed } from 'vue';
import type { GameForm, Matrix } from '../types/2048';

const props = defineProps<{
    form: GameForm
    m: Matrix
}>()

const boardStyle = computed(() => ({
    '--rows': props.form.r,
    '--cols': props.form.c,
    '--cell-w': `calc(min(100vw, 560px) / ${props.form.c})`
}))

const getCellStyle = (val: number) => {
    if (val === 0) return {}
    
    // 计算指数：2(1), 4(2), 8(3) ...
    const exponent = Math.log2(val)
    
    // 特殊处理 2 和 4 的浅色
    if (val === 2) return { background: '#eee4da', color: '#776e65' }
    if (val === 4) return { background: '#ede0c8', color: '#776e65' }
    
    // 从 8 (3次方) 开始，色相为 30 (橙色)，每升一级色相增加 25
    // 这样颜色会平滑地从橙色 -> 红色 -> 紫色 -> 蓝色 -> 绿色 循环
    const hue = 30 + (exponent - 3) * 25
    
    return {
        background: `hsl(${hue}, 70%, 55%)`,
        color: '#fff',
        boxShadow: val >= 2048 ? `0 0 15px hsla(${hue}, 80%, 60%, 0.5)` : 'none'
    }
}


const getFontScale = (val: number) => {
    if (val === 0) return '100%'
    const len = val.toString().length
    return `${Math.max(25, 200 / len)}%`
    // 🌟 纯数学公式：以 2 位数为基准（200 / 2 = 100%）
    // 3 位数 -> 200/3 = 66%
    // 4 位数 -> 200/4 = 50%
    // 5 位数 -> 200/5 = 40%
    // Math.max(25, ...) 是为了防止 8 位数时字号变成 0
}
</script>

<template>
    <div class="board" :style="boardStyle">
        <template v-for="(row, rIdx) in m" :key="rIdx">
            <div v-for="(val, cIdx) in row" :key="cIdx" class="cell" :style="getCellStyle(val)">
                <span :style="{ fontSize: getFontScale(val) }">
                    {{ val !== 0 ? val : '' }}
                </span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.board {
    display: grid;
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-template-columns: repeat(var(--cols), 1fr);
    gap: calc(var(--cell-w) * 0.1);
    padding: calc(var(--cell-w) * 0.1);
    border-radius: 8px;
    width: 100%;
    /* 🌟 删掉 aspect-ratio: 1，让高度由格子自己撑开 */
    background: #bbada0;
    box-sizing: border-box;
}

.cell {
    /* 🌟 核心魔法：让每一个格子都保持绝对的正方形 */
    aspect-ratio: 1;
    
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(var(--cell-w) * 0.38);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-weight: bold;
    line-height: 1;
    background-color: #cdc1b4; 
    border-radius: calc(var(--cell-w) * 0.1);
    color: #776e65;
    overflow: hidden;
    min-width: 0;
    min-height: 0;
    transition: all 0.2s ease;
}

.cell span {
    display: inline-block;
    transition: font-size 0.1s ease-in-out;
    letter-spacing: -0.05em;
    white-space: nowrap;
}
</style>