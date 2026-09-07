import React from 'react';
import { useSbobetStore } from './stores/sbobetStore';
import { SbobetHeader } from './components/SbobetHeader';
import { SbobetSubNav } from './components/SbobetSubNav';
import { SbobetSearchBar } from './components/SbobetSearchBar';
import { SbobetOddsTable } from './components/SbobetOddsTable';
import { SbobetBetBuilder } from './components/SbobetBetBuilder';
import { SbobetMatchAccordion } from './components/SbobetMatchAccordion';
import { SbobetTodayAccordion } from './components/SbobetTodayAccordion';
import { SbobetLigaPortugalAccordion } from './components/SbobetLigaPortugalAccordion';
import { SbobetTennisAccordion } from './components/SbobetTennisAccordion';
import { SbobetFooterBar } from './components/SbobetFooterBar';
import { SbobetBetSlipDrawer } from './components/SbobetBetSlipDrawer';
import { LobbyHubModal } from './components/LobbyHubModal';
import { SbobetCockfightView } from './components/SbobetCockfightView';
import { SbobetTaiXiuView } from './components/SbobetTaiXiuView';
import { SbobetXocDiaView } from './components/SbobetXocDiaView';
import { SbobetAuthModal } from './components/SbobetAuthModal';
import { translations } from './locales/translations';

export default function App() {
  const {
    currentView,
    activeSport,
    setActiveSport,
    activeTab,
    setActiveTab,
    language
  } = useSbobetStore();

  const t = translations[language];

  // Isolated View Routes for Cockfight and 3D Virtual Casino
  if (currentView === 'cockfight') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl">
        <SbobetCockfightView />
        <SbobetBetSlipDrawer />
        <SbobetAuthModal />
      </div>
    );
  }

  if (currentView === 'taixiu') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl">
        <SbobetTaiXiuView />
        <SbobetBetSlipDrawer />
        <SbobetAuthModal />
      </div>
    );
  }

  if (currentView === 'xocdia') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl">
        <SbobetXocDiaView />
        <SbobetBetSlipDrawer />
        <SbobetAuthModal />
      </div>
    );
  }

  // Determine footer sub-market count to match reference screenshots
  const subMarketCount = activeSport === 'tennis' 
    ? 23 
    : activeTab === 'today' 
      ? 23 
      : activeTab === 'matches' 
        ? 17 
        : 13;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F0F2F5] shadow-2xl flex flex-col font-sans relative border-x border-gray-200">
      
      {/* 1. SBOBET ROYAL BLUE HEADER */}
      <SbobetHeader />

      {/* 2. SBOBET SUB-NAVIGATION BAR (Trực, Hôm Nay, Đấu, Cược Chung) */}
      <SbobetSubNav />

      {/* 3. SEARCH & A-Z LEAGUE FILTER BAR (CONTRACT REQUIREMENT) */}
      <SbobetSearchBar />

      {/* 4. SCREENSHOT FAST SWITCHER (MAKES TESTING ALL 5 CLIENT SCREENSHOTS 1-CLICK EASY) */}
      <div className="bg-[#071E3D] px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[#0A2A54] text-[10px]">
        <span className="text-gray-400 font-bold shrink-0">Trang mẫu:</span>
        <button
          onClick={() => { setActiveSport('football'); setActiveTab('live'); }}
          className={`px-2 py-0.5 rounded font-bold shrink-0 transition-colors ${
            activeSport === 'football' && activeTab === 'live'
              ? 'bg-[#FFC800] text-black'
              : 'bg-[#0E3970] text-gray-300 hover:text-white'
          }`}
        >
          WA0009 (Trực tiếp)
        </button>

        <button
          onClick={() => { setActiveSport('tennis'); setActiveTab('live'); }}
          className={`px-2 py-0.5 rounded font-bold shrink-0 transition-colors ${
            activeSport === 'tennis'
              ? 'bg-[#FFC800] text-black'
              : 'bg-[#0E3970] text-gray-300 hover:text-white'
          }`}
        >
          WA0010/13 (Quần Vợt)
        </button>

        <button
          onClick={() => { setActiveSport('football'); setActiveTab('matches'); }}
          className={`px-2 py-0.5 rounded font-bold shrink-0 transition-colors ${
            activeSport === 'football' && activeTab === 'matches'
              ? 'bg-[#FFC800] text-black'
              : 'bg-[#0E3970] text-gray-300 hover:text-white'
          }`}
        >
          WA0011 (Liga Portugal)
        </button>

        <button
          onClick={() => { setActiveSport('football'); setActiveTab('today'); }}
          className={`px-2 py-0.5 rounded font-bold shrink-0 transition-colors ${
            activeSport === 'football' && activeTab === 'today'
              ? 'bg-[#FFC800] text-black'
              : 'bg-[#0E3970] text-gray-300 hover:text-white'
          }`}
        >
          WA0012 (Hôm Nay La Liga)
        </button>
      </div>

      {/* 4. MAIN DYNAMIC SPORTSBOOK CONTENT */}
      <main className="flex-1 p-2 space-y-2 overflow-y-auto">
        
        {/* VIEW A: TENNIS GRAND SLAM (SCREENSHOT 2 & 5: IMG-20260907-WA0010.jpg & WA0013.jpg) */}
        {activeSport === 'tennis' && (
          <SbobetTennisAccordion />
        )}

        {/* VIEW B: FOOTBALL - LIVE TAB (SCREENSHOT 1: IMG-20260907-WA0009.jpg) */}
        {activeSport === 'football' && activeTab === 'live' && (
          <div className="space-y-2">
            <div className="bg-[#DCE7F5] border border-[#BFD4EE] rounded px-3 py-1.5 flex items-center justify-between text-xs font-bold text-[#0B4DA2]">
              <span className="truncate">Giải La Liga Tây Ban Nha</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="bg-[#1877F2] text-white text-[10px] px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
                  ▲ {t.top_league}
                </span>
                <span className="bg-[#0B4DA2] text-white text-[10px] px-1.5 py-0.5 rounded font-black">
                  1 ▴
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-xs">
              <SbobetOddsTable
                matchId="match-barca-real-01"
                homeTeam="Barcelona"
                awayTeam="Real Madrid"
                scoreHome={2}
                scoreAway={0}
                liveTime="43' (H1)"
              />

              <SbobetBetBuilder
                matchId="match-barca-real-01"
                homeTeam="Barcelona"
                awayTeam="Real Madrid"
              />

              <div className="p-2">
                <SbobetMatchAccordion
                  matchId="match-barca-real-01"
                  homeTeam="Barcelona"
                  awayTeam="Real Madrid"
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW C: FOOTBALL - TODAY TAB (SCREENSHOT 4: IMG-20260907-WA0012.jpg) */}
        {activeSport === 'football' && activeTab === 'today' && (
          <div className="space-y-2">
            {/* LA LIGA BANNER WITH 'ĐỨNG ĐẦU' PILL (SCREENSHOT 4) */}
            <div className="bg-[#DCE7F5] border border-[#BFD4EE] rounded px-3 py-1.5 flex items-center justify-between text-xs font-bold text-[#0B4DA2]">
              <span className="truncate">Giải La Liga Tây Ban Nha</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="bg-[#1877F2] text-white text-[10px] px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
                  ▲ {t.top_league}
                </span>
                <span className="bg-[#0B4DA2] text-white text-[10px] px-1.5 py-0.5 rounded font-black">
                  1 ▴
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-xs">
              <SbobetOddsTable
                matchId="match-atletico-sevilla-01"
                homeTeam="Atlético Madrid"
                awayTeam="Sevilla"
                scoreHome={0}
                scoreAway={0}
                liveTime="Hôm nay 21:00"
              />

              {/* FULL EXTENDED SUB-MARKET ACCORDIONS (SCREENSHOT 4: HT/TT, Double Chance, Corners 1x2, Props) */}
              <div className="p-2">
                <SbobetTodayAccordion
                  matchId="match-atletico-sevilla-01"
                  homeTeam="Atlético Madrid"
                  awayTeam="Sevilla"
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW D: FOOTBALL - MATCHES / LEAGUES TAB (SCREENSHOT 3: IMG-20260907-WA0011.jpg) */}
        {activeSport === 'football' && activeTab === 'matches' && (
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-xs">
              <SbobetOddsTable
                matchId="match-benfica-sporting-01"
                homeTeam="Benfica"
                awayTeam="Sporting CP"
                scoreHome={1}
                scoreAway={0}
                liveTime="38' (H1)"
              />

              {/* POPULAR BET BUILDER @4.133 MATCHING SCREENSHOT 3 */}
              <SbobetBetBuilder
                matchId="match-benfica-sporting-01"
                homeTeam="Benfica"
                awayTeam="Sporting CP"
              />

              {/* LIGA PORTUGAL ACCORDIONS WITH CORNERS [2:1] (SCREENSHOT 3) */}
              <div className="p-2">
                <SbobetLigaPortugalAccordion />
              </div>
            </div>
          </div>
        )}

        {/* VIEW E: PARLAY / OUTRIGHT */}
        {activeSport === 'football' && activeTab === 'parlay' && (
          <div className="bg-white border border-gray-200 rounded p-4 text-xs font-sans space-y-3">
            <div className="font-bold text-[#0B4DA2] text-sm border-b pb-2">
              🏆 Cược Chung & Vô Địch Giải Đấu (Outrights)
            </div>
            <div className="space-y-2">
              {[
                { title: 'Vô Địch La Liga 2026/27', fav: 'Real Madrid (1.80)' },
                { title: 'Vô Địch Ngoại Hạng Anh 2026/27', fav: 'Manchester City (2.10)' },
                { title: 'Vô Địch UEFA Champions League', fav: 'Bayern Munich (4.50)' }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-gray-50 border rounded flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{item.title}</span>
                  <span className="font-black text-blue-800">{item.fav}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 5. SBOBET FOOTER TOOLBAR & BOTTOM ACTION BUTTONS */}
      <SbobetFooterBar subMarketCount={subMarketCount} />

      {/* 6. SLIDE-OVER BET SLIP DRAWER */}
      <SbobetBetSlipDrawer />

      {/* 7. 4-GRID MASTER LOBBY MODAL */}
      <LobbyHubModal />

      {/* 8. AUTH MODAL (LOGIN & REGISTER) */}
      <SbobetAuthModal />

    </div>
  );
}
