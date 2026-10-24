<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { PAGES } from '../constents/2048.ts';
import router from '../router/index.ts';
import { use2048 } from '../stores/use2048.ts';
import type { ActionItem, Direction, StatItem } from '../types/2048.ts';
import { useTimer } from '../composables/useTimer.ts';
import { Timer as TimerIcon, Trophy } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';

const store = use2048()
const timer = useTimer()

const handleMove = (dir: Direction) => {
    const moved = store.move(dir)
    if (moved) timer.start()
}

watch(() => store.hasWon, (won) => {
    if (won) {
        timer.pause() // 赢了先暂停时间

        // 🌟 情况 A：达成目标的同时，棋盘正好死局了（绝杀通关）
        if (store.isLost) {
            ElMessageBox.alert(
                `太神了！你不仅合成了 ${store.gameForm.target}，还填满了整个棋盘！完美通关！`,
                '绝杀通关',
                {
                    confirmButtonText: '返回设置',
                    type: 'success',
                    center: true,
                    callback: () => {
                        store.init()
                        router.push({ name: PAGES.Config })
                    }
                }
            )
            return
        }

        // 🌟 情况 B：正常活局达成目标，给玩家两个选择
        ElMessageBox.confirm(
            `恭喜！你成功合成了 ${store.gameForm.target}！`,
            '挑战成功',
            {
                confirmButtonText: '继续挑战极限',
                cancelButtonText: '结束并返回',
                type: 'success',
                center: true,
                showClose: false, // 🌟 加上这句，防止点 X 或按 Esc 导致意外退出
            }
        ).then(() => {
            // 🌟 选择继续：解除胜利锁定，恢复计时
            store.keepPlaying()
            timer.start()
        }).catch(() => {
            // 🌟 选择结束：重置游戏并返回设置页
            store.init()
            router.push({ name: PAGES.Config })
        })
    }
})

watch(() => store.isLost, (lost) => {
    if (lost) {
        timer.pause() // 死亡即停表

        // 如果同时达成了胜利，就交给上面的胜利弹窗处理，不要重复弹
        if (store.hasWon) return

        ElMessageBox.alert(
            '棋盘已经填满了，没有可以合并的数字了。',
            'Game Over',
            {
                confirmButtonText: '返回设置',
                type: 'error', // 红色错误图标
                center: true,
                showClose: false, // 必须点按钮，防止误触
                callback: () => {
                    store.init()
                    router.push({ name: PAGES.Config })
                }
            }
        )
    }
})

const handleReset = () => {
    if (store.hasWon || store.isLost) return
    store.init()
    timer.reset()
}

const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
// 如果是 Mac 显示 Cmd，否则显示 Ctrl
const cmdKey = isMac ? 'Cmd' : 'Ctrl'

const actions = computed<ActionItem[]>(() => [
    { key: 'back', label: '返回', onClick: () => router.push({ name: PAGES.Config }) },
    { key: 'reset', label: '重开', onClick: handleReset },
    { key: 'undo', label: '撤回', disabled: !store.canUndo || store.hasWon, onClick: store.undo, shortcut: `${cmdKey}+Z` },
    { key: 'redo', label: '重做', disabled: !store.canRedo || store.hasWon, onClick: store.redo, shortcut: `${cmdKey}+Y` }
])

const statItems = computed<StatItem[]>(() => [
    { label: '时间', value: timer.formattedTime.value, icon: TimerIcon },
    { label: '分数', value: store.score, icon: Trophy }
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

        <DirectionPad @move="handleMove" :undo="store.undo" :redo="store.redo" :reset="handleReset"></DirectionPad>
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