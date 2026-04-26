import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseHistory from './pages/ExpenseHistory';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Goals from './pages/Goals';
import CustomCursor from './components/CustomCursor';
import { ExpenseProvider } from './context/ExpenseContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Global CSS styles applied to App
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  return children;
};

const StartupLoadingScreen = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.load();

    const tryAutoplay = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Retry shortly after mount for stricter autoplay policies.
          window.setTimeout(() => {
            video.play().catch(() => {});
          }, 120);
        });
      }
    };

    tryAutoplay();
    video.addEventListener('canplay', tryAutoplay);
    video.addEventListener('loadeddata', tryAutoplay);
    return () => {
      video.removeEventListener('canplay', tryAutoplay);
      video.removeEventListener('loadeddata', tryAutoplay);
    };
  }, []);

  const handleFinish = () => {
    setIsFadingOut(true);
    window.setTimeout(() => onComplete(), 400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 400ms ease'
      }}
    >
      <video
        ref={videoRef}
        src="/Loading.mp4"
        autoPlay
        muted={true}
        defaultMuted
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        preload="auto"
        onEnded={handleFinish}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover'
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '190px',
          height: '90px',
          background: 'radial-gradient(ellipse at bottom right, rgba(0,0,0,1) 38%, rgba(0,0,0,0.92) 56%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const [showStartupVideo, setShowStartupVideo] = useState(true);

  const handleStartupComplete = () => {
    setShowStartupVideo(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <>
      {showStartupVideo && <StartupLoadingScreen onComplete={handleStartupComplete} />}
      <div className="flex-1 flex flex-col w-full h-full">
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
            <Route path="/expense-history" element={<ProtectedRoute><ExpenseHistory /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <CustomCursor />
        <Router>
          <AppRoutes />
        </Router>
      </ExpenseProvider>
    </AuthProvider>
  );
}
