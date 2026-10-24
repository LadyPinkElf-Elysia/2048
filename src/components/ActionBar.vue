<script setup lang="ts">
import type { ActionItem } from '../types/2048';

defineProps<{
    actions: ActionItem[]
}>()
</script>

<template>
    <div class="action-bar">
        <template v-for="item in actions" :key="item.key">
            <el-button :type="item.type||'default'" @click="item.onClick" :disabled="item.disabled" plain>
                <el-icon v-if="item.icon">
                    <component :is="item.icon"></component>
                </el-icon>
                <span>
                    {{ item.label }}
                </span>
            </el-button>
        </template>
    </div>
</template>

<style scoped>
.action-bar {
    display: flex;
    justify-content: center; /* 🌟 居中 */
    flex-wrap: wrap;         /* 屏幕太窄时自动换行 */
    gap: 12px;
    width: 100%;
}
</style>