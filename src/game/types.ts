export type SymbolId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SymbolDef {
  id: SymbolId;
  emoji: string;
  name: string;
  payout: number;
  isScatter?: boolean;
  isWild?: boolean;
}

export const SYMBOLS: SymbolDef[] = [
  { id: 0, emoji: '🀄', name: 'Red Dragon', payout: 5 },
  { id: 1, emoji: '🏮', name: 'Lantern', payout: 3 },
  { id: 2, emoji: '🐉', name: 'Dragon', payout: 4 },
  { id: 3, emoji: '🎋', name: 'Bamboo', payout: 2 },
  { id: 4, emoji: '🌸', name: 'Cherry Blossom', payout: 1.5 },
  { id: 5, emoji: '🎎', name: 'Dolls', payout: 1 },
  { id: 6, emoji: '🧧', name: 'Red Envelope', payout: 0.8 },
  { id: 7, emoji: '🎴', name: 'Card', payout: 0.5 },
  { id: 8, emoji: '🔮', name: 'Scatter', payout: 0, isScatter: true },
  { id: 9, emoji: '⭐', name: 'Wild', payout: 0, isWild: true },
];

export const COLS = 5;
export const ROWS = 5;

export const MULTIPLIER_STEPS = [1, 2, 3, 5, 10, 15, 25];
export const FREE_SPIN_MULTIPLIER_STEPS = [2, 4, 6, 10, 15, 25, 50];

export type CellState = {
  symbolId: SymbolId;
  key: number;
  fromRow?: number;
  isGoldenWild?: boolean; // transformed to wild after win
};

export type Grid = CellState[][];

export interface WinCluster {
  positions: [number, number][];
  symbolId: SymbolId;
  payout: number;
}

export interface FreeSpinState {
  active: boolean;
  totalSpins: number;
  remainingSpins: number;
  totalWin: number;
  multiplier: number;
  phase: 'inactive' | 'intro' | 'spinning' | 'summary';
}

export interface GameState {
  grid: Grid;
  balance: number;
  bet: number;
  totalWin: number;
  currentWin: number;
  multiplier: number;
  cascadeCount: number;
  isSpinning: boolean;
  isAutoSpin: boolean;
  winClusters: WinCluster[];
  phase: 'idle' | 'clearing' | 'spinning' | 'revealing' | 'exploding' | 'cascading' | 'settling' | 'teasing';
  freeSpin: FreeSpinState;
  scatterPositions: [number, number][];
  teaserActive?: boolean;
  teaserHit?: boolean;
  revealedCols?: number; // number of columns currently revealed (for column-by-column drop)
  teaserCol?: number; // which column is currently being teased
}
