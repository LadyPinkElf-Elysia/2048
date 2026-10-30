<script setup lang="ts">
import { computed, useCssModule } from 'vue';
import type { GameForm, Matrix, Direction } from '@/types/2048';
import { useBoardStyle } from '@/composables/useBoardStyle';
import { useTileAnimation } from '@/composables/useTileAnimation';

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
const { tiles } = useTileAnimation(
    computed(() => props.m),
    computed(() => props.direction)
)

const bgCells = computed(() => Array.from({ length: rows.value * cols.value }))
</script>

<template>
    <div :class="boardStyles.board">
        <div v-for="(_, i) in bgCells" :key="`bg-${i}`" :class="boardStyles.bgCell"></div>

        <TransitionGroup name="tile" tag="div" :class="boardStyles.tileContainer">
            <div v-for="tile in tiles" :key="tile.id" :class="boardStyles.cellWrapper" :style="{
                gridRow: tile.r + 1,
                gridColumn: tile.c + 1
            }">
                <div :class="boardStyles.cell" :style="getCellStyle(tile.val)">
                    <span :style="{ fontSize: getFontScale(tile.val) }">
                        {{ tile.val }}
                    </span>
                </div>
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

/* 🔑 覆盖层也用一模一样的 Grid，完美贴合背景 */
.tileContainer {
    position: absolute;
    top: calc(v-bind(cellW) * 0.1);
    left: calc(v-bind(cellW) * 0.1);
    right: calc(v-bind(cellW) * 0.1);
    bottom: calc(v-bind(cellW) * 0.1);
    display: grid;
    grid-template-columns: repeat(v-bind(cols), 1fr);
    grid-template-rows: repeat(v-bind(rows), 1fr);
    gap: calc(v-bind(cellW) * 0.1);
    pointer-events: none;
}

.cellWrapper {
    width: 100%;
    height: 100%;
}

.cell {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: calc(v-bind(cellW) * 0.1);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-weight: bold;
    line-height: 1;
    font-size: calc(v-bind(cellW) * 0.5);
    overflow: hidden;
}

.cell span {
    display: inline-block;
    letter-spacing: -0.05em;
    white-space: nowrap;
}

/* ==========================================
   🔑 极致动画（物理隔绝）
   ========================================== */

/* 1. 只有老方块在 Grid 中改变位置时，Vue 才会赋予它 FLIP 移动动画 */
.tileContainer :global(.tile-move) {
    transition: transform 0.15s cubic-bezier(0.2, 0, 0.2, 1);
    z-index: 8;
}

/* 2. 新元素进入：直接锁死外层过渡，纯粹在内层放大 */
.tileContainer :global(.tile-enter-active) {
    transition: none !important;
}

.tileContainer :global(.tile-enter-active) .cell {
    animation: pop-in 0.2s cubic-bezier(0.2, 0, 0.2, 1) forwards;
}

@keyframes pop-in {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }

    80% {
        transform: scale(1.1);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/* 3. 合并消失（纯内层） */
.tileContainer :global(.tile-leave-active) {
    transition: opacity 0.15s ease-in-out;
    z-index: 9;
}

.tileContainer :global(.tile-leave-to) .cell {
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.15s ease-in-out;
}
</style>