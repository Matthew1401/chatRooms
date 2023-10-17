<template>
  <main>
    <div class="decoration">
      <p>
        Welcome in chat rooms application. To start enter your nickname and
        email.
      </p>
    </div>
    <div class="form-container">
      <h1>Sign up</h1>
      <form @submit.prevent="submitForm" name="form">
        <input
          type="text"
          v-model.trim="data.user.nickname"
          placeholder="Enter your name"
        />
        <br />
        <input
          type="email"
          v-model.trim="data.user.email"
          placeholder="Enter your email"
        />
        <br />
        <button>Submit</button>
      </form>
      <div class="valid-data">{{ data.validData }}</div>
    </div>
    <Footer />
  </main>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Footer from "../components/Footer.vue";

const emits = defineEmits("form-sended");
const router = useRouter();

const { socket } = defineProps(["socket"]);

const data = reactive({
  validData: "",
  user: {
    email: "",
    nickname: "",
  },
});

const emitFormSended = (user) => {
  data.validData = "";
  emits("form-sended", user);
  router.push(`/rooms`);
};

const submitForm = () => {
  if (data.user.nickname.length < 4 || data.user.nickname.length > 14) {
    data.validData = "Your nickname should contain from 4 to 14 characters.";
  } else {
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.user.email)
    ) {
      data.validData = "Please enter a valid email address.";
    } else {
      const loginData = {
        username: data.user.nickname,
        email: data.user.email,
      };
      socket.emit("login", JSON.stringify(loginData));
      data.validData = "Error: connection with server failed.";
    }
  }
};

onMounted(() => {
  socket.on("login", (event) => {
    const login = JSON.parse(event);
    if (login.status === "error") {
      data.validData = login.message;
    } else {
      emitFormSended(data.user);
    }
  });
});
</script>

<style scoped>
.decoration {
  width: 45%;
  height: 50%;
  text-align: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 2em;
  transition: all 0.3s;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(255, 255, 255, 0.7), 0 0 30px rgba(255, 255, 255, 0.7);
}

h1 {
  color: #ffffff;
  margin-top: 45px;
  margin-bottom: 55px;
  font-weight: 700;
  font-size: 2em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(255, 255, 255, 0.7), 0 0 30px rgba(255, 255, 255, 0.7);
}

.form-container {
  width: 30%;
  height: 500px;
  margin-left: 100px;
  text-align: center;
  background-color: black;
  color: white;
  border-radius: 25px;
  transition: all 0.3s;
  box-shadow: rgba(165, 16, 110, 0.4) 5px 5px, rgba(104, 7, 68, 0.3) 10px 10px,
    rgba(104, 8, 69, 0.2) 15px 15px, rgba(99, 5, 64, 0.1) 20px 20px,
    rgba(107, 6, 70, 0.05) 25px 25px;
}

.form-container:hover {
  transform: translateY(-5px);
  box-shadow: rgba(165, 16, 110, 0.4) 5px 5px 5px 5px,
    rgba(104, 7, 68, 0.3) 10px 10px 10px 10px,
    rgba(104, 8, 69, 0.2) 15px 15px 15px 15px,
    rgba(99, 5, 64, 0.1) 20px 20px 20px 20px,
    rgba(107, 6, 70, 0.05) 25px 25px 25px 25px;
}

input {
  margin: 10px;
  padding: 2px;
  border: none;
  border-radius: 5px;
  height: 2.5em;
  width: 18em;
}

button {
  margin-top: 20px;
  border: 2px solid rgba(122, 0, 117, 1);
  border-radius: 5px;
  width: 10em;
  height: 2em;
  font-size: 1em;
  cursor: pointer;
  color: white;
  background-color: rgba(122, 0, 117, 1);
  transition: all 0.3s;
}

button:hover {
  background-color: rgb(51, 1, 49);
}

.valid-data {
  margin-top: 50px;
  color: #ffffff;
  font-weight: 200;
  font-size: 0.6em;
  padding: 0 20px;
}

@media only screen and (max-width: 1200px) {
  main {
    font-size: 16px;
  }

  input {
    width: 14em;
  }

  button {
    font-size: 1.2em;
  }

  .valid-data {
    font-size: 0.8em;
  }
}

@media only screen and (max-width: 900px) {
  main {
    font-size: 13px;
    display: block;
  }

  .decoration {
    width: 100%;
    height: 20%;
    justify-content: center;
    display: flex;
  }

  p {
    width: 60%;
  }

  .form-container {
    width: 50%;
    height: 450px;
    margin-left: 24%;
    margin-top: 40px;
  }

  input {
    width: 14em;
  }

  button {
    font-size: 1.5em;
  }

  h1 {
    font-size: 3em;
    padding-top: 30px;
  }

  .valid-data {
    font-size: 1em;
  }
}

@media only screen and (max-width: 450px) {
  main {
    font-size: 12px;
    display: block;
  }

  .form-container {
    width: 80%;
    height: 400px;
    margin-left: 30px;
  }

  input {
    width: 14em;
    height: 3em;
  }

  .decoration {
    width: 100%;
    font-size: 1.5em;
    margin-top: 10px;
  }

  h1 {
    margin-top: 45px;
    font-size: 3em;
  }
}
</style>
