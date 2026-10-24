<script setup lang="ts">
import { ElIcon } from 'element-plus';
import { Back, Bottom, Right, Top } from '@element-plus/icons-vue';
import { useKey } from '../composables/useKey';
import type { Direction } from '../types/2048';

const props = defineProps<{
    undo: () => void
    redo: () => void
    reset: () => void
}>()

const emit = defineEmits<{
    move: [direction: Direction]
}>()

const btns = {
    'up': Top,
    'down': Bottom,
    'left': Back,
    'right': Right,
}

const handleMove = (dir: Direction) => {
    emit('move', dir)
}

const { activeDir } = useKey(handleMove, {
    'ctrl+z': props.undo,
    'meta+z': props.undo,
    'ctrl+y': props.redo,
    'meta+y': props.redo,
    'r': props.reset, 
})

</script>

<template>
    <div class="direction-pad">
        <button v-for="(icon, dir) in btns" :key="dir" :class="['btn', dir, { 'is-pressed': activeDir === dir }]"
            @click="handleMove(dir as Direction)">
            <el-icon>
                <component :is="icon"></component>
            </el-icon>
        </button>
    </div>
</template>

<style scoped>
.direction-pad {
    display: grid;
    grid-template-columns: repeat(3, 60px);
    grid-template-rows: repeat(3, 60px);
    gap: 8px;
    width: max-content;
    margin: 10px auto 0;
}

/* 🌟 去掉所有原本 Element Plus 的属性，改用原生的圆角方块 */
.btn {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    /* 使用经典 2048 底板的浅木质灰 */
    background-color: #cdc1b4;
    color: #776e65;
    /* 图标颜色变深 */
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.1s ease-in-out;
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 悬浮稍微变深一点 */
.btn:hover {
    background-color: #bbada0;
}

/* 🌟 按下时的物理反馈：变深、缩小、阴影消失 */
.btn:active,
.btn.is-pressed {
    background-color: #8f7a66;
    /* 经典深木色 */
    color: #f9f6f2;
    transform: scale(0.92);
    box-shadow: none;
}

/* 精确的十字定位 */
.up {
    grid-area: 1/2/2/3;
}

.down {
    grid-area: 3/2/4/3;
}

.left {
    grid-area: 2/1/3/2;
}

.right {
    grid-area: 2/3/3/4;
}
</style>