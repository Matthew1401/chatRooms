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
import { RouterView, useRouter } from "vue-router";
import { reactive, onMounted} from "vue";
import { io } from "socket.io-client";

const socket = io(`https://chat-rooms-backend.onrender.com`);
const router = useRouter();

const data = reactive({
  user: {
    email: "",
    nickname: "",
    id: 0,
  },
  room: null,
});

const onFormSended = (user) => {
  data.user.email = user.email;
  data.user.nickname = user.nickname;
  data.user.id = user.id;
};

const onEnterToRoom = (room) => {
  data.room = room;
};

onMounted(() => {
  socket.on('keep-alive', (data) => {
  // Odbierz sygnał "keep-alive" od serwera
  console.log(data.message);
});
})

socket.onclose = () => {
  data.user.email = "";
  data.user.nickname = "";
  data.user.id = 0;
  router.push('/');
};
</script>
