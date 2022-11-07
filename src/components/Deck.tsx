import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import "../css/Deck.css"
import Card from "./Card"

export default function Deck() {
  const [deck, setDeck] = useState<
    { suit: any; value: any; show: any; img: any }[]
  >([]);
  const [drawn, setDrawn] = useState<
    { suit: any; value: any; show: any; img: any }[]
  >([]);
  const [jokers, setJokers] = useState(false);
  const [display, setDisplay] = useState(true);
  const [hand, setHand] = useState([]);
  let remainingCards = deck.length;

  const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "j",
    "q",
    "k",
    "a",
  ];

  const suits = ["clubs", "diamonds", "hearts", "spades"];

  const cardValues = {
    a: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    j: 11,
    q: 12,
    k: 13,
  };

  let url =
    "https://mendoza-showcase.s3.us-west-2.amazonaws.com/casino-games/cards";

  function generateDeck() {
    const cards = [];
    suits.map((suit) => {
      values.map((value) => {
        let card = {
          suit: suit,
          value: value,
          show: true,
          img: `${url}/${suit}-${value}.png`,
        };
        cards.push(card);
      });
    });

    if (jokers) {
      cards.push({
        suit: "joker",
        value: "b",
        show: true,
        img: `${url}/joker-b.png`,
      });
      cards.push({
        suit: "joker",
        value: "r",
        show: true,
        img: `${url}/joker-r.png`,
      });
    }
    setDeck(cards);
  }

  function shuffleDeck() {
    function shuffleArray(array: any) {
      let tempArray = array;
      for (let i = tempArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
      }
      return tempArray;
    }
    let shuffledDeck = shuffleArray(deck);
    setDeck([...shuffledDeck]);
  }

  function drawCard() {
    if (deck.length >= 1) {
      let tempList = deck;
      let card: any = tempList.pop();
      card.show = true;
      setDeck([...tempList]);
      setDrawn([...drawn, card]);
      return card;
    }
  }
  function drawHand() {
    let numcards = 5;
    let drawHand: any = [];
    if (deck.length >= numcards) {
      for (let i = 0; i < numcards; i++) {
        let newCard = drawCard();
        // newCard.show = true;
        drawHand.push(newCard);
      }
    }

    console.log(drawHand);
    setHand(drawHand);
    scoreHand(drawHand);
  }

  function hideAll() {
    setDeck((current) =>
      current.map((obj) => {
        if (display) {
          return { ...obj, show: false };
        } else {
          return { ...obj, show: true };
        }
      })
    );
    setDisplay((prevState) => !prevState);
  }

  function resetDeck() {
    generateDeck();
    // shuffleDeck();
    setHand([]);
    setDrawn([]);
  }
  function toggleJokers() {
    setJokers((prevState) => !prevState);
  }



  function scoreHand(cards) {
    // 1. Royal Flush
    // 2. Straight Flush
    // 3. Four of a Kind
    // 4. Full House
    // 5. Flush
    // 6. Straight
    // 7. Three of a Kind
    // 8. Two Pair
    // 9. Pair
    // 10. High Card

    // Organize cards in order
    // Check for Flush (Then Straight, then Royal)
    // Check for pairs (1 Pair, 2 Pairs, 3 of a kind, 4 of a kind, Full House)


    let score = "High Card";

    function checkFlush() {
      let suit = cards[0].suit;

      let flush = cards.every((card: any) => {
        return card.suit === suit;
      });
      console.log(flush);

      return flush;
    }

    if (checkFlush()) {
      score = "Flush";
    }

    
    console.log(score);
    return score;
  }


  //   function toggleHide(id: any) {
  //     setDeck((oldDeck) =>
  //       oldDeck.map((card) => {
  //         return card.id === id ? { ...card, card: !card.show } : card;
  //       })
  //     );

  useEffect(() => {
    generateDeck();
  }, []);






  return (
    <div className="Deck">
      <div className="deck-controls">
        <button className="deck-btn" onClick={hideAll}>
          {display ? "Hide" : "Show"}
        </button>
        <button className="deck-btn" onClick={shuffleDeck}>
          Shuffle
        </button>
        <button className="deck-btn" onClick={drawCard}>
          Draw
        </button>
        <button className="deck-btn" onClick={resetDeck}>
          Reset
        </button>
        <button className="deck-btn" onClick={toggleJokers}>
          {jokers ? "Disable Jokers" : "Enable Jokers"}
        </button>
        <button className="deck-btn" onClick={drawHand}>
          Draw Hand
        </button>
      </div>

      <div className="hand">
        <div className="hand-cards">
          {hand.map((card: any) => {
            return <Card card={card} key={nanoid()} />;
          })}
        </div>
        <p className="hand-score">High Card</p>
      </div>

      <div className="cards">
        {deck.map((card: any) => {
          return <Card card={card} key={nanoid()} />;
        })}
      </div>
    </div>
  );
}
