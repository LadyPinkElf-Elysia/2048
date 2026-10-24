<script setup lang="ts">
import { computed, watch } from 'vue';
import { PAGES } from '../constents/2048.ts';
import router from '../router/index.ts';
import { use2048 } from '../stores/use2048.ts';
import type { ActionItem, Direction, StatItem } from '../types/2048.ts';
import { useTimer } from '../composables/useTimer.ts';
import { Timer as TimerIcon, Trophy } from '@element-plus/icons-vue';

const store = use2048()
const timer=useTimer()

const handleMove=(dir:Direction)=>{
    const moved=store.move(dir)
    if(moved) timer.start()
}

watch(() => store.isLost, (lost) => {
    if (lost) timer.pause()
})

const handleReset=()=>{
    store.init()
    timer.reset()
}

const actions = computed<ActionItem[]>(()=>[
    { key: 'back', label: '返回', onClick: () => router.push({name:PAGES.Config}) },
    { key: 'reset', label: '重开', onClick: handleReset },
    { key: 'undo', label: '撤回', disabled:!store.canUndo,onClick: store.undo },
    { key: 'redo', label: '重做', disabled:!store.canRedo,onClick: store.redo }
])

const statItems=computed<StatItem[]>(()=>[
    {label:'时间',value:timer.formattedTime.value,icon:TimerIcon},
    {label:'分数',value:store.score,icon:Trophy}
])
</script>

<template>
    <div class="page-card">
        <h2 class="title">2048</h2>

        <div class="stats-board">
            <StatItem v-for="item in statItems" :key="item.label" :item="item" />
        </div>

        <div class="action-bar-wrapper">
            <ActionBar :actions="actions" />
        </div>

        <div class="board-wrapper">
            <Board :form="store.gameForm" :m="store.matrix"></Board>
        </div>

        <DirectionPad @move="handleMove"></DirectionPad>
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
}
</style>