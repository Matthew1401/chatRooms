<template>
  <main>
    <div class="hide-everything" v-if="data.hideMenu">
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
          <select name="number" id="number" v-model="data.roomCapacity">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
          <br />
          <button type="submit">Create</button>
        </form>
        <p>{{ data.validData }}</p>
      </div>
    </div>
    <div class="hide-everything" v-if="data.hidePassword">
      <div class="room-settings">
        <button @click="exitButtonClicked" class="exit">X</button>
        <h1 v-if="data.isPassword">Enter Password</h1>
        <h1 v-else>Are you sure?</h1>
        <form @submit.prevent="askForEnterToRoom" name="form">
          <input
            v-if="data.isPassword"
            type="password"
            placeholder="Password"
            v-model="data.roomPassword"
          />
          <br />
          <button type="submit" v-if="data.isPassword">Submit</button>
          <button type="submit" v-else>Enter</button>
        </form>
        <p>{{ data.validData }}</p>
      </div>
    </div>
    <div class="container" v-if="!data.hideMenu & !data.hidePassword">
      <div class="menu">
        <div class="middle">Welcome {{ user.nickname }}</div>
        <div class="left1">
          <button @click="data.hideMenu = true">Create room</button>
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
        <div class="title">
          <div class="id">Id</div>
          <div class="name">Room Name</div>
          <div class="host">Host Name</div>
          <div class="number">Space</div>
          <div class="password">Password required</div>
        </div>

        <Room
          v-for="room in data.rooms"
          :key="room.id"
          :room="room"
          @enter-to-room="enterRoomMenu"
          :socket="socket"
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
  roomCapacity: 2,
  validData: "",
  hideMenu: false,
  hidePassword: false,
  isPassword: false,
  rooms: [],
  currentRoom: null,
});

const { socket, user } = defineProps(["socket", "user"]);
const emits = defineEmits(["enter-to-room"]);

onMounted(() => {
  if (user.email == "" || user.nickname == "" || user.id == 0) {
    router.push(`/`);
  }

  socket.on("room", (event) => {
    event = JSON.parse(event);
    data.rooms.push(event);
  });

  socket.on("rooms", (event) => {
    event = JSON.parse(event);

    for (var i = 0; i < Object.keys(event); i++) {
      data.rooms.push(event[Object.keys(event)[i]]);
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

  socket.on("error", (event) => {
    data.validData = event;
  });

  socket.on("enterToRoom", (event) => {
    event = JSON.parse(event);
    enterToRoom(event);
  });
});

const exitButtonClicked = () => {
  data.roomName = "";
  data.roomPassword = "";
  data.hideMenu = false;
  data.hidePassword = false;
  data.validData = "";
};

const createRoom = () => {
  var room = {
    user: user,
    name: data.roomName,
    capacity: data.roomCapacity,
    password: data.roomPassword,
  };

  socket.emit("addRoom", JSON.stringify(room));
};

const enterRoomMenu = (room) => {
  if (room.connectedUsers.length == room.capacity) {
    return;
  }

  data.isPassword = room.isPassword;
  data.hidePassword = true;
  data.currentRoom = room;
};

const askForEnterToRoom = () => {
  let ask = {
    roomId: data.currentRoom.id,
    password: data.roomPassword,
  };
  socket.emit("canIEnterToRoom", JSON.stringify(ask));
};

const enterToRoom = (room) => {
  let ask = {
    nickname: user.nickname,
    roomId: `${room.id}`,
  };
  emits("enter-to-room", room);
  router.push(`/room/${room.id}`);

  socket.emit("giveDataToRoom", JSON.stringify(ask));
};

const refresh = () => {
  data.rooms = [];
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

.title {
  margin-left: 40px;
  margin-right: 40px;
  background-color: #5e064ffd;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 7em;
  border: 2px solid black;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
    0 0 15px rgba(255, 255, 255, 0.7);
}

.title > .id {
  min-width: 60px;
  height: 100%;
  font-size: 0.25em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 4px solid black;
}

.title > .name {
  min-width: 190px;
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.2em;
  color: #ffffff;
  border-right: 4px solid black;
}

.title > .host {
  min-width: 190px;
  width: 20%;
  height: 100%;
  font-size: 0.2em;
  text-align: center;
  border-right: 4px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title > .number {
  min-width: 100px;
  width: 10%;
  height: 100%;
  font-size: 0.2em;
  text-align: center;
  border-right: 4px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title > .password {
  min-width: 280px;
  width: 20%;
  height: 100%;
  font-size: 0.2em;
  text-align: center;
  border-right: 4px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rooms {
  margin-top: 70px;
  background-color: black;
  width: 100%;
  height: 70%;
  border-radius: 10px;
  padding-top: 40px;
  padding-bottom: 80px;
  transition: box-shadow ease 0.5s;
  box-shadow: inset 0 0 1em 10px rgba(165, 16, 110, 0.4),
    inset 0 0 1em 20px rgba(104, 7, 68, 0.3), 0 0 0 0 rgba(165, 16, 110, 0.4),
    0 0 0 0 rgba(104, 7, 68, 0.3);
  display: block;
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

@media only screen and (max-width: 1080px) {
  .title > .host {
    display: none;
  }
}

@media only screen and (max-width: 900px) {
  body {
    background-image: none;
  }

  main {
    background-color: black;
  }
  
  .menu {
    height: 10em;
    display: flex;
    box-shadow: none;
    background: none;
  }

  .menu:hover {
    box-shadow: none;
  }

  .menu button {
    background-color: rgb(122, 6, 87);
    color: white;
    border: 2px solid rgb(88, 1, 56);
    border-radius: 10px;
    cursor: pointer;
    transition: transform ease 0.3s, box-shadow ease 0.5s;
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

  .container {
    width: 100%;
  }

  .rooms {
    box-shadow: none;
    background: none;
    margin-top: 30px;
    -webkit-overflow-scrolling: touch;
  }

  .rooms:hover {
    box-shadow: none;
  }
}

@media only screen and (max-width: 730px) {
  .title > .password {
    display: none;
  }
}
</style>
