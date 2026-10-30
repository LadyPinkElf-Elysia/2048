<script setup lang="ts">
import { useCssModule } from 'vue';
import { Back, Bottom, Right, Top } from '@element-plus/icons-vue';
import type { Direction } from '@/types/2048';

const props = defineProps<{
    activeDir: Direction | null
    canHover: boolean
}>()

const emit = defineEmits<{
    move: [direction: Direction]
}>()

const directionPadStyles = useCssModule('directionPadStyles');

const btns = {
    'up': { icon: Top, hint: '向上 (↑ / W)' },
    'down': { icon: Bottom, hint: '向下 (↓ / S)' },
    'left': { icon: Back, hint: '向左 (← / A)' },
    'right': { icon: Right, hint: '向右 (→ / D)' },
}

const handleMove = (dir: Direction) => {
    emit('move', dir)
}
</script>

<template>
    <div :class="directionPadStyles.directionPad">
        <template v-for="(item, dir) in btns" :key="dir">
            <HoverTooltip :can-hover :content="item.hint">
                <button :class="[directionPadStyles.btn, directionPadStyles[dir], { [directionPadStyles.isPressed]: activeDir === dir }]"
                    @click="handleMove(dir as Direction)">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                </button>
            </HoverTooltip>
        </template>
    </div>
</template>

<style module="directionPadStyles">
.directionPad {
    display: grid;
    grid-template-columns: repeat(3, 60px);
    grid-template-rows: repeat(3, 60px);
    gap: 8px;
    width: max-content;
    margin: 10px auto 0;
}

.btn {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #cdc1b4;
    color: #776e65;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.1s ease-in-out;
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn:hover {
    background-color: #bbada0;
}

.btn:active,
.isPressed {
    background-color: #8f7a66;
    color: #f9f6f2;
    transform: scale(0.92);
    box-shadow: none;
}

.up { grid-area: 1/2/2/3; }
.down { grid-area: 3/2/4/3; }
.left { grid-area: 2/1/3/2; }
.right { grid-area: 2/3/3/4; }
</style>