<template>
  <main>
    <div class="hide-everything" v-if="data.isRoomCreating">
      <div class="room-settings">
        <button @click="exitButtonClicked" class="exit">X</button>
        <h1>Room Settings</h1>
        <form @submit.prevent="createRoom" name="form">
          <input
            type="text"
            placeholder="Room name"
            v-model.trim="data.roomName"
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            v-model="data.roomPassword"
          />
          <br />
          <button type="submit">Create</button>
        </form>
        <p>{{ data.validData }}</p>
      </div>
    </div>
    <!-- <div class="hide-everything" v-if="data.isPassword">
      <div class="room-settings">
        <button @click="exitButtonClicked" class="exit">X</button>
        <h1>Enter Password</h1>
        <form @submit.prevent="createRoom" name="form">
          <input
            type="password"
            placeholder="Password"
            v-model="data.roomPassword"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
        <p>{{ data.validData }}</p>
      </div>
    </div> -->
    <div class="container" v-else>
      <div class="menu">
        <div class="middle">Welcome {{ user.nickname }}</div>
        <div class="left1">
          <button @click="data.isRoomCreating = true">Create room</button>
        </div>
        <div class="left2">
          <button @click="refresh">Refresh</button>
        </div>
        <div class="right">
          <form action="">
            <button type="submit">Logout</button>
          </form>
        </div>
      </div>
      <div class="rooms">
        <Room
          v-for="room in data.rooms"
          :key="room.id"
          :room="room"
          @enter-to-room="onEnterToRoom"
        />
      </div>
    </div>
    <Footer />
  </main>
</template>

<script setup>
import Footer from "../components/Footer.vue";
import Room from "../components/Room.vue";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const data = reactive({
  roomName: "",
  roomPassword: "",
  validData: "",
  isRoomCreating: false,
  isPassword: false,
  roomId: 1,
  rooms: [],
});

const { socket, user } = defineProps(["socket", "user"]);
const emits = defineEmits(["enter-to-room"]);

onMounted(() => {
  if (user.email == "" || user.nickname == "") {
    router.push(`/`);
  }

  socket.on("room", (event) => {
    event = JSON.parse(event);
    data.rooms.push(event);
    data.roomId++;
  });

  socket.on("rooms", (event) => {
    event = JSON.parse(event);
    for (var i = 0; i < event.length; i++) {
      data.rooms.push(event[i]);
      data.roomId++;
    }
  });

  socket.on("deleteRoom", (event) => {
    event = JSON.parse(event);
    for (var i = 0; i < data.rooms.length; i++) {
      if (data.rooms[i].id == event.id) {
        data.rooms.splice(i, 1);
        break;
      }
    }
  });
});

const exitButtonClicked = () => {
  data.roomName = "";
  data.roomPassword = "";
  data.isRoomCreating = false;
};

const createRoom = () => {
  if (data.roomName.length < 4 || data.roomName.length > 15) {
    data.validData = "Your room name should contain from 4 to 15 characters.";
  } else {
    if (data.rooms.length > 0) {
      data.roomId = 1;
      var roomsIds = [];
      for (var i = 0; i < data.rooms.length; i++) {
        roomsIds.push(data.rooms[i].id);
      }

      while (roomsIds.includes(data.roomId)) {
        data.roomId++;
      }
    }

    var room = {
      id: data.roomId,
      user: user,
      name: data.roomName,
      password: data.roomPassword,
    };

    data.roomName = "";
    data.roomPassword = "";
    data.isRoomCreating = false;
    socket.emit("addRoom", JSON.stringify(room));
    data.roomId++;
    onEnterToRoom(room);
  }
};

const onEnterToRoom = (room) => {
  if (room.user.email !== user.email) {
    let ask = {
      user: user,
      recipientEmail: room.user.email,
    };
    socket.emit("giveDataToRoom", JSON.stringify(ask));
  }
  emits("enter-to-room", room);
  router.push(`/room/${room.id}`);
};

const refresh = () => {
  data.rooms = [];
  data.roomId = 1;
  socket.emit(
    "giveRooms",
    JSON.stringify("lol im under the water pls help me")
  );
};
</script>

<style scoped>
main {
  font-size: 20px;
  overflow: hidden;
}

.hide-everything {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(68, 65, 65, 0.322);
  display: flex;
  justify-content: center;
  align-items: center;
}

.room-settings {
  background-color: black;
  border-radius: 15px;
  width: 400px;
  height: 450px;
  text-align: center;
  transition: all 0.5s;
  position: relative;
}

.room-settings:hover {
  transform: translateY(-2px);
  box-shadow: 5px 10px 5px 0px rgba(26, 26, 26, 0.521);
}

.exit {
  position: absolute;
  right: 10px;
  top: 10px;
  color: rgb(165, 16, 110);
  font-size: 1em;
  cursor: pointer;
  border: none;
  background: none;
}

.exit:hover {
  color: rgb(236, 66, 174);
  font-size: 1.1em;
}

h1 {
  color: #ffffff;
  margin-top: 35px;
  font-weight: 600;
  font-size: 1.5em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(255, 255, 255, 0.7), 0 0 30px rgba(255, 255, 255, 0.7);
}

p {
  color: #ffffff;
  font-size: 0.7em;
  width: 60%;
  margin-left: 20%;
  margin-top: 45px;
}

.container {
  width: 85%;
  height: 100%;
  display: block;
}

.menu {
  background-color: black;
  color: white;
  margin-top: 15px;
  width: 100%;
  height: 4em;
  position: relative;
  border-radius: 5px;
  transition: box-shadow 0.4s;
  box-shadow: inset 0 0 1em 5px rgba(165, 16, 110, 0.4),
    0 0 0 0 rgba(165, 16, 110, 0.4);
}

.menu:hover {
  box-shadow: inset 0 0 0 0 rgba(165, 16, 110, 0.4),
    0 0 1em 10px rgba(165, 16, 110, 0.4);
}

.menu button {
  font-size: 1.4em;
  width: 8em;
  margin-top: 7px;
  margin-bottom: 7px;
  height: 1.7em;
  background-color: rgb(10, 0, 7);
  color: white;
  border: 2px solid rgba(105, 6, 69, 0.253);
  border-radius: 10px;
  cursor: pointer;
  transition: transform ease 0.3s, box-shadow ease 0.5s;
}

.menu button:hover {
  transform: translateY(-3px);
}

.left1 {
  position: absolute;
  top: 8px;
  left: 20px;
}

.left2 {
  position: absolute;
  top: 8px;
  left: 255px;
}

.middle {
  text-align: center;
  position: absolute;
  font-size: 1.5em;
  top: 22px;
  width: 100%;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
    0 0 10px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.7);
}

.right {
  position: absolute;
  right: 20px;
  top: 8px;
}

.rooms {
  margin-top: 70px;
  background-color: black;
  width: 100%;
  height: 80%;
  border-radius: 10px;
  padding-top: 40px;
  padding-bottom: 40px;
  transition: box-shadow ease 0.5s;
  box-shadow: inset 0 0 1em 10px rgba(165, 16, 110, 0.4),
    inset 0 0 1em 20px rgba(104, 7, 68, 0.3), 0 0 0 0 rgba(165, 16, 110, 0.4),
    0 0 0 0 rgba(104, 7, 68, 0.3);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow-y: auto;
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

.rooms:hover {
  box-shadow: inset 0 0 0 0 rgba(165, 16, 110, 0.4),
    inset 0 0 0 0 rgba(104, 7, 68, 0.3), 0 0 1em 10px rgba(165, 16, 110, 0.4),
    0 0 1em 20px rgba(104, 7, 68, 0.3);
}

@media only screen and (max-width: 1550px) {
  .middle {
    width: auto;
    left: 485px;
  }
}

@media only screen and (max-width: 1200px) {
  .middle {
    display: none;
  }
}

@media only screen and (max-width: 900px) {
  .menu {
    height: 10em;
    display: flex;
  }

  .left1 {
    left: unset;
    width: 100%;
    text-align: center;
  }

  .left2 {
    left: unset;
    width: 100%;
    text-align: center;
    top: 65px;
  }

  .right {
    right: unset;
    width: 100%;
    text-align: center;
    top: 122px;
  }
}

@media only screen and (max-width: 500px) {
  .menu {
    background-color: unset;
    border: unset;
    box-shadow: unset;
  }

  .rooms {
    -webkit-overflow-scrolling: touch;
  }

  .menu:hover {
    box-shadow: unset;
  }
}
</style>
