import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SbobetSportsView } from './components/SbobetSportsView';
import { SbobetAdminPortal } from './components/SbobetAdminPortal';
import { SbobetCockfightView } from './components/SbobetCockfightView';
import { SbobetTaiXiuView } from './components/SbobetTaiXiuView';
import { SbobetXocDiaView } from './components/SbobetXocDiaView';
import { SbobetBetSlipDrawer } from './components/SbobetBetSlipDrawer';
import { SbobetAuthModal } from './components/SbobetAuthModal';
import { SbobetAdminModal } from './components/SbobetAdminModal';

export default function App() {
  return (
    <BrowserRouter>
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
            <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl">
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
