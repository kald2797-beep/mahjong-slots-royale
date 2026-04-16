import { SymbolId } from '../game/types';

interface SymbolIconProps {
  symbolId: SymbolId;
  className?: string;
}

// 🀄 Red Dragon Tile
function RedDragonIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-[70%] h-[80%] rounded-md bg-gradient-to-b from-red-100 to-red-50 border border-red-200 shadow-md flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
        <div className="text-red-600 font-display font-black text-[1.2em] leading-none tracking-tighter" style={{ textShadow: '0 1px 2px rgba(220,38,38,0.3)' }}>
          中
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-red-600 to-red-500" />
      </div>
    </div>
  );
}

// 🏮 Lantern
function LanternIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Hook */}
        <div className="w-[3px] h-[6px] bg-yellow-600 rounded-full" />
        {/* Top cap */}
        <div className="w-[45%] h-[4px] bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 rounded-t-sm" />
        {/* Body */}
        <div className="w-[60%] aspect-[3/4] rounded-[50%] bg-gradient-to-b from-red-500 via-red-600 to-red-800 relative overflow-hidden shadow-lg"
          style={{ boxShadow: '0 0 12px rgba(239,68,68,0.5), inset 0 -4px 8px rgba(0,0,0,0.3)' }}>
          {/* Ribs */}
          <div className="absolute inset-0 flex justify-around">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-yellow-600/40" />
            ))}
          </div>
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-400/30 to-yellow-300/20 rounded-[50%]" />
          {/* 福 character */}
          <div className="absolute inset-0 flex items-center justify-center text-yellow-300 font-display text-[0.6em] font-black opacity-80">福</div>
        </div>
        {/* Bottom cap */}
        <div className="w-[45%] h-[4px] bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 rounded-b-sm" />
        {/* Tassel */}
        <div className="w-[2px] h-[8px] bg-gradient-to-b from-yellow-600 to-yellow-800" />
        <div className="w-[6px] h-[3px] bg-yellow-600 rounded-b-full" />
      </div>
    </div>
  );
}

// 🐉 Dragon
function DragonIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="relative w-[75%] h-[75%]">
        {/* Dragon body - S curve */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-lg">
            {/* Body */}
            <path d="M12 8 Q8 12, 14 18 Q20 24, 16 30 Q14 34, 18 36" 
              fill="none" stroke="url(#dragonGrad)" strokeWidth="4" strokeLinecap="round" />
            {/* Head */}
            <circle cx="12" cy="8" r="5" fill="url(#dragonHead)" />
            {/* Eye */}
            <circle cx="10.5" cy="7" r="1" fill="#fff" />
            <circle cx="10.5" cy="7" r="0.5" fill="#1a1a2e" />
            {/* Horns */}
            <path d="M14 4 L17 1" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M15 6 L19 3" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" />
            {/* Whiskers */}
            <path d="M8 9 Q4 8, 3 6" stroke="#e8b939" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <path d="M8 10 Q4 11, 2 10" stroke="#e8b939" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            {/* Spines */}
            <path d="M14 16 L18 14" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" />
            <path d="M16 22 L20 20" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" />
            <path d="M15 28 L19 27" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" />
            {/* Flame */}
            <path d="M8 6 Q5 4, 6 2 Q7 0, 8 2 Q9 0, 10 2 Q11 4, 9 5" fill="#ef4444" opacity="0.8" />
            <defs>
              <linearGradient id="dragonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="50%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
              <radialGradient id="dragonHead" cx="0.4" cy="0.4">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

// 🎋 Bamboo
function BambooIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 36 40" className="w-[65%] h-[80%] drop-shadow-md">
        {/* Stalks */}
        {[10, 20, 28].map((x, i) => (
          <g key={i}>
            <rect x={x - 2} y={4} width="4" height="34" rx="2" 
              fill={`url(#bamboo${i})`} />
            {/* Nodes */}
            {[12, 22, 32].map((ny, j) => (
              <rect key={j} x={x - 3} y={ny} width="6" height="2" rx="1"
                fill="#4d7c0f" opacity="0.7" />
            ))}
          </g>
        ))}
        {/* Leaves */}
        <path d="M8 8 Q2 4, 0 8 Q4 6, 8 8" fill="#65a30d" />
        <path d="M22 6 Q26 1, 30 4 Q26 3, 22 6" fill="#84cc16" />
        <path d="M18 16 Q12 12, 10 16 Q14 14, 18 16" fill="#65a30d" />
        <path d="M30 14 Q34 10, 36 14 Q34 12, 30 14" fill="#84cc16" />
        <defs>
          {[0, 1, 2].map(i => (
            <linearGradient key={i} id={`bamboo${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#65a30d" />
              <stop offset="40%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#4d7c0f" />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
}

// 🌸 Cherry Blossom
function CherryBlossomIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-[75%] h-[75%] drop-shadow-md">
        {/* Petals */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <ellipse
            key={i}
            cx="20" cy="12"
            rx="5.5" ry="8"
            fill={`url(#petalGrad)`}
            transform={`rotate(${angle}, 20, 20)`}
            opacity="0.9"
          />
        ))}
        {/* Center */}
        <circle cx="20" cy="20" r="4" fill="url(#centerGrad)" />
        {/* Stamens */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={i} transform={`rotate(${angle}, 20, 20)`}>
            <line x1="20" y1="20" x2="20" y2="15" stroke="#fbbf24" strokeWidth="0.6" />
            <circle cx="20" cy="14.5" r="0.8" fill="#f59e0b" />
          </g>
        ))}
        <defs>
          <radialGradient id="petalGrad" cx="0.5" cy="0.3">
            <stop offset="0%" stopColor="#fce7f3" />
            <stop offset="60%" stopColor="#f9a8d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </radialGradient>
          <radialGradient id="centerGrad" cx="0.4" cy="0.4">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fbbf24" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

// 🎎 Dolls (Kokeshi)
function KokeshiIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 32 42" className="w-[55%] h-[80%] drop-shadow-md">
        {/* Hair */}
        <ellipse cx="16" cy="10" rx="9" ry="10" fill="#1a1a2e" />
        {/* Face */}
        <ellipse cx="16" cy="12" rx="7" ry="7.5" fill="#fde8d0" />
        {/* Hair bangs */}
        <path d="M9 8 Q12 12, 16 8 Q20 12, 23 8 Q22 4, 16 3 Q10 4, 9 8" fill="#1a1a2e" />
        {/* Eyes */}
        <ellipse cx="13" cy="13" rx="1" ry="1.2" fill="#1a1a2e" />
        <ellipse cx="19" cy="13" rx="1" ry="1.2" fill="#1a1a2e" />
        {/* Cheeks */}
        <circle cx="11" cy="15" r="1.5" fill="#f9a8d4" opacity="0.5" />
        <circle cx="21" cy="15" r="1.5" fill="#f9a8d4" opacity="0.5" />
        {/* Mouth */}
        <path d="M14.5 16.5 Q16 17.5, 17.5 16.5" stroke="#e11d48" strokeWidth="0.6" fill="none" />
        {/* Body */}
        <path d="M10 20 Q10 40, 16 40 Q22 40, 22 20 Z" fill="url(#kimonoGrad)" />
        {/* Obi */}
        <rect x="10" y="26" width="12" height="3" rx="1" fill="#fbbf24" />
        {/* Pattern on kimono */}
        <circle cx="14" cy="32" r="1.5" fill="#fce7f3" opacity="0.6" />
        <circle cx="18" cy="35" r="1" fill="#fce7f3" opacity="0.6" />
        <defs>
          <linearGradient id="kimonoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// 🧧 Red Envelope
function RedEnvelopeIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[60%] h-[75%]">
        {/* Envelope body */}
        <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 40%, #b91c1c 100%)',
            border: '1.5px solid rgba(234,179,8,0.4)',
          }}>
          {/* Gold trim top */}
          <div className="absolute top-0 left-0 right-0 h-[12%] bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
          {/* Flap */}
          <div className="absolute top-[10%] left-[10%] right-[10%] h-[25%] rounded-b-[50%] bg-gradient-to-b from-yellow-500/30 to-transparent" />
          {/* Center medallion */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] aspect-square rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-inner"
            style={{ boxShadow: '0 0 8px rgba(234,179,8,0.5), inset 0 1px 2px rgba(255,255,255,0.3)' }}>
            <span className="text-red-800 font-display font-black text-[0.55em]">福</span>
          </div>
          {/* Corner ornaments */}
          <div className="absolute bottom-[5%] left-[8%] w-[15%] aspect-square border border-yellow-500/30 rounded-sm rotate-45" />
          <div className="absolute bottom-[5%] right-[8%] w-[15%] aspect-square border border-yellow-500/30 rounded-sm rotate-45" />
        </div>
      </div>
    </div>
  );
}

// 🎴 Card (Hanafuda-style)
function CardIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[55%] h-[75%] rounded-md overflow-hidden shadow-md"
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
          border: '1.5px solid rgba(234,179,8,0.3)',
        }}>
        {/* Moon */}
        <div className="absolute top-[15%] right-[15%] w-[30%] aspect-square rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400"
          style={{ boxShadow: '0 0 8px rgba(250,204,21,0.4)' }} />
        {/* Mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%]">
          <svg viewBox="0 0 40 20" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 20 L8 6 L16 14 L24 4 L32 12 L40 8 L40 20 Z" fill="#4c1d95" opacity="0.7" />
            <path d="M0 20 L10 10 L20 16 L30 8 L40 14 L40 20 Z" fill="#5b21b6" opacity="0.5" />
          </svg>
        </div>
        {/* Stars */}
        {[[20, 20], [60, 35], [75, 15], [35, 10]].map(([x, y], i) => (
          <div key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-yellow-200"
            style={{ left: `${x}%`, top: `${y}%`, boxShadow: '0 0 3px rgba(250,204,21,0.6)' }}
          />
        ))}
        {/* Gold border inner */}
        <div className="absolute inset-[3px] rounded-sm border border-yellow-600/20" />
      </div>
    </div>
  );
}

// 🔮 Scatter
function ScatterIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[70%] h-[70%]">
        <div className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, hsl(280 80% 70% / 0.6) 0%, transparent 70%)',
          }} />
        <div className="absolute inset-[10%] rounded-full shadow-lg"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #e9d5ff, #a855f7 40%, #7c3aed 70%, #4c1d95)',
            boxShadow: '0 0 20px rgba(168,85,247,0.6), inset 0 -2px 4px rgba(0,0,0,0.3)',
          }}>
          {/* Inner glow */}
          <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          {/* Star sparkle */}
          <div className="absolute inset-0 flex items-center justify-center text-yellow-300 font-display text-[0.7em] font-black"
            style={{ textShadow: '0 0 6px rgba(250,204,21,0.8)' }}>
            FS
          </div>
        </div>
        {/* Orbiting sparkles */}
        {[0, 120, 240].map((angle, i) => (
          <div key={i} className="absolute w-[6px] h-[6px] rounded-full bg-yellow-300"
            style={{
              top: `${50 + 42 * Math.sin((angle * Math.PI) / 180)}%`,
              left: `${50 + 42 * Math.cos((angle * Math.PI) / 180)}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 4px rgba(250,204,21,0.8)',
            }} />
        ))}
      </div>
    </div>
  );
}

// ⭐ Wild
function WildIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[75%] h-[75%]">
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-lg">
          {/* Star shape */}
          <polygon
            points="20,2 25,14 38,16 28,25 31,38 20,32 9,38 12,25 2,16 15,14"
            fill="url(#wildGrad)"
            stroke="#fbbf24"
            strokeWidth="1"
          />
          {/* Inner shine */}
          <polygon
            points="20,8 23,16 32,17 25,23 27,32 20,28 13,32 15,23 8,17 17,16"
            fill="url(#wildInner)"
            opacity="0.7"
          />
          <text x="20" y="24" textAnchor="middle" fill="#7c2d12" fontWeight="900" fontSize="8" fontFamily="serif">W</text>
          <defs>
            <linearGradient id="wildGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <radialGradient id="wildInner" cx="0.4" cy="0.3">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fbbf24" />
            </radialGradient>
          </defs>
        </svg>
        {/* Glow */}
        <div className="absolute inset-[-10%] rounded-full animate-pulse"
          style={{ background: 'radial-gradient(circle, hsl(38 92% 55% / 0.3) 0%, transparent 60%)' }} />
      </div>
    </div>
  );
}

const SYMBOL_COMPONENTS: Record<SymbolId, React.FC> = {
  0: RedDragonIcon,
  1: LanternIcon,
  2: DragonIcon,
  3: BambooIcon,
  4: CherryBlossomIcon,
  5: KokeshiIcon,
  6: RedEnvelopeIcon,
  7: CardIcon,
  8: ScatterIcon,
  9: WildIcon,
};

export function SymbolIcon({ symbolId, className = '' }: SymbolIconProps) {
  const Component = SYMBOL_COMPONENTS[symbolId];
  return (
    <div className={`w-full h-full ${className}`}>
      <Component />
    </div>
  );
}
