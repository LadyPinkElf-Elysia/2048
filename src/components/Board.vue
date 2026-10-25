<script setup lang="ts">
import { computed } from 'vue';
import type { GameForm, Matrix } from '../types/2048';
import { useBoardStyle } from '../composables/useBoardStyle';

const props = defineProps<{
    form: GameForm
    m: Matrix
}>()

const boardStyle = computed(() => ({
    '--rows': props.form.r,
    '--cols': props.form.c,
    '--cell-w': `calc(min(100vw, 560px) / ${props.form.c + 1})`
    // 🌟 分母 + 1 是为了给 gap 和 padding 预留空间，防止棋盘在手机上撑破屏幕
}))

const { getCellStyle, getFontScale } = useBoardStyle()
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