<script setup lang="ts">
import type { StatItem } from '../types/2048';

defineProps<{
    item:StatItem
}>()
</script>

<template>
    <div class="stat-item">
        <span class="label">{{ item.label }}</span>
        <div class="value-wrapper">
            <el-icon v-if="item.icon" class="icon">
                <component :is="item.icon" />
            </el-icon>
            <span class="value">{{ item.value }}</span>
        </div>
    </div>
</template>

<style scoped>
.stat-item {
    flex: 1; /* 🌟 让两个卡片等宽 */
    max-width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #bbada0;
    color: #f9f6f2;
    padding: 8px 0;
    border-radius: 8px;
    font-weight: bold;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.label {
    font-size: 12px;
    color: #eee4da;
    margin-bottom: 2px;
    letter-spacing: 1px;
}

.value-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
}

.icon {
    font-size: 16px;
    color: #edc22e;
}

.value {
    font-size: 20px;
    font-family: 'Courier New', Courier, monospace;
}
</style>