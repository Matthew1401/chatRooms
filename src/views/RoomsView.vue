<template>
    <main>
        <div class="create-room" v-if="data.isRoomCreating">
            <div class="room-settings">
                <button @click="exitButtonClicked" class="exit">X</button>
                <h1>Room Settings</h1>
                <form @submit.prevent="createRoom" name="form">
                    <input type="text" placeholder="Room name" v-model.trim="data.roomName"> <br>
                    <input type="password" placeholder="Password" v-model="data.roomPassword"> <br>
                    <button type="submit">Create</button>
                </form>
                <p>{{ data.validData }}</p>
            </div>
        </div>
        <div class="container" v-else>
            <div class="menu">
                <div class="box left">
                    <button @click="data.isRoomCreating=true">Create room</button>
                </div>
                <div class="box middle">Welcome {{ nickname }}</div>
                <div class="box right">
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
                />
            </div>
        </div>
        <Footer />
    </main>
</template>

<!-- 
    Done TODO: 1.Zrobić menu.
    Done TODO: 2.Dodać przyciski oraz status połączenia. Jeśli użytkownika wywali, czy wywali serwer to niech wraca na '/'
    
    TODO: 3.Stworzyć komponent room. i dodawać go do panelu za każdym razem, gdy przycik create room wciśnięty.
 -->

<script setup>
    import Footer from '../components/Footer.vue'
    import Room from '../components/Room.vue'
    import { onMounted, reactive } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const data = reactive({
        roomName: '',
        roomPassword: '',
        validData: '',
        isRoomCreating: false,
        roomId: 1,
        rooms: []
    })

    const { socket, email, nickname } = defineProps(['socket', 'email', 'nickname'])

    onMounted(() => {
        if (email == '' || nickname == '') {
            router.push(`/`)
        }
    })
    
    const exitButtonClicked = () => {
        data.roomName = ''
        data.roomPassword = ''
        data.isRoomCreating = false
    }

    const createRoom = () => {
        if (data.roomName.length < 4 ||data.roomName.length > 15) {
            data.validData = 'Your room name should contain from 4 to 15 characters.'
        }
        else {
            data.validData = ''
            let room = {status: 'room', id: data.roomId, email: email, name: data.roomName, password: data.roomPassword}
            data.roomName = ''
            data.roomPassword = ''
            data.isRoomCreating = false
            socket.send(JSON.stringify(room))
        }
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log(message)
        if (message.status === 'room') {
            data.rooms.push(message)
            data.roomId++
        }
        else if (message[0].status === 'room'){
            for (var i = 0; i<message.length; i++) {
                data.rooms.push(message[i])
                data.roomId++
                console.log(message[i])
            }
        }
    }
 
</script>

<style scoped>
    main {
        font-size: 20px;
    }

    .create-room {
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
        color: #FFFFFF;
        font-family: Cursive;
        margin-top: 35px;
        font-weight: 600;
        font-size: 1.5em;
        text-shadow:
            0 0 10px rgba(255, 255, 255, .7),
            0 0 20px rgba(255, 255, 255, .7),
            0 0 30px rgba(255, 255, 255, .7);
    }

    p {
        color: #FFFFFF;
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
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        transition: box-shadow 0.4s;
        box-shadow: 
            inset 0 0 1em 5px rgba(165, 16, 110, 0.4),
            0 0 0 0 rgba(165, 16, 110, 0.4);
    }

    .menu:hover {
        box-shadow: 
            inset 0 0 0 0 rgba(165, 16, 110, 0.4),
            0 0 1em 10px rgba(165, 16, 110, 0.4);
    }

    .box {
        width: 33%;
        height: 80%;
    }

    .menu button {
        font-size: 1.5em;
        width: 8em;
        margin-top: 7px;
        height: 1.7em;
        background-color: rgb(10, 0, 7);
        color: white;
        font-family: Cursive;
        border: 2px solid rgba(105, 6, 69, 0.253);
        border-radius: 10px;
        cursor: pointer;
        transition: transform ease 0.3s, box-shadow ease 0.5s;
    }

    .menu button:hover {
       transform: translateY(-3px);
    }

    .left button {
        margin-left: 20px;
    }

    .left p {
        position: absolute;
        top: 0;
        left: 30em;
        font-size: 0.8em;
    }

    .left {
        text-align: left;
    }

    .middle {
        text-align: center;
        height: 50%;
        font-size: 1.5em;
        text-shadow:
            0 0 5px rgba(255, 255, 255, .7),
            0 0 10px rgba(255, 255, 255, .7),
            0 0 15px rgba(255, 255, 255, .7);
    }

    .right {
        text-align: right;
        display: flex;
        justify-content: right;
    }

    .right p {
        position: absolute;
        top: 0;
        right: 30em;
        font-size: 0.8em;
    }

    .right button {
        margin-right: 20px;
    }

    .rooms {
        margin-top: 70px;
        background-color: black;
        width: 100%;
        height: 80%;
        border-radius: 10px;
        transition: box-shadow ease 0.5s;
        /* box-shadow: rgba(165, 16, 110, 0.4) 0px 5px 5px 0px, rgba(104, 7, 68, 0.3) 0px 10px 10px 0px, rgba(104, 8, 69, 0.2) 0px 15px 15px 0px, rgba(99, 5, 64, 0.1) 0px 20px 20px 0px, rgba(107, 6, 70, 0.05) 0px 25px 25px 0px;   */
        box-shadow: 
            inset 0 0 1em 10px rgba(165, 16, 110, 0.4),
            inset 0 0 1em 20px rgba(104, 7, 68, 0.3),
            0 0 0 0 rgba(165, 16, 110, 0.4), 
            0 0 0 0 rgba(104, 7, 68, 0.3);
        display: flex;
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
        box-shadow: 
        inset 0 0 0 0 rgba(165, 16, 110, 0.4),
        inset 0 0 0 0 rgba(104, 7, 68, 0.3),
        0 0 1em 10px rgba(165, 16, 110, 0.4), 
        0 0 1em 20px rgba(104, 7, 68, 0.3);
    }

    
</style>