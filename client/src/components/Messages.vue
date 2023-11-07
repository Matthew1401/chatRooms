<template>
  <div
    :class="[message.sender == user.nickname ? 'sended-text' : 'received-text']"
  >
    <p v-if="message.sender !== user.nickname">{{ message.sender }}:</p>
    <Message :text="message.message" />
  </div>
</template>

<script setup>
import Message from "./Message.vue";

const { message, user } = defineProps(["message", "user"]);
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
