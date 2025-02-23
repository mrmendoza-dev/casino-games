import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface SoundContextType {
  isMusicPlaying: boolean;
  isSoundMuted: boolean;
  musicVolume: number;
  effectsVolume: number;
  toggleMusic: () => void;
  toggleMute: () => void;
  playSound: (soundName: SoundEffect) => void;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  stopAllSounds: () => void;
}

interface SoundProviderProps {
  children: ReactNode;
  defaultMusicVolume?: number;
  defaultEffectsVolume?: number;
}

const SOUND_EFFECTS = {
  card: "/sounds/card-flip.mp3",
  win: "/sounds/chaching.mp3",
  lose: "/sounds/lose.mp3",
  chip: "/sounds/chip.mp3",
  button: "/sounds/button-click.mp3",
} as const;

type SoundEffect = keyof typeof SOUND_EFFECTS;

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({
  children,
  defaultMusicVolume = 0.5,
  defaultEffectsVolume = 0.7,
}: SoundProviderProps) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(defaultMusicVolume);
  const [effectsVolume, setEffectsVolume] = useState(defaultEffectsVolume);
  const [backgroundMusic, setBackgroundMusic] =
    useState<HTMLAudioElement | null>(null);
  const [soundEffects] = useState<Map<string, HTMLAudioElement>>(new Map());

  // Initialize background music
  useEffect(() => {
    const music = new Audio("/sounds/casino-night.mp3");
    music.loop = true;
    music.volume = isSoundMuted ? 0 : musicVolume;
    setBackgroundMusic(music);

    return () => {
      music.pause();
      music.src = "";
    };
  }, []);

  // Handle mute state changes
  useEffect(() => {
    if (backgroundMusic) {
      backgroundMusic.volume = isSoundMuted ? 0 : musicVolume;
    }

    soundEffects.forEach((sound) => {
      sound.volume = isSoundMuted ? 0 : effectsVolume;
    });
  }, [isSoundMuted, musicVolume, effectsVolume, backgroundMusic, soundEffects]);

  // Handle music playing state
  useEffect(() => {
    if (!backgroundMusic) return;

    if (isMusicPlaying && !isSoundMuted) {
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsMusicPlaying(false);
        });
      }
    } else {
      backgroundMusic.pause();
    }
  }, [isMusicPlaying, isSoundMuted, backgroundMusic]);

  const toggleMusic = useCallback(() => {
    setIsMusicPlaying((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsSoundMuted((prev) => !prev);
  }, []);

  const initSoundEffect = useCallback(
    (soundName: SoundEffect) => {
      if (isSoundMuted) return;
      if (!soundEffects.has(soundName)) {
        const audio = new Audio(SOUND_EFFECTS[soundName]);
        audio.volume = isSoundMuted ? 0 : effectsVolume;
        soundEffects.set(soundName, audio);
        return audio;
      }
      return soundEffects.get(soundName)!;
    },
    [soundEffects, isSoundMuted, effectsVolume]
  );

  const playSound = useCallback(
    (soundName: SoundEffect) => {
      if (isSoundMuted) return;
      return;

      const sound: any = initSoundEffect(soundName);
      if (!sound) return;

      // Clone the audio for overlapping sounds
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = effectsVolume;
      soundClone.play().catch(() => {});
    },
    [isSoundMuted, effectsVolume, initSoundEffect]
  );

  const stopAllSounds = useCallback(() => {
    soundEffects.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
    if (backgroundMusic) {
      backgroundMusic.pause();
      setIsMusicPlaying(false);
    }
  }, [backgroundMusic, soundEffects]);

  const value: SoundContextType = {
    isMusicPlaying,
    isSoundMuted,
    musicVolume,
    effectsVolume,
    toggleMusic,
    toggleMute,
    playSound,
    setMusicVolume,
    setEffectsVolume,
    stopAllSounds,
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
