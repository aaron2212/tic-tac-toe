class GameManager {
  constructor(mainContentSelector, boardSelector) {
    this.gameId = null;
    this.hasGameStarted = false;
    this.mainContentSelector = mainContentSelector;
    this.boardSelector = boardSelector;
  }

  loadGame(gameId, hasGameStarted) {
    this.gameId = gameId;
    this.hasGameStarted = hasGameStarted;
    
    this.renderGame();    
  }

  renderGame() {
    const _this = this;
    
    $.ajax({
      url: `/game?id=${_this.gameId}`,
      success: function(data) {
        $(_this.mainContentSelector).html(data);

        if (_this.hasGameStarted) {
          $(_this.boardSelector).show();
          $(_this.mainContentSelector + ' #waiting').hide();
        }
      },
      error: function(data) {
        console.log('Error', data);
      }
    });
  }
}