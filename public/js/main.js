const HOST = 'localhost'
const PORT = 3000;

let client;
const gameManager = new GameManager('.main', 'table');
let gameType;

$(document).ready(function() {
  $('#chooseAction').val('1');
});

$('#chooseAction').on('change', function() {
  renderContent(this.value);
});

const renderContent = option => {
  $('#selectionContent').empty();

  let html = (option == 2) ? 'Game ID: <input type="text" id="gameId" value="1" />' : '';
  html += '<button id="go">Go!</button>';

  $('#selectionContent').html(html);
};

$(document).on('click', '#go', async function() {
  const option = $('#chooseAction').val();
  gameType = option;

  if (option == 0)
    document.location.href = '/game';
  else if (option == 1 || option == 2) 
    client = new WebSocketClient(HOST, PORT, connectionMade);
});

const connectionMade = () => {
  const option = $('#chooseAction').val();

  if (option == 1) client.createGame(gameCreated);
  else if (option == 2) client.joinGame($('#gameId').val(), gameJoined); 
}

const gameCreated = response => {
  gameManager.loadGame(response.data.gameId, false);
}

const gameJoined = response => {
  gameManager.loadGame(response.data.gameId, true);
}