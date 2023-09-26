<template>
  <RouterView :socket="socket"/>
</template>
<!-- 
  Done TODO: 1.Na początek stworzyć formularz do podania imienia/nicku oraz maila.
  Done TODO: 4.Stworzyć unikalne id dla każdego użytkownika. Niech to będzie email. Po odłączeniu z sesji dane użytkownika są usuwane z tabeli.

  TODO: 2.Przekierować użytkownika do strony z wybieraniem pokoi. Stworzyć taką stronę, gdzie można wybierać pokój lub go stworzyć.
  TODO: 3.Zsynchronizować to z serwerem. Stworzony pokój musi pojawiać się u innych użytkowników.
 -->

<script setup>
  import { RouterView } from 'vue-router'

  const socket = new WebSocket('ws://localhost:3000')

  // const username = ref('')
  // const text = ref('')
  // const socket = new WebSocket('ws://localhost:3000')
  // const messages = ref([])

  // const sendMessage = () => {
  //   const messageData = { username: username.value, message: text.value};
  //   console.log(messageData)
  //   // Send the message data to the server using WebSockets
  //   socket.send(JSON.stringify(messageData))
  //   // Add the message data to the messages array
  //   messages.value.push(messageData)
  // }

  // socket.onmessage = (event) => {
  //   const message = JSON.parse(event.data);
  //   messages.value.push(message);
  // }


</script>
