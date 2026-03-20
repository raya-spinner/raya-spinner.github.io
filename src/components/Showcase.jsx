import React, { useMemo } from 'react';
import './Showcase.css';

export default function Showcase({ winners, count = 6, onViewAll, onPhotoClick }) {
  if (winners.length === 0) {
    return (
      <div className="showcase-empty glass-panel">
        <div className="showcase-empty-icon">
          <span>🎁</span>
        </div>
        <h3 style={{color: '#1f2937'}}>Belum Ada Pemenang</h3>
        <p style={{color: '#4b5563'}}>SPIN roda untuk mulai membagikan hadiah Lebaran!</p>
      </div>
    );
  }

  // Randomize the displayed winners so it changes
  const displayedWinners = useMemo(() => {
    if (winners.length <= count) return winners;
    return [...winners].sort(() => 0.5 - Math.random()).slice(0, count);
  }, [winners, count]);

  return (
    <div className="showcase-container">
      <div className="showcase-header">
        <h3 className="showcase-title">🏆 Showcase Pemenang</h3>
        <span className="showcase-badge">
          Total: {winners.length}
        </span>
      </div>

      <div className="showcase-grid">
        {displayedWinners.map((w) => (
          <div key={w.id} className="showcase-grid-item" onClick={() => onPhotoClick(w)} title={w.prizeName}>
            {w.photoUrl ? (
              <img src={w.photoUrl} alt="Winner" className="showcase-photo" />
            ) : (
              <div className="showcase-avatar-placeholder text-4xl">😎</div>
            )}
            <div className="showcase-prize-badge">
              <img src={w.prizeURL} alt={w.prizeName} />
            </div>
          </div>
        ))}
      </div>
      
      {winners.length > count && (
        <div className="showcase-footer">
          <button className="showcase-btn-all" onClick={onViewAll}>
            LIHAT SEMUA ({winners.length})
          </button>
        </div>
      )}
    </div>
  );
}
