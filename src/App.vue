<template>
  <div>
    <h1>Hello</h1>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="username">
      <input type="text" v-model="text">
      <button type="submit">Send</button>
    </form>
  </div>
</template>
<!-- 
  TODO: 1.Poczytać o tworzeniu czatów.
  TODO: 2.Ogarnąć websockety.
 -->

<script setup>
  import { ref } from 'vue'

  const username = ref('')
  const text = ref('')
  const socket = new WebSocket('ws://localhost:3000')

  const sendMessage = () => {
    const messageData = { username: username.value, message: text.value};
    console.log(messageData)
    // Send the message data to the server using WebSockets
    socket.send(JSON.stringify(messageData))
    // Add the message data to the messages array
    // messages.value.push(messageData)
  }


</script>