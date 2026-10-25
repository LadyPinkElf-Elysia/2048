<script setup lang="ts">
import { computed, ref } from 'vue';
import { PAGES } from '../constents/2048.ts';
import router from '../router/index.ts';
import { use2048 } from '../stores/use2048.ts';
import type { ActionItem, StatItem } from '../types/2048.ts';
import { useTimer } from '../composables/useTimer.ts';
import { Timer as TimerIcon, Trophy } from '@element-plus/icons-vue';
import { formatShortcut } from '../composables/useKey.ts';
import { useGameStatus } from '../composables/useGameStatus.ts';
import { useGameControl } from '../composables/useGameControl.ts';
import { useTooltip } from '../composables/useTooltip.ts';

const store = use2048()
const timer = useTimer()

// 1. DOM 引用
const boardRef = ref<HTMLElement | null>(null) 
const keyboardRef = ref(window)

// 2. 胜负弹窗逻辑
useGameStatus(store, timer)

// 3. 输入控制逻辑
const canMove = computed(() => !store.hasWon && !store.isLost)

const { activeDir, handleMove, handleReset } = useGameControl(
    boardRef,
    keyboardRef,
    // 动作字典
    {
        move: store.move,
        reset: () => { store.init(); timer.reset() },
        undo: store.undo,
        redo: store.redo
    },
    // 配置项
    {
        canMove,
        onMoveSuccess: () => timer.start()
    }
)

const actions = computed<ActionItem[]>(() => [
    { key: 'back', label: '返回', onClick: () => router.push({ name: PAGES.Config }) },
    { key: 'reset', label: '重开', onClick: handleReset },
    { key: 'undo', label: '撤回', disabled: !store.canUndo || store.hasWon, onClick: store.undo, shortcut: formatShortcut('ctrl+z') },
    { key: 'redo', label: '重做', disabled: !store.canRedo || store.hasWon, onClick: store.redo, shortcut: formatShortcut('ctrl+y') }
])

const statItems = computed<StatItem[]>(() => [
    { label: '时间', value: timer.formattedTime.value, icon: TimerIcon },
    { label: '分数', value: store.score, icon: Trophy }
])

const {canHover}=useTooltip()

</script>

<template>
    <div class="page-card">
        <h2 class="title">2048</h2>

        <div class="stats-board">
            <StatItem v-for="item in statItems" :key="item.label" :item="item" />
        </div>

        <div class="action-bar-wrapper">
            <ActionBar :can-hover  :actions="actions" />
        </div>

        <div class="board-wrapper" ref="boardRef">
            <Board :form="store.gameForm" :m="store.matrix"></Board>
        </div>

        <DirectionPad :can-hover  @move="handleMove" :active-dir></DirectionPad>
    </div>
</template>

<style scoped>
.stats-board {
    display: flex;
    justify-content: center;
    gap: 16px;
    width: 100%;
}

.action-bar-wrapper {
    margin: 8px 0;
    display: flex;
    justify-content: center;
    width: 100%;
}

.board-wrapper {
    width: 100%;
    margin: 8px 0;
    display: flex;
    /* 🌟 确保内部棋盘能 100% 撑开 */
    justify-content: center;
}
</style>