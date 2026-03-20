import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Check, X, Download } from 'lucide-react';
import './CameraCapture.css';

const DECORATIONS = [
  { id: 'none', label: 'Tanpa Bingkai' },
  { id: 'gold', label: 'Bingkai Emas', src: '/frame-gold.png' },
  { id: 'hijau', label: 'Bingkai Hijau', src: '/eid-frame.png' },
  { id: 'ketupat', label: 'Ketupat', src: '/frame-ketupat.png' },
  { id: 'ramadhan', label: 'Ramadhan', src: '/frame-ramadhan.png' },
  { id: 'muharram1', label: 'Twibbon 1', src: '/frame-muharram-1.png' },
  { id: 'muharram2', label: 'Twibbon 2', src: '/frame-muharram-2.png' }
];

export default function CameraCapture({ prize, onComplete, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDecor, setSelectedDecor] = useState('gold');

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Gagal mengakses kamera. ' + err.message);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Use fixed high resolution square (1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    // Draw mirrored video - crop to square
    const vWidth = video.videoWidth;
    const vHeight = video.videoHeight;
    const minSize = Math.min(vWidth, vHeight);
    const sx = (vWidth - minSize) / 2;
    const sy = (vHeight - minSize) / 2;

    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, minSize, minSize, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw Selected Decoration
    const decor = DECORATIONS.find(d => d.id === selectedDecor);
    if (decor && decor.src) {
      const frameImg = new Image();
      frameImg.src = decor.src;
      await new Promise((resolve) => {
        frameImg.onload = () => {
          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        frameImg.onerror = resolve;
      });
    }

    // Draw Prize Image
    const prizeImg = new Image();
    prizeImg.crossOrigin = 'anonymous';
    prizeImg.src = prize.image;
    
    // We must wait for image to load to draw it onto canvas
    prizeImg.onload = () => {
      const size = 250;
      const x = canvas.width - size - 40;
      const y = canvas.height - size - 40;
      
      // Draw prize background
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, size, size, 20) : ctx.rect(x, y, size, size);
      ctx.fill();
      
      ctx.drawImage(prizeImg, x + 10, y + 10, size - 20, size - 20);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImg(dataUrl);
    };
    
    // Fallback if image fails to load quickly
    prizeImg.onerror = () => {
       const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
       setCapturedImg(dataUrl);
    };
  };

  const handleRetake = () => {
    setCapturedImg(null);
  };

  const handleConfirm = () => {
    onComplete(capturedImg);
  };

  const handleDownload = () => {
    if (!capturedImg) return;
    const link = document.createElement('a');
    const safeName = (prize.userName || 'Pemenang').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const code = prize.uniqueCode || Math.random().toString(36).substring(2, 7).toUpperCase();
    link.download = `${safeName}-${code}-${prize.name}.jpg`;
    link.href = capturedImg;
    link.click();
  };

  return (
    <div className="camera-overlay">
      <div className="camera-card">
        <div className="camera-header">
          <button onClick={onCancel} className="camera-close">
            <X size={24} />
          </button>
          <h2 className="camera-title">Selfie Pemenang</h2>
          <p className="camera-subtitle">{prize.name}</p>
        </div>

        {!capturedImg && (
          <div className="camera-decor-selector">
            {DECORATIONS.map(d => (
              <button 
                key={d.id} 
                className={`decor-btn ${selectedDecor === d.id ? 'active' : ''}`}
                onClick={() => setSelectedDecor(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}

        <div className="camera-viewport">
          {error ? (
            <div className="camera-error">{error}</div>
          ) : capturedImg ? (
            <img src={capturedImg} alt="Captured" className="camera-preview" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          <div className="camera-prize-stamp">
            <img src={prize.image} alt={prize.name} />
          </div>
          
          {/* Live overlay preview so user knows what they've selected */}
          {!capturedImg && (
             <div className="camera-live-overlay">
                {DECORATIONS.find(d => d.id === selectedDecor)?.src && (
                  <img src={DECORATIONS.find(d => d.id === selectedDecor).src} alt="Frame" className="live-frame-img" />
                )}
             </div>
          )}
        </div>

        <div className="camera-controls">
          {!capturedImg ? (
            <button onClick={handleCapture} className="camera-btn-capture">
              <div className="camera-btn-inner" />
            </button>
          ) : (
            <div className="camera-actions">
              <button onClick={handleRetake} className="camera-btn-retake">
                <RefreshCw size={20} /> Ulangi
              </button>
              <button onClick={handleDownload} className="camera-btn-download">
                <Download size={20} /> Unduh
              </button>
              <button onClick={handleConfirm} className="camera-btn-confirm">
                <Check size={20} /> Simpan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
