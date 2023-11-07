<template>
  <main>
    <div class="data">
      <section>
        <p>nick: {{ user.nickname }}</p>
        <p>email: {{ user.email }}</p>
      </section>
    </div>
    <div class="menu">
      <section>
        <h1>Room data</h1>
        <p>Room nr: {{ room.id }}</p>
        <p>Room name: {{ room.name }}</p>
        <p>Room creator: {{ room.hostName }}</p>
        <br />
        <h2>Connected user:</h2>
        <p v-for="roomUser in room.connectedUsers">{{ roomUser }}</p>
      </section>
    </div>
    <button class="exit" @click="exitRoom">Exit room</button>
    <div class="messenger">
      <div class="message-container">
        <Messages
          v-for="message in data.messageHistory"
          :key="message.id"
          :message="message"
          :user="user"
        />
      </div>
      <div class="writing-space">
        <form @submit.prevent="sendMessage">
          <input type="text" v-model.trim="data.message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import Messages from "../components/Messages.vue";

const router = useRouter();

const { socket, user, room } = defineProps(["socket", "user", "room"]);

const data = reactive({
  message: "",
  messageHistory: [],
});

onBeforeMount(() => {
  if (user.email == "" || user.nickname == "" || user.id == 0) {
    router.push(`/`);
  }
});

onMounted(() => {
  socket.on("changeUsersRoom", (event) => {
    event = JSON.parse(event);
    room.connectedUsers = event;
  });

  socket.on("messages", (event) => {
    event = JSON.parse(event);
    data.messageHistory = event;
  });

  socket.on("message", (event) => {
    event = JSON.parse(event);
    data.messageHistory.push(event);
  });

  socket.on("host-disconnected", (event) => {
    event = JSON.parse(event);
    data.messageHistory.push(event);
    socket.emit("userLeftRoom", JSON.stringify({ id: room.id }));

    setTimeout(function () {
      router.push("/rooms");
    }, 4000);
  });
});

const sendMessage = () => {
  if (data.message == "") {
    return;
  }
  let ask = {
    message: data.message,
    sender: user.nickname,
    roomId: room.id,
  };

  socket.emit("message", JSON.stringify(ask));

  data.message = "";
};

const exitRoom = () => {
  if (user.id == room.hostId) {
    socket.emit("deleteRoom", JSON.stringify({ id: room.id }));
  } else {
    socket.emit(
      "userLeftRoom",
      JSON.stringify({ id: room.id, nickname: user.nickname })
    );
  }
  router.push(`/rooms`);
};
</script>

<style scoped>
main {
  position: relative;
  color: #ffff;
  width: 100vw;
  height: 100vh;
}

.data {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 125px;
  background-color: black;
  border-bottom: 2px solid rgb(165, 16, 110);
  display: flex;
}

.data section {
  position: absolute;
  left: 320px;
  top: 25px;
  width: 70%;
  height: 70px;
}

p {
  color: #ffff;
  height: 10px;
  font-size: 0.6em;
}

.menu {
  position: absolute;
  left: 0;
  width: 300px;
  height: 100%;
  background-color: black;
  border-right: 2px solid rgb(165, 16, 110);
  border-top-right-radius: 50px;
}

.menu section {
  margin-left: 55px;
  margin-top: 55px;
}

.menu h1 {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.5em;
  margin: 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(255, 255, 255, 0.7);
}

.menu h2 {
  color: #ffffff;
  font-weight: 500;
  font-size: 1em;
  margin: 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(255, 255, 255, 0.7);
}

.exit {
  position: absolute;
  bottom: 20px;
  left: 25px;
  font-size: 25px;
  width: 8em;
  margin-top: 7px;
  height: 1.7em;
  background-color: rgb(10, 0, 7);
  color: white;
  border: 2px solid rgba(105, 6, 69, 0.253);
  border-radius: 10px;
  cursor: pointer;
  transition: transform ease 0.3s;
}

.exit:hover {
  transform: translateX(5px);
}

.messenger {
  position: absolute;
  width: 75%;
  height: 75%;
  background-color: black;
  top: 150px;
  left: 350px;
  display: flex;
  justify-content: center;
  border-radius: 15px;
}

.message-container {
  height: 90%;
  width: 95%;
  display: block;
  overflow-y: auto;
}

.writing-space {
  width: 100%;
  height: 35px;
  position: absolute;
  text-align: center;
  bottom: 5px;
}

input {
  width: 85%;
  margin-right: 10px;
  margin-left: 15px;
  height: 30px;
  border: none;
  border-radius: 5px;
  padding: 0 15px;
  font-size: 0.8em;
}

.writing-space button {
  border: 2px solid rgba(122, 0, 117, 1);
  font-size: 0.8em;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  background-color: rgba(122, 0, 117, 1);
  transition: all 0.3s;
}

.writing-space button:hover {
  background-color: rgb(51, 1, 49);
}

::-webkit-scrollbar {
  width: 20px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(92, 91, 91, 0.534);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background: rgba(104, 7, 68, 0.3);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(165, 16, 110, 0.4);
}

@media only screen and (max-width: 1400px) {
  .menu {
    width: 250px;
  }

  .menu section {
    margin-left: 30px;
    margin-top: 55px;
  }

  .data section {
    left: 270px;
    width: 60%;
  }

  .messenger {
    width: 70%;
    height: 75%;
    left: 300px;
  }

  input {
    width: 80%;
  }
}

@media only screen and (max-width: 1000px) {
  .menu {
    width: 200px;
    font-size: 20px;
  }

  .menu section {
    margin-left: 30px;
    margin-top: 55px;
  }

  .exit {
    font-size: 20px;
  }

  .data section {
    left: 220px;
    width: 50%;
  }

  .messenger {
    width: 65%;
    height: 75%;
    left: 225px;
  }

  input {
    width: 65%;
  }
}

@media only screen and (max-width: 650px) {
  .menu {
    display: none;
  }

  .data {
    height: 70px;
  }

  .exit {
    left: 60%;
    top: 10px;
  }

  .data section {
    font-size: 20px;
    top: 5px;
    left: 20px;
    width: 175px;
  }

  .messenger {
    width: 100%;
    height: 80%;
    left: 0;
    top: 100px;
  }

  input {
    width: 55%;
  }
}
</style>
