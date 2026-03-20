import React, { useState, useEffect } from 'react';
import Spinner from './components/Spinner';
import WinnerModal from './components/WinnerModal';
import CameraCapture from './components/CameraCapture';
import Showcase from './components/Showcase';
import PhotoDetailModal from './components/PhotoDetailModal';
import ViewAllWinnersModal from './components/ViewAllWinnersModal';
import RemainingPrizesModal from './components/RemainingPrizesModal';
import { generateWheelSlices } from './prizeConfig';
import { Sparkles, Gift, User, ArrowLeft } from 'lucide-react';

function App() {
  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem('raya_prizes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse prizes", e);
      }
    }
    return generateWheelSlices();
  });

  const [winners, setWinners] = useState(() => {
    const saved = localStorage.getItem('raya_winners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse winners", e);
      }
    }
    return [];
  });
  
  // Modal states
  const [currentWinner, setCurrentWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showAllWinners, setShowAllWinners] = useState(false);
  const [showRemainingPrizes, setShowRemainingPrizes] = useState(false);
  const [selectedPhotoRecord, setSelectedPhotoRecord] = useState(null);
  const [userName, setUserName] = useState('');
  const [isReadyToSpin, setIsReadyToSpin] = useState(false);

  // Auto-sync state to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('raya_prizes', JSON.stringify(prizes));
  }, [prizes]);

  useEffect(() => {
    localStorage.setItem('raya_winners', JSON.stringify(winners));
  }, [winners]);

  const handleWin = (prize) => {
    setCurrentWinner(prize);
    setShowModal(true);
    
    setPrizes(prev => {
      const sliceIndex = prev.findIndex(p => p.id === prize.id);
      if (sliceIndex === -1) return prev;
      
      const newPrizes = [...prev];
      newPrizes.splice(sliceIndex, 1);
      return newPrizes;
    });
  };

  const handleCapturePhoto = () => {
    setShowModal(false);
    setShowCamera(true);
  };

  const handleSkipPhoto = () => {
    addWinnerRecord(null);
    setShowModal(false);
    setCurrentWinner(null);
  };

  const handleCameraComplete = (photoDataUrl) => {
    addWinnerRecord(photoDataUrl);
    setShowCamera(false);
    setCurrentWinner(null);
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
    setShowModal(true);
  };

  const addWinnerRecord = (photoUrl) => {
    const uniqueCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newRecord = {
      id: `history-${Date.now()}`,
      userName: userName || 'Pemenang',
      uniqueCode: uniqueCode,
      prizeName: currentWinner.name,
      prizeURL: currentWinner.image,
      photoUrl: photoUrl,
      timestamp: Date.now()
    };
    setWinners(prev => [newRecord, ...prev]);
    // Optionally reset name after record is added, or keep it for next spin
    // setUserName(''); 
    // setIsReadyToSpin(false); 
  };

  const handleReset = () => {
    const newPrizes = generateWheelSlices();
    setPrizes(newPrizes);
    setWinners([]);
    localStorage.setItem('raya_prizes', JSON.stringify(newPrizes));
    localStorage.setItem('raya_winners', JSON.stringify([]));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="badge glass-panel">
          <Sparkles color="#d97706" size={20} />
          <span>Berkah Ramadhan</span>
          <Sparkles color="#d97706" size={20} />
        </div>
        <h1 className="app-title text-gradient">
          RAYA SPINNER
        </h1>
      </header>

      <main className="main-content">
        <section className="spinner-section">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="spinner-container-wrapper">
              {!isReadyToSpin ? (
                <div className="name-input-panel glass-panel">
                  <div className="name-input-icon">👤</div>
                  <h2 className="name-input-title">Siapa yang akan Spin?</h2>
                  <p className="name-input-desc">Masukkan nama Anda untuk memulai keseruan!</p>
                  <input 
                    type="text" 
                    className="name-input-field" 
                    placeholder="Contoh: Budi Santoso"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                       if (userName.trim()) setIsReadyToSpin(true);
                       else alert('Tolong isi nama dulu ya!');
                    }}
                  >
                    Lanjut ke Spinner
                  </button>
                </div>
              ) : prizes.length > 0 ? (
                <Spinner prizes={prizes} onWin={handleWin} />
              ) : (
                <div className="empty-state glass-panel">
                  <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>😲</span>
                  <h2>Semua Hadiah Habis!</h2>
                  <button onClick={handleReset} className="btn-primary">
                    Mulai Ulang
                  </button>
                </div>
              )}
            </div>
            
            {isReadyToSpin && (
              <div className="flex flex-col items-center gap-4 mt-4">
                <button className="btn-secondary" onClick={() => setShowRemainingPrizes(true)}>
                  <Gift size={20} /> Lihat Hadiah Tersisa ({prizes.length})
                </button>
                <button className="btn-tertiary" onClick={() => setIsReadyToSpin(false)}>
                  <User size={18} />
                  <span>Ganti Nama ({userName})</span>
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="showcase-section">
          <Showcase 
            winners={winners} 
            count={9} 
            onViewAll={() => setShowAllWinners(true)}
            onPhotoClick={(record) => setSelectedPhotoRecord(record)}
          />
          <button 
            onClick={() => {
              if (window.confirm('Yakin ingin mereset aplikasi? Semua data pemenang akan hilang!')) {
                handleReset();
              }
            }} 
            className="reset-btn"
          >
            Reset Aplikasi
          </button>
        </section>
      </main>

      <div className="bg-decor-1" />
      <div className="bg-decor-2" />

      {/* Primary Capture Modals */}
      {showModal && currentWinner && (
        <WinnerModal 
          prize={currentWinner} 
          onCapturePhoto={handleCapturePhoto} 
          onSkip={handleSkipPhoto} 
        />
      )}

      {showCamera && currentWinner && (
        <CameraCapture 
          prize={currentWinner}
          onComplete={handleCameraComplete}
          onCancel={handleCameraCancel}
        />
      )}

      {/* Info Modals */}
      {showAllWinners && (
        <ViewAllWinnersModal 
          winners={winners} 
          onClose={() => setShowAllWinners(false)}
          onPhotoClick={(record) => setSelectedPhotoRecord(record)}
        />
      )}

      {showRemainingPrizes && (
        <RemainingPrizesModal 
          prizes={prizes}
          onClose={() => setShowRemainingPrizes(false)}
        />
      )}

      {selectedPhotoRecord && (
        <PhotoDetailModal
          record={selectedPhotoRecord}
          onClose={() => setSelectedPhotoRecord(null)}
        />
      )}
    </div>
  );
}

export default App;
