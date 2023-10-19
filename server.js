const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const ip = "0.0.0.0"; // Twoje IP
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `*`,
  },
});

const validator = require("email-validator");

const connectedUsers = {};
const rooms = [];

io.on("connection", (socket) => {
  console.log("Client connected.");

  socket.on("login", (data) => {
    data = JSON.parse(data);
    // Sprawdź, czy użytkownik o podanym adresie e-mail już istnieje
    if (! validator.validate(data.email)) {
      socket.emit(
        "login",
        JSON.stringify({
          status: "error",
          message: "Please enter a valid email address.",
        })
      );
      return;
    }
    else if (connectedUsers[data.email]) {
      socket.emit(
        "login",
        JSON.stringify({
          status: "error",
          message: "This email adress is curentlly in use.",
        })
      );
      return;
    } else if (data.username.length < 4 || data.username.length > 14) {
      socket.emit(
        "login",
        JSON.stringify({
          status: "error",
          message: "Your nickname should contain from 4 to 14 characters.",
        })
      );
      return;
    }

    // Dodaj użytkownika do obiektu connectedUsers, używając jego email jako klucza
    connectedUsers[data.email] = {
      socket: socket,
      username: data.username,
    };
    console.log(`${data.username} logged in.`);
    // Wyślij odpowiedź zwrotną do klienta, że poprawnie zalogowano
    socket.emit(
      "login",
      JSON.stringify({
        message: "Succesfully",
      })
    );

    if (rooms.length) {
      socket.emit("rooms", JSON.stringify(rooms));
    }
  });

  socket.on("addRoom", (data) => {
    data = JSON.parse(data);
    console.log(data)

    rooms.push(data);
    io.sockets.sockets.forEach((client) => {
      if (client !== socket) {
        // Wyślij wiadomość do wszystkich klientów, z wyjątkiem nadawcy
        client.emit("room", JSON.stringify(data));
      }
    });
  });

  socket.on("giveDataToRoom", (data) => {
    data = JSON.parse(data);
    connectedUsers[data.recipientEmail].socket.emit(
      "user",
      JSON.stringify({
        nickname: data.user.nickname,
        email: data.user.email,
      })
    );
  });

  socket.on("giveRooms", () => {
    socket.emit("rooms", JSON.stringify(rooms));
  });

  socket.on("deleteRoom", (data) => {
    data = JSON.parse(data);
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].id == data.id) {
        rooms.splice(i, 1);
        break;
      }
    }
    io.sockets.sockets.forEach((client) => {
      if (client !== socket) {
        // Wyślij wiadomość do wszystkich klientów
        client.emit("deleteRoom", JSON.stringify(data));
      }
    });
  });

  socket.on("message", (data) => {
    data = JSON.parse(data);

    var recipientSocket = connectedUsers[data.recipientEmail]?.socket;

    if (recipientSocket) {
      recipientSocket.emit(
        "message",
        JSON.stringify({
          message: data.message,
        })
      );
      console.log(
        `Message sent from ${data.senderUsername} to ${data.recipientEmail}: ${data.message}`
      );
    } else {
      console.log(`Recipient ${data.recipientEmail} not found.`);
    }
  });

  socket.on("disconnect", () => {
    // Usuń użytkownika z connectedUsers po rozłączeniu
    for (const email in connectedUsers) {
      if (connectedUsers[email].socket === socket) {
        console.log(`${connectedUsers[email].username} disconnected.`);
        delete connectedUsers[email];
        // Usuwanie pokoju po odłączeniu użytkownika z serwera
        for (var i = 0; i < rooms.length; i++) {
          if (rooms[i].user.email == email) {
            rooms.splice(i, 1);
            // Wysyłanie pokoju do każdego z użytkowników
            io.sockets.sockets.forEach((client) => {
              if (client !== socket) {
                // Wyślij wiadomość do wszystkich klientów
                client.emit("rooms", JSON.stringify(rooms));
              }
            });
            break;
          }
        }
        break;
      }
    }
  });
});

server.listen(port, ip, () => {
  console.log(`Serwer nasłuchuje na http://${ip}:${port}`);
});
