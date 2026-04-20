import { motion, AnimatePresence } from 'framer-motion';
import { SYMBOLS, CellState, ROWS } from '../game/types';
import { SymbolIcon } from './SymbolIcon';
import { useMemo } from 'react';

interface SymbolCellProps {
  cell: CellState;
  isWinning: boolean;
  isExploding: boolean;
  isClearing: boolean;
  isCascading: boolean;
  colIndex: number;
  rowIndex: number;
  isScatterHighlight?: boolean;
  isGoldenWild?: boolean;
  isTeaserDrop?: boolean;
}

const CELL_HEIGHT = 80;

// Generate random particles for explosion
function useParticles(count: number) {
  return useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (360 / count) * i + (Math.random() - 0.5) * 30,
      distance: 40 + Math.random() * 60,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 0.1,
      duration: 0.4 + Math.random() * 0.3,
      rotation: Math.random() * 720 - 360,
      color: [
        'hsl(38 92% 55%)',   // gold
        'hsl(42 100% 70%)',  // light gold
        'hsl(0 84% 60%)',    // red
        'hsl(330 100% 60%)', // pink
        'hsl(160 100% 50%)', // green
        'hsl(280 80% 60%)',  // purple
      ][Math.floor(Math.random() * 6)],
    })),
  [count]);
}

function ExplosionParticles({ colIndex, rowIndex }: { colIndex: number; rowIndex: number }) {
  const particles = useParticles(12);
  const baseDelay = colIndex * 0.02 + rowIndex * 0.01;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {particles.map((p) => {
        const radians = (p.angle * Math.PI) / 180;
        const tx = Math.cos(radians) * p.distance;
        const ty = Math.sin(radians) * p.distance;

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              top: '50%',
              left: '50%',
              marginTop: -p.size / 2,
              marginLeft: -p.size / 2,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: tx,
              y: ty,
              scale: 0,
              opacity: 0,
              rotate: p.rotation,
            }}
            transition={{
              duration: p.duration,
              delay: baseDelay + p.delay,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Central flash */}
      <motion.div
        className="absolute inset-[-20%] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(38 92% 55% / 0.8) 0%, hsl(38 92% 55% / 0) 70%)',
        }}
        initial={{ scale: 0.3, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.4, delay: baseDelay, ease: 'easeOut' }}
      />

      {/* Shockwave ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: 'hsl(38 92% 55% / 0.6)' }}
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.05, ease: 'easeOut' }}
      />
    </div>
  );
}

export function SymbolCell({ cell, isWinning, isExploding, isClearing, isCascading, colIndex, rowIndex, isScatterHighlight, isGoldenWild, isTeaserDrop }: SymbolCellProps) {
  const symbol = SYMBOLS[cell.symbolId];
  const isHidden = (cell as any)._hidden === true;

  // Hidden cell — render nothing (completely invisible, no placeholder)
  if (isHidden) {
    return <div className="aspect-square" />;
  }

  if (isClearing) {
    return (
      <motion.div
        key={`clear-${cell.key}`}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: ROWS * CELL_HEIGHT, opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: 'easeIn',
          delay: colIndex * 0.03 + rowIndex * 0.02,
        }}
        className="symbol-cell rounded-lg flex items-center justify-center aspect-square"
      >
        <SymbolIcon symbolId={cell.symbolId} />
      </motion.div>
    );
  }

  // Calculate initial Y based on where this cell came from
  let initialY: number;
  if (isCascading && cell.fromRow !== undefined) {
    if (cell.fromRow < 0) {
      initialY = cell.fromRow * CELL_HEIGHT;
    } else {
      initialY = (cell.fromRow - rowIndex) * CELL_HEIGHT;
    }
  } else {
    initialY = -(ROWS * CELL_HEIGHT);
  }

  const isExplodingWin = isExploding && isWinning;

  return (
    <div className="relative aspect-square">
      {/* Scatter highlight pulse */}
      {isScatterHighlight && (
        <motion.div
          className="absolute inset-[-4px] rounded-xl pointer-events-none z-30"
          style={{
            border: '2px solid hsl(280 80% 60%)',
            boxShadow: '0 0 20px hsl(280 80% 60% / 0.6), inset 0 0 10px hsl(280 80% 60% / 0.3)',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Golden wild transformation glow */}
      {isGoldenWild && (
        <motion.div
          className="absolute inset-[-3px] rounded-xl pointer-events-none z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            border: '2px solid hsl(38 92% 55%)',
            boxShadow: '0 0 15px hsl(38 92% 55% / 0.7), 0 0 30px hsl(38 92% 55% / 0.3)',
            background: 'hsl(38 92% 55% / 0.1)',
          }}
        />
      )}

      {/* Explosion particles */}
      {isExplodingWin && (
        <ExplosionParticles colIndex={colIndex} rowIndex={rowIndex} />
      )}

      <motion.div
        key={cell.key}
        initial={{ y: initialY, opacity: isCascading ? 1 : 0 }}
        animate={{
          y: 0,
          opacity: isExplodingWin ? 0 : 1,
          scale: isExplodingWin ? 0 : isWinning ? 1.08 : 1,
          rotate: isExplodingWin ? 180 : 0,
          filter: isWinning && !isExploding
            ? 'brightness(1.3) drop-shadow(0 0 6px hsl(38 92% 55% / 0.6))'
            : 'brightness(1)',
        }}
        transition={{
          y: isTeaserDrop
            ? {
                // Heavy impact + soft bouncing oscillation, like an object hitting the floor
                type: 'spring',
                stiffness: 320,
                damping: 7,
                mass: 1.4,
                delay: rowIndex * 0.025,
                restDelta: 0.2,
              }
            : {
                type: 'spring',
                stiffness: 220,
                damping: 16,
                mass: 0.9,
                delay: isCascading ? colIndex * 0.02 : rowIndex * 0.035,
              },
          opacity: { duration: 0.18, delay: 0 },
          scale: { duration: 0.35, ease: 'backIn' },
          rotate: { duration: 0.35 },
          filter: { duration: 0.3 },
        }}
        className={`
          symbol-cell rounded-lg flex items-center justify-center w-full h-full
          ${isWinning && !isExploding ? 'winning' : ''}
        `}
        style={isWinning && !isExploding ? {
          boxShadow: '0 0 15px hsl(38 92% 55% / 0.5), 0 0 30px hsl(38 92% 55% / 0.2)',
        } : undefined}
      >
        {/* Golden glow ring on winning */}
        {isWinning && !isExploding && (
          <motion.div
            className="absolute inset-[-2px] rounded-lg border-2 pointer-events-none"
            style={{ borderColor: 'hsl(38 92% 55%)' }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        <SymbolIcon symbolId={cell.symbolId} />
      </motion.div>
    </div>
  );
}
