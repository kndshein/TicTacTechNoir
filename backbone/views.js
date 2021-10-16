TicTacToe.Position = Backbone.View.extend({
  tagName: "button",
  player: null,
  position: [],
  board: null,
  game: null,

  events: {
    click: "playerMove",
  },

  initialize: function (options) {
    this.$el.addClass("position");
    this.position = options.position;
    this.board = options.board;
  },

  playerMove: function () {
    if (!this.isAvailable()) {
      return;
    }

    this.player = this.board.boards.game.getCurrentPlayer();
    this.$el.html(this.player.getPlayerToken());
    this.board.recordPosition(this.position, this.player.getPlayerToken());
    this.board.boards.game.nextPlayer();
  },

  isAvailable: function () {
    return this.player === null;
  },
});

TicTacToe.Board = Backbone.View.extend({
  // board: [],
  boards: null,
  score: {
    row: [0, 0, 0],
    column: [0, 0, 0],
    diagonal: [0, 0],
    count: 0,
  },

  initialize: function (options) {
    this.board = [];
    this.boards = options.boards;
    this.score = {
      row: [0, 0, 0],
      column: [0, 0, 0],
      diagonal: [0, 0],
      count: 0,
    };
    this.$el.addClass("board");
    this.render();
  },

  render: function () {
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        let newPosition = new TicTacToe.Position({
          position: [row, column],
          board: this,
        });
        this.board.push(newPosition);
        this.$el.append(newPosition.$el);
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
    console.log(this, this.board, this.score);
    let oneBigArray = [
      ...this.score.row,
      ...this.score.column,
      ...this.score.diagonal,
    ];

    if (this.score.count === 9) {
      this.endBoard({ tie: true });
    }

    for (let position of oneBigArray) {
      if (position === 3 || position === -3) {
        this.endBoard({ tie: false });
      }
    }
  },

  endBoard: function () {
    this.disableButtons();
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

TicTacToe.Boards = Backbone.View.extend({
  el: ".boards-container",
  boards: [],
  game: null,
  score: {
    row: [0, 0, 0],
    column: [0, 0, 0],
    diagonal: [0, 0],
    count: 0,
  },

  initialize: function (options) {
    this.game = options.game;

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        let newBoard = new TicTacToe.Board({
          position: [row, column],
          boards: this,
        });
        this.boards.push(newBoard);
        this.$el.append(newBoard.$el);
      }
    }
  },

  restart: function () {},
});

TicTacToe.Game = Backbone.View.extend({
  el: ".game-container",
  players: null,
  boards: null,

  events: {
    "click .restart": "restart",
  },

  initialize: function () {
    this.players = new TicTacToe.Players();
    this.boards = new TicTacToe.Boards({ game: this });
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
    this.boards.restart();
  },
});

$(document).ready(function () {
  new TicTacToe.Game();
});
