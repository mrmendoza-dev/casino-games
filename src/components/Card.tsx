


import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import "../css/Deck.css";

Card.defaultProps = {
  value: "a",
  suit: "spades",
  show: false,
  img: "../src/assets/cards/back.png",
};


export default function Card(props: any) {

    const card = props.card;
    let url = "https://mendoza-showcase.s3.us-west-2.amazonaws.com/casino-games/cards";

    function getCard() {
        console.log(card);
    }

    
  return (
    <div className="Card" onClick={getCard}>
      {card.show ? (
        <img className="card-img" src={card.img} />
      ) : (
        <img className="card-back" src={`${url}/back.png`} />
      )}
    </div>
  );
}

