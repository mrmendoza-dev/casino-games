
import { Button } from "@/components/ui/button";
import { Card } from "@/components/common/Card";
import { useState, useEffect } from "react";
import { usePokerHand } from "@/utils/usePokerHand";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// types.ts
export interface Card {
  suit: string;
  value: number;
  show: boolean;
  img: string;
}

export interface HandScore {
  name: string;
  rank: number;
}

// constants.ts
export const SUITS = ["clubs", "diamonds", "hearts", "spades"] as const;

export const CARD_VALUES = {
  a: 14,
  k: 13,
  q: 12,
  j: 11,
  "10": 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
} as const;

// utils/deckUtils.ts
export const generateDeck = (includeJokers: boolean, show: boolean = true): Card[] => {
  const path = "./cards";
  const cards: Card[] = [];

  SUITS.forEach((suit) => {
    Object.entries(CARD_VALUES).forEach(([key, value]) => {
      cards.push({
        suit,
        value,
        show,
        img: `${path}/${suit}-${key}.png`,
      });
    });
  });

  if (includeJokers) {
    cards.push(
      {
        suit: "joker",
        value: -1,
        show,
        img: `${path}/joker-b.png`,
      },
      {
        suit: "joker",
        value: -1,
        show,
        img: `${path}/joker-r.png`,
      }
    );
  }

  return cards;
};

export const shuffleArray = (array: any[]) => {
  const tempArray = [...array];
  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
  }
  return tempArray;
};


// components/controls/DeckControls.tsx
export const DeckControls = ({
  onShowAll,
  onHideAll,
  onShuffle,
  onReset,
  onToggleJokers,
  onDraw,
  onDrawHand,
  jokersEnabled,
}: {
  onShowAll: () => void;
  onHideAll: () => void;
  onShuffle: () => void;
  onReset: () => void;
  onToggleJokers: () => void;
  onDraw: () => void;
  onDrawHand: () => void;
  jokersEnabled: boolean;
}) => (
  <div className="flex flex-col gap-2 p-4">
    <div className="flex gap-2 mx-auto justify-center">
      <Button variant="outline" className="text-foreground" onClick={onShowAll}>
        Show
      </Button>
      <Button variant="outline" className="text-foreground" onClick={onHideAll}>
        Hide
      </Button>
      <Button variant="outline" className="text-foreground" onClick={onShuffle}>
        Shuffle
      </Button>
      <Button variant="outline" className="text-foreground" onClick={onReset}>
        Reset
      </Button>
      <Button variant="outline" className="text-foreground" onClick={onToggleJokers}>
        {jokersEnabled ? "Disable Jokers" : "Enable Jokers"}
      </Button>
    </div>
    <div className="flex gap-2 mx-auto justify-center">
      <Button variant="outline" className="text-foreground" onClick={onDraw}>
        Draw
      </Button>
      <Button variant="outline" className="text-foreground" onClick={onDrawHand}>
        Draw Hand
      </Button>
    </div>
  </div>
);

// components/HandDisplay.tsx
export const HandDisplay = ({ hand, score }: { hand: Card[]; score: string }) => (
  <div className="w-full mx-auto">
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {hand.map((card, index) => (
        <Card {...card} key={index} />
      ))}
    </div>
    <p className="text-2xl font-bold text-foreground text-center py-4">{score}</p>
  </div>
);


// CardDeck.tsx
export const CardDeck = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [drawn, setDrawn] = useState<Card[]>([]);
  const [jokers, setJokers] = useLocalStorage("includeJokers", false);
  const [hand, setHand] = useState<Card[]>([]);
  const [handScore, setHandScore] = useState("");

  const { checkHand } = usePokerHand();

  const handleShowAll = () => setDeck(deck.map(card => ({ ...card, show: true })));
  const handleHideAll = () => setDeck(deck.map(card => ({ ...card, show: false })));
  const handleShuffle = () => setDeck(shuffleArray(deck));


function handleDrawCard() {
  if (deck.length >= 1) {
    const tempDeck = [...deck];
    const drawnCard = tempDeck.pop()!;
    const newCard = { ...drawnCard, show: true };
    setDeck(tempDeck);
    setDrawn([...drawn, newCard]);
    setHand([...hand, newCard]);
    setHandScore(checkHand(hand));
    return newCard;
  }
}

function handleDrawHand() {
  const numCards = 5;

  if (deck.length >= numCards) {
    const tempDeck = [...deck];
    const drawnCards = tempDeck
      .splice(-numCards)
      .map((card) => ({ ...card, show: true }));

    setDeck(tempDeck);
    setDrawn([...drawn, ...drawnCards]);
    setHand(drawnCards);

    const score = checkHand(drawnCards);
    setHandScore(score);
  }
}

  const handleReset = () => {
    const newDeck = generateDeck(jokers, false);
    const shuffledDeck = shuffleArray(newDeck);
    setDeck(shuffledDeck);
    setHand([]);
    setDrawn([]);
    setHandScore("");
  };

  const handleToggleJokers = () => {
    setJokers(!jokers);
    setDeck(generateDeck(!jokers));
  };

  useEffect(() => {
    handleReset();
  }, []);

  return (
    <div className="w-full">
      <DeckControls
        onShowAll={handleShowAll}
        onHideAll={handleHideAll}
        onShuffle={handleShuffle}
        onReset={handleReset}
        onToggleJokers={handleToggleJokers}
        onDraw={handleDrawCard}
        onDrawHand={handleDrawHand}
        jokersEnabled={jokers}
      />

      <HandDisplay hand={hand} score={handScore} />

      <div className="flex items-center justify-center gap-2 flex-wrap">
        {deck.map((card, index) => (
          <Card {...card} key={index} />
        ))}
      </div>
    </div>
  );
};