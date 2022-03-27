export default class Setting {
  constructor(backCardIndex, difficulty) {
    this.backCardIndex = backCardIndex;
    this.difficulty = difficulty;
  }

  get boardWidth() {
    return this.difficulty.width;
  }

  get boardHeight() {
    return this.difficulty.height;
  }

  get timer() {
    return this.difficulty.maxTimer;
  }
}

export class Difficulty {
  static easy = new Difficulty("easy");
  static normal = new Difficulty("normal");
  static hard = new Difficulty("hard");

  constructor(name) {
    this.name = name;
  }

  get index() {
    switch (this.name) {
      case "easy":
        return 0;
      case "normal":
        return 1;
      case "hard":
        return 2;
    }
  }

  get height() {
    switch (this.name) {
      case "easy":
        return 3;
      case "normal":
        return 4;
      case "hard":
        return 5;
    }
  }

  get width() {
    switch (this.name) {
      case "easy":
        return 4;
      case "normal":
        return 5;
      case "hard":
        return 6;
    }
  }

  get maxTimer() {
    switch (this.name) {
      case "easy":
        return 60;
      case "normal":
        return 80;
      case "hard":
        return 120;
    }
  }
}
