import React from 'react';
import { X } from 'lucide-react';
import './ModalStlyes.css';

export default function ViewAllWinnersModal({ winners, onClose, onPhotoClick }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-fullscreen-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header-nav">
          <h2>🏆 Semua Pemenang ({winners.length})</h2>
          <button className="modal-close-btn relative" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {winners.length === 0 ? (
            <div className="empty-message">Belum ada pemenang yang tercatat.</div>
          ) : (
            <div className="winners-grid-large">
              {winners.map(w => (
                <div key={w.id} className="winner-grid-card" onClick={() => onPhotoClick(w)}>
                  <div className="winner-grid-avatar">
                    {w.photoUrl ? (
                      <img src={w.photoUrl} alt="Winner" />
                    ) : (
                      <div className="winner-placeholder">😎</div>
                    )}
                    <div className="winner-grid-badge">
                      <img src={w.prizeURL} alt={w.prizeName} />
                    </div>
                  </div>
                  <p className="winner-grid-name">{w.prizeName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
