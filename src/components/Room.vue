<template>
  <div class="room" @click="enterToRoom">
    <div class="id allowed">
      {{ room.id }}
    </div>
    <div class="name">
      {{ room.name }}
    </div>
    <div class="host">
      {{ room.user.nickname }}
    </div>
    <div class="number allowed">
      1/2
    </div>
    <div class="password not-allowed">Password required</div>
  </div>
</template>

<script setup>
const { room } = defineProps(["room"]);
const emits = defineEmits(["enterToRoom"]);

const enterToRoom = () => {
  emits("enterToRoom", room);
};
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
  min-width: 50px;
  width: 4%;
  height: 100%;
  font-size: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 4px solid black;
}

.name {
  min-width: 190px;
  width: 15%;
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
  width: 15%;
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
  text-shadow: 0 0 5px rgba(46, 224, 70, 0.7),
    0 0 15px rgba(59, 230, 74, 0.7);
}

.not-allowed {
  color: rgb(212, 20, 20);
  text-shadow: 0 0 5px rgba(233, 60, 60, 0.7),
    0 0 15px rgba(233, 71, 71, 0.7);
}

/* @media only screen and (max-width: 1200px) {
  .room {
    width: 200px;
    height: 200px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 0;
    margin-bottom: 20px;
  }
} */
</style>
