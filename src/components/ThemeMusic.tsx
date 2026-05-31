import { useEffect, useRef, useState } from 'react';
import themeMusicUrl from '../assets/theme-music.mp3';

export function ThemeMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(themeMusicUrl);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const tryPlay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — wait for user gesture
      }
    };
    tryPlay();

    const onGesture = () => {
      if (audioRef.current && audioRef.current.paused && !muted) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener('pointerdown', onGesture, { once: false });
    window.addEventListener('keydown', onGesture, { once: false });

    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => { setPlaying(true); setMuted(false); }).catch(() => {});
    } else {
      const next = !muted;
      audio.muted = next;
      setMuted(next);
    }
  };

  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      className="fixed top-2 left-2 z-[60] px-2.5 py-1 rounded-md bg-black/70 backdrop-blur 
                 border border-white/20 text-white text-[12px] font-mono uppercase tracking-wider
                 hover:bg-black/90 active:scale-95 transition"
    >
      {muted || !playing ? '🔇' : '🎵'}
    </button>
  );
}
