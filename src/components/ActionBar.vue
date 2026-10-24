<script setup lang="ts">
import type { ActionItem } from '../types/2048';

defineProps<{
    actions: ActionItem[]
}>()
</script>

<template>
    <div class="action-bar">
        <template v-for="item in actions" :key="item.key">
            <el-tooltip :content="item.shortcut ? `${item.label} (${item.shortcut})` : item.label" placement="top"
                :show-after="200">
                <el-button class="btn" :type="item.type || 'default'" @click="item.onClick" :disabled="item.disabled"
                    plain>
                    <el-icon v-if="item.icon">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>
                        {{ item.label }}
                    </span>
                </el-button>
            </el-tooltip>
        </template>
    </div>
</template>

<style scoped>
.action-bar {
    display: flex;
    justify-content: center;
    /* 🌟 1. 强制不换行 */
    flex-wrap: nowrap;
    gap: 8px;
    width: 100%;
}

.btn {
    /* 🌟 2. 让每个按钮等宽填满整行 */
    flex: 1;
    min-width: 0;
    /* 允许文本在极窄时收缩 */

    background: #8f7a66;
    color: #f9f6f2;
    border: none;
    /* 🌟 3. 去掉左右 padding，靠 flex 自动撑开，这样绝对不会溢出 */
    padding: 10px 0;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.1s;
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.btn:hover:not(:disabled) {
    background: #9f8b77;
}

.btn:active:not(:disabled) {
    transform: scale(0.95);
}

.btn:disabled {
    background: #cdc1b4;
    color: #a69e94;
    cursor: not-allowed;
    box-shadow: none;
}
</style>