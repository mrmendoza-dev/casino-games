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


    function generateDeck() {
        const cards = [];
        suits.map((suit)=> {
            values.map((value)=> {
                let card = {suit: suit, value: value, show: true, img: `../src/assets/cards/${suit}-${value}.png`}
                cards.push(card);
            })
        })

        if (jokers) {
            cards.push({
              suit: "joker",
              value: "b",
              show: true,
              img: `../src/assets/cards/joker-b.png`,
            });
            cards.push({
              suit: "joker",
              value: "r",
              show: true,
              img: `../src/assets/cards/joker-r.png`,
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
        let tempList = deck;
        let card: any = tempList.pop();
        setDeck([...tempList]);
        setDrawn([...drawn, card])
        return card;
    }
    function drawHand() {
        let numcards = 5;
        let hand = [];
        for (let i=0; i< numcards; i++) {
            hand.push(drawCard())
        }
        console.log(hand)
    }

    function hideAll() {
        setDeck((current) =>
        current.map((obj) => {
            if (display) {
                return { ...obj, show: false};
            } else {
                return { ...obj, show: true};
            }
        })
        );
        setDisplay(prevState => !prevState)
    }

    function resetDeck() {
        generateDeck();
    }
    function toggleJokers() {
      setJokers(prevState => !prevState);

    }

    function scoreHand() {

    }


    //   function toggleHide(id: any) {
    //     setDeck((oldDeck) =>
    //       oldDeck.map((card) => {
    //         return card.id === id ? { ...card, card: !card.show } : card;
    //       })
    //     );
    //   }



    useEffect(()=> {generateDeck()}, [])


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

        <div className="cards">
          {deck.map((card: any) => {
            return <Card card={card} key={nanoid()} />;
          })}
        </div>
      </div>
    );
}
