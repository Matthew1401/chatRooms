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
import { RouterView } from "vue-router";
import { reactive } from "vue";
import { io } from "socket.io-client";

// let hostname = window.location.host.split(":")[0];
const socket = io(`http://172.20.10.2:3000`);

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

socket.onclose = () => {
  data.user.email = "";
  data.user.nickname = "";
  data.user.id = 0;
};
</script>
