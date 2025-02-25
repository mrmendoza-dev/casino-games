import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { usePlayer } from "@/contexts/PlayerContext";

type ResultType = {
  number: number;
  color: string;
};

type BetType = "number" | "section";

type Bet = {
  type: BetType;
  value: string | number;
};

export const RouletteWheel = () => {
  const { player, handleGameWin, handleGameLoss, betAmount } = usePlayer();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [previousResults, setPreviousResults] = useState<ResultType[]>([]);
  const [resultNumber, setResultNumber] = useState("00");
  const [resultColor, setResultColor] = useState("red");
  const [message, setMessage] = useState("Place Your Bets");
  const [currentBet, setCurrentBet] = useState<Bet | null>(null);
  console.log(currentBet);

  const SPIN_TIMER = 3000;
  const RED_NUMBERS = [
    32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3,
  ];
  const NUMBERS = [
    32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
    16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0,
  ];

  const getColor = (number: number): string => {
    if (number === 0) return "green";
    return RED_NUMBERS.includes(number) ? "red" : "black";
  };


  const handlePlaceBet = (bet: Bet) => {
    if (betAmount > player.funds) {
      toast.error("Insufficient funds");
      return;
    }
    setCurrentBet(bet);
    toast.success(`Bet placed: $${betAmount.toLocaleString()} on ${bet.type} ${bet.value}`);
  };

const spin = useCallback(() => {
  if (isSpinning || !currentBet) return;

  const randomNumber = Math.floor(Math.random() * 37);
  const color = getColor(randomNumber);

  // Reset ball position first
  const inner = document.querySelector(".inner") as HTMLElement;
  if (inner) {
    inner.style.transition = "none";
    inner.setAttribute("data-spinto", "");
    inner.offsetHeight;
    inner.style.transition = "";
  }

  setIsSpinning(true);
  setShowResult(false);
  setMessage("No More Bets");

  // Store the current bet and amount
  const thisBet = { ...currentBet };
  const thisBetAmount = betAmount;

  setTimeout(() => {
    setSelectedNumber(randomNumber);
  }, 50);

  setTimeout(() => {
    setResultNumber(randomNumber.toString());
    setResultColor(color);
    setShowResult(true);
    setIsSpinning(false);
    setMessage("Place Your Bets");

    // Calculate and handle winnings
    const winnings = calculateWinnings(
      thisBet,
      thisBetAmount,
      randomNumber,
      color
    );
    if (winnings > 0) {
      handleGameWin(winnings);
      toast.success(`You won $${winnings.toLocaleString()}!`);
    } else {
      handleGameLoss(thisBetAmount);
      toast.error("Better luck next time!");
    }

    setPreviousResults((prev) =>
      [{ number: randomNumber, color }, ...prev].slice(0, 10)
    );
  }, SPIN_TIMER);
}, [isSpinning, currentBet, betAmount, handleGameWin, handleGameLoss]);

  const calculateWinnings = (
    bet: Bet,
    betAmount: number,
    winningNumber: number,
    winningColor: string
  ) => {
    if (!bet) return 0;

    if (bet.type === "number" && bet.value === winningNumber) {
      return betAmount * 35; // 35:1 for single numbers
    }

    if (bet.type === "section") {
      const num = winningNumber;
      switch (bet.value) {
        case "1st12":
          return num >= 1 && num <= 12 ? betAmount * 3 : 0;
        case "2nd12":
          return num >= 13 && num <= 24 ? betAmount * 3 : 0;
        case "3rd12":
          return num >= 25 && num <= 36 ? betAmount * 3 : 0;
        case "1to18":
          return num >= 1 && num <= 18 ? betAmount * 2 : 0;
        case "19to36":
          return num >= 19 && num <= 36 ? betAmount * 2 : 0;
        case "even":
          return num !== 0 && num % 2 === 0 ? betAmount * 2 : 0;
        case "odd":
          return num !== 0 && num % 2 === 1 ? betAmount * 2 : 0;
        case "red":
          return winningColor === "red" ? betAmount * 2 : 0;
        case "black":
          return winningColor === "black" ? betAmount * 2 : 0;
        default:
          return 0;
      }
    }

    return 0;
  };


  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="plate mx-auto" id="plate">
        <ul
          className={`inner ${showResult ? "rest" : ""}`}
          data-spinto={selectedNumber?.toString()}
        >
          {NUMBERS.map((number) => (
            <li key={number} className="number">
              <label>
                <input type="radio" name="pit" value={number} />
                <span className="pit select-none">{number}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className={`data ${showResult ? "reveal" : ""}`}>
          <div className="data-inner select-none">
            <div className="mask">{message}</div>
            <div className="result" style={{ backgroundColor: resultColor }}>
              <div className="result-number">{resultNumber}</div>
              <div className="result-color">{resultColor}</div>
            </div>
          </div>
        </div>
      </div>


      <BettingInterface
        isSpinning={isSpinning}
        onPlaceBet={handlePlaceBet}
        currentBet={currentBet}
        spin={spin}
        betAmount={betAmount}
      />
    </div>
  );
};



export const BettingInterface = ({
  isSpinning,
  onPlaceBet,
  currentBet,
  spin,
  betAmount,
}: {
  isSpinning: boolean;
  onPlaceBet: (bet: Bet) => void;
  betAmount: number;
  currentBet: Bet | null;
  spin: () => void;
}) => {
  const [activeBet, setActiveBet] = useState<{
    type: BetType;
    value: string | number;
  } | null>(null);

  

  const handleBetPlacement = (type: BetType, value: string | number) => {
    setActiveBet({ type, value });
    onPlaceBet({ type, value });
  };

  // Add this before the BettingInterface component
  const sections = [
    { label: "1st 12", value: "1st12" },
    { label: "2nd 12", value: "2nd12" },
    { label: "3rd 12", value: "3rd12" },
    { label: "1 to 18", value: "1to18" },
    { label: "EVEN", value: "even" },
    {
      label: "RED",
      value: "red",
      className: "bg-red-600 hover:bg-red-700 text-white",
    },
    {
      label: "BLACK",
      value: "black",
      className: "bg-black hover:bg-black/90 text-white",
    },
    { label: "ODD", value: "odd" },
    { label: "19 to 36", value: "19to36" },
  ];

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <p> Place Your Bets</p>
          <div className="flex justify-center items-center gap-4">
            <div className="flex justify-between items-center">
              {currentBet && (
                <div className="text-base text-center">
                  ${betAmount.toLocaleString()} on {currentBet.type}{" "}
                  {currentBet.value}
                </div>
              )}
            </div>
          </div>

          <Button
            type="button"
            id="spin"
            onClick={spin}
            disabled={isSpinning || !currentBet}
          >
            <span className="btn-label">Spin</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-1 sm:gap-2">
          {Array.from({ length: 37 }, (_, i) => i).map((number) => (
            <Button
              key={number}
              variant="outline"
              onClick={() => handleBetPlacement("number", number)}
              disabled={isSpinning}
              className={`
        aspect-square w-full min-w-0 p-0 text-sm sm:text-base
        ${
          activeBet?.type === "number" && activeBet.value === number
            ? "ring-2 ring-primary"
            : ""
        } ${
                [
                  32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7,
                  12, 3,
                ].includes(number)
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : number === 0
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-black text-white hover:bg-black/90"
              }`}
            >
              {number}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 sm:gap-2">
          {sections.map((section) => (
            <Button
              key={section.value}
              variant="outline"
              onClick={() => handleBetPlacement("section", section.value)}
              disabled={isSpinning}
              className={`h-12 ${
                activeBet?.type === "section" &&
                activeBet.value === section.value
                  ? "ring-2 ring-primary"
                  : ""
              } ${section.className || ""}`}
            >
              {section.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};