const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const game = require('./game');

const PORT = 3000;

const app = express();

app.get('/', (req, res) => res.render('index'));
app.get('/game', (req, res) => {
  const gameId = req.query.id;
  const gameExists = game.exists(gameId);
  
  res.render('game', { gameExists, gameId });
});

// Setup express
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'html');
app.engine('html', require('atpl').__express);

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on('connection', ws => {
  console.log('connection received');

  ws.on('message', message => {
    try {
      const { action, gameId, player, position, requestId } = JSON.parse(message);

      switch (action) {
        case 'createGame':
          game.create(ws, requestId);
          break;
        case 'joinGame':
          game.join(ws, requestId, gameId);
          break;
        case 'updatePosition':
          game
        default:
          game.sendResponse(ws, requestId, false, 'Invalid request')
          break;
      }
    } catch (err) {
      console.log('Error:', err);
      game.sendResponse(ws, null, false, 'Invalid request');
    }
  })
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));