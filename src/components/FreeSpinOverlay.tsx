import { motion, AnimatePresence } from 'framer-motion';
import { FreeSpinState } from '../game/types';

interface FreeSpinOverlayProps {
  freeSpin: FreeSpinState;
}

export function FreeSpinOverlay({ freeSpin }: FreeSpinOverlayProps) {
  if (freeSpin.phase === 'inactive') return null;

  return (
    <AnimatePresence>
      {/* Intro Animation */}
      {freeSpin.phase === 'intro' && (
        <motion.div
          key="fs-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            className="absolute inset-0 bg-black"
          />

          {/* Lightning flashes */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse at 50% 50%, hsl(280 80% 60% / 0) 0%, transparent 100%)',
                'radial-gradient(ellipse at 50% 50%, hsl(280 80% 60% / 0.3) 0%, transparent 100%)',
                'radial-gradient(ellipse at 50% 50%, hsl(280 80% 60% / 0) 0%, transparent 100%)',
                'radial-gradient(ellipse at 50% 50%, hsl(38 92% 55% / 0.4) 0%, transparent 100%)',
                'radial-gradient(ellipse at 50% 50%, hsl(38 92% 55% / 0) 0%, transparent 100%)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Particle ring */}
          {Array.from({ length: 20 }, (_, i) => {
            const angle = (360 / 20) * i;
            const rad = (angle * Math.PI) / 180;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0
                    ? 'hsl(38 92% 55%)'
                    : 'hsl(280 80% 60%)',
                  boxShadow: `0 0 8px ${i % 2 === 0 ? 'hsl(38 92% 55%)' : 'hsl(280 80% 60%)'}`,
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(rad) * 150, Math.cos(rad) * 120],
                  y: [0, Math.sin(rad) * 150, Math.sin(rad) * 120],
                  scale: [0, 1.5, 1],
                  opacity: [0, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.03,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          {/* Main text */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
            >
              <div className="font-display text-5xl sm:text-6xl font-black tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #fde047, #f59e0b, #fde047)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px hsl(38 92% 55% / 0.8))',
                }}>
                FREE SPINS!
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4"
            >
              <span className="font-display text-3xl sm:text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #e9d5ff, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 10px hsl(280 80% 60% / 0.6))',
                }}>
                {freeSpin.totalSpins} Spins
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-2 text-sm text-yellow-300/80"
            >
              Multiplier starts at x2 — Never resets!
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Spinning HUD */}
      {freeSpin.phase === 'spinning' && (
        <motion.div
          key="fs-hud"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className="px-4 py-2 rounded-b-xl flex items-center gap-4"
            style={{
              background: 'linear-gradient(180deg, hsl(280 60% 20% / 0.95), hsl(280 40% 12% / 0.95))',
              border: '1px solid hsl(280 80% 60% / 0.4)',
              borderTop: 'none',
              boxShadow: '0 4px 20px hsl(280 80% 60% / 0.3)',
            }}>
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wider text-purple-300/70">Free Spins</div>
              <motion.div
                key={freeSpin.remainingSpins}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="font-display font-black text-lg"
                style={{
                  background: 'linear-gradient(135deg, #e9d5ff, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                {freeSpin.remainingSpins}/{freeSpin.totalSpins}
              </motion.div>
            </div>
            <div className="w-px h-8 bg-purple-500/30" />
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wider text-yellow-300/70">Multiplier</div>
              <motion.div
                key={freeSpin.multiplier}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="font-display font-black text-lg text-yellow-300"
                style={{ textShadow: '0 0 10px hsl(38 92% 55% / 0.6)' }}>
                x{freeSpin.multiplier}
              </motion.div>
            </div>
            <div className="w-px h-8 bg-purple-500/30" />
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wider text-green-300/70">Win</div>
              <div className="font-bold text-sm text-green-300">
                ${freeSpin.totalWin.toFixed(2)}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Screen */}
      {freeSpin.phase === 'summary' && (
        <motion.div
          key="fs-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            className="absolute inset-0 bg-black"
          />

          {/* Coin rain */}
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #fde047, #f59e0b)',
                boxShadow: '0 0 6px hsl(38 92% 55% / 0.6)',
                left: `${Math.random() * 100}%`,
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: ['0vh', '100vh'],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <div className="font-display text-3xl sm:text-4xl font-black text-purple-300 mb-4"
                style={{ textShadow: '0 0 15px hsl(280 80% 60% / 0.5)' }}>
                FREE SPINS COMPLETE!
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Total Win</div>
              <div className="font-display text-5xl sm:text-6xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #fde047, #f59e0b, #fde047)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px hsl(38 92% 55% / 0.8))',
                }}>
                ${freeSpin.totalWin.toFixed(2)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 text-xs text-yellow-300/60"
            >
              Max multiplier reached: x{freeSpin.multiplier}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
