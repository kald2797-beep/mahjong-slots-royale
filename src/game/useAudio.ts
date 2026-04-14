import { useCallback, useRef } from 'react';

type SoundName = 'spin' | 'cascade' | 'win' | 'bigWin' | 'reelDrop';

function playNote(ctx: AudioContext, freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
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
}

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
        // Heavy bass slam — deep thud for each column hitting
        // Sub bass impact
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(55, now);
        sub.frequency.exponentialRampToValueAtTime(30, now + 0.35);
        subGain.gain.setValueAtTime(0.25, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        sub.connect(subGain).connect(ctx.destination);
        sub.start(now);
        sub.stop(now + 0.45);

        // Chunky mid slam
        const mid = ctx.createOscillator();
        const midGain = ctx.createGain();
        mid.type = 'square';
        mid.frequency.setValueAtTime(80, now);
        mid.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        midGain.gain.setValueAtTime(0.1, now);
        midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        mid.connect(midGain).connect(ctx.destination);
        mid.start(now);
        mid.stop(now + 0.3);

        // Heavy stone tiles landing — staggered thuds
        [0.08, 0.16, 0.24, 0.32, 0.38].forEach((t, i) => {
          const thud = ctx.createOscillator();
          const thudGain = ctx.createGain();
          thud.type = 'sine';
          thud.frequency.setValueAtTime(70 - i * 5, now + t);
          thud.frequency.exponentialRampToValueAtTime(25, now + t + 0.12);
          thudGain.gain.setValueAtTime(0.15 - i * 0.02, now + t);
          thudGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.15);
          thud.connect(thudGain).connect(ctx.destination);
          thud.start(now + t);
          thud.stop(now + t + 0.2);
        });
      }

      if (sound === 'cascade') {
        // Sparkling waterfall — fast rising shimmer
        const notes = [784, 880, 987, 1175, 1318, 1568];
        notes.forEach((freq, i) => {
          playNote(ctx, freq, now + i * 0.04, 0.18, 'sine', 0.08);
          playNote(ctx, freq * 1.5, now + i * 0.04 + 0.01, 0.12, 'triangle', 0.03);
        });
      }

      if (sound === 'win') {
        // Coin shower — rapid tinkling coins falling
        // Quick metallic pings at random-ish pitches
        const coinFreqs = [2400, 3200, 2800, 3600, 2600, 3400, 2900, 3100, 2500, 3800,
                           2700, 3300, 2850, 3500, 2650, 3700, 2950, 3150, 2750, 3900];
        coinFreqs.forEach((freq, i) => {
          const t = i * 0.035;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + t);
          osc.frequency.setValueAtTime(freq * 0.98, now + t + 0.03);
          gain.gain.setValueAtTime(0.06, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.12);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.15);

          // Metallic harmonic
          const harm = ctx.createOscillator();
          const harmGain = ctx.createGain();
          harm.type = 'triangle';
          harm.frequency.setValueAtTime(freq * 2.4, now + t);
          harmGain.gain.setValueAtTime(0.02, now + t);
          harmGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.08);
          harm.connect(harmGain).connect(ctx.destination);
          harm.start(now + t);
          harm.stop(now + t + 0.1);
        });

        // Celebratory base chord underneath
        [523, 659, 784].forEach(f => {
          playNote(ctx, f, now, 0.8, 'sine', 0.05);
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
  }, [getCtx]);

  return { play };
}
