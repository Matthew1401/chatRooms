<template>
    <main>
        <div class="data">
            <div class="move" style="width: 320px; height: 125px;"></div>
            <section>
                <p>nick: {{ user.nickname }}</p>
                <p>email: {{ user.email }}</p>
                <p>password: EMPTY NOW</p>
            </section>
        </div>
        <div class="menu">
            <section v-if="room">
                <p>Room nr {{ room.id }}</p>
                <p>Room name: {{ room.name }}</p>
                <p>Room password: {{ room.password }}</p>
                <p>Room creator: {{ room.user.nickname }}</p>
            </section>
            <button class="exit" @click="exitRoom">Exit room</button>
        </div>
        <div class="messenger">
            <div class="message-container">
                <div class="sended-text">siema</div>
                <div class="received-text">Heelloaaaaaaaaaaaaaaaaaaaaaaaaaaaaaoaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
            </div>
            <div class="writing-space">
                <form @submit.prevent="">
                    <input type="text">
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const { socket, user, room } = defineProps(['socket', 'user', 'room'])

    onMounted(() => {
        if (user.email == '' || user.nickname == '') {
            router.push(`/`)
        }
    })

    const exitRoom = () => {
        if (user.email == room.user.email) {
            let ask = {status: 'delete-room', id: room.id}
            socket.send(JSON.stringify(ask))
        }
        let ask = {status: 'give-rooms'}
        socket.send(JSON.stringify(ask))
        router.push(`/rooms`)
    }

</script>

<style scoped>

    main {
        position: relative;
        color: #FFFF;
    }

    .data {
        position: absolute;
        top: 0;
        width: 100%;
        height: 125px;
        background-color: black;
        border-bottom: 2px solid rgb(165, 16, 110);
        display: flex;
    }

    section {
        width: 400px;
        height: 50px;
    }

    p {
        color: #FFFF;
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

    .menu .exit {
        position: absolute;
        bottom: 20px;
        left: 25px;
        font-size: 1em;
        width: 8em;
        margin-top: 7px;
        height: 1.7em;
        background-color: rgb(10, 0, 7);
        color: white;
        font-family: Cursive;
        border: 2px solid rgba(105, 6, 69, 0.253);
        border-radius: 10px;
        cursor: pointer;
        transition: transform ease 0.3s;
    }

    .menu button:hover {
       transform: translateX(5px);
    }

    .messenger {
        position: absolute;
        width: 75%;
        height: 75%;
        background-color: black;
        bottom: 50px;
        left: 350px;
        display: flex;
        justify-content: center;
    }

    .message-container {
        background-color: #FFFF;
        height: 90%;
        width: 95%;
        display: block;
    }

    .sended-text {
        max-width: 100%;
        height: auto;
        text-align: right;
        background-color: green;
    }

    .received-text {
        max-width: 100%;
        height: auto;
        background-color: pink;
    }

    .writing-space {
        width: 100%;
        height: 35px;
        position: absolute;
        bottom: 5px;
    }

    input {
        width: 90%;
        margin-right: 10px;
        margin-left: 15px;
        height: 30px;
        border: none;
        border-radius: 5px;
        padding: 0 15px;
        font-size: 0.8em;
    }

    .writing-space button {
        border: 2px solid rgba(122,0,117,1);
        font-size: 0.8em;
        border-radius: 5px;
        cursor: pointer;
        font-family: Cursive;
        color: white;
        background-color: rgba(122,0,117,1);
        transition: all 0.3s; 
    }

    .writing-space button:hover {
        background-color: rgb(51, 1, 49);
    }

</style>