


import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import "../css/Deck.css";



Card.defaultProps = {
  value: "a",
  suit: "spades",
  show: false,
  img: "./cards/back.png",
};


export default function Card(props: any) {
    const card = props.card;

    function getCard() {
    }

    
  return (
    <div className="Card" onClick={getCard}>
      {card.show ? (
        <img className="card-img" src={card.img} />
      ) : (
        <img className="card-back" src={`./cards/back.png`} />
      )}
    </div>
  );
}

