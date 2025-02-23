import { DeckProvider } from "@/contexts/DeckContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { SoundProvider } from "@/contexts/SoundContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SoundProvider>
      <PlayerProvider>
        <DeckProvider>{children}</DeckProvider>
      </PlayerProvider>
    </SoundProvider>
  );
};
