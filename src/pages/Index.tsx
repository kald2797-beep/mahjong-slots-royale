import { useEffect, useRef, useCallback } from 'react';
import { useGameState } from '../game/useGameState';
import { SlotGrid } from '../components/SlotGrid';
import { TopBar } from '../components/TopBar';
import { Controls } from '../components/Controls';
import { BigWinOverlay } from '../components/BigWinOverlay';
import bgTemple from '../assets/bg-temple.jpg';

const Index = () => {
  const { state, spin, setBet, toggleAutoSpin, betOptions, autoSpinRef } = useGameState();
  const containerRef = useRef<HTMLDivElement>(null);

  const showBigWin = state.phase === 'idle' && state.totalWin > state.bet * 10;
  const showShake = state.phase === 'idle' && state.totalWin > state.bet * 20;

  // Auto-spin loop
  const spinRef = useRef(spin);
  spinRef.current = spin;
  
  useEffect(() => {
    if (state.phase === 'idle' && autoSpinRef.current && state.balance >= state.bet) {
      const timer = setTimeout(() => {
        spinRef.current();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.balance, state.bet, autoSpinRef]);

  const handleSpin = useCallback(() => {
    spin();
  }, [spin]);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen min-h-[100dvh] flex flex-col items-center justify-between 
                  px-2 py-3 sm:px-4 sm:py-4 max-w-md mx-auto relative overflow-hidden
                  ${showShake ? 'screen-shake' : ''}`}
    >
      {/* Background image - full bleed */}
      <div
        className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgTemple})` }}
      />
      <div className="fixed inset-0 w-screen h-screen bg-black/30" />

      {/* Top bar */}
      <div className="w-full relative z-10">
        <TopBar
          balance={state.balance}
          bet={state.bet}
          totalWin={state.totalWin}
          multiplier={state.multiplier}
          cascadeCount={state.cascadeCount}
        />
      </div>

      {/* Slot Grid */}
      <div className="w-full flex-1 flex items-center justify-center relative z-10 my-2 sm:my-3">
        <div className="w-full">
          <SlotGrid
            grid={state.grid}
            winClusters={state.winClusters}
            phase={state.phase}
            cascadeCount={state.cascadeCount}
          />
        </div>
        <BigWinOverlay amount={state.totalWin} visible={showBigWin} />
      </div>

      {/* Controls */}
      <div className="w-full relative z-10">
        <Controls
          onSpin={handleSpin}
          isSpinning={state.isSpinning}
          bet={state.bet}
          betOptions={betOptions}
          onBetChange={setBet}
          isAutoSpin={state.isAutoSpin}
          onToggleAutoSpin={toggleAutoSpin}
          canSpin={state.balance >= state.bet}
        />
      </div>
    </div>
  );
};

export default Index;
