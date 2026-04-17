import { useState } from 'react';
import { DevForceMode } from '../game/devForce';

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
];

export function DevPanel({ onForceSpin, disabled }: DevPanelProps) {
  const [open, setOpen] = useState(false);

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
                        border border-white/20 shadow-2xl min-w-[140px]">
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
        </div>
      )}
    </div>
  );
}
