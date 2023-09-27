const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const connectedUsers = {};
const rooms = []


wss.on('connection', (socket) => {
  console.log('Client connected.');

  socket.on('message', (data) => {
    data = JSON.parse(data);

    if (data.status === 'login') {
      // Sprawdź, czy użytkownik o podanym adresie e-mail już istnieje
      if (connectedUsers[data.email]) {
        // Jeśli istnieje, wyślij odpowiedź o błędzie i nie zaloguj użytkownika
        socket.send(JSON.stringify({
          status: 'error',
          message: 'This email adress is curentlly in use.'
        }));     
        return;
      }

      // Dodaj użytkownika do obiektu connectedUsers, używając jego email jako klucza
      connectedUsers[data.email] = {
        socket: socket,
        username: data.username,
      };
      console.log(`${data.username} logged in.`);
      // Wyślij odpowiedź zwrotną do klienta, że poprawnie zalogowano
      socket.send(JSON.stringify({
          status: 'login',
          message: 'Succesfully'
        }));

      if (rooms.length) {
        socket.send(JSON.stringify(rooms))
      }    
    } 
    else if (data.status === 'room') {
      rooms.push(data);

      wss.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          // Wyślij wiadomość do wszystkich klientów, z wyjątkiem nadawcy
          client.send(JSON.stringify(data));
        }
      });
    }
    else if (data.status === 'give-rooms') {
      socket.send(JSON.stringify(rooms));
    }
    else if (data.status === 'delete-room') {
      for (var i = 0; i<rooms.length; i++) {
        if ( rooms[i].id == data.id) {
          rooms.splice(i, 1)
          break;
        }
      }
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Wyślij wiadomość do wszystkich klientów, z wyjątkiem nadawcy
          client.send(JSON.stringify(rooms));
        }
      });
    }
    else if (data.status === 'message') {
      // Sprawdź, czy odbiorca istnieje w connectedUsers
      const recipientSocket = connectedUsers[data.recipientEmail]?.socket;

      if (recipientSocket) {
        // Jeśli odbiorca istnieje, przekaż mu wiadomość
        recipientSocket.send(JSON.stringify({
          status: 'message',
          sender: data.senderUsername,
          message: data.message,
        }));
        console.log(`Message sent from ${data.senderUsername} to ${data.recipientEmail}: ${data.message}`);
      } else {
        console.log(`Recipient ${data.recipientEmail} not found.`);
      }
    }
  });

  socket.on('close', () => {
    // Usuń użytkownika z connectedUsers po rozłączeniu
    for (const email in connectedUsers) {
      if (connectedUsers[email].socket === socket) {
        console.log(`${connectedUsers[email].username} disconnected.`);
        delete connectedUsers[email];
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Websocket server started on port 3000");
});
