/**
 * ============================================================
 * RTP Configuration
 * ============================================================
 * Single source of truth for tuning the slot's Return-To-Player.
 *
 * Target RTP: 96%
 *
 * Tuned via Monte Carlo simulation (see scripts/simulateRtp.ts).
 * Adjust `payoutFactor` to scale RTP up/down without changing
 * symbol balance. Adjust weights/payouts for math redesign.
 *
 * Quick tuning rule:
 *   newPayoutFactor = currentPayoutFactor * (targetRTP / measuredRTP)
 * ============================================================
 */

export interface RtpConfig {
  /** Symbol weights for the BASE game reels (index = SymbolId 0..9) */
  baseWeights: number[];
  /** Symbol weights during FREE SPINS (index = SymbolId 0..9) */
  freeSpinWeights: number[];
  /** Per-symbol payout (index = SymbolId 0..9). Used in calculateWin. */
  payouts: number[];
  /** Cascade multiplier ladder (base game) */
  multiplierSteps: number[];
  /** Cascade multiplier ladder (free spins, persistent) */
  freeSpinMultiplierSteps: number[];
  /**
   * Global payout scaling factor.
   * `win = clusterSize * symbolPayout * bet * multiplier * payoutFactor`
   * Increase → higher RTP. Decrease → lower RTP.
   */
  payoutFactor: number;
  /** Free-spin trigger table: scatterCount → freeSpinCount */
  freeSpinTrigger: { count: number; spins: number }[];
  /** Retrigger table: scatterCount during free spins → extra spins */
  retriggerTable: { count: number; spins: number }[];
  /** Min cluster size to award a payout */
  minClusterSize: number;
}

/**
 * Default config — calibrated for ~96% RTP.
 *
 * Symbol IDs:
 *  0 Red Dragon (5)  1 Lantern (3)  2 Dragon (4)  3 Bamboo (2)
 *  4 Cherry (1.5)    5 Dolls (1)    6 Envelope (0.8)
 *  7 Card (0.5)      8 Scatter      9 Wild
 */
export const DEFAULT_RTP_CONFIG: RtpConfig = {
  baseWeights:     [3, 5, 4, 8, 10, 14, 16, 20, 1.5, 0],
  freeSpinWeights: [5, 7, 6, 10, 12, 14, 14, 16, 0,   2],
  payouts:         [5, 3, 4, 2, 1.5, 1, 0.8, 0.5, 0, 0],
  multiplierSteps:         [1, 2, 3, 5, 10, 15, 25],
  freeSpinMultiplierSteps: [2, 4, 6, 10, 15, 25, 50],
  payoutFactor: 0.1,
  freeSpinTrigger: [
    { count: 5, spins: 15 },
    { count: 4, spins: 12 },
    { count: 3, spins: 10 },
  ],
  retriggerTable: [
    { count: 3, spins: 5 },
    { count: 2, spins: 3 },
  ],
  minClusterSize: 5,
};

// Live config (mutable) — change at runtime via setRtpConfig()
let activeConfig: RtpConfig = { ...DEFAULT_RTP_CONFIG };

export function getRtpConfig(): RtpConfig {
  return activeConfig;
}

export function setRtpConfig(partial: Partial<RtpConfig>) {
  activeConfig = { ...activeConfig, ...partial };
}

export function resetRtpConfig() {
  activeConfig = { ...DEFAULT_RTP_CONFIG };
}
