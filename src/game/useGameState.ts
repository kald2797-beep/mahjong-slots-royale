import { useState, useCallback, useRef } from 'react';
import { GameState, Grid, WinCluster } from './types';
import { createGrid, findClusters, removeWinning, getMultiplier, calculateWin } from './engine';
import { useAudio } from './useAudio';

const INITIAL_BALANCE = 1000;
const BET_OPTIONS = [0.5, 1, 2, 5, 10, 20];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export function useGameState() {
  const [state, setState] = useState<GameState>({
    grid: createGrid(),
    balance: INITIAL_BALANCE,
    bet: 1,
    totalWin: 0,
    currentWin: 0,
    multiplier: 1,
    cascadeCount: 0,
    isSpinning: false,
    isAutoSpin: false,
    winClusters: [],
    phase: 'idle',
  });

  const autoSpinRef = useRef(false);
  const { play } = useAudio();

  const runCascadeLoop = useCallback(async (grid: Grid, bet: number, cascadeCount: number, accumulatedWin: number) => {
    const clusters = findClusters(grid);
    
    if (clusters.length === 0) {
      return { grid, totalWin: accumulatedWin, cascadeCount };
    }

    const multiplier = getMultiplier(cascadeCount);
    const win = calculateWin(clusters, bet, multiplier);

    // Show winning clusters
    setState(s => ({ ...s, winClusters: clusters, phase: 'revealing', multiplier, currentWin: win }));
    play(win > bet * 10 ? 'bigWin' : 'win');
    await delay(800);

    // Explode
    setState(s => ({ ...s, phase: 'exploding' }));
    play('cascade');
    await delay(400);

    // Remove and cascade
    const newGrid = removeWinning(grid, clusters);
    setState(s => ({
      ...s,
      grid: newGrid,
      winClusters: [],
      phase: 'cascading',
      totalWin: accumulatedWin + win,
      cascadeCount: cascadeCount + 1,
    }));
    await delay(500);

    // Recurse
    return runCascadeLoop(newGrid, bet, cascadeCount + 1, accumulatedWin + win);
  }, [play]);

  const spin = useCallback(async () => {
    setState(s => {
      if (s.isSpinning || s.balance < s.bet) return s;
      return {
        ...s,
        isSpinning: true,
        phase: 'spinning',
        balance: s.balance - s.bet,
        totalWin: 0,
        currentWin: 0,
        multiplier: 1,
        cascadeCount: 0,
        winClusters: [],
      };
    });

    play('spin');
    
    // Generate new grid
    const newGrid = createGrid();
    
    // Quick reveal with stagger effect
    setState(s => {
      if (!s.isSpinning && s.phase !== 'spinning') return s; // guard
      return { ...s, grid: newGrid, phase: 'settling' };
    });
    await delay(600);

    // Get current bet from state
    let currentBet = 1;
    setState(s => { currentBet = s.bet; return s; });

    const result = await runCascadeLoop(newGrid, currentBet, 0, 0);

    setState(s => ({
      ...s,
      grid: result.grid,
      balance: s.balance + result.totalWin,
      totalWin: result.totalWin,
      isSpinning: false,
      phase: 'idle',
      winClusters: [],
    }));

    // Auto-spin
    if (autoSpinRef.current) {
      await delay(500);
      // Trigger next spin via ref check
    }

    return result.totalWin;
  }, [play, runCascadeLoop]);

  const setBet = useCallback((bet: number) => {
    setState(s => s.isSpinning ? s : { ...s, bet });
  }, []);

  const toggleAutoSpin = useCallback(() => {
    setState(s => {
      const newAuto = !s.isAutoSpin;
      autoSpinRef.current = newAuto;
      return { ...s, isAutoSpin: newAuto };
    });
  }, []);

  return {
    state,
    spin,
    setBet,
    toggleAutoSpin,
    betOptions: BET_OPTIONS,
    autoSpinRef,
  };
}
