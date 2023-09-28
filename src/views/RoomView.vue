<template>
    <main>
        <div class="data">
            <div class="move" style="width: 320px; height: 125px;"></div>
            <section>
                <p>nick: {{ user.nickname }}</p>
                <p>email: {{ user.email }}</p>
            </section>
        </div>
        <div class="menu">
            <section>
                <h1>Room data</h1>
                <p>Room nr {{ room.id }}</p>
                <p>Room name: {{ room.name }}</p>
                <p>Room password: {{ room.password }}</p>
                <p>Room creator: {{ room.user.nickname }}</p>
            </section>
            <button class="exit" @click="exitRoom">Exit room</button>
        </div>
        <div class="messenger">
            <div class="message-container">
                <div class="sended-text">
                    <div class="message-box">ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</div>
                </div>
                <div class="received-text">
                    <p>Mateuszek56:</p>
                    <div class="message-box">sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</div>
                </div>
                <div class="received-text">
                    <p>Mateuszek56:</p>
                    <div class="message-box">Dane kolegi: {{ recipientData.nickname }}, {{ recipientData.email }}</div>
                </div>
            </div>
            <div class="writing-space">
                <form @submit.prevent="console.log(recipientData)">
                    <input type="text">
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup>
    import { onMounted, reactive, onBeforeMount } from 'vue';
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const { socket, user, room } = defineProps(['socket', 'user', 'room'])
    const recipientData = reactive({
        nickname: '',
        email: ''
    })

    onBeforeMount(() => {
        if (user.email !== room.user.email) {
            recipientData.nickname = room.user.nickname
            recipientData.email = room.user.email
        }
    })

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

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log(message)
        if (message.status == 'user') {
            recipientData.nickname = message.nickname
            recipientData.email = message.email
        }
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

    .data section {
        margin-left: 25px;
        margin-top: 25px;
        width: 300px;
        height: 70px;
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

    .menu section {
        margin-left: 55px;
        margin-top: 55px;
    }

    .menu h1 {
        color: #FFFFFF;
        font-family: Cursive;
        font-weight: 600;
        font-size: 1.5em;
        text-shadow:
            0 0 10px rgba(255, 255, 255, .7),
            0 0 20px rgba(255, 255, 255, .7);
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
        border-radius: 15px;
    }

    .message-container {
        height: 90%;
        width: 95%;
        display: block;
        overflow-y: auto;
    }

    .sended-text {
        width: 100%;
        display: flex;
        justify-content: right;
        height: auto;
    }

    .received-text {
        width: 100%;
        display: flex;
        height: auto;
        position: relative;
    }

    .received-text p {
        position: absolute;
        top: -25px;
        left: 10px;
    }

    .message-box {
        background-color: rgba(46, 45, 45, 0.288);
        border: 1px solid purple;
        border-radius: 10px;
        padding: 2px 5px;
        margin: 15px 10px;
        max-width: 70%;
        overflow: auto;
        height: auto;
        word-wrap: break-word;
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

</style>