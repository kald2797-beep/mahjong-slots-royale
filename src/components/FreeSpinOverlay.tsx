import { motion, AnimatePresence } from 'framer-motion';
import { FreeSpinState } from '../game/types';
import scrollBg from '../assets/scroll-bg.png';

interface FreeSpinOverlayProps {
  freeSpin: FreeSpinState;
}

// Chinese-themed palette
const RED_DEEP = 'hsl(0 70% 22%)';
const RED_RICH = 'hsl(0 75% 38%)';
const GOLD = 'hsl(42 95% 58%)';
const GOLD_LIGHT = 'hsl(48 100% 72%)';
const PAPER = 'hsl(38 55% 88%)';

export function FreeSpinOverlay({ freeSpin }: FreeSpinOverlayProps) {
  if (freeSpin.phase === 'inactive') return null;

  return (
    <AnimatePresence>
      {/* ============ INTRO ============ */}
      {freeSpin.phase === 'intro' && (
        <motion.div
          key="fs-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
          {/* Deep red backdrop with vignette */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.92 }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${RED_RICH} 0%, ${RED_DEEP} 55%, hsl(0 80% 8%) 100%)`,
            }}
          />

          {/* Golden radial burst */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                `radial-gradient(circle at 50% 50%, ${GOLD}33 0%, transparent 30%)`,
                `radial-gradient(circle at 50% 50%, ${GOLD}66 0%, transparent 55%)`,
                `radial-gradient(circle at 50% 50%, ${GOLD}33 0%, transparent 35%)`,
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Sun-ray spokes */}
          <motion.div
            className="absolute"
            style={{
              width: '180vmax',
              height: '180vmax',
              background: `repeating-conic-gradient(from 0deg, ${GOLD}22 0deg 6deg, transparent 6deg 18deg)`,
              maskImage: 'radial-gradient(circle, black 10%, transparent 65%)',
              WebkitMaskImage: 'radial-gradient(circle, black 10%, transparent 65%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />

          {/* Floating lanterns */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`lantern-${i}`}
              className="absolute text-4xl sm:text-5xl"
              style={{ left: `${10 + i * 11}%`, filter: `drop-shadow(0 0 12px ${GOLD})` }}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{ y: '-20vh', opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 6 + Math.random() * 3,
                delay: i * 0.25,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              🏮
            </motion.div>
          ))}

          {/* Gold petal particles ring */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (360 / 24) * i;
            const rad = (angle * Math.PI) / 180;
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-3 rounded-full"
                style={{
                  background: `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD})`,
                  boxShadow: `0 0 8px ${GOLD}`,
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(rad) * 180, Math.cos(rad) * 150],
                  y: [0, Math.sin(rad) * 180, Math.sin(rad) * 150],
                  scale: [0, 1.4, 1],
                  opacity: [0, 1, 0.7],
                  rotate: angle + 90,
                }}
                transition={{ duration: 1.6, delay: i * 0.025, ease: 'easeOut' }}
              />
            );
          })}

          {/* Center medallion */}
          <div className="relative z-10 text-center px-6">
            {/* Chinese character medallion */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              className="mx-auto mb-5 relative"
              style={{ width: 130, height: 130 }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${GOLD_LIGHT} 0%, ${GOLD} 60%, hsl(38 70% 35%) 100%)`,
                  boxShadow: `0 0 40px ${GOLD}, inset 0 0 20px hsl(38 70% 30%)`,
                  border: `3px solid ${GOLD_LIGHT}`,
                }}
              />
              <div
                className="absolute inset-2 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${RED_RICH}, ${RED_DEEP})`,
                  border: `2px solid ${GOLD}`,
                }}
              >
                <span
                  className="text-6xl font-bold"
                  style={{ color: GOLD_LIGHT, textShadow: `0 0 12px ${GOLD}, 0 2px 0 hsl(0 80% 15%)` }}
                >
                  福
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.35 }}
            >
              <div
                className="font-display text-4xl sm:text-5xl font-black tracking-wider"
                style={{
                  background: `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD} 50%, hsl(38 80% 42%))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: `drop-shadow(0 2px 0 hsl(0 80% 12%)) drop-shadow(0 0 18px ${GOLD})`,
                  letterSpacing: '0.08em',
                }}
              >
                FREE SPINS
              </div>
              <div
                className="text-base sm:text-lg mt-1 tracking-[0.4em]"
                style={{ color: GOLD_LIGHT, textShadow: `0 0 10px ${GOLD}` }}
              >
                免 費 旋 轉
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-5"
            >
              <div
                className="inline-block px-6 py-2 rounded-md"
                style={{
                  background: `linear-gradient(180deg, ${RED_RICH}, ${RED_DEEP})`,
                  border: `2px solid ${GOLD}`,
                  boxShadow: `0 0 18px ${GOLD}66, inset 0 0 12px hsl(0 80% 10%)`,
                }}
              >
                <span
                  className="font-display text-2xl sm:text-3xl font-black"
                  style={{ color: GOLD_LIGHT, textShadow: `0 0 8px ${GOLD}` }}
                >
                  {freeSpin.totalSpins} SPINS
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-3 text-sm"
              style={{ color: PAPER }}
            >
              Multiplier x2 · 永 不 重 置 · Never Resets
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ============ SPINNING HUD ============ */}
      {freeSpin.phase === 'spinning' && (
        <motion.div
          key="fs-hud"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          {/* Pagoda-style header */}
          <div className="relative">
            {/* Pagoda roof */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-2"
              style={{
                width: '110%',
                height: 14,
                background: `linear-gradient(180deg, ${GOLD}, hsl(38 70% 35%))`,
                clipPath: 'polygon(0% 100%, 8% 0%, 92% 0%, 100% 100%)',
                boxShadow: `0 2px 8px hsl(0 80% 10% / 0.6)`,
              }}
            />
            <div
              className="px-5 pt-3 pb-2 rounded-b-2xl flex items-center gap-4 relative"
              style={{
                background: `linear-gradient(180deg, ${RED_RICH}, ${RED_DEEP})`,
                border: `2px solid ${GOLD}`,
                borderTop: 'none',
                boxShadow: `0 6px 20px hsl(0 80% 10% / 0.6), 0 0 18px ${GOLD}44`,
              }}
            >
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-wider" style={{ color: GOLD_LIGHT }}>
                  免費 Spins
                </div>
                <motion.div
                  key={freeSpin.remainingSpins}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  className="font-display font-black text-lg"
                  style={{ color: GOLD_LIGHT, textShadow: `0 0 8px ${GOLD}` }}
                >
                  {freeSpin.remainingSpins}/{freeSpin.totalSpins}
                </motion.div>
              </div>
              <div className="w-px h-9" style={{ background: `${GOLD}66` }} />
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-wider" style={{ color: GOLD_LIGHT }}>
                  倍數 Multi
                </div>
                <motion.div
                  key={freeSpin.multiplier}
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  className="font-display font-black text-lg"
                  style={{ color: GOLD_LIGHT, textShadow: `0 0 10px ${GOLD}` }}
                >
                  x{freeSpin.multiplier}
                </motion.div>
              </div>
              <div className="w-px h-9" style={{ background: `${GOLD}66` }} />
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-wider" style={{ color: GOLD_LIGHT }}>
                  贏 Win
                </div>
                <div className="font-bold text-sm" style={{ color: GOLD_LIGHT }}>
                  ${freeSpin.totalWin.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============ SUMMARY ============ */}
      {freeSpin.phase === 'summary' && (
        <motion.div
          key="fs-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden pointer-events-none"
        >
          {/* Gold coin rain (with 元 character) */}
          {Array.from({ length: 24 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute flex items-center justify-center text-[10px] font-bold rounded-full"
              style={{
                width: 18,
                height: 18,
                background: `radial-gradient(circle, ${GOLD_LIGHT}, ${GOLD} 70%, hsl(38 70% 35%))`,
                boxShadow: `0 0 8px ${GOLD}`,
                color: 'hsl(0 80% 20%)',
                left: `${Math.random() * 100}%`,
              }}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: ['0vh', '110vh'], opacity: [0, 1, 1, 0], rotate: [0, 540] }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              元
            </motion.div>
          ))}

          {/* Scroll card with image background */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 16 }}
            className="relative z-10 w-full max-w-md"
            style={{
              aspectRatio: '1265 / 800',
              backgroundImage: `url(${scrollBg})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              filter: `drop-shadow(0 12px 30px hsl(0 0% 0% / 0.6))`,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 py-10">
              <div
                className="font-display text-3xl font-black mb-1"
                style={{ color: RED_RICH, letterSpacing: '0.15em' }}
              >
                恭 喜
              </div>
              <div
                className="font-display text-xs font-bold uppercase tracking-[0.3em] mb-2"
                style={{ color: 'hsl(20 60% 25%)' }}
              >
                Congratulations
              </div>

              <div
                className="mx-auto w-16 h-px mb-2"
                style={{ background: `linear-gradient(90deg, transparent, ${RED_RICH}, transparent)` }}
              />

              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(20 50% 30%)' }}>
                Total Win · 總贏
              </div>
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.4 }}
                className="font-display text-4xl font-black my-1"
                style={{
                  background: `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD} 50%, hsl(38 80% 40%))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: `drop-shadow(0 2px 0 hsl(0 80% 18%)) drop-shadow(0 0 12px ${GOLD})`,
                }}
              >
                ${freeSpin.totalWin.toFixed(2)}
              </motion.div>

              <div
                className="inline-block mt-1 px-3 py-0.5 rounded-md"
                style={{
                  background: `linear-gradient(180deg, ${RED_RICH}, ${RED_DEEP})`,
                  border: `1px solid ${GOLD}`,
                }}
              >
                <span className="text-[10px] font-bold" style={{ color: GOLD_LIGHT }}>
                  Max Multiplier · x{freeSpin.multiplier}
                </span>
              </div>

              <div className="mt-2 text-[10px] tracking-[0.3em]" style={{ color: 'hsl(20 50% 35%)' }}>
                — 大 吉 大 利 —
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
