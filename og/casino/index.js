let cards = [];
let sum = 0;

let hasBlackJack = false;
let isAlive = false;

let message = "";
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");

let startGameBtn = document.getElementById("start-game-btn");
let newCardBtn = document.getElementById("new-card-btn");
let resetGameBtn = document.getElementById("reset-game-btn");

let ethPrice = 3542;



let playerEl = document.getElementById("player-el");
let balanceEthEl = document.getElementById("balance-eth-el");
let balanceUsdEl = document.getElementById("balance-usd-el");



let betEl = document.getElementById("bet-el");
let priceEl = document.getElementById("price-el");

let bet = 0;
let reward = 0;
let multiplier = 0;



function initGame() {
  bet = 25;
  multiplier = 5;
  reward = bet * multiplier;

  player.name = "Degenerate";
  player.funds = 100;


  updateFunds();
  updateBet(bet);

}


function updateFunds() {
  playerEl.textContent = player.name;
      balanceEthEl.textContent = "Balance: " + player.funds + " ETH";
      balanceUsdEl.textContent = "$" + player.funds * ethPrice;


}

function getRandomCard() {
  let randomNumer = Math.floor(Math.random() * 13) + 1;
  if (randomNumer > 10) {
    return 10;
  } else if (randomNumer === 1) {
    return 11;
  } else {
    return randomNumer;
  }
}
function winGame() {
  player.funds += reward;
  sumEl.style.color = "#0f0";

  updateFunds();
}

function loseGame() {
  player.funds -= bet;
  sumEl.style.color = "#f00";

  updateFunds();
}




function getMessage() {
  let messageList = [
    "You're betting more than you have.",
    "Your money is no good here.",
    "Get Lost.",
  ];
  


  let message = Math.floor(Math.random() * messageList.length);
  return messageList[message];

}



function startGame() {

  sumEl.style.color = "#fff";




  if (bet <= player.funds) {
      isAlive = true;
      hasBlackJack = false;

      let firstCard = getRandomCard();
      let secondCard = getRandomCard();
      cards = [firstCard, secondCard];
      sum = firstCard + secondCard;

      renderGame();
  } else {
        message = getMessage();

       messageEl.textContent = message;

  }


}

function renderGame() {
  cardsEl.textContent = "Cards: ";

  for (let i = 0; i < cards.length; i += 1) {
    cardsEl.textContent += cards[i] + " ";
  }

  sumEl.textContent = "Sum: " + sum;

  if (sum <= 20) {
    message = "Your Move.";
  } else if (sum === 21) {
    message = "You just got lucky.";
    hasBlackJack = true;
    winGame();
  } else {
    message = "Not this time";
    isAlive = false;
    loseGame();
  }
  messageEl.textContent = message;
  updateFunds();
}

function newCard() {
  if (isAlive && !hasBlackJack) {
    let card = getRandomCard();
    sum += card;
    cards.push(card);

    renderGame();
  }
}

function resetGame() {
  renderGame();
}









function updateBet(bet) {
  reward = bet * 5;
  betEl.textContent = bet + " ETH";
  priceEl.textContent = "$" + bet * ethPrice;
}


function resetBet() {
    bet = 25;
    updateBet(bet);
  }

function decrement() {
  if (bet > 1) {
    bet -= 1;
    updateBet(bet);

  }


}

function increment() {
  bet += 1;
    updateBet(bet);

}


