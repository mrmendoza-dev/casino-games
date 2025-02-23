import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSound } from "@/contexts/SoundContext";

// Types
interface Player {
  name: string;
  funds: number;
  avatar?: string;
}

interface PlayerContextType {
  player: Player;
  currentBet: number;
  updatePlayerName: (name: string) => void;
  updatePlayerFunds: (amount: number) => void;
  updatePlayerAvatar: (avatar: string) => void;
  setBet: (amount: number) => void;
  adjustBet: (amount: number) => void;
  resetBet: () => void;
  maxBet: () => void;
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
  handleGameWin: () => void;
  handleGameLoss: () => void;
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
  const [currentBet, setCurrentBet] = useLocalStorage("currentBet", initialBet);
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
        setCurrentBet(amount);
      }
    },
    [player.funds]
  );

  const adjustBet = useCallback(
    (amount: number) => {
      const newBet = currentBet + amount;
      if (amount < 0 && newBet > 0) {
        setCurrentBet(newBet);
      } else if (amount > 0 && newBet <= player.funds) {
        setCurrentBet(newBet);
      }
    },
    [currentBet, player.funds]
  );

  const maxBet = useCallback(() => {
    setCurrentBet(player.funds);
  }, [player.funds]);

  const resetBet = useCallback(() => {
    setCurrentBet(initialBet);
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


    const handleGameWin = useCallback(() => {
      setPlayer((prev: Player) => ({
        ...prev,
        funds: prev.funds + currentBet, // Add winnings to funds
      }));
      playSound("win");
    }, [currentBet]);

    const handleGameLoss = useCallback(() => {
      setPlayer((prev: Player) => ({
        ...prev,
        funds: prev.funds - currentBet, // Subtract loss from funds
      }));
      playSound("lose");
    }, [currentBet]);

      const handleGamePush = useCallback(() => {
        // No change in funds for a push/tie
      }, []);


    useEffect(() => {
      if (currentBet > player.funds) {
        setCurrentBet(player.funds);
      }
    }, [player.funds]);


  const value = {
    player,
    currentBet,
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
