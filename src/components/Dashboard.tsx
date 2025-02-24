import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { AddFundsDialog } from "./AddFundsDialog";
import { CashOutDialog } from "./CashOutDialog";

interface BetButtonProps {
  value: number;
  onClick: () => void;
  variant: "minus" | "plus" | "reset";
  children: React.ReactNode;
}

const BetButton = ({ value, onClick, variant, children }: BetButtonProps) => {
  const baseStyles =
    "w-9 h-8 font-medium transition-all duration-200 bg-black/60 hover:scale-105";
  const variantStyles = {
    minus:
      "text-red-500 border border-red-500 hover:bg-red-500 hover:text-black hover:shadow-red-500/50 hover:shadow-glow",
    plus: "text-green-500 border border-green-500 hover:bg-green-500 hover:text-black hover:shadow-green-500/50 hover:shadow-glow",
    reset:
      "text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-black hover:shadow-yellow-500/50 hover:shadow-glow",
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const Dashboard = () => {
  const {
    player,
    betAmount,
    setBet,
    adjustBet,
    resetBet,
    addFunds,
    withdrawFunds,
    maxBet,
  } = usePlayer();

  const handleBetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setBet(value);
  };

  const betValues = [-100, -25, -10, -5, -1, 0, 1, 5, 10, 25, 100];

  return (
    <Card
      className="flex-shrink-0 relative max-w-screen-lg w-full mx-auto mt-4 min-w-min bg-cover bg-center shadow-xl overflow-hidden"
      style={{ backgroundImage: "url('/images/blue-table.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <CardContent className="relative z-10 flex flex-wrap justify-center gap-8 p-4">
        {/* Player Info Section */}
        <div className="flex items-center gap-4 text-lg">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={player.avatar || "/images/avatar.jpg"}
              alt={player.name}
            />
            <AvatarFallback>{player.name[0]}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <p className="font-semibold">{player.name}</p>
            <p className="text-green-400">${player.funds.toLocaleString()}</p>
            <div className="flex gap-2">
              <AddFundsDialog onAddFunds={addFunds} />
              <CashOutDialog
                onCashOut={withdrawFunds}
                maxAmount={player.funds}
              />
            </div>
          </div>
        </div>

        {/* Betting Section */}
        <div className="flex flex-col items-center gap-4 text-lg">
          {/* Current Bet Input */}
          <div className="flex items-center">
            <p className="text-center mr-4">Adjust Your Bet</p>

            <span className="text-xl text-green-400 mr-1">$</span>
            <Input
              value={betAmount}
              onChange={handleBetChange}
              type="number"
              max={player.funds}
              className="w-24 !text-xl text-green-400 bg-transparent border-green-400/20 focus:border-green-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Betting Controls */}
            <div className="flex items-center gap-1">
              {betValues.map((value, index) => {
                if (value === 0) {
                  return (
                    <BetButton
                      key="reset"
                      value={value}
                      onClick={resetBet}
                      variant="reset"
                    >
                      <XIcon className="w-4 h-4" />
                    </BetButton>
                  );
                }

                if (value < 0) {
                  return (
                    <BetButton
                      key={value}
                      value={Math.abs(value)}
                      onClick={() => adjustBet(value)}
                      variant="minus"
                    >
                      {Math.abs(value)}
                    </BetButton>
                  );
                }
              })}

              {/* Positive Value Buttons */}
              {betValues.map((value) => {
                if (value > 0) {
                  return (
                    <BetButton
                      key={value}
                      value={Math.abs(value)}
                      onClick={() => adjustBet(value)}
                      variant="plus"
                    >
                      {value}
                    </BetButton>
                  );
                }
              })}

              {/* Max Bet Button */}
              <BetButton value={player.funds} onClick={maxBet} variant="plus">
                Max
              </BetButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
