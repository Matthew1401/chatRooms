const express = require("express");
const http = require("http");
const WebSocket = require("ws");

// Create an Express app instance
const app = express();

// Create an HTTP server using the Express app instance
const server = http.createServer(app);

// Create a WebSocket server instance and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Start the server listening on port 3000
server.listen(3000, () => {
  console.log("Websocket server started on port 3000");
});

const connectedUsers = {}

wss.on('request', (req) => {
  console.log('someone tried to connect')
})

wss.on('connection', (socket, req) => {
  console.log('Client connected.');

  socket.on('message', (data) => {
    data = JSON.parse(data)
    if (data.status == 'login') {
      if (! connectedUsers[data.email] == undefined) {

      }
      connectedUsers[data.email] = data.username;
      console.log(connectedUsers)
    }

   // Broadcast the message to all connected clients
    // wss.clients.forEach(function each(client) {
    //   if (client !== socket && client.readyState === WebSocket.OPEN) {
    //     client.send(data.toString());
    //     console.log("message",data.toString())
    //   }
    // });
  });
  socket.on('close', () => {
    console.log('------------------------------------');
  });
});