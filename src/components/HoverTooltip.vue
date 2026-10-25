<script setup lang="ts">
import { ElTooltip } from 'element-plus'

// 禁止透传属性到根节点（避免 el-tooltip 和原生节点冲突）
defineOptions({ inheritAttrs: false })

defineProps<{
    content: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    showAfter?: number
    canHover:boolean
}>()

</script>

<template>
    <!-- PC 端包裹 Tooltip -->
    <el-tooltip v-if="canHover" :content="content" :placement="placement ?? 'top'" :show-after="showAfter ?? 200"
        v-bind="$attrs">
        <slot></slot>
    </el-tooltip>

    <!-- 移动端直接渲染插槽 -->
    <slot v-else></slot>
</template>