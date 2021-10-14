let TicTacToe = {};

TicTacToe.Player = Backbone.Model.extend({
  initialize: function (options) {
    this.set("playerToken", options.playerToken);
  },
  getPlayerToken: function () {
    return this.get("playerToken");
  },
});

TicTacToe.Players = Backbone.Collection.extend({
  playerTokens: [1, -1],
  players: [],
  currentPlayerIndex: 0,

  initialize: function () {
    this.players[0] = new TicTacToe.Player({
      playerToken: this.playerTokens[0],
    });
    this.players[1] = new TicTacToe.Player({
      playerToken: this.playerTokens[1],
    });
  },

  reset: function () {
    this.currentPlayerIndex = 0;
  },

  next: function () {
    this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
    return this.getCurrentPlayer();
  },

  getCurrentPlayer: function () {
    return this.players[this.currentPlayerIndex];
  },
});
