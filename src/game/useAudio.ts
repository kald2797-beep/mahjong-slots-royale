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
        // Warm golden shimmer — soft bell-like tone
        const bell = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(880, now);
        bell.frequency.exponentialRampToValueAtTime(440, now + 0.35);
        bellGain.gain.setValueAtTime(0.08, now);
        bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        bell.connect(bellGain).connect(ctx.destination);
        bell.start(now);
        bell.stop(now + 0.45);

        // Warm harmonic
        const warm = ctx.createOscillator();
        const warmGain = ctx.createGain();
        warm.type = 'triangle';
        warm.frequency.setValueAtTime(660, now);
        warm.frequency.exponentialRampToValueAtTime(330, now + 0.3);
        warmGain.gain.setValueAtTime(0.05, now);
        warmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        warm.connect(warmGain).connect(ctx.destination);
        warm.start(now);
        warm.stop(now + 0.4);

        // Soft golden sweep
        const sweep = ctx.createOscillator();
        const sweepGain = ctx.createGain();
        sweep.type = 'sine';
        sweep.frequency.setValueAtTime(1320, now);
        sweep.frequency.exponentialRampToValueAtTime(660, now + 0.25);
        sweepGain.gain.setValueAtTime(0.03, now);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        sweep.connect(sweepGain).connect(ctx.destination);
        sweep.start(now);
        sweep.stop(now + 0.35);
      }

      if (sound === 'reelDrop') {
        // Synced to SymbolCell spring animation:
        // Each row delay = rowIndex * 0.07, spring settle ~0.28s
        // So row i lands at approximately i * 0.07 + 0.28
        const rowCount = 5;
        for (let i = 0; i < rowCount; i++) {
          const landTime = now + i * 0.07 + 0.28;

          // Deep bass thud — ตึก
          const bass = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bass.type = 'sine';
          bass.frequency.setValueAtTime(60, landTime);
          bass.frequency.exponentialRampToValueAtTime(25, landTime + 0.1);
          bassGain.gain.setValueAtTime(0.22, landTime);
          bassGain.gain.exponentialRampToValueAtTime(0.001, landTime + 0.13);
          bass.connect(bassGain).connect(ctx.destination);
          bass.start(landTime);
          bass.stop(landTime + 0.16);

          // Sharp attack snap
          const click = ctx.createOscillator();
          const clickGain = ctx.createGain();
          click.type = 'square';
          click.frequency.setValueAtTime(180 - i * 10, landTime);
          click.frequency.exponentialRampToValueAtTime(40, landTime + 0.035);
          clickGain.gain.setValueAtTime(0.09, landTime);
          clickGain.gain.exponentialRampToValueAtTime(0.001, landTime + 0.05);
          click.connect(clickGain).connect(ctx.destination);
          click.start(landTime);
          click.stop(landTime + 0.07);

          // Sub rumble
          const sub = ctx.createOscillator();
          const subGain = ctx.createGain();
          sub.type = 'sine';
          sub.frequency.setValueAtTime(32, landTime + 0.01);
          subGain.gain.setValueAtTime(0.14, landTime + 0.01);
          subGain.gain.exponentialRampToValueAtTime(0.001, landTime + 0.09);
          sub.connect(subGain).connect(ctx.destination);
          sub.start(landTime + 0.01);
          sub.stop(landTime + 0.12);
        }
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
        // Coin shower — rapid tinkling coins
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

        // Celebratory chord
        [523, 659, 784].forEach(f => {
          playNote(ctx, f, now, 0.8, 'sine', 0.05);
        });
      }

      if (sound === 'bigWin') {
        // Deep bass drums
        [0, 0.2, 0.4].forEach(t => {
          const drum = ctx.createOscillator();
          const drumGain = ctx.createGain();
          drum.type = 'sine';
          drum.frequency.setValueAtTime(80, now + t);
          drum.frequency.exponentialRampToValueAtTime(30, now + t + 0.2);
          drumGain.gain.setValueAtTime(0.2, now + t);
          drumGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.25);
          drum.connect(drumGain).connect(ctx.destination);
          drum.start(now + t);
          drum.stop(now + t + 0.3);
        });

        // Massive coin shower
        for (let i = 0; i < 30; i++) {
          const freq = 2200 + Math.random() * 2000;
          const t = i * 0.03 + Math.random() * 0.02;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + t);
          osc.frequency.setValueAtTime(freq * 0.97, now + t + 0.04);
          gain.gain.setValueAtTime(0.05, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.15);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.18);

          const h = ctx.createOscillator();
          const hg = ctx.createGain();
          h.type = 'triangle';
          h.frequency.setValueAtTime(freq * 2.5, now + t);
          hg.gain.setValueAtTime(0.015, now + t);
          hg.gain.exponentialRampToValueAtTime(0.001, now + t + 0.1);
          h.connect(hg).connect(ctx.destination);
          h.start(now + t);
          h.stop(now + t + 0.12);
        }

        // Triumphant chord swell
        [523, 659, 784, 1047].forEach(f => {
          playNote(ctx, f, now + 0.1, 1.2, 'sine', 0.07);
          playNote(ctx, f * 2, now + 0.5, 0.8, 'sine', 0.03);
        });
      }
    } catch {
      // Audio not available
    }
  }, [getCtx]);

  return { play };
}
