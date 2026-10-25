<script setup lang="ts">
import { ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus';
import type { GameForm } from '../types/2048';
import { createDefaultForm } from '../stores/use2048';
import { ROW_OPTIONS, COL_OPTIONS, N_OPTIONS, TARGET_OPTIONS } from '../constents/2048';

const emit = defineEmits<{
    start: []
}>()

const form = defineModel<GameForm>('form', { default: () => createDefaultForm() })

const handleStart = () => {
    emit('start')
}

const formConfig = [
    { label: '行数(r)', key: 'r' as const, options: ROW_OPTIONS, suffix: '行', placeholder: '请选择行数' },
    { label: '列数(c)', key: 'c' as const, options: COL_OPTIONS, suffix: '列', placeholder: '请选择列数' },
    { label: '初始个数(n)', key: 'n' as const, options: N_OPTIONS, suffix: '个', placeholder: '请选择个数' },
    { label: '目标数字(t)', key: 'target' as const, options: TARGET_OPTIONS, suffix: '', placeholder: '请选择目标' }
]

</script>

<template>
    <el-form label-width="100px" label-position="left" class="game-setup-form">
        <el-form-item v-for="item in formConfig" :key="item.key" :label="item.label">
            <el-select v-model="form[item.key]" :placeholder="item.placeholder" class="custom-select">
                <el-option v-for="n in item.options" :key="n" :label="item.suffix ? `${n}${item.suffix}` : `${n}`"
                    :value="n" />
            </el-select>
        </el-form-item>
    </el-form>
    <div class="submit-wrapper">
        <button class="btn-start" @click="handleStart">
            开始游戏
        </button>
    </div>
</template>

<style scoped>
.game-setup-form {
    width: 100%;
}

.custom-select {
    width: 100%;
}

:deep(.el-select__wrapper) {
    border-radius: 8px;
    background-color: #fcfbf9;
    box-shadow: 0 0 0 1px #cdc1b4 inset;
}

:deep(.el-select__wrapper.is-focused) {
    box-shadow: 0 0 0 1px #8f7a66 inset;
}

.submit-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 36px;
}

.btn-start {
    width: 100%;
    background: #8f7a66;
    color: #f9f6f2;
    border: none;
    padding: 14px 0;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.1s;
    box-shadow: 0 4px 10px rgba(143, 122, 102, 0.3);
    letter-spacing: 1px;
}

.btn-start:hover {
    background: #9f8b77;
    transform: translateY(-1px);
}

.btn-start:active {
    transform: scale(0.96) translateY(0);
    box-shadow: 0 2px 5px rgba(143, 122, 102, 0.3);
}
</style>