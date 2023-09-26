<template>
    <main>
        <div class="container">
            <div class="menu">
                <div class="box left">
                    <button>Create room</button>
                </div>
                <div class="box middle">Welcome {{ nickname }}</div>
                <div class="box right">
                    <form action="">
                        <button type="submit">Logout</button>
                    </form>
                </div>             
            </div>
            <div class="rooms">
                <div class="room">

                </div>
            </div>
        </div>
        <Footer />
    </main>
</template>

<!-- 
    Done TODO: 1.Zrobić menu.
    TODO: 2.Dodać przyciski oraz status połączenia. Jeśli użytkownika wywali, czy wywali serwer to niech wraca na '/'
    TODO: 3.Stworzyć komponent room. i dodawać go do panelu za każdym razem, gdy przycik create room wciśnięty.
 -->

<script setup>
    import Footer from '../components/Footer.vue'
    import { defineEmits, defineProps, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const emits = defineEmits('logout')

    const { socket, email, nickname } = defineProps(['socket', 'email', 'nickname'])

    onMounted(() => {
        if (email == '' || nickname == '') {
            router.push(`/`)
        }
    })
 
</script>

<style scoped>
    main {
        width: 100vw;
        height: 100vh;
        font-size: 20px;
        justify-content: center;
        align-items: center;
        display: flex;
        font-family: Cursive;
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
        min-height: 80%;
        border-radius: 15px;
        transition: box-shadow ease 0.5s;
        /* box-shadow: rgba(165, 16, 110, 0.4) 0px 5px 5px 0px, rgba(104, 7, 68, 0.3) 0px 10px 10px 0px, rgba(104, 8, 69, 0.2) 0px 15px 15px 0px, rgba(99, 5, 64, 0.1) 0px 20px 20px 0px, rgba(107, 6, 70, 0.05) 0px 25px 25px 0px;   */
        box-shadow: 
            inset 0 0 1em 10px rgba(165, 16, 110, 0.4),
            inset 0 0 1em 20px rgba(104, 7, 68, 0.3),
            0 0 0 0 rgba(165, 16, 110, 0.4), 
            0 0 0 0 rgba(104, 7, 68, 0.3);
    }

    .rooms:hover {
        box-shadow: 
        inset 0 0 0 0 rgba(165, 16, 110, 0.4),
        inset 0 0 0 0 rgba(104, 7, 68, 0.3),
        0 0 1em 10px rgba(165, 16, 110, 0.4), 
        0 0 1em 20px rgba(104, 7, 68, 0.3);
    }
</style>