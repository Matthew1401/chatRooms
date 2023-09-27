<template>

  <RouterView 
    :socket="socket" 
    :user="data.user"
    :room="data.room"
    @form-sended="onFormSended"
    @enter-to-room="onEnterToRoom"
  />

</template>

<script setup>
  import { RouterView } from 'vue-router'
  import { reactive } from 'vue'

  const socket = new WebSocket('ws://localhost:3000')

  const data = reactive({
    user: {
      email: '',
      nickname: ''
    },
    recipient: {},
    room: null
  })

  const onFormSended = (user) => {
    data.user.email = user.email
    data.user.nickname = user.nickname
  }

  const onEnterToRoom = (room) => {
    data.room = room
  }

  socket.onclose = () => {
    data.user.email = ''
    data.user.nickname = ''
  }


</script>
