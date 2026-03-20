import React from 'react';
import { X, Download } from 'lucide-react';
import './ModalStlyes.css'; // Shared CSS for new modals

export default function PhotoDetailModal({ record, onClose }) {
  if (!record) return null;

  const handleDownload = () => {
    if (!record.photoUrl) return;
    const link = document.createElement('a');
    const safeName = (record.userName || 'Pemenang').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const code = record.uniqueCode || record.id.split('-').pop();
    link.download = `${safeName}-${code}-${record.prizeName}.jpg`;
    link.href = record.photoUrl;
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-detail-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="detail-photo-wrapper">
          {record.photoUrl ? (
            <img src={record.photoUrl} alt="Winner" className="detail-photo" />
          ) : (
            <div className="detail-photo-placeholder">
              <span className="text-6xl">😎</span>
            </div>
          )}
          <div className="detail-prize-badge">
             <img src={record.prizeURL} alt={record.prizeName} />
          </div>
        </div>

        <h3 className="detail-prize-title">{record.prizeName}</h3>
        <p className="detail-winner-name">Dimenangkan oleh: <strong>{record.userName}</strong> ({record.uniqueCode})</p>
        <p className="detail-time">
          Waktu: {new Date(record.timestamp).toLocaleString('id-ID')}
        </p>

        {record.photoUrl && (
          <button className="detail-download-btn" onClick={handleDownload}>
            <Download size={20} /> Unduh & Bagikan
          </button>
        )}
      </div>
    </div>
  );
}
