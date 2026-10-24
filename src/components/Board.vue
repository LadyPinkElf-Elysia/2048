<script setup lang="ts">
import { computed } from 'vue';
import type { GameForm, Matrix } from '../types/2048';

const props = defineProps<{
    form: GameForm
    m: Matrix
}>()

const boardStyle = computed(() => ({
    '--rows': props.form.r,
    '--cols': props.form.c
}))

const getFontScale = (val: number) => {
    if (val === 0) return '100%'
    const len = val.toString().length
    if (len <= 2) return '100%'    // 64 以下
    if (len === 3) return '65%'    // 128, 256, 512 (大幅缩小)
    if (len === 4) return '45%'    // 1024, 2048 (大幅缩小)
    if (len === 5) return '35%'    // 16384
    return '28%'                   // 65536
}
</script>

<template>
    <div class="board" :style="boardStyle">
        <template v-for="(row, rIdx) in m" :key="rIdx">
            <div v-for="(val, cIdx) in row" :key="cIdx" :class="['cell', `cell-${val}`]">
                <span :style="{ fontSize: getFontScale(val) }">
                    {{ val !== 0 ? val : '' }}
                </span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.board {
    container-type: inline-size;
    display: grid;
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-template-columns: repeat(var(--cols), 1fr);

    /* 间距与内边距：基于单格的 10% */
    gap: calc(100cqw / var(--cols) * 0.1);
    padding: calc(100cqw / var(--cols) * 0.1);

    border-radius: 8px;
    aspect-ratio: 1;
    width: 100%;
    background: #bbada0;
    box-sizing: border-box;
}

.cell {
    display: flex;
    justify-content: center;
    align-items: center;

    /* 🌟 基础字号：格子宽度的 60%，限制最小 8px 最大 45px */
    font-size: clamp(8px, calc(100cqw / var(--cols) * 0.6), 45px);
    font-weight: 900;
    line-height: 1;
    background-color: #cdc1b4;
    border-radius: calc(100cqw / var(--cols) * 0.1);
    color: #776e65;
    overflow: hidden;
    transition: all 0.1s;
}

/* span 用于触发字号动态缩放 */
.cell span {
    display: inline-block;
    transition: font-size 0.1s ease-in-out;
    /* 🌟 魔法属性：压缩字间距，防止多位数太宽 */
    letter-spacing: -0.05em;
    /* 🌟 防止文字换行 */
    white-space: nowrap;
}

/* === 颜色表完全保留 === */
.cell-2 {
    background: #eee4da;
}

.cell-4 {
    background: #ede0c8;
}

.cell-8 {
    background: #f2b179;
    color: #f9f6f2;
}

.cell-16 {
    background: #f59563;
    color: #f9f6f2;
}

.cell-32 {
    background: #f67c5f;
    color: #f9f6f2;
}

.cell-64 {
    background: #f65e3b;
    color: #f9f6f2;
}

.cell-128 {
    background: #edcf72;
    color: #f9f6f2;
}

.cell-256 {
    background: #edcc61;
    color: #f9f6f2;
}

.cell-512 {
    background: #edc850;
    color: #f9f6f2;
}

.cell-1024 {
    background: #edc53f;
    color: #f9f6f2;
}

.cell-2048 {
    background: #edc22e;
    color: #f9f6f2;
    box-shadow: 0 0 15px rgba(237, 194, 46, 0.5);
}

.cell-4096 {
    background: linear-gradient(135deg, #ef6767, #c0392b);
    color: #fff;
}

.cell-8192 {
    background: linear-gradient(135deg, #a55eea, #8854d0);
    color: #fff;
}

.cell-16384 {
    background: linear-gradient(135deg, #45aaf2, #2d98da);
    color: #fff;
}

.cell-32768 {
    background: linear-gradient(135deg, #2ecc71, #20bf6b);
    color: #fff;
}

.cell-65536 {
    background: linear-gradient(135deg, #2c3e50, #000000);
    color: #f1c40f;
}
</style>