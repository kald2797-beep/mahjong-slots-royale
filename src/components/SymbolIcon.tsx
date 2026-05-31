import { SymbolId } from '../game/types';
import s0 from '../assets/symbols/s0.png';
import s1 from '../assets/symbols/s1.png';
import s2 from '../assets/symbols/s2.png';
import s3 from '../assets/symbols/s3.png';
import s4 from '../assets/symbols/s4.png';
import s5 from '../assets/symbols/s5.png';
import s6 from '../assets/symbols/s6.png';
import s7 from '../assets/symbols/s7.png';
import s8 from '../assets/symbols/s8.png';
import s9 from '../assets/symbols/s9.png';

interface SymbolIconProps {
  symbolId: SymbolId;
  className?: string;
}

const SYMBOL_IMAGES: Record<SymbolId, string> = {
  0: s0, 1: s1, 2: s2, 3: s3, 4: s4,
  5: s5, 6: s6, 7: s7, 8: s8, 9: s9,
};

const SYMBOL_NAMES: Record<SymbolId, string> = {
  0: 'Red Dragon', 1: 'Lantern', 2: 'Phoenix', 3: 'Bamboo', 4: 'Cherry Blossom',
  5: 'Kokeshi', 6: 'Red Envelope', 7: 'Scroll', 8: 'Scatter', 9: 'Tiger Wild',
};

export function SymbolIcon({ symbolId, className = '' }: SymbolIconProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <img
        src={SYMBOL_IMAGES[symbolId]}
        alt={SYMBOL_NAMES[symbolId]}
        draggable={false}
        className="w-[92%] h-[92%] object-contain select-none pointer-events-none"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
      />
    </div>
  );
}
