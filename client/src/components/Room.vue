<template>
  <div class="room" @click="enterToRoom">
    <div class="id" :class="[roomClosed ? 'not-allowed' : 'allowed']">
      {{ room.id }}
    </div>
    <div class="name">
      {{ room.name }}
    </div>
    <div class="host">
      {{ room.hostName }}
    </div>
    <div class="number" :class="[roomClosed ? 'not-allowed' : 'allowed']">
      {{ room.connectedUsers.length }}/{{ room.capacity }}
    </div>
    <div
      class="password"
      :class="[room.isPassword ? 'not-allowed' : 'allowed']"
    >
      {{ pass }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount } from "vue";

const { room, socket } = defineProps(["room", "socket"]);
const emits = defineEmits(["enterToRoom"]);

const roomClosed = ref(false);
const pass = ref("Free entry");

const enterToRoom = () => {
  emits("enterToRoom", room);
};

onBeforeMount(() => {
  if (room.isPassword) {
    pass.value = "Password required";
  }

  if (room.connectedUsers.length >= room.capacity) {
      roomClosed.value = true;
    }
});

onMounted(() => {
  socket.on("changeUsersLobby", (event) => {
    event = JSON.parse(event);
    room.connectedUsers = event.connectedUsers;

    if (room.connectedUsers.length >= room.capacity) {
      roomClosed.value = true;
    } else {
      roomClosed.value = false;
    }
  });
});
</script>

<style scoped>
.room {
  margin-left: 40px;
  margin-right: 40px;
  background-color: #5e064fa9;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 7em;
  cursor: pointer;
  border: 2px solid black;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
    0 0 15px rgba(255, 255, 255, 0.7);
}

.id {
  min-width: 60px;
  height: 100%;
  font-size: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 4px solid black;
}

.name {
  min-width: 190px;
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.15em;
  color: #ffffff;
  border-right: 4px solid black;
}

.host {
  min-width: 190px;
  width: 20%;
  height: 100%;
  font-size: 0.15em;
  text-align: center;
  border-right: 4px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.number {
  min-width: 100px;
  width: 10%;
  height: 100%;
  font-size: 0.15em;
  text-align: center;
  border-right: 4px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.password {
  min-width: 280px;
  width: 20%;
  height: 100%;
  font-size: 0.15em;
  text-align: center;
  border-right: 4px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.room:hover {
  transform: translateX(-2px);
}

.allowed {
  color: rgb(39, 207, 39);
  text-shadow: 0 0 5px rgba(46, 224, 70, 0.7), 0 0 15px rgba(59, 230, 74, 0.7);
}

.not-allowed {
  color: rgb(212, 20, 20);
  text-shadow: 0 0 5px rgba(233, 60, 60, 0.7), 0 0 15px rgba(233, 71, 71, 0.7);
}

@media only screen and (max-width: 1080px) {
  .host {
    display: none;
  }
}

@media only screen and (max-width: 730px) {
  .password {
    display: none;
  }
}
</style>
