import { createContext, useContext, useEffect, useState } from "react";

// Core types
export type Suit = "clubs" | "diamonds" | "hearts" | "spades" | "joker";
export type CardValue =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | "J"
  | "Q"
  | "K"
  | "A"
  | -1;

export interface Card {
  suit: Suit;
  value: CardValue;
  show: boolean;
  id: string; // Unique identifier for each card
}

interface DeckState {
  cards: Card[];
  drawn: Card[];
  jokers: boolean;
}

interface DeckContextType {
  createDeck: (deckId: string, includeJokers: boolean, show?: boolean) => void;
  removeDeck: (deckId: string) => void;
  getDeck: (deckId: string) => DeckState | undefined;
  drawCards: (deckId: string, count: number) => Card[];
  returnCards: (deckId: string, cards: Card[]) => void;
  shuffleDeck: (deckId: string) => void;
  toggleCardVisibility: (
    deckId: string,
    cardIds: string[],
    show: boolean
  ) => void;
  setJokers: (deckId: string, enabled: boolean) => void;
}

// Utility functions
const generateCardId = (suit: Suit, value: CardValue): string =>
  `${suit}-${value}`;

const createStandardDeck = (includeJokers: boolean, show = false): Card[] => {
  const suits: Suit[] = ["clubs", "diamonds", "hearts", "spades"];
  const values: CardValue[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

  const cards: Card[] = suits.flatMap((suit) =>
    values.map((value) => ({
      suit,
      value,
      show,
      id: generateCardId(suit, value),
    }))
  );

  if (includeJokers) {
    cards.push(
      {
        suit: "joker",
        value: "b" as CardValue,
        show,
        id: generateCardId("joker", "b" as CardValue),
      },
      {
        suit: "joker",
        value: "r" as CardValue,
        show,
        id: generateCardId("joker", "r" as CardValue),
      }
    );
  }

  return cards;
};

const shuffleCards = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Create the context
export const DeckContext = createContext<DeckContextType | null>(null);

export const DeckProvider = ({ children }: { children: React.ReactNode }) => {
  const [decks, setDecks] = useState<Map<string, DeckState>>(new Map());

  const updateDeckState = (deckId: string, updates: Partial<DeckState>) => {
    setDecks((current) => {
      const newDecks = new Map(current);
      const currentDeck = newDecks.get(deckId);
      if (currentDeck) {
        newDecks.set(deckId, { ...currentDeck, ...updates });
      }
      return newDecks;
    });
  };

  const createDeck = (deckId: string, includeJokers: boolean, show = false) => {
    const initialState: DeckState = {
      cards: shuffleCards(createStandardDeck(includeJokers, show)),
      drawn: [],
      jokers: includeJokers,
    };
    setDecks((current) => new Map(current).set(deckId, initialState));
  };

  const removeDeck = (deckId: string) => {
    setDecks((current) => {
      const newDecks = new Map(current);
      newDecks.delete(deckId);
      return newDecks;
    });
  };

  const drawCards = (deckId: string, count: number): Card[] => {
    const deck = decks.get(deckId);
    if (!deck || deck.cards.length < count) return [];

    const drawnCards = deck.cards.slice(-count);
    const remainingCards = deck.cards.slice(0, -count);

    updateDeckState(deckId, {
      cards: remainingCards,
      drawn: [...deck.drawn, ...drawnCards],
    });

    return drawnCards;
  };

  const returnCards = (deckId: string, cards: Card[]) => {
    const deck = decks.get(deckId);
    if (!deck) return;

    const newDrawn = deck.drawn.filter(
      (card) => !cards.some((returnCard) => returnCard.id === card.id)
    );

    updateDeckState(deckId, {
      cards: [...deck.cards, ...cards],
      drawn: newDrawn,
    });
  };

  const shuffleDeck = (deckId: string) => {
    const deck = decks.get(deckId);
    if (!deck) return;

    updateDeckState(deckId, {
      cards: shuffleCards(deck.cards),
    });
  };

  const toggleCardVisibility = (
    deckId: string,
    cardIds: string[],
    show: boolean
  ) => {
    const deck = decks.get(deckId);
    if (!deck) return;

    const updateCards = (cards: Card[]) =>
      cards.map((card) =>
        cardIds.includes(card.id) ? { ...card, show } : card
      );

    updateDeckState(deckId, {
      cards: updateCards(deck.cards),
      drawn: updateCards(deck.drawn),
    });
  };

  const setJokers = (deckId: string, enabled: boolean) => {
    const deck = decks.get(deckId);
    if (!deck) return;

    updateDeckState(deckId, {
      cards: shuffleCards(createStandardDeck(enabled)),
      drawn: [],
      jokers: enabled,
    });
  };

  const getDeck = (deckId: string) => decks.get(deckId);

  const value: DeckContextType = {
    createDeck,
    removeDeck,
    getDeck,
    drawCards,
    returnCards,
    shuffleDeck,
    toggleCardVisibility,
    setJokers,
  };

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};

// Custom hook for using a specific deck
export const useDeck = (deckId: string) => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDeck must be used within a DeckProvider");
  }

  // Create a deck if it doesn't exist
  useEffect(() => {
    const deck = context.getDeck(deckId);
    if (!deck) {
      context.createDeck(deckId, true);
    }
    return () => {
      context.removeDeck(deckId);
    };
  }, [deckId]);

  const deck = context.getDeck(deckId);

  return {
    cards: deck?.cards ?? [],
    drawn: deck?.drawn ?? [],
    jokers: deck?.jokers ?? false,
    drawCards: (count: number) => context.drawCards(deckId, count),
    returnCards: (cards: Card[]) => context.returnCards(deckId, cards),
    shuffle: () => context.shuffleDeck(deckId),
    toggleCardVisibility: (cardIds: string[], show: boolean) =>
      context.toggleCardVisibility(deckId, cardIds, show),
    setJokers: (enabled: boolean) => context.setJokers(deckId, enabled),
    createDeck: context.createDeck,
  };
};
