<template>

  <RouterView 
    :socket="socket" 
    :email="data.email"
    :nickname="data.nickname"
    @formSended="onFormSended"
  />

</template>
<!-- 
  Done TODO: 1.Na początek stworzyć formularz do podania imienia/nicku oraz maila.
  Done TODO: 4.Stworzyć unikalne id dla każdego użytkownika. Niech to będzie email. Po odłączeniu z sesji dane użytkownika są usuwane z tabeli.

  TODO: 2.Przekierować użytkownika do strony z wybieraniem pokoi. Stworzyć taką stronę, gdzie można wybierać pokój lub go stworzyć.
  TODO: 3.Zsynchronizować to z serwerem. Stworzony pokój musi pojawiać się u innych użytkowników.
 -->

<script setup>
  import { RouterView } from 'vue-router'
  import { reactive } from 'vue'

  const socket = new WebSocket('ws://localhost:3000')

  const data = reactive({
    email: '',
    nickname: '',
  })

  const onFormSended = (email, nickname) => {
    data.email = email
    data.nickname = nickname
  }

  socket.onclose = () => {
    data.email = ''
    data.nickname = ''
  }


</script>
