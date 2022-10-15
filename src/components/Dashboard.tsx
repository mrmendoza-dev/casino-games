
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import "../css/Dashboard.css"
import avatar from "../assets/images/avatar.jpg"

export default function Dashboard(props: any) {

const [player, setPlayer] = useState({
      name: "Degenerate",
      funds: 250,
    });

const [bet, setBet] = useState(25)

  

function resetBet() {
  setBet(25);
}

function decrement(multi: any) {
  if (bet - 1 * multi > 0) {
    setBet((prevBet) => prevBet - 1 * multi);
  }
}

function increment(multi: any) {
  setBet((prevBet) => prevBet + 1 * multi);
}



  return (
    <div className="Dashboard">
      <div className="player-info">
        <img src={avatar} className="profile-avatar" />
        <div>
          <p>{player.name}</p>
          <p>${player.funds}</p>
        </div>
      </div>

      <div className="betting-menu">
        <div className="betting">
          <p>Adjust Your Bet</p>
          <p>${bet}</p>
        </div>

        <div className="bet-btns">
          <button
            onClick={() => {
              decrement(10);
            }}
            className="bet-btn bet-minus"
          >
            10
          </button>
          <button
            onClick={() => {
              decrement(5);
            }}
            className="bet-btn bet-minus"
          >
            5
          </button>
          <button
            onClick={() => {
              decrement(1);
            }}
            className="bet-btn bet-minus"
          >
            1
          </button>

          <button onClick={resetBet} className="bet-btn bet-reset">
            X
          </button>

          <button
            onClick={() => {
              increment(1);
            }}
            className="bet-btn bet-plus"
          >
            1
          </button>
          <button
            onClick={() => {
              increment(5);
            }}
            className="bet-btn bet-plus"
          >
            5
          </button>
          <button
            onClick={() => {
              increment(10);
            }}
            className="bet-btn bet-plus"
          >
            10
          </button>
        </div>
      </div>
    </div>
  );
}

