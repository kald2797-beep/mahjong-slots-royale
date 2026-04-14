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

  const playNote = useCallback((ctx: AudioContext, freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.setValueAtTime(volume * 0.8, startTime + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }, []);

  const play = useCallback((sound: SoundName) => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      if (sound === 'spin') {
        // Slot machine lever pull — quick percussive click + sweep
        // Click
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(1200, now);
        clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        clickGain.gain.setValueAtTime(0.06, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        clickOsc.connect(clickGain).connect(ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.1);

        // Soft rolling whoosh
        const noise = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        noise.type = 'sawtooth';
        noise.frequency.setValueAtTime(400, now + 0.05);
        noise.frequency.linearRampToValueAtTime(150, now + 0.3);
        noiseGain.gain.setValueAtTime(0.03, now + 0.05);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        noise.connect(noiseGain).connect(ctx.destination);
        noise.start(now + 0.05);
        noise.stop(now + 0.35);
      }

      if (sound === 'reelDrop') {
        // Mahjong tiles landing — pentatonic "tik tik tik" with reverb feel
        const pentatonic = [1318, 1175, 987, 880, 784]; // E6 D6 B5 A5 G5
        pentatonic.forEach((freq, i) => {
          // Main tone
          playNote(ctx, freq, now + i * 0.055, 0.1, 'sine', 0.07);
          // Harmonic shimmer
          playNote(ctx, freq * 2, now + i * 0.055, 0.06, 'sine', 0.02);
        });
        // Landing thud
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(120, now + 0.3);
        thud.frequency.exponentialRampToValueAtTime(60, now + 0.45);
        thudGain.gain.setValueAtTime(0.08, now + 0.3);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start(now + 0.3);
        thud.stop(now + 0.5);
      }

      if (sound === 'cascade') {
        // Sparkling waterfall — fast rising shimmer
        const notes = [784, 880, 987, 1175, 1318, 1568]; // G5 A5 B5 D6 E6 G6
        notes.forEach((freq, i) => {
          playNote(ctx, freq, now + i * 0.04, 0.18, 'sine', 0.08);
          playNote(ctx, freq * 1.5, now + i * 0.04 + 0.01, 0.12, 'triangle', 0.03);
        });
      }

      if (sound === 'win') {
        // Chinese-inspired happy jingle — pentatonic melody
        const melody = [
          { f: 784, t: 0 },      // G5
          { f: 987, t: 0.1 },    // B5
          { f: 1175, t: 0.2 },   // D6
          { f: 1318, t: 0.3 },   // E6
          { f: 1568, t: 0.45 },  // G6
        ];
        melody.forEach(({ f, t }) => {
          playNote(ctx, f, now + t, 0.25, 'sine', 0.1);
          playNote(ctx, f * 0.5, now + t, 0.2, 'triangle', 0.04); // octave below
        });
        // Final shimmer chord
        [1568, 1975, 2349].forEach(f => {
          playNote(ctx, f, now + 0.55, 0.4, 'sine', 0.05);
        });
      }

      if (sound === 'bigWin') {
        // Grand fanfare — layered pentatonic celebration
        // Drum hits
        [0, 0.15, 0.3].forEach(t => {
          const drum = ctx.createOscillator();
          const drumGain = ctx.createGain();
          drum.type = 'sine';
          drum.frequency.setValueAtTime(150, now + t);
          drum.frequency.exponentialRampToValueAtTime(50, now + t + 0.15);
          drumGain.gain.setValueAtTime(0.12, now + t);
          drumGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.15);
          drum.connect(drumGain).connect(ctx.destination);
          drum.start(now + t);
          drum.stop(now + t + 0.2);
        });

        // Ascending melody
        const melody = [
          { f: 659, t: 0.05 },   // E5
          { f: 784, t: 0.15 },   // G5
          { f: 987, t: 0.25 },   // B5
          { f: 1175, t: 0.35 },  // D6
          { f: 1318, t: 0.45 },  // E6
          { f: 1568, t: 0.55 },  // G6
          { f: 1975, t: 0.65 },  // B6
        ];
        melody.forEach(({ f, t }) => {
          playNote(ctx, f, now + t, 0.3, 'sine', 0.09);
          playNote(ctx, f * 0.5, now + t, 0.25, 'triangle', 0.04);
        });

        // Final triumphant chord
        [1568, 1975, 2349, 2637].forEach(f => {
          playNote(ctx, f, now + 0.75, 0.7, 'sine', 0.06);
          playNote(ctx, f * 0.5, now + 0.75, 0.6, 'triangle', 0.03);
        });

        // Shimmer tail
        [2637, 3135, 3520].forEach((f, i) => {
          playNote(ctx, f, now + 1.0 + i * 0.08, 0.5, 'sine', 0.03);
        });
      }
    } catch {
      // Audio not available
    }
  }, [getCtx, playNote]);

  return { play };
}
