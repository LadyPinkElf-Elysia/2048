<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
    content: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    showAfter?: number
    canHover: boolean
}>()

</script>

<template>
    <el-tooltip v-if="canHover" :content="content" :placement="placement ?? 'top'" :show-after="showAfter ?? 200"
        v-bind="$attrs">
        <slot></slot>
    </el-tooltip>

    <slot v-else></slot>
</template>