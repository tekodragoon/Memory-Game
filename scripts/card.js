import Setting from './setting.js';

let imagePairValue = new Map();

export default class Cards {
  #cards;
  #cardToCheck;
  #backCardIndex;
  #gridWidth;
  #gridHeight;
  #busy;
  #victory;
  #gamePaused;
  constructor(gameBoard, setting) {
    this.#gridHeight = setting.boardHeight;
    this.#gridWidth = setting.boardWidth;
    gameBoard.style.setProperty("--boardCardWidth", this.#gridWidth);
    gameBoard.style.setProperty("--boardCardHeight", this.#gridHeight);
    gameBoard.style.backgroundColor = "hsla(0, 60%, 40%, 0.6)";
    this.#backCardIndex = setting.backCardIndex;
    this.#cards = createCardGame(gameBoard, this.#gridWidth, this.#gridHeight).map(
      (cardElement, index) => {
        return new card(cardElement, 0, 0, Math.floor(index / 2));
      }
    );
    this.#busy = false;
    this.#victory = false;
    this.#gamePaused = false;
  }

  /**
   * @param {boolean} value
   */
  set pause(value) {
    this.#gamePaused = value;
  }

  get pause() {
    return this.#gamePaused;
  }

  get victory() {
    return this.#victory;
  }

  randomizeCard() {
    imagePairValue = new Map();
    // randomize card
    for (let i = this.#cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.#cards[i], this.#cards[j]] = [this.#cards[j], this.#cards[i]];
    }
    //calculate xy position
    setTimeout(() => {
      this.#cards.forEach((card, index) => {
        card.xVal = index % this.#gridWidth;
        card.yVal = Math.floor(index / this.#gridWidth);
        card.cardElement.classList.remove('hide');
        card.cardElement.style.setProperty("--x", card.x);
        card.cardElement.style.setProperty("--y", card.y);
      });
    }, 500);
  }

  addCardContent() {
    // add all html element inside card div
    this.#cards.forEach((card) => {
      addToCard(card, this.#backCardIndex);
    });
  }

  flipCard(index) {
    if (this.#busy || this.#gamePaused) return;
    // card already founded ?
    if (this.#cards[index].founded) {
      return;
    }
    // try already check this card ?
    if (this.#cards[index] === this.#cardToCheck) {
      return;
    }
    this.#busy = true;
    // flip the card
    this.#cards[index].cardElement.classList.add("visible");
    // if no card is flipped
    if (this.#cardToCheck == null) {
      this.#cardToCheck = this.#cards[index];
      setTimeout(() => {
        this.#busy = false;
      }, 300);
      return;
    }
    // check if cards match
    if (this.#cardToCheck.pairValue === this.#cards[index].pairValue) {
      this.#cardToCheck.found = true;
      this.#cards[index].found = true;
      this.#cardToCheck = null;
      // check victory
      if (
        !this.#cards.some((card) => {
          return card.founded == false;
        })
      ) {
        this.#victory = true;
      }
      setTimeout(() => {
        this.#busy = false;
      }, 300);
      return;
    }
    // mismatch. Flip over cards after delay
    setTimeout(() => {
      this.#cardToCheck.cardElement.classList.remove("visible");
      this.#cards[index].cardElement.classList.remove("visible");
      this.#busy = false;
      this.#cardToCheck = null;
    }, 1000);
  }

  get cards() {
    return this.#cards;
  }
}

// card class => position, pairValue and found state
class card {
  #cardElement;
  #x;
  #y;
  #pairValue;
  #founded;
  constructor(cardElement, x, y, pairValue) {
    this.#cardElement = cardElement;
    this.#x = x;
    this.#y = y;
    this.#pairValue = pairValue;
    this.#founded = false;
  }

  get x() {
    return this.#x;
  }

  /**
   * @param {number} value
   */
  set xVal(value) {
    this.#x = value;
  }

  get y() {
    return this.#y;
  }

  /**
   * @param {number} value
   */
  set yVal(value) {
    this.#y = value;
  }

  get pairValue() {
    return this.#pairValue;
  }

  get cardElement() {
    return this.#cardElement;
  }

  /**
   * @param {boolean} value
   */
  set found(value) {
    this.#founded = value;
  }

  get founded() {
    return this.#founded;
  }
}

//create card root element and add to board
function createCardGame(gameBoard, width, height) {
  let cards = [];
  for (let i = 0; i < width * height; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("hide");
    cards.push(card);
    gameBoard.appendChild(card);
  }
  return cards;
}

// add card html element structure
function addToCard(card, backCardIndex) {
  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");
  card.cardElement.appendChild(cardContent);
  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");
  cardContent.appendChild(cardBack);
  const imgBack = document.createElement("img");
  imgBack.src = `Assets/backcard/backcard0${backCardIndex}.png`;
  imgBack.alt = "backCard";
  cardBack.appendChild(imgBack);
  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");
  cardContent.appendChild(cardFront);
  const imgFront = document.createElement("img");
  imgFront.src = getRandomImage(card);
  imgFront.alt = card.pairValue;
  cardFront.appendChild(imgFront);
}

function getRandomImage(card) {
  let key = card.pairValue.toString();
  let randIndex;
  if (imagePairValue.has(key)) {
    randIndex = imagePairValue.get(key);
  } else {
    let valueCorrect = false;
    while (!valueCorrect) {
      randIndex = Math.floor(Math.random() * 117 + 1)
      .toString()
      .padStart(3, "0");
      valueCorrect = true;
      for (let value of imagePairValue.values()) {
        if (value === randIndex) {
          console.log('value already set');
          valueCorrect = false;
          break;
        }
      }
    }
    imagePairValue.set(key, randIndex);
  }
  return `Assets/Images/${randIndex}.png`;
}