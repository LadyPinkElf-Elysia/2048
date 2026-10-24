<script setup lang="ts">
import { ElForm, ElFormItem, ElSelect, ElOption, ElButton } from 'element-plus';
import type { GameForm } from '../types/2048';
import { createDefaultForm } from '../stores/use2048';

const emit = defineEmits<{
    start: []
}>()

const form = defineModel<GameForm>('form', { default: () => createDefaultForm() })

const handleStart = () => {
    emit('start')
}

const ROW_OPTIONS = [3, 4, 5, 6, 7, 8]
const COL_OPTIONS = [3, 4, 5, 6, 7, 8]
const N_OPTIONS = [2, 3, 4]
</script>

<template>
    <el-form label-width="100px" label-position="left" class="game-setup-form">
        <el-form-item label="行数(r)">
            <el-select v-model="form.r" placeholder="请选择行数" class="custom-select">
                <el-option v-for="n in ROW_OPTIONS" :key="n" :label="`${n}行`" :value="n"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="列数(c)">
            <el-select v-model="form.c" placeholder="请选择列数" class="custom-select">
                <el-option v-for="n in COL_OPTIONS" :key="n" :label="`${n}列`" :value="n"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="初始个数(n)">
            <el-select v-model="form.n" placeholder="请选择个数" class="custom-select">
                <el-option v-for="n in N_OPTIONS" :key="n" :label="`${n}个`" :value="n"></el-option>
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

/* 让 Select 边框稍显圆润，颜色融入主题 */
.custom-select {
    width: 100%;
}
:deep(.el-select__wrapper) {
    border-radius: 8px;
    background-color: #fcfbf9;
    box-shadow: 0 0 0 1px #cdc1b4 inset; /* 替换默认边框 */
}

:deep(.el-select__wrapper.is-focused) {
    box-shadow: 0 0 0 1px #8f7a66 inset;
}

/* 木质开始按钮 */
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