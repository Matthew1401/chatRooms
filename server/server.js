const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Dodaj domenę, z której chcesz zaakceptować żądania
//     methods: ["GET", "POST"], // Określ dozwolone metody HTTP
//     credentials: true, // Jeśli wymagasz przesyłania plików cookie lub autoryzacji, ustaw to na true
//   },
// });

const validator = require("email-validator");

const connectedUsers = {};
const rooms = {};
const passwordsToRooms = {};
const messages = {};

io.on("connection", (socket) => {
  console.log("Client connected.");

  socket.on("login", (data) => {
    data = JSON.parse(data);
    // Sprawdź, czy użytkownik o podanym adresie e-mail już istnieje
    if (!validator.validate(data.email)) {
      socket.emit(
        "login",
        JSON.stringify({
          status: "error",
          message: "Please enter a valid email address.",
        })
      );
      return;
    } else if (connectedUsers[data.email]) {
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

    // Dodaj użytkownika do obiektu connectedUsers
    var userId = 1;
    if (Object.keys(connectedUsers).length > 0) {
      while (Object.keys(connectedUsers).includes(userId.toString())) {
        userId++;
      }
    }

    connectedUsers[userId] = {
      socket: socket,
      username: data.username,
      email: data.email,
    };

    console.log(`${data.username} logged in.`);
    // Wyślij odpowiedź zwrotną do klienta, że poprawnie zalogowano
    socket.emit(
      "login",
      JSON.stringify({
        message: "Succesfully",
        userId: userId,
      })
    );

    if (Object.keys(rooms).length) {
      socket.emit("rooms", JSON.stringify(rooms));
    }

    socket.join("lobby");
  });

  socket.on("addRoom", (data) => {
    data = JSON.parse(data);

    if (data.name.length < 4 || data.name.length > 14) {
      socket.emit(
        "error",
        "Your room name should contain from 4 to 14 characters."
      );
      return;
    } else if (data.capacity < 2 || data.capacity > 8) {
      socket.emit(
        "error",
        "Stop trying to destroy my site. Room capacity is from 2 to 8."
      );
    }

    var isPassword = false;
    if (!data.password == "") {
      isPassword = true;
    }

    var roomId = 1;
    if (rooms.length > 0) {
      var roomsIds = [];

      for (var i = 0; i < rooms.length; i++) {
        roomsIds.push(rooms[i].id);
      }
      while (roomsIds.includes(roomId)) {
        roomId++;
      }

      var roomData = {
        id: roomId,
        hostId: data.user.id,
        hostName: data.user.nickname,
        name: data.name,
        capacity: data.capacity,
        connectedUsers: [],
        isPassword: isPassword,
      };
    } else {
      var roomData = {
        id: 1,
        hostId: data.user.id,
        hostName: data.user.nickname,
        name: data.name,
        capacity: data.capacity,
        connectedUsers: [],
        isPassword: isPassword,
      };
    }

    rooms[roomId] = roomData;
    passwordsToRooms[roomData.id] = data.password;

    socket.emit("enterToRoom", JSON.stringify(roomData));

    socket.to("lobby").emit("room", JSON.stringify(roomData));
  });

  socket.on("canIEnterToRoom", (data) => {
    data = JSON.parse(data);

    if (!rooms[data.roomId]) {
      socket.emit("error", "Room doesn't exist now.");
      return;
    }

    if (rooms[data.roomId].isPassword) {
      if (passwordsToRooms[data.roomId] !== data.password) {
        socket.emit("error", "Wrong password.");
        return;
      }
    }

    if (
      rooms[data.roomId].capacity == rooms[data.roomId].connectedUsers.length
    ) {
      socket.emit("error", "The room is already full");
      return;
    }

    socket.emit("enterToRoom", JSON.stringify(rooms[data.roomId]));
  });

  socket.on("giveDataToRoom", (data) => {
    data = JSON.parse(data);

    if (rooms[data.roomId].connectedUsers.includes(data.nickname)) {
      return;
    }

    rooms[data.roomId].connectedUsers.push(data.nickname);
    socket.join(`room${data.roomId}`);
    socket.leave("lobby");

    var sendToLobby = {
      id: data.roomId,
      connectedUsers: rooms[data.roomId].connectedUsers,
    };
    socket.to("lobby").emit("changeUsersLobby", JSON.stringify(sendToLobby));
    io.in(`room${data.roomId}`).emit(
      "changeUsersRoom",
      JSON.stringify(sendToLobby.connectedUsers)
    );

    if (messages[data.roomId]) {
      socket.emit("messages", JSON.stringify(messages[data.roomId]));
    }
  });

  socket.on("userLeftRoom", (data) => {
    data = JSON.parse(data);

    if (!rooms[data.id]) {
      socket.leave(`room${data.id}`);
      socket.join("lobby");
      return;
    }

    for (var i = 0; i < rooms[data.id].connectedUsers.length; i++) {
      if (rooms[data.id].connectedUsers[i] == data.nickname) {
        rooms[data.id].connectedUsers.splice(i, 1);
        break;
      }
    }

    socket
      .to(`room${data.id}`)
      .emit("changeUsersRoom", JSON.stringify(rooms[data.id].connectedUsers));

    var sendToLobby = {
      id: data.id,
      connectedUsers: rooms[data.id].connectedUsers,
    };
    socket.to("lobby").emit("changeUsersLobby", JSON.stringify(sendToLobby));

    socket.leave(`room${data.id}`);
    socket.join("lobby");
    socket.emit("rooms", JSON.stringify(rooms));
  });

  socket.on("giveRooms", () => {
    socket.emit("rooms", JSON.stringify(rooms));
  });

  socket.on("deleteRoom", (data) => {
    data = JSON.parse(data);

    delete rooms[data.id];
    delete passwordsToRooms[data.id];

    if (messages[data.roomId]) {
      var message_id = messages[data.roomId].length + 1;
    } else {
      var message_id = 1;
    }

    let ask = {
      id: message_id,
      message: "HOST DISCONNECTED",
      sender: "",
    };

    socket.leave(`rooms${data.id}`);
    io.in(`room${data.id}`).emit("host-disconnected", JSON.stringify(ask));
    delete messages[data.id];

    socket.to("lobby").emit("deleteRoom", JSON.stringify(data));
    socket.join("lobby");
    socket.emit("rooms", JSON.stringify(rooms));
  });

  socket.on("message", (data) => {
    data = JSON.parse(data);

    if (!rooms[data.roomId]) return;

    if (messages[data.roomId]) {
      var message_id = messages[data.roomId].length + 1;
    } else {
      var message_id = 1;
    }

    let ask = {
      id: message_id,
      message: data.message,
      sender: data.sender,
    };

    if (!messages[data.roomId]) {
      messages[data.roomId] = [ask];
    } else {
      messages[data.roomId].push(ask);
    }

    io.in(`room${data.roomId}`).emit("message", JSON.stringify(ask));
  });

  socket.on("disconnect", () => {
    // Usuń użytkownika z connectedUsers po rozłączeniu
    for (const id in connectedUsers) {
      if (connectedUsers[id].socket === socket) {
        console.log(`${connectedUsers[id].username} disconnected.`);
        delete connectedUsers[id];

        // Usuwanie pokoju po odłączeniu użytkownika z serwera
        for (const i in rooms) {
          if (rooms[i].hostId == id) {
            delete rooms[i];
            delete passwordsToRooms[i];

            if (messages[i]) {
              var message_id = messages[i].length + 1;
            } else {
              var message_id = 1;
            }

            let ask = {
              id: message_id,
              message: "HOST DISCONNECTED",
              sender: "",
            };

            io.in(`room${i}`).emit("host-disconnected", JSON.stringify(ask));
            delete messages[i];

            socket.to("lobby").emit("deleteRoom", JSON.stringify({ id: i }));
            break;
          }
        }
        break;
      }
    }
  });
});

const keepAliveInterval = 10000; // co 10 sekund
setInterval(() => {
  io.sockets.emit("keep-alive", { message: "Ping" });
}, keepAliveInterval);

server.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
});
