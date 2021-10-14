TicTacToe.Position = Backbone.View.extend({
  el: "",
  player: null,
  position: [],
  board: null,
  game: null,

  events: {
    click: "playerMove",
  },

  initialize: function (options) {
    this.setElement(options.el);
    this.position = options.position;
    this.board = options.board;
  },

  playerMove: function () {
    if (!this.isAvailable()) {
      return;
    }

    this.player = this.board.game.getCurrentPlayer();
    this.el.innerHTML = this.player.getPlayerToken();
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
    this.setElement(".board");
    this.game = options.game;
    for (let row = 0; row < 3; row++) {
      this.board.push([]);
      for (let column = 0; column < 3; column++) {
        this.board[row][column] = new TicTacToe.Position({
          el: `.position-${row}${column}`,
          position: [row, column],
          board: this,
        });
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

    for (let position of oneBigArray) {
      if (position === 3) {
        console.log("player 1 wins");
      } else if (position === -3) {
        console.log("player 2 wins");
      }
    }

    if (this.score.count === 9) {
      console.log("it's a tie");
    }
  },
});

TicTacToe.Game = Backbone.View.extend({
  el: ".game-container",
  players: null,

  initialize: function () {
    this.players = new TicTacToe.Players();
    this.board = new TicTacToe.Board({ game: this });
    this.listenTo(this, "move", this.nextPlayer);
  },

  getCurrentPlayer: function () {
    return this.players.getCurrentPlayer();
  },

  nextPlayer: function () {
    this.players.next();
  },
});

$(document).ready(function () {
  new TicTacToe.Game();
});
