<script setup lang="ts">
</script>

<template>
    <div class="app-wrapper">
        <RouterView></RouterView>
    </div>
</template>

<style>
/* 🌟 这里是全局样式，千万不要加 scoped */
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    /* 外部背景颜色：柔和的暖灰色 */
    background-color: #ece9e1; 
    font-family: 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
}

/* 确保 Vue 挂载点也撑满全屏并居中 */
#app {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ece9e1; /* 保险起见，这里也加一次 */
}

.app-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.page-card {
    width: 100%;
    max-width: 480px;
    background-color: #faf8ef;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 
        0 20px 40px rgba(119, 110, 101, 0.15), 
        0 0 0 1px rgba(0, 0, 0, 0.02);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    margin: 0 0 24px 0;
    font-size: 56px;
    font-weight: 900;
    color: #776e65;
    letter-spacing: 2px;
    text-align: center;
}
</style>