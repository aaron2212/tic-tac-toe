const games = [];
let lastGameId = 1;

const create = (socket, requestId) => {
  const game = {
    gameId: lastGameId++,
    connections: [socket],
    hasStarted: false,
    positions: {
      X: [],
      O: []
    }
  }

  games.push(game);
  sendResponse(socket, requestId, true, game);
}

const join = (socket, requestId, gameId) => {
  const game = games.find(game => game.gameId == gameId);

  if (game === undefined) {
    sendResponse(socket, null, false, "Game does not exist");
  } else {
    if (game.connections.length === 2) {
      sendResponse(socket, requestId, false, 'Game already has 2 players');
      return;
    }

    game.connections.push(socket);
    game.hasStarted = true;
    sendResponse(socket, requestId, true, game);
    sendResponse(game.connections[0], 0, true, game);
  }
}

const sendResponse = (socket, requestId, success, message) => {
  const response = {
    success,
    requestId,
    data: message
  };

  socket.send(JSON.stringify(response));
}

const exists = gameId => {
  const game = games.find(game => game.gameId == gameId);
  
  return game !== undefined;
}

const updatePosition = (socket, requestId, gameId, player, position) => {
  const game = games.find(game => game.gameId == gameId);

  if (game === undefined) {
    sendResponse(socket, null, false, 'Game does not exist');
  } else {
    if (game.connections.length !== 2) {
      sendResponse(socket, requestId, false, 'Game has not started yet');
      return;
    }

    game.positions[player]
  }
}

module.exports = { create, exists, join, sendResponse };