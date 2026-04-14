import { useCallback, useRef } from 'react';

const SOUNDS = {
  spin: { freq: 300, duration: 0.15, type: 'square' as OscillatorType },
  cascade: { freq: 500, duration: 0.2, type: 'sine' as OscillatorType },
  win: { freq: 700, duration: 0.3, type: 'sine' as OscillatorType },
  bigWin: { freq: 900, duration: 0.5, type: 'sine' as OscillatorType },
};

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback((sound: keyof typeof SOUNDS) => {
    try {
      const ctx = getCtx();
      const { freq, duration, type } = SOUNDS[sound];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      if (sound === 'win' || sound === 'bigWin') {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
      }
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not available
    }
  }, [getCtx]);

  return { play };
}
