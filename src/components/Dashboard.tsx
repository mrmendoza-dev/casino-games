import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface Player {
  name: string;
  funds: number;
}

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
  const [player, setPlayer] = useState<Player>({
    name: "Player",
    funds: 250,
  });

  const [bet, setBet] = useState(25);

  const resetBet = () => setBet(25);

  const adjustBet = (amount: number) => {
    const newBet = bet + amount;
    if (amount < 0 && newBet > 0) {
      setBet(newBet);
    } else if (amount > 0 && newBet <= player.funds) {
      setBet(newBet);
    }
  };

  const betValues = [-100, -25, -10, -5, -1, 0, 1, 5, 10, 25, 100];

  return (
    <Card
      className="relative max-w-screen-lg mx-auto mt-8 min-w-min bg-cover bg-center shadow-xl overflow-hidden"
      style={{ backgroundImage: "url('/images/blue-table.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <CardContent className="relative z-10 flex justify-center gap-8 p-4">
        {/* Player Info Section */}
        <div className="flex items-center gap-4 text-lg">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/images/avatar.jpg" alt={player.name} />
            <AvatarFallback>{player.name[0]}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <p className="font-semibold">{player.name}</p>
            <p className="text-green-400">${player.funds}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="hover:bg-green-500 hover:text-black transition-colors"
              >
                Add Funds
              </Button>
              <Button
                variant="outline"
                className="hover:bg-red-500 hover:text-black transition-colors"
              >
                Cash Out
              </Button>
            </div>
          </div>
        </div>

        {/* Betting Section */}
        <div className="flex flex-col items-center gap-4 text-lg">
          <div className="text-center">
            <p>Adjust Your Bet</p>
            <p className="text-2xl font-bold text-green-400">${bet}</p>
          </div>

          <div className="grid grid-cols-11 gap-1">
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

              return (
                <BetButton
                  key={value}
                  value={Math.abs(value)}
                  onClick={() => adjustBet(value)}
                  variant={value < 0 ? "minus" : "plus"}
                >
                  {Math.abs(value)}
                </BetButton>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
