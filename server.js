const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const connectedUsers = {};

wss.on('connection', (socket, req) => {
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
    } else if (data.status === 'message') {
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


// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");

// // Create an Express app instance
// const app = express();

// // Create an HTTP server using the Express app instance
// const server = http.createServer(app);

// // Create a WebSocket server instance and attach it to the HTTP server
// const wss = new WebSocket.Server({ server });

// // Start the server listening on port 3000
// server.listen(3000, () => {
//   console.log("Websocket server started on port 3000");
// });

// const connectedUsers = {}

// wss.on('request', (req) => {
//   console.log('someone tried to connect')
// })

// wss.on('connection', (socket, req) => {
//   console.log('Client connected.');

//   socket.on('message', (data) => {
//     data = JSON.parse(data)
//     if (data.status == 'login') {
//       if (! connectedUsers[data.email] == undefined) {

//       }
//       connectedUsers[data.email] = data.username;
//       console.log(connectedUsers)
//     }

//    // Broadcast the message to all connected clients
//     // wss.clients.forEach(function each(client) {
//     //   if (client !== socket && client.readyState === WebSocket.OPEN) {
//     //     client.send(data.toString());
//     //     console.log("message",data.toString())
//     //   }
//     // });
//   });
//   socket.on('close', () => {
//     console.log('------------------------------------');
//   });
// });