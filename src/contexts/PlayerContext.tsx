import { useSound } from "@/contexts/SoundContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";

// Types
interface Player {
  name: string;
  funds: number;
  avatar?: string;
}

interface PlayerContextType {
  player: Player;
  betAmount: number;
  updatePlayerName: (name: string) => void;
  updatePlayerFunds: (amount: number) => void;
  updatePlayerAvatar: (avatar: string) => void;
  setBet: (amount: number) => void;
  adjustBet: (amount: number) => void;
  resetBet: () => void;
  maxBet: () => void;
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
  handleGameWin: (winnings: number) => void;
  handleGameLoss: (betAmount: number) => void;
  handleGamePush: () => void;
}

// Context
const PlayerContext = createContext<PlayerContextType | null>(null);

// Provider Component
interface PlayerProviderProps {
  children: ReactNode;
  initialPlayer?: Player;
  initialBet?: number;
}

export const PlayerProvider = ({
  children,
  initialPlayer = {
    name: "Player",
    funds: 250,
  },
  initialBet = 25,
}: PlayerProviderProps) => {
  const [player, setPlayer] = useLocalStorage("player", initialPlayer);
  const [betAmount, setBetAmount] = useLocalStorage("betAmount", initialBet);
  const { playSound } = useSound();

  const updatePlayerName = useCallback((name: string) => {
    setPlayer((prev: Player) => ({ ...prev, name }));
  }, []);

  const updatePlayerFunds = useCallback((amount: number) => {
    setPlayer((prev: Player) => ({ ...prev, funds: amount }));
  }, []);

  const updatePlayerAvatar = useCallback((avatar: string) => {
    setPlayer((prev: Player) => ({ ...prev, avatar }));
  }, []);

  const setBet = useCallback(
    (amount: number) => {
      if (amount >= 0 && amount <= player.funds) {
        setBetAmount(amount);
      }
    },
    [player.funds]
  );

  const adjustBet = useCallback(
    (amount: number) => {
      const newBet = betAmount + amount;
      if (amount < 0 && newBet > 0) {
        setBetAmount(newBet);
      } else if (amount > 0 && newBet <= player.funds) {
        setBetAmount(newBet);
      }
    },
    [betAmount, player.funds]
  );

  const maxBet = useCallback(() => {
    setBetAmount(player.funds);
  }, [player.funds]);

  const resetBet = useCallback(() => {
    setBetAmount(initialBet);
  }, [initialBet]);

  const addFunds = useCallback((amount: number) => {
    setPlayer((prev: Player) => ({
      ...prev,
      funds: prev.funds + amount,
    }));
  }, []);

  const withdrawFunds = useCallback((amount: number) => {
    setPlayer((prev: Player) => ({
      ...prev,
      funds: Math.max(0, prev.funds - amount),
    }));
  }, []);

const handleGameWin = useCallback(
  (winnings: number) => {
    setPlayer((prev: Player) => ({
      ...prev,
      funds: prev.funds + winnings,
    }));
    playSound("win");
  },
  [setPlayer]
);

const handleGameLoss = useCallback(
  (betAmount: number) => {
    setPlayer((prev: Player) => ({
      ...prev,
      funds: prev.funds - betAmount,
    }));
    playSound("lose");
    // playSound("bust");
  },
  [setPlayer]
);

  const handleGamePush = useCallback(() => {
    // No change in funds for a push/tie
  }, []);

  useEffect(() => {
    if (betAmount > player.funds) {
      setBetAmount(player.funds);
    }
  }, [player.funds]);

  const value = {
    player,
    betAmount,
    updatePlayerName,
    updatePlayerFunds,
    updatePlayerAvatar,
    setBet,
    adjustBet,
    maxBet,
    resetBet,
    addFunds,
    withdrawFunds,
    handleGameWin,
    handleGameLoss,
    handleGamePush,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

// Custom Hook
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
