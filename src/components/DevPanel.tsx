import { useState } from 'react';
import { DevForceMode } from '../game/devForce';
import { getRtpConfig, setRtpConfig, resetRtpConfig, DEFAULT_RTP_CONFIG } from '../game/rtpConfig';

interface DevPanelProps {
  onForceSpin: (mode: DevForceMode) => void;
  disabled: boolean;
}

const BUTTONS: Array<{ mode: DevForceMode; label: string; color: string }> = [
  { mode: 'freespin', label: '🎰 Free Spin', color: 'bg-purple-600 hover:bg-purple-500' },
  { mode: 'bigwin', label: '💰 Big Win', color: 'bg-yellow-500 hover:bg-yellow-400 text-black' },
  { mode: 'smallwin', label: '🪙 Small Win', color: 'bg-emerald-600 hover:bg-emerald-500' },
  { mode: 'chain1', label: '⛓️ Chain x1', color: 'bg-sky-600 hover:bg-sky-500' },
  { mode: 'chain2', label: '⛓️⛓️ Chain x2', color: 'bg-indigo-600 hover:bg-indigo-500' },
  { mode: 'chain3', label: '⛓️⛓️⛓️ Chain x3', color: 'bg-fuchsia-600 hover:bg-fuchsia-500' },
  { mode: 'teaserHit', label: '🎯 Teaser HIT', color: 'bg-orange-600 hover:bg-orange-500' },
  { mode: 'teaserMiss', label: '😢 Teaser MISS', color: 'bg-slate-600 hover:bg-slate-500' },
];

// Calibrated via Monte Carlo @ 3M spins. RTP is linear in payoutFactor.
const RTP_PRESETS = [
  { rtp: 90, factor: 0.4458 },
  { rtp: 92, factor: 0.4557 },
  { rtp: 94, factor: 0.4656 },
  { rtp: 96, factor: 0.4755 },
  { rtp: 97, factor: 0.4805 },
  { rtp: 98, factor: 0.4854 },
];

export function DevPanel({ onForceSpin, disabled }: DevPanelProps) {
  const [open, setOpen] = useState(false);
  const [factor, setFactor] = useState(getRtpConfig().payoutFactor);

  const updateFactor = (f: number) => {
    setFactor(f);
    setRtpConfig({ payoutFactor: f });
  };

  // Linear approximation: factor 0.4755 ≈ 96% RTP
  const approxRtp = (factor / 0.4755) * 96;

  return (
    <div className="fixed top-2 right-2 z-[60] flex flex-col items-end gap-1.5">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur border border-white/20 
                   text-white text-[10px] font-mono uppercase tracking-wider 
                   hover:bg-black/90 active:scale-95 transition"
      >
        {open ? '✕ Dev' : '⚙ Dev'}
      </button>

      {open && (
        <div className="flex flex-col gap-1 p-2 rounded-lg bg-black/80 backdrop-blur 
                        border border-white/20 shadow-2xl min-w-[200px] max-h-[80vh] overflow-y-auto">
          <div className="text-[9px] text-white/50 font-mono uppercase tracking-wider px-1 pb-1 border-b border-white/10">
            Force Outcome
          </div>
          {BUTTONS.map(b => (
            <button
              key={b.mode}
              onClick={() => {
                onForceSpin(b.mode);
                setOpen(false);
              }}
              disabled={disabled}
              className={`px-2.5 py-1.5 rounded text-[11px] font-bold text-white
                         disabled:opacity-40 disabled:cursor-not-allowed
                         active:scale-95 transition ${b.color}`}
            >
              {b.label}
            </button>
          ))}

          {/* RTP Tuning */}
          <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1.5">
            <div className="text-[9px] text-white/50 font-mono uppercase tracking-wider px-1">
              RTP Config
            </div>
            <div className="flex items-baseline justify-between px-1">
              <span className="text-[10px] text-white/70 font-mono">payoutFactor</span>
              <span className="text-[11px] text-primary font-bold font-mono">{factor.toFixed(4)}</span>
            </div>
            <input
              type="range"
              min={0.30}
              max={0.60}
              step={0.0005}
              value={factor}
              onChange={(e) => updateFactor(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="text-[9px] text-white/40 font-mono px-1 text-right">
              ≈ {approxRtp.toFixed(1)}% RTP
            </div>
            <div className="grid grid-cols-3 gap-1">
              {RTP_PRESETS.map(p => (
                <button
                  key={p.rtp}
                  onClick={() => updateFactor(p.factor)}
                  className={`px-1 py-0.5 rounded text-[10px] font-bold font-mono transition
                             ${Math.abs(factor - p.factor) < 0.001
                               ? 'bg-primary text-primary-foreground'
                               : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                >
                  {p.rtp}%
                </button>
              ))}
            </div>
            <button
              onClick={() => { resetRtpConfig(); setFactor(DEFAULT_RTP_CONFIG.payoutFactor); }}
              className="px-2 py-1 rounded text-[10px] font-mono bg-white/10 text-white/70 hover:bg-white/20"
            >
              Reset (default 96%)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
