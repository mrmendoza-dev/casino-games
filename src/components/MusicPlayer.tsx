import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

export const MusicPlayer = () => {
  const {
    isMusicPlaying,
    isSoundEffectsMuted,
    musicVolume,
    effectsVolume,
    toggleMusic,
    toggleSoundEffects,
    setMusicVolume,
    setEffectsVolume,
  } = useSound();

  return (
    <div className="flex items-center gap-4 p-2">
      {/* Music Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 text-foreground"
          onClick={toggleMusic}
        >
          {isMusicPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <div className="w-24">
          <Slider
            value={[musicVolume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setMusicVolume(value[0] / 100)}
            className="w-full"
          />
        </div>
      </div>

      {/* Sound Effects Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 text-foreground"
          onClick={toggleSoundEffects}
        >
          {isSoundEffectsMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
        <div className="w-24">
          <Slider
            value={[effectsVolume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setEffectsVolume(value[0] / 100)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
