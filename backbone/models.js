let TicTacToe;

TicTacToe.Player = Backbone.Model.extend({
  setPlayerToken: function (playerToken) {
    this.set("playerToken", playerToken);
  },
  getPlayerToken: function (playerToken) {
    this.get("playerToken");
  },
});
TicTacToe.Players = Backbone.Collection.extend({
  playerTokens: [1, 2],
  players: [],
  currentPlayerTurn: 0,

  initialize: function () {
    this.players[0] = new TicTacToe.Player({
      playerToken: this.playerTokens[0],
    });
    this.players[1] = new TicTacToe.Player({
      playerToken: this.playerToken[1],
    });
  },

  reset: function () {
    this.currentPlayerTurn = 0;
  },

  next: function () {
    this.currentPlayerTurn = this.current = 0 ? 1 : 0;
  },
});
