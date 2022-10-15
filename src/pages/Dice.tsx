import "../css/Dice.css";
import { useState, useEffect } from "react";



export default function Dice() {

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  function rollDice() {
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    if (playerTurn) {
      setPlayerScore((prevScore) => prevScore + randomNumber);
    } else {
      setComputerScore((prevScore) => prevScore + randomNumber);
    }

    if (playerScore >= 20) {
      setGameOver(true)
    } else if (computerScore >= 20) {
      setGameOver(true);
    }

    setPlayerTurn(prevTurn => !prevTurn);

  }

  function resetGame() {
    let start = Math.floor(Math.random() * 2) + 1;
    start ? setPlayerTurn(true) : setPlayerTurn(false);
    setPlayerScore(0)
    setComputerScore(0);
  }


  return (
    <div className="Dice">
      <div className="container">
        <div className="game-board">
          <p className="game-title">Dice</p>

          <div className="board-header">
            <p className="game-message">
              {gameOver
                ? playerTurn
                  ? "Player 1 Wins"
                  : "Player 2 Wins"
                : playerTurn
                ? "Player 1 Turn"
                : "Player 2 Turn"}
            </p>
          </div>

          <div className="board-main">
            <div>
              <h1>
                Score:
                <span id="player1Scoreboard">{playerScore}</span>
              </h1>
              <div className="dice active">-</div>
            </div>
            <div>
              <h1>
                Score:
                <span id="player2Scoreboard">{computerScore}</span>
              </h1>
              <div className="dice">-</div>
            </div>
          </div>

          <div className="board-footer">
            <button className="game-btn" id="rollBtn" onClick={rollDice}>
              Roll Dice
            </button>
            <button className="game-btn" id="resetBtn" onClick={resetGame}>
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
