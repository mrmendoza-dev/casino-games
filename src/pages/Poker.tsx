import "../css/War.css";
import { useState, useEffect } from "react";
import cardBack from "../assets/images/back.png";


export default function Poker() {
  let computerScore = 0;
  let playerScore = 0;
  let remaining = 0;

  function determineCardWinner(card1: any, card2: any) {
    const valueOptions = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "JACK",
      "QUEEN",
      "KING",
      "ACE",
    ];
    const card1ValueIndex = valueOptions.indexOf(card1.value);
    const card2ValueIndex = valueOptions.indexOf(card2.value);

    if (card1ValueIndex > card2ValueIndex) {
      // computerScore++;
      // computerScoreEl.textContent = `Computer score: ${computerScore}`;
      return "Computer wins!";
    } else if (card1ValueIndex < card2ValueIndex) {
      // myScore++;
      // myScoreEl.textContent = `My score: ${myScore}`;
      return "You win!";
    } else {
      return "War!";
    }
  }

  function newDeck() {
    // fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     remainingText.textContent = `Remaining cards: ${data.remaining}`;
    //     deckId = data.deck_id;
    //     console.log(deckId);
    //   });
  }

  function drawCard() {
    // fetch(
    //   `https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     remainingText.textContent = `Remaining cards: ${data.remaining}`;
    //     cardsContainer.children[0].innerHTML = `
    //             <img src=${data.cards[0].image} className="card" />
    //         `;
    //     cardsContainer.children[1].innerHTML = `
    //             <img src=${data.cards[1].image} className="card" />
    //         `;
    //     const winnerText = determineCardWinner(data.cards[0], data.cards[1]);
    //     header.textContent = winnerText;

    //     if (data.remaining === 0) {
    //       drawCardBtn.disabled = true;
    //       if (computerScore > myScore) {
    //         // display "The computer won the game!"
    //         header.textContent = "The computer won the game!";
    //       } else if (myScore > computerScore) {
    //         // display "You won the game!"
    //         header.textContent = "You won the game!";
    //       } else {
    //         // display "It's a tie game!"
    //         header.textContent = "It's a tie game!";
    //       }
    //     }
    //   });
  }

  return (
    <div className="Poker">
      <div className="container">
        <div className="game-board">
          <p className="game-title">Game of War</p>

          <div className="board-header">
            <button id="new-deck" className="game-btn" onClick={newDeck}>
              New Deck
            </button>

            <div>
              <h3 id="my-score">My score: {playerScore}</h3>
              <h3 id="computer-score">Computer score: {computerScore}</h3>
            </div>
            <p>Remaining Cards: {remaining}</p>
          </div>

          <div className="board-main">
            <div id="cards">
              <div className="card-slot">
                <img src={cardBack} className="card" />
              </div>
              <div className="card-slot">
                <img src={cardBack} className="card" />
              </div>
            </div>
          </div>

          <div className="board-footer">
            <button
              id="draw-cards"
              className="game-btn draw"
              onClick={drawCard}
            >
              Draw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
