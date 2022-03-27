export default class GameState {
  static menu = new GameState('menu');
  static inGame = new GameState('inGame');
  static paused = new GameState('paused');
  static gameOver = new GameState('gameOver');

  constructor(name) {
    this.name = name;
  }
}