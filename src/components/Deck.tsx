import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/common/Card";
import { useDeck, type Card as CardType } from "@/contexts/DeckContext";
import { usePokerHand } from "@/utils/usePokerHand";

const DeckControls = ({
  cards,
  onShowAll,
  onHideAll,
  onShuffle,
  onReset,
  onToggleJokers,
  onDraw,
  onDrawHand,
  jokersEnabled,
}: {
  cards: CardType[];
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
    <div className="flex flex-wrap gap-2 mx-auto justify-center">
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
      <Button
        variant="outline"
        className="text-foreground"
        onClick={onToggleJokers}
      >
        {jokersEnabled ? "Disable Jokers" : "Enable Jokers"}
      </Button>
    </div>
    <div className="flex gap-2 mx-auto justify-center">
      <Button variant="outline" className="text-foreground" onClick={onDraw}>
        Draw
      </Button>
      <Button
        variant="outline"
        className="text-foreground"
        onClick={onDrawHand}
      >
        Draw Hand
      </Button>
    </div>
    <div className="text-center mt-4 text-sm text-muted-foreground">
      Cards remaining: {cards.length}
    </div>
  </div>
);

const formatCardValue = (card: CardType) => {
  if (typeof card.value === "number") {
    // Convert numerical values to be compatible with poker scoring
    if (card.value === 1) return 14; // Ace is high
    return card.value;
  }
  // Convert face cards to numerical values
  switch (card.value) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 11;
    default:
      return -1; // Handle jokers or invalid values
  }
};

export const HandDisplay = ({ hand }: { hand: any }) => {
  const { checkHand } = usePokerHand();

  // Only calculate poker hand for 5 or fewer cards, excluding jokers
  const showPokerHand =
    hand.length <= 5 &&
    hand.length > 0 &&
    !hand.some((card: any) => card.suit === "joker");

  const pokerHand = showPokerHand
    ? checkHand(
        hand.map((card: any) => ({
          ...card,
          value: formatCardValue(card),
        }))
      )
    : null;

  return (
    <div className="w-full mx-auto my-4">
      {showPokerHand && pokerHand && (
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-foreground">{pokerHand}</h3>
          <p className="text-sm text-muted-foreground">
            {hand.length < 5
              ? `(${5 - hand.length} more cards needed for a full hand)`
              : ""}
          </p>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 flex-wrap">
        {hand.map((card: any) => (
          <Card {...card} key={card.id} show={true} />
        ))}
      </div>
    </div>
  );
};

export const CardDeck = ({ gameId = "demo" }: { gameId?: string }) => {
  const {
    cards,
    drawn,
    jokers,
    drawCards,
    returnCards,
    shuffle,
    toggleCardVisibility,
    setJokers,
    createDeck,
  } = useDeck(gameId);

  const [drawnCards, setDrawnCards] = useState<CardType[]>([]);

  const handleShowAll = () => {
    const cardIds = cards.map((card) => card.id);
    toggleCardVisibility(cardIds, true);
  };

  const handleHideAll = () => {
    const cardIds = cards.map((card) => card.id);
    toggleCardVisibility(cardIds, false);
  };

  const handleShuffle = () => {
    shuffle();
  };

  const handleReset = () => {
    setDrawnCards([]);
    returnCards(drawn);
    createDeck(gameId, jokers, true);
  };

  const handleToggleJokers = () => {
    setJokers(!jokers);
    setDrawnCards([]);
  };

  const handleDraw = () => {
    const newCards = drawCards(1);
    if (newCards.length > 0) {
      setDrawnCards((current) => [...current, ...newCards]);
    }
  };

  const handleDrawHand = () => {
    const newCards = drawCards(5);
    if (newCards.length > 0) {
      setDrawnCards(newCards);
    }
  };

  return (
    <div className="w-full">
      <DeckControls
        cards={cards}
        onShowAll={handleShowAll}
        onHideAll={handleHideAll}
        onShuffle={handleShuffle}
        onReset={handleReset}
        onToggleJokers={handleToggleJokers}
        onDraw={handleDraw}
        onDrawHand={handleDrawHand}
        jokersEnabled={jokers}
      />



      <HandDisplay hand={drawnCards} />

      <div className="flex items-center justify-center gap-2 flex-wrap">
        {cards.map((card) => (
          <Card {...card} key={card.id} />
        ))}
      </div>
    </div>
  );
};
