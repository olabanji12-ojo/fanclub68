import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSbobetStore } from './stores/sbobetStore';
import { SbobetSportsView } from './components/SbobetSportsView';
import { SbobetAdminPortal } from './components/SbobetAdminPortal';
import { SbobetCockfightView } from './components/SbobetCockfightView';
import { SbobetTaiXiuView } from './components/SbobetTaiXiuView';
import { SbobetXocDiaView } from './components/SbobetXocDiaView';
import { SbobetBetSlipDrawer } from './components/SbobetBetSlipDrawer';
import { SbobetAuthModal } from './components/SbobetAuthModal';
import { SbobetAdminModal } from './components/SbobetAdminModal';

function NavigationBridge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentView, setCurrentView } = useSbobetStore();

  // 1. Sync React Router location when store currentView changes
  useEffect(() => {
    const routeMap: Record<string, string> = {
      sbobet: '/',
      lobby: '/lobby',
      taixiu: '/taixiu',
      cockfight: '/cockfight',
      xocdia: '/xocdia',
      admin: '/admin',
    };
    const target = routeMap[currentView] || '/';
    // Don't re-navigate if already on matching root or alias
    if (target === '/' && (location.pathname === '/' || location.pathname === '/sports')) return;
    if (location.pathname !== target) {
      navigate(target);
    }
  }, [currentView, navigate, location.pathname]);

  // 2. Sync store when browser URL changes directly (e.g. direct load, refresh, back/forward)
  useEffect(() => {
    const path = location.pathname.replace(/^\//, '').toLowerCase();
    if (path === 'admin' && currentView !== 'admin') setCurrentView('admin');
    else if ((path === 'taixiu' || path === 'casino') && currentView !== 'taixiu') setCurrentView('taixiu');
    else if (path === 'cockfight' && currentView !== 'cockfight') setCurrentView('cockfight');
    else if (path === 'xocdia' && currentView !== 'xocdia') setCurrentView('xocdia');
    else if (path === 'lobby' && currentView !== 'lobby') setCurrentView('lobby');
    else if ((path === '' || path === 'sports') && currentView !== 'sbobet') setCurrentView('sbobet');
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBridge />
      <Routes>
        {/* 1. Main Sportsbook Routes */}
        <Route path="/" element={<SbobetSportsView />} />
        <Route path="/sports" element={<SbobetSportsView />} />

        {/* 2. Milestone 2 Staging Admin Command Portal */}
        <Route path="/admin" element={<SbobetAdminPortal />} />

        {/* 3. 3D Virtual Casino (Tài Xỉu) */}
        <Route 
          path="/taixiu" 
          element={
            <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl overflow-x-hidden">
              <SbobetTaiXiuView />
              <SbobetBetSlipDrawer />
              <SbobetAuthModal />
              <SbobetAdminModal />
            </div>
          } 
        />
        <Route 
          path="/casino" 
          element={
            <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl overflow-x-hidden">
              <SbobetTaiXiuView />
              <SbobetBetSlipDrawer />
              <SbobetAuthModal />
              <SbobetAdminModal />
            </div>
          } 
        />

        {/* 4. SV388 Cockfight Live Arena */}
        <Route 
          path="/cockfight" 
          element={
            <div className="w-full max-w-full md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl overflow-x-hidden">
              <SbobetCockfightView />
              <SbobetBetSlipDrawer />
              <SbobetAuthModal />
              <SbobetAdminModal />
            </div>
          } 
        />

        {/* 5. 3D Xóc Đĩa MD5 Token Arena */}
        <Route 
          path="/xocdia" 
          element={
            <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#070A12] border-x border-[#1A253C] shadow-2xl overflow-x-hidden">
              <SbobetXocDiaView />
              <SbobetBetSlipDrawer />
              <SbobetAuthModal />
              <SbobetAdminModal />
            </div>
          } 
        />

        {/* 6. 4-Grid Master Lobby */}
        <Route path="/lobby" element={<SbobetSportsView showLobbyOnMount={true} />} />

        {/* Fallback wildcard redirect to Sportsbook */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
