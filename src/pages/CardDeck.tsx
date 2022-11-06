
import Deck from "../components/Deck";
import "../css/Deck.css";
import { useState, useEffect } from "react";

export default function Dice() {


  return (
    <div className="CardDeck">
      <div className="game-board">
        <Deck />
      </div>
    </div>
  );
}
