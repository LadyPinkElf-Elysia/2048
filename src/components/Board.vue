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
    container-type: inline-size;
    display: grid;
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-template-columns: repeat(var(--cols), 1fr);
    
    /* 🌟 间距与内边距：基于总宽度除以列数（也就是单个格子的宽度）的 10% */
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
    
    /* 🌟 字体魔法：基础大小为单格的 60%，最小 8px，最大 40px */
    font-size: clamp(8px, calc(100cqw / var(--cols) * 0.6), 40px);
    font-weight: 900;
    line-height: 1;
    background-color: #cdc1b4; 
    border-radius: calc(100cqw / var(--cols) * 0.1);
    color: #776e65;
    overflow: hidden;
    transition: all 0.1s;
}

/* === 基础色块 (2 ~ 2048) === */
.cell-2 { background: #eee4da; }
.cell-4 { background: #ede0c8; }
.cell-8 { background: #f2b179; color: #f9f6f2; }
.cell-16 { background: #f59563; color: #f9f6f2; }
.cell-32 { background: #f67c5f; color: #f9f6f2; }
.cell-64 { background: #f65e3b; color: #f9f6f2; }
.cell-128 { background: #edcf72; color: #f9f6f2; font-size: clamp(10px, 6cqw, 28px); }
.cell-256 { background: #edcc61; color: #f9f6f2; font-size: clamp(10px, 6cqw, 28px); }
.cell-512 { background: #edc850; color: #f9f6f2; font-size: clamp(10px, 6cqw, 28px); }
.cell-1024 { background: #edc53f; color: #f9f6f2; font-size: clamp(8px, 5cqw, 24px); }
.cell-2048 { background: #edc22e; color: #f9f6f2; font-size: clamp(8px, 5cqw, 24px); box-shadow: 0 0 15px rgba(237, 194, 46, 0.5); }

/* === 神仙色块 (4096 ~ 65536) === */
/* 4096: 暗红/深橙渐变 */
.cell-4096 {
    background: linear-gradient(135deg, #ef6767, #c0392b);
    color: #fff;
    font-size: clamp(8px, 5cqw, 22px);
    box-shadow: 0 0 15px rgba(239, 103, 103, 0.5);
}

/* 8192: 神秘紫 */
.cell-8192 {
    background: linear-gradient(135deg, #a55eea, #8854d0);
    color: #fff;
    font-size: clamp(7px, 4.5cqw, 20px);
    box-shadow: 0 0 15px rgba(165, 94, 234, 0.5);
}

/* 16384: 科技蓝 */
.cell-16384 {
    background: linear-gradient(135deg, #45aaf2, #2d98da);
    color: #fff;
    font-size: clamp(6px, 4cqw, 18px);
    box-shadow: 0 0 15px rgba(69, 170, 242, 0.5);
}

/* 32768: 极光绿 */
.cell-32768 {
    background: linear-gradient(135deg, #2ecc71, #20bf6b);
    color: #fff;
    font-size: clamp(5px, 3.5cqw, 16px);
    box-shadow: 0 0 15px rgba(46, 204, 113, 0.5);
}

/* 65536: 黑洞黑金 */
.cell-65536 {
    background: linear-gradient(135deg, #2c3e50, #000000);
    color: #f1c40f; /* 黑底金字 */
    font-size: clamp(5px, 3.2cqw, 16px);
    box-shadow: 0 0 20px rgba(241, 196, 15, 0.4);
    text-shadow: 0 0 5px rgba(241, 196, 15, 0.6);
}

/* 如果有玩家突破天际，成了 131072 这种 6 位数，用动态 CSS 缩字 */
[class*="cell-1"] {
    letter-spacing: -0.5px; /* 高位数稍微缩紧字间距 */
}
</style>