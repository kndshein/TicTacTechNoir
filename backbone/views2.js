var TicTacToe = TicTacToe || {};

TicTacToe.Position = Backbone.View.extend({
  game: null,
  position: null,
  player: null,
  matching: null,

  events: {
    click: "playerMove",
  },

  initialize: function (options) {
    this.el = options.el;
    this.game = options.game;
    this.position = options.position;
    this.matching = options.matching;

    this.clear();
  },

  getPosition: function () {
    return this.position;
  },

  getPlayer: function () {
    return this.player;
  },

  hasSamePlayer: function (other) {
    return other.getPlayer() === this.getPlayer();
  },

  playerMove: function () {
    if (!this.isAvailable()) {
      return;
    }

    this.player = this.game.currentPlayer();
    this.el.innerHTML = this.player.getLabel();

    this.game.trigger("move", this);
  },

  clear: function () {
    this.player = null;
    this.el.innerHTML = "";
  },

  isAvailable: function () {
    return this.player === null;
  },

  matchWin: function () {
    var board = this.game.board;

    var win = _.find(
      this.matching,
      function (combination) {
        return (
          board.getPosition(combination[0]).hasSamePlayer(this) &&
          board.getPosition(combination[1]).hasSamePlayer(this) &&
          board.getPosition(combination[2]).hasSamePlayer(this)
        );
      },
      this
    );

    return win !== undefined;
  },
});

TicTacToe.Board = Backbone.View.extend({
  game: null,
  map: null,
  match: null,

  el: ".box",

  initialize: function (options) {
    this.game = options.game;

    this.configureMap();
  },

  configureMap: function () {
    this.map = [];
    this.match = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    _.each(
      this.$("li"),
      function (element, index) {
        var position = {
          el: element,
          position: index,
          game: this.game,
          matching: this.matchingCombinations(index),
        };

        this.map.push(new TicTacToe.Position(position));
      },
      this
    );
  },

  getPosition: function (index) {
    return this.map[index];
  },

  restart: function () {
    _.each(this.map, function (position) {
      position.clear();
    });
  },

  nextAvailablePosition: function () {
    return _.find(this.map, function (position) {
      return position.isAvailable();
    });
  },

  matchingCombinations: function (positionIndex) {
    return _.filter(
      this.match,
      function (combination) {
        return _.contains(combination, positionIndex);
      },
      this
    );
  },
});

TicTacToe.Game = Backbone.View.extend({
  board: null,
  audioPlayer: null,
  players: null,
  modals: null,

  el: ".stage",

  events: {
    "click .play": "play",
    "click .restart": "restartGame",
  },

  initialize: function () {
    this.players = new TicTacToe.Players();
    this.board = new TicTacToe.Board({ game: this });
    this.audioPlayer = new TicTacToe.AudioPlayer();
    this.modals = TicTacToe.Modal.all();

    this.configureListeners();
    this.players.selectOpponent();
  },

  configureListeners: function () {
    this.players.configureListeners(this);
    this.audioPlayer.configureListeners(this);
    this.modals.setup.configureListeners(this);
    this.modals.winner.configureListeners(this);
    this.modals.tie.configureListeners(this);

    this.listenTo(this, "move", this.nextPlayer);
  },

  play: function () {
    this.board.restart();
    this.currentPlayer().move(this.board);
  },

  restartGame: function () {
    this.board.restart();
    this.players.reset();
  },

  currentPlayer: function () {
    return this.players.getCurrent();
  },

  nextPlayer: function (playedPosition) {
    var player = this.players.next();

    if (this.weHaveAWinner(playedPosition) || this.isATie()) {
      return;
    }

    player.move(this.board);
  },

  weHaveAWinner: function (playedPosition) {
    if (playedPosition && playedPosition.matchWin()) {
      this.trigger("winner", playedPosition.getPlayer());

      return true;
    }

    return false;
  },

  isATie: function () {
    if (!this.board.nextAvailablePosition()) {
      this.trigger("tie");
      return true;
    }

    return false;
  },
});

$(document).ready(function () {
  new TicTacToe.Game();
});
