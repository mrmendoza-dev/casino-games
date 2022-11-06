import "../css/Blackjack.css";
import { useState, useEffect } from "react";

export default function Blackjack() {
  const [cards, setCards] = useState([])
  let sum = 0;
  let hasBlackJack = false;
  let isAlive = false;

  function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1;
    if (randomNumber > 10) {
      return 10;
    } else if (randomNumber === 1) {
      return 11;
    } else {
      return randomNumber;
    }
  }

  function startGame() {
    isAlive = true;
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    // cards = [firstCard, secondCard];
    sum = firstCard + secondCard;
    renderGame();
  }

  function renderGame() {
    // cardsEl.textContent = "Cards: ";
    // for (let i = 0; i < cards.length; i++) {
    //   cardsEl.textContent += cards[i] + " ";
    // }

    // sumEl.textContent = "Sum: " + sum;
    // if (sum <= 20) {
    //   message = "Do you want to draw a new card?";
    // } else if (sum === 21) {
    //   message = "You've got Blackjack!";
    //   hasBlackJack = true;
    // } else {
    //   message = "You're out of the game!";
    //   isAlive = false;
    // }
    // messageEl.textContent = message;
  }

  function newCard() {
    if (isAlive === true && hasBlackJack === false) {
      let card = getRandomCard();
      sum += card;
      // cards.push(card);
      renderGame();
    }
  }

  return (
    <div className="Blackjack">
      <div className="container">
        <div className="game-board">
          <p className="game-title">Blackjack</p>

          <div className="board-header">
            <p>Want to play a round?</p>
          </div>

          <div className="board-main">
            <div className="cards-drawn"></div>
            <p >Total: </p>
          </div>

          <div className="board-footer">

            <button
              className="game-btn"
              onClick={startGame}
            >
              START GAME
            </button>
            <button className="game-btn" onClick={newCard}>
              NEW CARD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
