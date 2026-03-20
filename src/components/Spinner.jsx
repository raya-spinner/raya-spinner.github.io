import React, { useState, useRef } from 'react';
import { playTick, playWin } from '../utils/audio';
import './Spinner.css';

const COLORS = [
  '#f43f5e', '#d946ef', '#8b5cf6', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#f97316'
];

export default function Spinner({ prizes, onWin }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  if (!prizes || prizes.length === 0) return <div>No prizes left!</div>;

  const totalSlices = prizes.length;
  const anglePerSlice = 360 / totalSlices;

  const colorStops = prizes.map((_, i) => {
    const c = COLORS[i % COLORS.length];
    return `${c} ${(i * anglePerSlice).toFixed(2)}deg ${((i + 1) * anglePerSlice).toFixed(2)}deg`;
  }).join(', ');

  const handleSpin = () => {
    if (isSpinning || totalSlices === 0) return;
    setIsSpinning(true);

    const winningIndex = Math.floor(Math.random() * totalSlices);
    const winner = prizes[winningIndex];

    const extraSpins = 5;
    const stopAngle = 360 - (winningIndex * anglePerSlice + anglePerSlice / 2);
    const finalRotation = rotation - (rotation % 360) + (extraSpins * 360) + stopAngle;

    setRotation(finalRotation);

    // Audio effect: simulate clicks. It spins for 6s.
    let ticks = 0;
    const maxTicks = 45;
    const playNextTick = () => {
      if (ticks >= maxTicks || !isSpinning) return;
      playTick();
      ticks++;
      // exponential delay simulating slow down
      const delay = 10 * Math.exp((ticks / maxTicks) * 3);
      setTimeout(playNextTick, delay);
    };
    playNextTick();

    setTimeout(() => {
      setIsSpinning(false);
      playWin();
      onWin(winner);
    }, 6000); 
  };

  return (
    <div className="spinner-wrapper">
      <div className="spinner-pointer" />

      <div 
        ref={wheelRef}
        className="spinner-wheel"
        style={{
          background: `conic-gradient(${colorStops})`,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 6s cubic-bezier(0.1, 0, 0, 1)'
        }}
      >
        {prizes.map((p, i) => {
          const rotateAngle = i * anglePerSlice + anglePerSlice / 2;
          return (
            <div 
              key={p.id}
              className="spinner-slice"
              style={{ transform: `rotate(${rotateAngle}deg)` }}
            >
              <div className="spinner-item-container">
                <img 
                  src={p.image} 
                  alt={p.name}
                  className="spinner-image"
                />
              </div>
            </div>
          );
        })}
        <div className="spinner-inner-circle" />
      </div>

      <button 
        onClick={handleSpin}
        disabled={isSpinning}
        className="spinner-btn"
      >
        SPIN
      </button>
    </div>
  );
}
