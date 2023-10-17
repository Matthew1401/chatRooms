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
import { ref, reactive } from "vue";
import { io } from "socket.io-client";

let hostname = window.location.host.split(":")[0];
const socket = io(`http://${hostname}:3000`);

const data = reactive({
  user: {
    email: "",
    nickname: "",
  },
  recipient: {},
  room: null,
});

const onFormSended = (user) => {
  data.user.email = user.email;
  data.user.nickname = user.nickname;
};

const onEnterToRoom = (room) => {
  data.room = room;
};

socket.onclose = () => {
  data.user.email = "";
  data.user.nickname = "";
};
</script>
