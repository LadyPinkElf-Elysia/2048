<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ActionItem } from '../types/2048';

defineProps<{
    actions: ActionItem[]
}>()

const canHover = ref(true)
onMounted(() => {
    canHover.value = window.matchMedia('(hover: hover)').matches
})
</script>

<template>
    <div class="action-bar">
        <div v-for="item in actions" :key="item.key" class="btn-wrapper">
            <!-- PC 端显示 Tooltip -->
            <el-tooltip v-if="canHover" :content="item.shortcut ? `${item.label} (${item.shortcut})` : item.label"
                placement="top" :show-after="200">
                <el-button class="btn" :type="item.type || 'default'" @click="item.onClick" :disabled="item.disabled"
                    plain>
                    <el-icon v-if="item.icon">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.label }}</span>
                </el-button>
            </el-tooltip>

            <!-- 移动端直接显示按钮 -->
            <el-button v-else class="btn" :type="item.type || 'default'" @click="item.onClick" :disabled="item.disabled"
                plain>
                <el-icon v-if="item.icon">
                    <component :is="item.icon"></component>
                </el-icon>
                <span>{{ item.label }}</span>
            </el-button>

        </div>
    </div>
</template>

<style scoped>
.action-bar {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap; 
    gap: 8px;
    width: 100%;
}

/* 🌟 核心：包裹层占满剩余空间，让四个按钮等宽 */
.btn-wrapper {
    flex: 1;
    display: flex;
    min-width: 0; /* 允许极窄屏幕时压缩 */
}

/* 🌟 按钮撑满包裹层 */
.btn {
    width: 100%;
    background: #8f7a66;
    color: #f9f6f2;
    border: none;
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