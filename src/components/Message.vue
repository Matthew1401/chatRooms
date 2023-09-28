<template>
    <div class="message-box">{{ text }}</div>
</template>

<script setup>
    const { text } = defineProps(['text'])
</script>

<style scoped>
    .message-box {
        background-color: rgba(46, 45, 45, 0.288);
        border: 1px solid purple;
        border-radius: 10px;
        padding: 2px 5px;
        margin: 15px 10px;
        max-width: 70%;
        overflow: auto;
        height: auto;
        word-wrap: break-word;
    }
</style>