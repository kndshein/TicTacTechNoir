TicTacToe.Position = Backbone.View.extend({
  player: null,
  position: [],
  board: null,
  game: null,

  events: {
    click: "playerMove",
  },

  initialize: function (options) {
    this.template = _.template($(".position-template").html());
    this.$el.html(this.template({ token: "" }));
    this.position = options.position;
    this.board = options.board;
  },

  playerMove: function () {
    if (!this.isAvailable()) {
      return;
    }

    this.player = this.board.game.getCurrentPlayer();
    this.$el.html(this.template({ token: this.player.getPlayerToken() }));
    this.board.recordPosition(this.position, this.player.getPlayerToken());
    this.board.game.nextPlayer();
  },

  isAvailable: function () {
    return this.player === null;
  },
});

TicTacToe.Board = Backbone.View.extend({
  el: ".board",
  board: [],
  game: null,
  score: {
    row: [0, 0, 0],
    column: [0, 0, 0],
    diagonal: [0, 0],
    count: 0,
  },

  initialize: function (options) {
    this.game = options.game;
    this.render();
  },

  render: function () {
    for (let row = 0; row < 3; row++) {
      this.board.push([]);
      for (let column = 0; column < 3; column++) {
        this.board[row][column] = new TicTacToe.Position({
          position: [row, column],
          board: this,
        });
        this.$el.append(this.board[row][column].$el);
      }
    }
  },

  recordPosition: function (position, playerToken) {
    let row = position[0],
      column = position[1];

    if (row === column) {
      this.score.diagonal[0] += playerToken;
      if (row + column === this.board.length - 1) {
        this.score.diagonal[1] += playerToken;
      }
    } else if (row + column === this.board.length - 1) {
      this.score.diagonal[1] += playerToken;
    }

    this.score.row[row] += playerToken;
    this.score.column[column] += playerToken;
    this.score.count++;
    this.checkScore();
  },

  checkScore: function () {
    let oneBigArray = [
      ...this.score.row,
      ...this.score.column,
      ...this.score.diagonal,
    ];

    if (this.score.count === 9) {
      this.game.endGame({ tie: true });
    }

    for (let position of oneBigArray) {
      if (position === 3 || position === -3) {
        this.game.endGame({ tie: false });
      }
    }
  },

  disableButtons: function () {
    console.log(this.board.flat());
    _.each(this.board.flat(), function (ele) {
      ele.$el.children().prop("disabled", true);
    });
  },

  restart: function () {
    _.each(this.board.flat(), function (ele) {
      ele.player = null;
      ele.$el.html(ele.template({ token: "" }));
      ele.$el.children().prop("disabled", false);
    });
    this.score = {
      row: [0, 0, 0],
      column: [0, 0, 0],
      diagonal: [0, 0],
      count: 0,
    };
  },
});

TicTacToe.Game = Backbone.View.extend({
  el: ".game-container",
  players: null,
  board: null,

  events: {
    "click .restart": "restart",
  },

  initialize: function () {
    this.players = new TicTacToe.Players();
    this.board = new TicTacToe.Board({ game: this });
  },

  getCurrentPlayer: function () {
    return this.players.getCurrentPlayer();
  },

  nextPlayer: function () {
    this.players.next();
  },

  endGame: function (options) {
    if (options.tie) {
      this.$(".alert").html("It's a tie.");
    } else {
      let winningPlayer = this.getCurrentPlayer().get("playerToken");
      this.$(".alert").html(`${winningPlayer} wins!`);
    }
    this.board.disableButtons();
  },

  restart: function () {
    this.$(".alert").html("");
    this.board.restart();
  },
});

$(document).ready(function () {
  new TicTacToe.Game();
});
