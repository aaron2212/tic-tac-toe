const HOST = '192.168.1.7';
const PORT = 3000;

let socket;
let requests = [];
let currentGameId;

$(document).ready(function() {
  $('#chooseAction').val('0');
});

$('#chooseAction').on('change', function() {
  renderContent(this.value);
});

const renderContent = option => {
  $('#selectionContent').empty();

  let html = (option == 2) ? 'Game ID: <input type="text" id="gameId" />' : '';
  html += '<button id="go">Go!</button>';

  $('#selectionContent').html(html);
};

$(document).on('click', '#go', async function() {
  const option = $('#chooseAction').val();
  let message;

  switch (option) {
    case '0':
      document.location.href = '/game';
      break;
    case '1':
        message = { action: 'createGame', callback: startGame };
        break;
    case '2':
      message = { action: 'joinGame', gameId: $('#gameId').val(), callback: joinGame };
      break;
  }

  if (option == 1 || option == 2) {
    socket = await createSocket(HOST, PORT);
    sendMessage(message);
  }
});

const createSocket = async (host, port) => {
  socket = new WebSocket(`ws://${host}:${port}`);
  socket.onmessage = messageReceived;

  return new Promise((resolve, reject) => {
    setTimeout(
      () => socket.readyState === 1 ? resolve(socket) : reject({}), 1000
    )
  });
}

const sendMessage = message => {
  const requestId = requests.length || 1
  const request = { requestId, callback: message.callback }
  requests.push(request);
  message.requestId = requestId;

  socket.send(JSON.stringify(message));
}

const messageReceived = message => {
  const messageObject = JSON.parse(message.data);
  const request = requests.find(req => req.requestId === messageObject.requestId);

  if (request !== undefined) {
    if (request.requestId === messageObject.requestId &&
      typeof request.callback === 'function') {
        request.callback(messageObject);
    }
  } else {
    if (messageObject.requestId === 0) {
      renderGame(messageObject);
    } else {
      alert(messageObject.data);
      console.log(messageObject);
    }
  }

  currentGameId = messageObject.gameId;
}

const startGame = response => {
  $('.main').empty();

  $.get(`/game?id=${response.data.gameId}`, function(data) {
    $('.main').html(data);
  });
  renderGame(response);
}

const joinGame = response => {
  $('.main').empty();

  $.get(`/game?id=${response.data.gameId}`, function(data) {
    $('.main').html(data);
    $('#waiting').hide();
    $('table').show();
  });
}

const renderGame = response => {
  if (response.data.hasStarted) {
    $.get(`/game?id=${response.data.gameId}`, function(data) {
      $('.main').html(data);
      $('#waiting').hide();
      $('table').show();
    });
  }

  console.log('re-rendering...');
}
