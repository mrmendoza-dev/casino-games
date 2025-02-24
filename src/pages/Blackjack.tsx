import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/common/Card";
import { useDeck } from "@/contexts/DeckContext";
import type { Card as CardType } from "@/contexts/DeckContext";
import { usePlayer } from "@/contexts/PlayerContext";

// Constants
const STANDARD_DECK_SIZE = 52;
const DEPLETION_THRESHOLD = 0.25;

// Types
type GameStatus = "playing" | "complete";
type CardValue =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface HandDisplayProps {
  hand: CardType[];
  label: string;
  gameStatus: GameStatus;
}

// Helper Functions
export const getBlackjackValue = (value: CardValue): number => {
  if (value === "A") return 11;
  if (value === "K" || value === "Q" || value === "J") return 10;
  return parseInt(value, 10);
};

export const calculateHandValue = (hand: CardType[]) => {
  let value = 0;
  let aces = 0;

  hand.forEach((card) => {
    if (card.value === "A") {
      aces += 1;
      value += 11;
    } else {
      value += getBlackjackValue(card.value as CardValue);
    }
  });

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

const isDeckDepleted = (remainingCards: number): boolean => {
  return remainingCards <= STANDARD_DECK_SIZE * DEPLETION_THRESHOLD;
};

// Components
const HandDisplay = ({ hand, label, gameStatus }: HandDisplayProps) => (
  <div className="w-full p-4 mx-auto">
    <h3 className="text-lg font-semibold text-foreground text-center mb-2">
      {label}{" "}
      {label === "Dealer" && gameStatus === "playing"
        ? ""
        : `(${calculateHandValue(hand)})`}
    </h3>
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {hand.map((card) => (
        <Card {...card} key={card.id} show={card.show} />
      ))}
    </div>
  </div>
);

export const Blackjack = () => {
  const gameId = "blackjack";
  const { cards, drawCards, createDeck } = useDeck(gameId);
    const { handleGameWin, handleGameLoss, handleGamePush, betAmount } = usePlayer();


  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("complete");
  const [message, setMessage] = useState("");

  const createNewDeck = () => {
    const enableJokers = false;
    const showCards = true;
    createDeck(gameId, enableJokers, showCards);
  };
const dealInitialCards = () => {
  if (cards.length < 4) {
    setMessage("Not enough cards in deck");
    return;
  }

  // Clear both hands first
  setDealerHand([]);
  setPlayerHand([]);

  const initialCards = drawCards(4);
  if (initialCards.length === 4) {
    setDealerHand([
      { ...initialCards[1], show: true },
      { ...initialCards[3], show: false },
    ]);
    setPlayerHand([
      { ...initialCards[0], show: true },
      { ...initialCards[2], show: true },
    ]);
    setGameStatus("playing");
    setMessage("Your turn");
  }
};

const dealCards = () => {
  // Clear hands immediately to avoid stale state
  setDealerHand([]);
  setPlayerHand([]);

  if (isDeckDepleted(cards.length)) {
    createNewDeck();
    // Add slight delay before dealing to ensure deck is ready
    setTimeout(() => {
      dealInitialCards();
    }, 100);
    return;
  }
  dealInitialCards();
};

  const stand = () => {
    let currentDealerHand = dealerHand.map((card) => ({ ...card, show: true }));
    setDealerHand(currentDealerHand);

    const dealerPlay = () => {
      if (isDeckDepleted(cards.length)) {
        createNewDeck();
      }

      while (calculateHandValue(currentDealerHand) < 17) {
        const [newCard] = drawCards(1);
        if (!newCard) break;
        currentDealerHand = [...currentDealerHand, { ...newCard, show: true }];
      }

      setDealerHand(currentDealerHand);

      const dealerValue = calculateHandValue(currentDealerHand);
      const playerValue = calculateHandValue(playerHand);

      if (dealerValue > 21) {
        setMessage("Dealer busts! You win!");
        handleGameWin(betAmount);
      } else if (dealerValue > playerValue) {
        setMessage("Dealer wins!");
        handleGameLoss(betAmount);
      } else if (dealerValue < playerValue) {
        setMessage("You win!");
        handleGameWin(betAmount);
      } else {
        setMessage("Push - it's a tie!");
        handleGamePush();
      }

      setGameStatus("complete");
    };

    setTimeout(dealerPlay, 500);
  };

  const hit = () => {
    if (isDeckDepleted(cards.length)) {
      createNewDeck();
    }

    const [newCard] = drawCards(1);
    if (newCard) {
      const newHand = [...playerHand, { ...newCard, show: true }];
      setPlayerHand(newHand);

      const value = calculateHandValue(newHand);
      if (value > 21) {
        setMessage("Bust! Dealer wins");
        handleGameLoss(betAmount); // Add this
        setGameStatus("complete");
        setDealerHand(dealerHand.map((card) => ({ ...card, show: true })));
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Blackjack</h2>
        <p className="text-lg text-foreground">{message}</p>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        {gameStatus === "playing" ? (
          <>
            <Button onClick={hit} className="text-foreground" variant="outline">
              Hit
            </Button>
            <Button
              onClick={stand}
              className="text-foreground"
              variant="outline"
            >
              Stand
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={dealCards}
              className="text-foreground"
              variant="outline"
            >
              Deal
            </Button>
            <Button
              onClick={createNewDeck}
              className="text-foreground"
              variant="outline"
            >
              New Deck
            </Button>
          </>
        )}
      </div>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Cards remaining: {cards.length}
      </div>

      <div className="space-y-0 mx-auto w-full">
        {
          dealerHand.length > 0 && (
            <HandDisplay hand={dealerHand} label="Dealer" gameStatus={gameStatus} />
          )
        }
        {
          playerHand.length > 0 && (
            <HandDisplay hand={playerHand} label="Player" gameStatus={gameStatus} />
          )
        }
      </div>
    </div>
  );
};
