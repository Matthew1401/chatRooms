<template>
    <div :class="[ message.sended ? 'sended-text': 'received-text' ]">
        <p v-if="! message.sended">{{ nickname }}:</p>
        <Message 
            :text="message.message"
        />
    </div>
</template>

<script setup>
    import Message from './Message.vue'

    const { message, nickname } = defineProps(['message', 'nickname'])
</script>

<style scoped>
    .sended-text {
        width: 100%;
        display: flex;
        justify-content: right;
        height: auto;
    }

    .received-text {
        width: 100%;
        display: flex;
        height: auto;
        position: relative;
    }

    .received-text p {
        position: absolute;
        top: -15px;
        left: 10px;
        font-size: 0.6em;
    }
</style>
