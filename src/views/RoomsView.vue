<template>
    <main>
        <div class="container">
            <div class="menu">
                <div class="box left">
                    <button>Create room</button>
                </div>
                <div class="box middle">CONNECTION STATUS: OPEN</div>
                <div class="box right">
                    <section>
                        <p>Nazwa: pozderki iksdeeeeeeeeeee</p>
                        <p>Email: lol123@.pl</p>
                    </section>
                    <button>Logout</button>
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
    TODO: 1.Zrobić menu.
    TODO: 2.Dodać przyciski oraz status połączenia. Jeśli użytkownika wywali, czy wywali serwer to niech wraca na '/'
    TODO: 3.Stworzyć komponent room. i dodawać go do panelu za każdym razem, gdy przycik create room wciśnięty.
 -->

<script setup>
    import Footer from '../components/Footer.vue'
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
        transition: box-shadow 0.5s;
        box-shadow: 
            inset 0 0 1em 5px rgba(165, 16, 110, 0.4),
            inset 0 0 1em 10px rgba(104, 7, 68, 0.3),
            0 0 0 0 rgba(165, 16, 110, 0.4), 
            0 0 0 0 rgba(104, 7, 68, 0.3);
    }

    .menu:hover {
        box-shadow: 
            inset 0 0 0 0 rgba(165, 16, 110, 0.4),
            inset 0 0 0 0 rgba(104, 7, 68, 0.3),
            0 0 1em 10px rgba(165, 16, 110, 0.4), 
            0 0 1em 20px rgba(104, 7, 68, 0.3);
    }

    .box {
        width: 33%;
        height: 80%;
    }

    .left {
        text-align: left;
    }

    .middle {
        text-align: center;
    }

    .right {
        text-align: right;
        display: flex;
        justify-content: right;
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