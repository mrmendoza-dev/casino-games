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
    const [handScore, setHandScore] = useState("");

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

  const cardValues: any = {
    "a": 14,
    "k": 13,
    "q": 12,
    "j": 11,
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
  };

  let bucketUrl =
    "https://mendoza-showcase.s3.us-west-2.amazonaws.com/casino-games/cards";


  function generateDeck() {
    const cards = [];
    suits.map((suit) => {
      Object.entries(cardValues).map(([key, value]) => {
        let card = {
          suit: suit,
          value: value,
          show: true,
          img: `${bucketUrl}/${suit}-${key}.png`,
        };
        cards.push(card);
      });
    });

    if (jokers) {
      cards.push({
        suit: "joker",
        value: "b",
        show: true,
        img: `${bucketUrl}/joker-b.png`,
      });
      cards.push({
        suit: "joker",
        value: "r",
        show: true,
        img: `${bucketUrl}/joker-r.png`,
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

    setHand(drawHand);
    let score = checkHand(drawHand);
    console.log(score);
    setHandScore(score);

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

function checkHand(hand: any) {
  // Sort the hand in ascending order
  hand.sort((a: any, b: any) => a.value - b.value);
      console.log(hand);
      setHand(hand);


  // Check for Royal Flush
  // let isRoyalFlush = true;
  // for (let i = 8; i < hand.length; i++) {
  //   if (hand[i].value !== 14 || hand[i].suit !== hand[0].suit) {
  //     isRoyalFlush = false;
  //     break;
  //   }
  // }
  // if (isRoyalFlush) return "Royal Flush";

  // Check for Straight Flush
  let isStraightFlush = true;
  for (let i = 1; i < hand.length; i++) {
    if (
      hand[i].value !== hand[i - 1].value + 1 ||
      hand[i].suit !== hand[0].suit
    ) {
      isStraightFlush = false;
      break;
    }
  }
  if (isStraightFlush) return "Straight Flush";

  // Check for Four of a Kind
  let fourOfAKindValue = null;
  for (let i = 0; i < hand.length - 3; i++) {
    if (hand[i].value === hand[i + 3].value) {
      fourOfAKindValue = hand[i].value;
      break;
    }
  }
  if (fourOfAKindValue !== null) return "Four of a Kind";

  // Check for Full House
  let threeOfAKindValue = null;
  let pairValue = null;
  for (let i = 0; i < hand.length - 2; i++) {
    if (hand[i].value === hand[i + 2].value) {
      threeOfAKindValue = hand[i].value;
      break;
    }
  }
  for (let i = 0; i < hand.length - 1; i++) {
    if (
      hand[i].value === hand[i + 1].value &&
      hand[i].value !== threeOfAKindValue
    ) {
      pairValue = hand[i].value;
      break;
    }
  }
  if (threeOfAKindValue !== null && pairValue !== null) return "Full House";

  // Check for Flush
  let isFlush = true;
  for (let i = 1; i < hand.length; i++) {
    if (hand[i].suit !== hand[0].suit) {
      isFlush = false;
      break;
    }
  }
  if (isFlush) return "Flush";

  // Check for Straight
  let isStraight = true;
  for (let i = 1; i < hand.length; i++) {
    if (hand[i].value !== hand[i - 1].value + 1) {
      isStraight = false;
      break;
    }
  }
  if (isStraight) return "Straight";

  // Check for Three of a Kind
  for (let i = 0; i < hand.length - 2; i++) {
    if (hand[i].value === hand[i + 2].value) {
      return "Three of a Kind";
    }
  }

  // Check for Two Pairs
  let firstPairValue = null;
  let secondPairValue = null;
  for (let i = 0; i < hand.length - 1; i++) {
    if (hand[i].value === hand[i + 1].value) {
      if (firstPairValue === null) {
        firstPairValue = hand[i].value;
      } else {
        secondPairValue = hand[i].value;
        break;
      }
    }
  }
  if (firstPairValue !== null && secondPairValue !== null) return "Two Pairs";

  // Check for One Pair
  for (let i = 0; i < hand.length - 1; i++) {
    if (hand[i].value === hand[i + 1].value) {
      return "One Pair";
    }
  }

  // If no hand is found, return High Card
  return "High Card";
}

  useEffect(() => {
    generateDeck();
  }, []);






  return (
    <div className="Deck">
      <div className="deck-controls">
        <button className="btn" onClick={hideAll}>
          {display ? "Hide" : "Show"}
        </button>
        <button className="btn" onClick={shuffleDeck}>
          Shuffle
        </button>
        <button className="btn" onClick={drawCard}>
          Draw
        </button>
        <button className="btn" onClick={resetDeck}>
          Reset
        </button>
        <button className="btn" onClick={toggleJokers}>
          {jokers ? "Disable Jokers" : "Enable Jokers"}
        </button>
        <button className="btn" onClick={drawHand}>
          Draw Hand
        </button>
      </div>

      <div className="hand">
        <div className="hand-cards">
          {hand.map((card: any) => {
            return <Card card={card} key={nanoid()} />;
          })}
        </div>
        <p className="hand-score">{handScore}</p>
      </div>

      <div className="cards">
        {deck.map((card: any) => {
          return <Card card={card} key={nanoid()} />;
        })}
      </div>
    </div>
  );
}
