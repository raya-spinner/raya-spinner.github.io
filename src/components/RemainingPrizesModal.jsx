import React from 'react';
import { X, Gift } from 'lucide-react';
import './ModalStlyes.css';

export default function RemainingPrizesModal({ prizes, onClose }) {
  // Group prizes by identity to show quantities properly
  const prizeCounts = prizes.reduce((acc, p) => {
    if (!acc[p.name]) {
      acc[p.name] = { name: p.name, image: p.image, count: 0 };
    }
    acc[p.name].count += 1;
    return acc;
  }, {});

  const groupedPrizes = Object.values(prizeCounts).sort((a, b) => b.count - a.count);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-fullscreen-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header-nav">
          <h2><Gift className="inline-block mr-2 text-emerald-600" /> Sisa Hadiah Menarik ({prizes.length})</h2>
          <button className="modal-close-btn relative" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {groupedPrizes.length === 0 ? (
            <div className="empty-message">Wah, semua hadiah sudah habis!</div>
          ) : (
            <div className="prizes-grid">
              {groupedPrizes.map((p, idx) => (
                <div key={idx} className="prize-info-card">
                  <div className="prize-image-wrap">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div className="prize-text-wrap">
                    <p className="prize-name">{p.name}</p>
                    <p className="prize-count">Sisa: {p.count} buah</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
