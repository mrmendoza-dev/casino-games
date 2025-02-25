import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface SoundContextType {
  // Music controls
  isMusicPlaying: boolean;
  musicVolume: number;
  toggleMusic: () => void;
  setMusicVolume: (volume: number) => void;

  // Sound effects controls
  isSoundEffectsMuted: boolean;
  effectsVolume: number;
  toggleSoundEffects: () => void;
  setEffectsVolume: (volume: number) => void;

  // Sound playback
  playSound: (soundName: SoundEffect) => void;
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
  bust: "/sounds/bust.mp3",
} as const;

type SoundEffect = keyof typeof SOUND_EFFECTS;

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({
  children,
  defaultMusicVolume = 0.5,
  defaultEffectsVolume = 0.7,
}: SoundProviderProps) => {
  // Music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(defaultMusicVolume);
  const [backgroundMusic, setBackgroundMusic] =
    useState<HTMLAudioElement | null>(null);

  // Sound effects state
  const [isSoundEffectsMuted, setIsSoundEffectsMuted] = useState(false);
  const [effectsVolume, setEffectsVolume] = useState(defaultEffectsVolume);
  const [soundEffects] = useState<Map<string, HTMLAudioElement>>(new Map());

  // Initialize background music
  useEffect(() => {
    const music = new Audio("/sounds/casino-night.mp3");
    music.loop = true;
    music.volume = musicVolume;
    setBackgroundMusic(music);

    return () => {
      music.pause();
      music.src = "";
    };
  }, []);

  // Handle music volume changes
  useEffect(() => {
    if (backgroundMusic) {
      backgroundMusic.volume = musicVolume;
    }
  }, [musicVolume, backgroundMusic]);

  // Handle sound effects volume changes
  useEffect(() => {
    soundEffects.forEach((sound) => {
      sound.volume = isSoundEffectsMuted ? 0 : effectsVolume;
    });
  }, [isSoundEffectsMuted, effectsVolume, soundEffects]);

  // Handle music playing state
  useEffect(() => {
    if (!backgroundMusic) return;

    if (isMusicPlaying) {
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsMusicPlaying(false);
        });
      }
    } else {
      backgroundMusic.pause();
    }
  }, [isMusicPlaying, backgroundMusic]);

  const toggleMusic = useCallback(() => {
    setIsMusicPlaying((prev) => !prev);
  }, []);

  const toggleSoundEffects = useCallback(() => {
    setIsSoundEffectsMuted((prev) => !prev);
  }, []);

  const initSoundEffect = useCallback(
    (soundName: SoundEffect) => {
      if (isSoundEffectsMuted) return;
      if (!soundEffects.has(soundName)) {
        const audio = new Audio(SOUND_EFFECTS[soundName]);
        audio.volume = effectsVolume;
        soundEffects.set(soundName, audio);
        return audio;
      }
      return soundEffects.get(soundName)!;
    },
    [soundEffects, isSoundEffectsMuted, effectsVolume]
  );

  const playSound = useCallback(
    (soundName: SoundEffect) => {
      if (isSoundEffectsMuted) return;

      const sound = initSoundEffect(soundName);
      if (!sound) return;

      // Clone the audio for overlapping sounds
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = effectsVolume;
      soundClone.play().catch(() => {});
    },
    [isSoundEffectsMuted, effectsVolume, initSoundEffect]
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
    // Music controls
    isMusicPlaying,
    musicVolume,
    toggleMusic,
    setMusicVolume,

    // Sound effects controls
    isSoundEffectsMuted,
    effectsVolume,
    toggleSoundEffects,
    setEffectsVolume,

    // Sound playback
    playSound,
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
