<script setup lang="ts">
import { useCssModule } from 'vue';
import { PAGES } from '@/constents/2048';
import router from '@/router';
import { use2048 } from '@/stores/use2048';

const configPageStyles = useCssModule('configPageStyles');
const store = use2048()

const handleStart = () => {
    store.init()
    router.push({ name: PAGES.Game })
}
</script>

<template>
    <div class="page-card">
        <h2 class="title">2048</h2>
        <div :class="configPageStyles.content">
            <GameSetup @start="handleStart" v-model:form="store.gameForm" />
        </div>
    </div>
</template>

<style module="configPageStyles">
.content {
    width: 100%;
}
</style>