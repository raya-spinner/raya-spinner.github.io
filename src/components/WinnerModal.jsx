import React from 'react';
import confetti from 'canvas-confetti';
import { Camera, X } from 'lucide-react';
import './WinnerModal.css';

export default function WinnerModal({ prize, onCapturePhoto, onSkip }) {
  if (!prize) return null;

  React.useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, { particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">HORE!! 🥳</h2>
        <p className="modal-subtitle">Kamu Mendapatkan</p>
        
        <div className="modal-image-container">
          <img src={prize.image} alt={prize.name} className="modal-image" />
        </div>
        
        <h3 className="modal-prize-name">{prize.name}</h3>

        <div className="modal-actions">
          <button onClick={onCapturePhoto} className="btn-capture">
            <Camera size={24} />
            Selfie Sama Hadiah!
          </button>
          
          <button onClick={onSkip} className="btn-skip">
            <X size={20} />
            Lewati Foto
          </button>
        </div>
      </div>
    </div>
  );
}
