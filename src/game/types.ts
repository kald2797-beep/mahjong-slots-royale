import tileRedDragon from '@/assets/tiles/red-dragon.png';
import tileGreenDragon from '@/assets/tiles/green-dragon.png';
import tileWhiteDragon from '@/assets/tiles/white-dragon.png';
import tileBamboo from '@/assets/tiles/bamboo.png';
import tileCircles from '@/assets/tiles/circles.png';
import tileCharacter from '@/assets/tiles/character.png';
import tileEastWind from '@/assets/tiles/east-wind.png';
import tileSparrow from '@/assets/tiles/sparrow.png';

export type SymbolId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface SymbolDef {
  id: SymbolId;
  image: string;
  name: string;
  payout: number;
}

export const SYMBOLS: SymbolDef[] = [
  { id: 0, image: tileRedDragon, name: 'Red Dragon', payout: 5 },
  { id: 1, image: tileGreenDragon, name: 'Green Dragon', payout: 3 },
  { id: 2, image: tileWhiteDragon, name: 'White Dragon', payout: 4 },
  { id: 3, image: tileBamboo, name: 'Bamboo', payout: 2 },
  { id: 4, image: tileCircles, name: 'Circles', payout: 1.5 },
  { id: 5, image: tileCharacter, name: 'Character', payout: 1 },
  { id: 6, image: tileEastWind, name: 'East Wind', payout: 0.8 },
  { id: 7, image: tileSparrow, name: 'Sparrow', payout: 0.5 },
];

export const COLS = 5;
export const ROWS = 5;

export const MULTIPLIER_STEPS = [1, 2, 3, 5, 10, 15, 25];

export type CellState = {
  symbolId: SymbolId;
  key: number;
};

export type Grid = CellState[][];

export interface WinCluster {
  positions: [number, number][];
  symbolId: SymbolId;
  payout: number;
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
  phase: 'idle' | 'spinning' | 'revealing' | 'exploding' | 'cascading' | 'settling';
}
