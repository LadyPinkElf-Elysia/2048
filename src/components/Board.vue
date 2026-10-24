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
</script>

<template>
    <div class="board" :style="boardStyle">
        <template v-for="(row, rIdx) in m" :key="rIdx">
            <div v-for="(val, cIdx) in row" :key="cIdx" :class="['cell', `cell-${val}`]">
                <span>{{ val !== 0 ? val : '' }}</span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.board {
    display: grid;
    grid-template-rows: repeat(var(--rows), minmax(60px, 80px));
    grid-template-columns: repeat(var(--cols), minmax(60px, 80px));
    gap: 5px;
    width: max-content;
    margin: 10px auto;
    padding: 0;
}

.cell {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-weight: bold;
    background: #cdc1b4;
    border-radius: 6px;
    color: #776e65;
}

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
}
</style>