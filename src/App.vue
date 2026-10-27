<script setup lang="ts">
</script>

<template>
    <div class="app-wrapper">
        <RouterView></RouterView>
    </div>
</template>

<style>
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: #ece9e1;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
}

#app {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ece9e1;
}

.app-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 12px;
    box-sizing: border-box;
}

.page-card {
    width: 100%;
    max-width: 560px;
    background-color: #faf8ef;
    border-radius: 24px;
    padding: 24px 16px;
    box-shadow: 0 20px 40px rgba(119, 110, 101, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02);
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