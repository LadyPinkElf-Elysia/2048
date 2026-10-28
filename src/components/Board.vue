<script setup lang="ts">
import { computed, useCssModule } from 'vue';
import type { GameForm, Matrix, Direction } from '../types/2048';
import { useBoardStyle } from '../composables/useBoardStyle';
import { useTileAnimation } from '../composables/useTileAnimation';

// 🔑 接收 direction
const props = defineProps<{
    form: GameForm
    m: Matrix
    direction: Direction | null
}>()

const boardStyles = useCssModule('boardStyles');

const rows = computed(() => props.form.r);
const cols = computed(() => props.form.c);
const cellW = computed(() => `calc(min(100vw, 560px) / ${props.form.c + 1})`);

const { getCellStyle, getFontScale } = useBoardStyle()

// 🔑 将 direction 传进去
const { tiles } = useTileAnimation(
    computed(() => props.m), 
    computed(() => props.direction)
)

const bgCells = computed(() => Array.from({ length: rows.value * cols.value }))
</script>

<template>
    <div :class="boardStyles.board">
        <!-- 1. 底层静态背景网格 -->
        <div v-for="(_, i) in bgCells" :key="`bg-${i}`" :class="boardStyles.bgCell"></div>

        <!-- 2. 顶层动态方块容器（同样使用 Grid 布局） -->
        <TransitionGroup name="tile" tag="div" :class="boardStyles.tileContainer">
            <div
                v-for="tile in tiles"
                :key="tile.id"
                :class="boardStyles.cell"
                :style="{
                    ...getCellStyle(tile.val),
                    gridRow: tile.r + 1,
                    gridColumn: tile.c + 1
                }"
            >
                <span :style="{ fontSize: getFontScale(tile.val) }">
                    {{ tile.val }}
                </span>
            </div>
        </TransitionGroup>
    </div>
</template>

<style module="boardStyles">
.board {
    position: relative;
    display: grid;
    grid-template-columns: repeat(v-bind(cols), 1fr);
    grid-template-rows: repeat(v-bind(rows), 1fr);
    gap: calc(v-bind(cellW) * 0.1);
    padding: calc(v-bind(cellW) * 0.1);
    border-radius: 8px;
    width: 100%;
    background: #bbada0;
    box-sizing: border-box;
}

.bgCell {
    aspect-ratio: 1;
    background-color: #cdc1b4;
    border-radius: calc(v-bind(cellW) * 0.1);
    width: 100%;
    height: 100%;
}

.tileContainer {
    position: absolute;
    inset: 0;
    padding: calc(v-bind(cellW) * 0.1);
    display: grid;
    grid-template-columns: repeat(v-bind(cols), 1fr);
    grid-template-rows: repeat(v-bind(rows), 1fr);
    gap: calc(v-bind(cellW) * 0.1);
    pointer-events: none;
    box-sizing: border-box;
}

.cell {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: calc(v-bind(cellW) * 0.1);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-weight: bold;
    line-height: 1;
    font-size: calc(v-bind(cellW) * 0.5);
    overflow: hidden;
    /* 🔑 移除 transition，完全交由 Vue 的 .tile-move 处理 */
}

.cell span {
    display: inline-block;
    letter-spacing: -0.05em;
    white-space: nowrap;
}

/* 移动动画 */
.tileContainer :global(.tile-move) {
    transition: transform 0.15s cubic-bezier(0.2, 0, 0.2, 1);
    z-index: 8;
}

/* 生成动画（纯原地缩放） */
.tileContainer :global(.tile-enter-active) {
    transition: opacity 0.2s, transform 0.15s;
    z-index: 10;
}
.tileContainer :global(.tile-enter-from) {
    opacity: 0;
    /* 🔑 强制重置 transform 的位移，确保只原地放大，没有任何漂移 */
    transform: scale(0.5) translate(0, 0) !important; 
}

/* 合并消失动画 */
.tileContainer :global(.tile-leave-active) {
    transition: opacity 0.15s, transform 0.15s;
    z-index: 9;
}
.tileContainer :global(.tile-leave-to) {
    opacity: 0;
    transform: scale(0.8) translate(0, 0) !important;
}
</style>