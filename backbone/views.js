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

  render: function () {
    console.log("Poop", this.template);
    this.$el.html(this.template);
    return this;
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
    this.render();
  },

  render: function () {
    // let that = this;
    for (let row = 0; row < 3; row++) {
      this.board.push([]);
      for (let column = 0; column < 3; column++) {
        this.board[row][column] = new TicTacToe.Position({
          // el: `.position-${row}${column}`,
          position: [row, column],
          board: this,
        });
        console.log(this.board[row][column]);
        this.$el.append(this.board[row][column].render().$el);
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
      this.disableButtons();
      this.game.endGame({ tie: true });
    }

    for (let position of oneBigArray) {
      if (position === 3 || position === -3) {
        this.disableButtons();
        this.game.endGame({ tie: false });
      }
    }
  },

  disableButtons: function () {
    _.each(this.board.flat(), function (ele) {
      ele.$el.prop("disabled", true);
    });
  },

  restart: function () {
    _.each(this.board.flat(), function (ele) {
      ele.player = null;
      ele.$el.html("");
      ele.$el.prop("disabled", false);
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
  },

  restart: function () {
    this.$(".alert").html("");
    this.board.restart();
  },
});

$(document).ready(function () {
  new TicTacToe.Game();
});
