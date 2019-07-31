class WebSocketClient {
  constructor(host, port, callback) {
    this.isConnected = false;
    this.socket = new WebSocket(`ws://${host}:${port}`);
    this.requests = [];

    setTimeout(() => {
      if (this.socket.readyState === 1) {
        this.isConnected = true;
        this.socket.onmessage = this.messageReceived.bind(this);
        callback();
      } 
    }, 500);
  }

  messageReceived(message) {
    const messageObject = JSON.parse(message.data);
    console.log(messageObject);
    
    const request = this.requests.find(req => req.requestId === messageObject.requestId);
  
    if (request !== undefined) {
      if (request.requestId === messageObject.requestId &&
        typeof request.callback === 'function') {
          request.callback(messageObject);
      }
    } else {
      if (messageObject.requestId === 0) {
        gameManager.hasGameStarted = true;
        gameManager.renderGame();
      } else {
        alert(messageObject.data);
        console.log(messageObject);
      }
    }
  }

  sendMessage(message) {
    console.log(message);
    
    
    if (this.isConnected) {
      const requestId = this.requests.length || 1;
      const request = { requestId, callback: message.callback };
      this.requests.push(request);
      message.requestId = requestId;

      this.socket.send(JSON.stringify(message));
    }
  }

  createGame(callback) {
    this.sendMessage({ action: 'createGame', callback });
  }

  joinGame(gameId, callback) {
    this.sendMessage({ action: 'joinGame', gameId, callback });
  }
}