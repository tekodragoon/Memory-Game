import Cards from "./card.js";
import GameState from "./gamestate.js";
import Setting, { Difficulty } from "./setting.js";

const gameBoard = document.getElementById("board-cards");
const startButton = document.getElementById("startButton");
const imageButton = document.getElementById("imageButton");
const menuButton = document.getElementById("menuButton");
const timer = document.getElementById("timer");
const timerFill = document.getElementById("timerFill");
const gameSetting = new Setting(0, Difficulty.easy);

let timeMaxValue;
let timeRemaining;
let counter;
let cardGame;
let gameState = GameState.menu;
let settingMenuOpen = false;
let victory = false;

startButton.addEventListener("click", function () {
  switch (gameState) {
    case GameState.menu:
      initGame();
      break;
    case GameState.inGame:
      pauseGame();
      break;
    case GameState.paused:
      restart();
      break;
    case GameState.gameOver:
      break;
  }
});

menuButton.addEventListener("click", function () {
  showSettingMenu();
});

function initGame() {
  gameBoard.innerHTML = "";
  cardGame = new Cards(gameBoard, gameSetting);
  cardGame.randomizeCard();
  cardGame.addCardContent();
  timer.style.display = "block";

  cardGame.cards.forEach((card, index) => {
    card.cardElement.addEventListener("click", function () {
      cardGame.flipCard(index);
    });
  });

  timeMaxValue = gameSetting.timer;
  timeRemaining = timeMaxValue;
  gameState = GameState.inGame;
  victory = false;
  startButton.classList.remove("hide");
  startButton.classList.add("inGame");
  imageButton.classList.add("pause");
  menuButton.classList.add("hide");
  setTimeout(() => {
    counter = startCountDown();
  }, 1000);
}

function startCountDown() {
  return setInterval(() => {
    if (!cardGame.pause) {
      timeRemaining -= 0.1;
      let percent = Math.max((timeRemaining * 100) / timeMaxValue, 0);
      timerFill.style.setProperty("--timeRemaining", `${percent}%`);
      if (timeRemaining <= 0) {
        showGameOver();
      }
      if (cardGame.victory) {
        victory = true;
        showGameOver();
      }
    }
  }, 100);
}

function stopCountDown() {
  clearInterval(counter);
  gameState = GameState.gameOver;
  startButton.classList.add("hide");
  cardGame.cards.forEach((card) => {
    card.cardElement.classList.add("hide");
  });
  menuButton.classList.remove("hide");
  timer.style.display = "none";
}

function setGameBoardToMenu() {
  gameBoard.innerHTML = "";
  gameBoard.style.setProperty("--boardCardWidth", 7);
  gameBoard.style.setProperty("--boardCardHeight", 6);
  gameBoard.style.backgroundColor = "hsl(300, 80%, 5%)";
}

function hideGameBoard() {
  gameBoard.innerHTML = "";
  gameBoard.style.removeProperty("--boardCardWidth");
  gameBoard.style.removeProperty("--boardCardHeight");
}

function showGameOver() {
  stopCountDown();
  const messageBox = document.createElement("div");
  messageBox.classList.add("messageBox");
  messageBox.classList.add("gameover");
  const message = document.createElement("span");
  message.innerText = `you ${victory ? "win" : "lose"}!!`;
  const restartMessage = document.createElement("span");
  restartMessage.innerText = "another game ?";
  restartMessage.classList.add("question");
  const restartButton = document.createElement("div");
  restartButton.classList.add("anotherGame");
  restartButton.addEventListener("click", function () {
    initGame();
  });
  setTimeout(() => {
    setGameBoardToMenu();
    gameBoard.appendChild(messageBox);
    messageBox.appendChild(message);
    messageBox.appendChild(restartMessage);
    messageBox.appendChild(restartButton);
  }, 500);
}

function showSettingMenu() {
  // game is not started yet
  if (settingMenuOpen && gameState === GameState.menu) {
    startButton.classList.remove("hide");
    hideGameBoard();
    settingMenuOpen = false;
    return;
  }
  // settingMenu is open ?
  if (settingMenuOpen) {
    settingMenuOpen = false;
    showGameOver();
    return;
  }
  // if game is not started hide start button
  if (gameState === GameState.menu) {
    startButton.classList.add("hide");
  }
  settingMenuOpen = true;
  setGameBoardToMenu();
  const messageBox = document.createElement("div");
  messageBox.classList.add("messageBox");
  gameBoard.appendChild(messageBox);
  // setting menu title
  const title = document.createElement("span");
  title.innerText = "setting";
  messageBox.appendChild(title);
  // setting menu back card
  const backCardSettingBox = document.createElement("div");
  backCardSettingBox.style.display = "flex";
  messageBox.appendChild(backCardSettingBox);
  for (let i = 0; i < 4; i++) {
    const option = document.createElement("div");
    option.classList.add("backCardOption");
    option.style.backgroundImage = `url(Assets/backcard/backcard0${i}.png)`;
    option.style.backgroundSize = "contain";
    option.style.margin = `0 1vmin`;
    if (i === gameSetting.backCardIndex) {
      option.style.boxShadow = "0 0 20px white";
    }
    option.addEventListener("click", function () {
      setBackcard(i);
    });
    backCardSettingBox.appendChild(option);
  }
  // setting menu difficulty option
  const difficultySettingBox = document.createElement("div");
  difficultySettingBox.style.display = "flex";
  messageBox.appendChild(difficultySettingBox);
  for (let i = 0; i < 3; i++) {
    const option = document.createElement("div");
    option.classList.add("difficultyOption");
    option.style.backgroundImage = `url(Assets/Shapes/${i}-pattern.png)`;
    option.style.backgroundSize = "contain";
    option.style.margin = `0 1vmin`;
    if (i === gameSetting.difficulty.index) {
      option.style.boxShadow = "0 0 20px white";
    }
    option.addEventListener("click", function () {
      setDifficulty(i);
    });
    difficultySettingBox.appendChild(option);
  }
}

function setBackcard(index) {
  gameSetting.backCardIndex = index;
  const backCardOptions = document.getElementsByClassName("backCardOption");
  for (let i = 0; i < backCardOptions.length; i++) {
    backCardOptions[i].style.boxShadow = "";
    if (i === gameSetting.backCardIndex) {
      backCardOptions[i].style.boxShadow = "0 0 20px white";
    }
  }
}

function setDifficulty(index) {
  switch (index) {
    case 0:
      gameSetting.difficulty = Difficulty.easy;
      break;
    case 1:
      gameSetting.difficulty = Difficulty.normal;
      break;
    case 2:
      gameSetting.difficulty = Difficulty.hard;
      break;
  }
  const difficultyOptions = document.getElementsByClassName("difficultyOption");
  for (let i = 0; i < difficultyOptions.length; i++) {
    difficultyOptions[i].style.boxShadow = "";
    if (i === gameSetting.difficulty.index) {
      difficultyOptions[i].style.boxShadow = "0 0 20px white";
    }
  }
}

function pauseGame() {
  gameState = GameState.paused;
  imageButton.classList.remove("pause");
  imageButton.classList.add("start");
  cardGame.pause = true;
}

function restart() {
  gameState = GameState.inGame;
  imageButton.classList.remove("start");
  imageButton.classList.add("pause");
  cardGame.pause = false;
}
