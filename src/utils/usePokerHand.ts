import { type Card } from "@/components/Deck";

type PokerHand =
  | "Royal Flush"
  | "Straight Flush"
  | "Four of a Kind"
  | "Full House"
  | "Flush"
  | "Straight"
  | "Three of a Kind"
  | "Two Pair"
  | "One Pair"
  | "High Card";

export const usePokerHand = () => {
  const isFlush = (hand: Card[]): boolean => {
    return hand.every((card) => card.suit === hand[0].suit);
  };

  const isStraight = (hand: Card[]): boolean => {
    // Handle Ace-low straight (A,2,3,4,5)
    if (
      hand[0].value === 2 &&
      hand[1].value === 3 &&
      hand[2].value === 4 &&
      hand[3].value === 5 &&
      hand[4].value === 14
    ) {
      return true;
    }

    // Regular straight check
    for (let i = 1; i < hand.length; i++) {
      if (hand[i].value !== hand[i - 1].value + 1) {
        return false;
      }
    }
    return true;
  };

  const getCardCounts = (hand: Card[]): Map<number, number> => {
    const counts = new Map<number, number>();
    hand.forEach((card) => {
      counts.set(card.value, (counts.get(card.value) || 0) + 1);
    });
    return counts;
  };

  const checkHand = (hand: Card[]): PokerHand => {
    if (hand.length !== 5) {
      throw new Error("Hand must contain exactly 5 cards");
    }

    // Sort hand by value
    const sortedHand = [...hand].sort((a, b) => a.value - b.value);

    const hasFlush = isFlush(sortedHand);
    const hasStraight = isStraight(sortedHand);

    // Check for Royal Flush and Straight Flush
    if (hasFlush && hasStraight) {
      if (sortedHand[0].value === 10 && sortedHand[4].value === 14) {
        return "Royal Flush";
      }
      return "Straight Flush";
    }

    // Get counts of each card value
    const cardCounts = getCardCounts(sortedHand);
    const countValues = Array.from(cardCounts.values());

    // Check for Four of a Kind
    if (countValues.includes(4)) {
      return "Four of a Kind";
    }

    // Check for Full House
    if (countValues.includes(3) && countValues.includes(2)) {
      return "Full House";
    }

    // Check for Flush
    if (hasFlush) {
      return "Flush";
    }

    // Check for Straight
    if (hasStraight) {
      return "Straight";
    }

    // Check for Three of a Kind
    if (countValues.includes(3)) {
      return "Three of a Kind";
    }

    // Check for Two Pair
    if (countValues.filter((count) => count === 2).length === 2) {
      return "Two Pair";
    }

    // Check for One Pair
    if (countValues.includes(2)) {
      return "One Pair";
    }

    return "High Card";
  };

  return { checkHand };
};
