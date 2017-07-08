const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer();

app.use(express.static('public'));

const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

server.on('request', app);
server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});
