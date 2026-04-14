import { useCallback, useRef } from 'react';

type SoundName = 'spin' | 'cascade' | 'win' | 'bigWin' | 'reelDrop';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback((sound: SoundName) => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      if (sound === 'spin') {
        // Quick whoosh sweep down
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }

      if (sound === 'reelDrop') {
        // Musical descending tones like tiles clicking into place
        const notes = [880, 784, 698, 659, 587];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.1, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.15);
        });
      }

      if (sound === 'cascade') {
        // Sparkly cascade - rising arpeggio
        const notes = [523, 659, 784, 988, 1175];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.12, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.25);
        });
      }

      if (sound === 'win') {
        // Cheerful win jingle - major chord arpeggio
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.4);
        });
      }

      if (sound === 'bigWin') {
        // Triumphant fanfare - rich chord progression
        const chords = [
          [523, 659, 784],
          [587, 740, 880],
          [659, 784, 1047],
        ];
        chords.forEach((chord, ci) => {
          chord.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + ci * 0.15);
            gain.gain.setValueAtTime(0.12, now + ci * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + ci * 0.15 + 0.5);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + ci * 0.15);
            osc.stop(now + ci * 0.15 + 0.55);
          });
        });
      }
    } catch {
      // Audio not available
    }
  }, [getCtx]);

  return { play };
}
