<template>
  <main>
    <div class="decoration">
      <h1>Welcome in chat rooms application. To start enter your nickname and email.</h1>
    </div>
    <div class="form-container">
      <h1>Enter your data</h1>
      <form @submit.prevent="submitForm">
        <input type="text" v-model="data.nickname" placeholder="Enter your name"> <br>
        <input type="email" v-model="data.email" placeholder="Enter your email"> <br>
        <button>Submit</button>
      </form>
      <div class="valid-data">{{ data.validData }}</div>
    </div>
    <Footer />
  </main>
  <!-- <div>
    <h1>Hello</h1>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="username">
      <input type="text" v-model="text">
      <button type="submit">Send</button>
    </form>
    <div v-for="message in messages" class="message">
      <p>
        {{ message.username }}: <br>
        {{ message.message }}
      </p>   
    </div>
  </div> -->
</template>
<!-- 
  TODO: 1.Na początek stworzyć formularz do podania imienia/nicku oraz maila.
  TODO: 2.Przekierować użytkownika do strony z wybieraniem pokoi. Stworzyć taką stronę, gdzie można wybierać pokój lub go stworzyć.
  TODO: 3.Zsynchronizować to z serwerem. Stworzony pokój musi pojawiać się u innych użytkowników.
 -->

<script setup>
  import { reactive } from 'vue'
  import Footer from './components/Footer.vue'

  const socket = new WebSocket('ws://localhost:3000')
  
  const data = reactive({
    validData: '',
    email: '',
    nickname: ''
  })

  const submitForm = () => {
    if (data.nickname.length < 4) {
      data.validData = 'Your nickname should contain more than 4 characters.'
    }
    else {
      if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
        data.validData = 'Please enter a valid email address.'
      }
      else {
        const messageData = { status: 'login', username: data.nickname, email: data.email};
        console.log(messageData)
        socket.send(JSON.stringify(messageData))
      }
    }
  }


  // const username = ref('')
  // const text = ref('')
  // const socket = new WebSocket('ws://localhost:3000')
  // const messages = ref([])

  // const sendMessage = () => {
  //   const messageData = { username: username.value, message: text.value};
  //   console.log(messageData)
  //   // Send the message data to the server using WebSockets
  //   socket.send(JSON.stringify(messageData))
  //   // Add the message data to the messages array
  //   messages.value.push(messageData)
  // }

  // socket.onmessage = (event) => {
  //   const message = JSON.parse(event.data);
  //   messages.value.push(message);
  // }


</script>

<style scoped>
  main {
    width: 100vw;
    height: 100vh;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .decoration {
    width: 40%;
    height: 50%;
    text-align: center;
  }

  h1 {
    color: #FFFFFF;
    font-family: Cursive;
    font-weight: 700;
    font-size: 2em;
    text-shadow:
      0 0 10px rgba(255, 255, 255, .7),
      0 0 20px rgba(255, 255, 255, .7),
      0 0 30px rgba(255, 255, 255, .7);
  }

  .form-container {
    width: 30%;
    height: 60%;
    margin-left: 100px;
    text-align: center;
    background-color: black;
    color: white;
    border-radius: 25px;
    transition: all 0.3s;
    box-shadow: rgba(165, 16, 110, 0.4) 5px 5px, rgba(104, 7, 68, 0.3) 10px 10px, rgba(104, 8, 69, 0.2) 15px 15px, rgba(99, 5, 64, 0.1) 20px 20px, rgba(107, 6, 70, 0.05) 25px 25px;  
  }

  .form-container:hover {
    box-shadow: rgba(165, 16, 110, 0.4) 5px 5px 5px 5px, rgba(104, 7, 68, 0.3) 10px 10px 10px 10px, rgba(104, 8, 69, 0.2) 15px 15px 15px 15px, rgba(99, 5, 64, 0.1) 20px 20px 20px 20px, rgba(107, 6, 70, 0.05) 25px 25px 25px 25px;  
  }

  input {
    margin: 10px;
    padding: 2px;
    border: none;
    border-radius: 5px;
    height: 1.6em;
    width: 13em;
    font-family: Cursive;
  }

  button {
    margin-top: 20px;
    border: 2px solid rgba(122,0,117,1);
    border-radius: 5px;
    width: 13em;
    height: 2em;
    font-size: 0.8em;
    cursor: pointer;
    font-family: Cursive;
    color: white;
    background-color: rgba(122,0,117,1);    
    transition: all 0.3s;
  }

  button:hover {
    background-color: rgb(51, 1, 49);
  }

  .valid-data {
    margin-top: 50px;
    color: #FFFFFF;
    font-family: Cursive;
    font-weight: 200;
    font-size: 0.6em;
  }
  
</style>