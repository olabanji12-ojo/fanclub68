import React, { useState } from 'react';
import { RotateCw, Shield, Trash2 } from 'lucide-react';
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
import { SbobetBasketballView } from './components/SbobetBasketballView';
import { SbobetNflView } from './components/SbobetNflView';
import { SbobetFooterBar } from './components/SbobetFooterBar';
import { SbobetBetSlipDrawer } from './components/SbobetBetSlipDrawer';
import { LobbyHubModal } from './components/LobbyHubModal';
import { SbobetCockfightView } from './components/SbobetCockfightView';
import { SbobetTaiXiuView } from './components/SbobetTaiXiuView';
import { SbobetXocDiaView } from './components/SbobetXocDiaView';
import { SbobetAuthModal } from './components/SbobetAuthModal';
import { SbobetPullToRefresh } from './components/SbobetPullToRefresh';
import { SbobetAZModal } from './components/SbobetAZModal';
import { SbobetAdminModal } from './components/SbobetAdminModal';
import { translations } from './locales/translations';

export default function App() {
  const {
    currentView,
    setCurrentView,
    activeSport,
    setActiveSport,
    activeTab,
    setActiveTab,
    language,
    isRefreshing,
    refreshOdds,
    slipSelections,
    clearSlip,
    setIsBetSlipOpen,
    setIsAZModalOpen,
    setIsAdminModalOpen,
    searchTerm
  } = useSbobetStore();

  const [startY, setStartY] = useState<number>(0);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const mainEl = e.currentTarget;
    if (mainEl.scrollTop <= 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.45, 75));
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    setIsPulling(false);
    if (pullDistance >= 45) {
      setPullDistance(45);
      await refreshOdds();
    }
    setPullDistance(0);
  };

  const t = translations[language];

  // Isolated View Routes for Cockfight and 3D Virtual Casino
  if (currentView === 'cockfight') {
    return (
      <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl">
        <SbobetCockfightView />
        <SbobetBetSlipDrawer />
        <SbobetAuthModal />
        <SbobetAdminModal />
      </div>
    );
  }

  if (currentView === 'taixiu') {
    return (
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#F0F2F5] border-x border-gray-200 shadow-2xl overflow-x-hidden">
        <SbobetTaiXiuView />
        <SbobetBetSlipDrawer />
        <SbobetAuthModal />
        <SbobetAdminModal />
      </div>
    );
  }

  if (currentView === 'xocdia') {
    return (
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#070A12] border-x border-[#1A253C] shadow-2xl overflow-x-hidden">
        <SbobetXocDiaView />
        <SbobetBetSlipDrawer />
        <SbobetAuthModal />
        <SbobetAdminModal />
      </div>
    );
  }

  // Determine footer sub-market count to match reference screenshots
  const subMarketCount = activeSport === 'tennis' 
    ? 23 
    : activeSport === 'basketball'
      ? 28
      : activeSport === 'nfl'
        ? 34
        : activeTab === 'today' 
          ? 23 
          : activeTab === 'matches' 
            ? 17 
            : 13;

  return (
    <div className="min-h-screen bg-[#E5E9F0] flex justify-center selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-7xl flex justify-center">
        
        {/* DESKTOP LEFT SIDEBAR (VISIBLE ON lg: SCREENS - FULL RESPONSIVE DESKTOP LAYOUT) */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-screen sticky top-0 overflow-y-auto p-3 space-y-4 shrink-0 shadow-xs select-none">
          {/* SBOBET Desktop Branding */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentView('sbobet')}>
              <span className="text-xl font-black italic tracking-tighter text-[#0B4DA2]">
                <span className="text-[#FFC800] text-sm font-bold mr-1">3</span>SBOBET
              </span>
            </div>
            <span className="text-[10px] bg-blue-100 text-[#0B4DA2] font-black px-1.5 py-0.5 rounded uppercase">
              Pro Desktop
            </span>
          </div>

          {/* Sportsbook Navigation Menu */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 px-1">
              {language === 'vi' ? 'Sảnh Thể Thao' : 'Sportsbook Markets'}
            </div>
            <div className="space-y-1">
              {[
                { id: 'football', labelVi: 'Bóng Đá (Football)', labelEn: 'Football / Soccer', count: 42 },
                { id: 'tennis', labelVi: 'Quần Vợt (Tennis)', labelEn: 'Tennis Grand Slam', count: 18 },
                { id: 'basketball', labelVi: 'Bóng Rổ (NBA)', labelEn: 'Basketball NBA', count: 12 },
                { id: 'nfl', labelVi: 'Bóng Bầu Dục (NFL)', labelEn: 'American Football NFL', count: 8 }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActiveSport(s.id as any); setActiveTab('live'); }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-bold text-xs transition-all ${
                    activeSport === s.id
                      ? 'bg-[#0B4DA2] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">{language === 'vi' ? s.labelVi : s.labelEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    activeSport === s.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{s.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4-Grid Quick Game Hub */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 px-1">
              {language === 'vi' ? 'Trò Chơi 4-Grid & Casino' : '4-Grid & Casino Hub'}
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => setCurrentView('cockfight')}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <span>Đá Gà SV388 (7 Bồ)</span>
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black">LIVE</span>
              </button>
              <button
                onClick={() => setCurrentView('taixiu')}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                <span>Tài Xỉu 3D (40s Loop)</span>
                <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-black">3D</span>
              </button>
              <button
                onClick={() => setCurrentView('xocdia')}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <span>Xóc Đĩa 3D (Đĩa Lắc)</span>
                <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">3D</span>
              </button>
            </div>
          </div>

          {/* Admin Dashboard & Fast A-Z Shortcuts */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <button
              onClick={() => setIsAZModalOpen(true)}
              className="w-full py-2 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>A–Z Giải Đấu & Đội Bóng</span>
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full py-2 px-2.5 bg-gradient-to-r from-[#071E3D] to-[#0B4DA2] hover:brightness-110 text-yellow-300 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </button>
          </div>
        </aside>

        {/* CENTER MAIN FEED (RESPONSIVE: MOBILE MAX-W-MD, TABLET MD:MAX-W-XL, DESKTOP LG:MAX-W-2XL) */}
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl min-h-screen bg-[#F0F2F5] shadow-2xl flex flex-col font-sans relative border-x border-gray-200">
          
          {/* 1. SBOBET ROYAL BLUE HEADER */}
          <SbobetHeader />

          {/* 2. SBOBET SUB-NAVIGATION BAR (Trực, Hôm Nay, Đấu, Cược Chung) */}
          <SbobetSubNav />

          {/* 3. SEARCH & A-Z LEAGUE FILTER BAR */}
          <SbobetSearchBar />

          {/* 4. FAST TESTING SHORTCUTS (SWITCHES AMONG REFERENCE CLIENT SCREENSHOTS & SPORTS) */}
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
              WA0009 (Bóng Đá Trực Tiếp)
            </button>

            <button
              onClick={() => { setActiveSport('tennis'); setActiveTab('live'); }}
              className={`px-2 py-0.5 rounded font-bold shrink-0 transition-colors ${
                activeSport === 'tennis'
                  ? 'bg-[#FFC800] text-black'
                  : 'bg-[#0E3970] text-gray-300 hover:text-white'
              }`}
            >
              WA0010/13 (Quần Vợt US Open)
            </button>

            <button
              onClick={() => { setActiveSport('basketball'); setActiveTab('live'); }}
              className={`px-2 py-0.5 rounded font-bold shrink-0 transition-colors ${
                activeSport === 'basketball'
                  ? 'bg-[#FFC800] text-black'
                  : 'bg-[#0E3970] text-gray-300 hover:text-white'
              }`}
            >
              Bóng Rổ (NBA)
            </button>

            <button
              onClick={() => { setActiveSport('nfl'); setActiveTab('live'); }}
              className={`px-2 py-0.5 rounded font-bold shrink-0 transition-colors ${
                activeSport === 'nfl'
                  ? 'bg-[#FFC800] text-black'
                  : 'bg-[#0E3970] text-gray-300 hover:text-white'
              }`}
            >
              Bóng Bầu Dục (NFL)
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

          {/* 5. MAIN DYNAMIC SPORTSBOOK CONTENT */}
          <main
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex-1 p-2 space-y-2 overflow-y-auto relative"
          >
            {/* PULL TO REFRESH CIRCULAR INDICATOR */}
            <SbobetPullToRefresh pullDistance={pullDistance} isPulling={isPulling} />
            
            {/* VIEW A: TENNIS GRAND SLAM (SCREENSHOT 2 & 5: IMG-20260907-WA0010.jpg & WA0013.jpg) */}
            {activeSport === 'tennis' && (
              <SbobetTennisAccordion />
            )}

            {/* VIEW B: BASKETBALL NBA (MILESTONE 1 REQUIREMENT) */}
            {activeSport === 'basketball' && (
              <SbobetBasketballView />
            )}

            {/* VIEW C: AMERICAN FOOTBALL NFL (MILESTONE 1 REQUIREMENT) */}
            {activeSport === 'nfl' && (
              <SbobetNflView />
            )}

            {/* VIEW D: FOOTBALL - LIVE TAB (MATCHING TEST2.JPG & TEST1.JPG) */}
            {activeSport === 'football' && activeTab === 'live' && (
              <div className="space-y-3">
                {/* MATCH 1: CUIABA EC VS ATHLETIC CLUB MG (EXACT MATCH FROM TEST2.JPG) */}
                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-xs">
                  <SbobetOddsTable
                    matchId="match-cuiaba-athletic-01"
                    homeTeam="Cuiaba EC"
                    awayTeam="Athletic Club MG"
                    scoreHome={1}
                    scoreAway={0}
                    liveTime="1H 49' (+6)"
                    handicapTeam="home"
                    leagueName="Giải Serie B Brazil"
                    isLive={true}
                    homeHandicap="-0.25"
                    homeOdds={-0.91}
                    awayHandicap="+0.25"
                    awayOdds={0.81}
                    ouGoal="2.00"
                    ouOverOdds={0.87}
                    ouUnderOdds={-0.99}
                    oneXTwoHome={1.23}
                    oneXTwoAway={13.50}
                    oneXTwoDraw={4.66}
                    moreCount={8}
                  />
                </div>

                {/* MATCH 2: CRICIUMA EC VS EC JUVENTUDE (EXACT MATCH FROM TEST2.JPG) */}
                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-xs">
                  <SbobetOddsTable
                    matchId="match-criciuma-juventude-01"
                    homeTeam="Criciuma EC"
                    awayTeam="EC Juventude"
                    scoreHome={0}
                    scoreAway={0}
                    liveTime="1H 16'"
                    handicapTeam="home"
                    leagueName="Giải Serie B Brazil"
                    isLive={true}
                    homeHandicap="-0.25"
                    homeOdds={0.89}
                    awayHandicap="+0.25"
                    awayOdds={-0.79}
                    ouGoal="1.50"
                    ouOverOdds={0.95}
                    ouUnderOdds={-0.79}
                    oneXTwoHome={2.25}
                    oneXTwoAway={3.80}
                    oneXTwoDraw={2.95}
                    moreCount={8}
                  />
                </div>

                {/* MATCH 3: BARCELONA VS REAL MADRID (LA LIGA LIVE) */}
                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-xs">
                  <SbobetOddsTable
                    matchId="match-barca-real-01"
                    homeTeam="Barcelona"
                    awayTeam="Real Madrid"
                    scoreHome={2}
                    scoreAway={0}
                    liveTime="43' (H1)"
                    handicapTeam="home"
                    leagueName="Giải La Liga Tây Ban Nha"
                    isLive={true}
                    homeHandicap="-0.50"
                    homeOdds={-0.75}
                    awayHandicap="+0.50"
                    awayOdds={0.65}
                    ouGoal="3.50"
                    ouOverOdds={0.92}
                    ouUnderOdds={0.88}
                    oneXTwoHome={1.65}
                    oneXTwoAway={4.80}
                    oneXTwoDraw={3.90}
                    moreCount={12}
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
                      cornerScore="[4:2]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW E: FOOTBALL - TODAY TAB (SCREENSHOT 4: IMG-20260907-WA0012.jpg) */}
            {activeSport === 'football' && activeTab === 'today' && (
              <div className="space-y-2">
                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-xs">
                  <SbobetOddsTable
                    matchId="match-atletico-sevilla-01"
                    homeTeam="Atlético Madrid"
                    awayTeam="Sevilla"
                    scoreHome={0}
                    scoreAway={0}
                    liveTime="Hôm nay 21:00"
                    handicapTeam="home"
                    leagueName="Giải La Liga Tây Ban Nha"
                    isLive={false}
                    homeHandicap="-0.50"
                    homeOdds={0.85}
                    awayHandicap="+0.50"
                    awayOdds={0.95}
                    ouGoal="2.50"
                    ouOverOdds={0.90}
                    ouUnderOdds={0.90}
                    oneXTwoHome={1.85}
                    oneXTwoAway={4.20}
                    oneXTwoDraw={3.40}
                    moreCount={14}
                  />

                  {/* FULL EXTENDED SUB-MARKET ACCORDIONS */}
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

            {/* VIEW F: FOOTBALL - MATCHES / LEAGUES TAB (SCREENSHOT 3 & TEST1.JPG) */}
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
                    handicapTeam="home"
                    leagueName="Giải Liga Portugal"
                    isLive={true}
                    homeHandicap="-0.25"
                    homeOdds={-0.54}
                    awayHandicap="+0.25"
                    awayOdds={0.46}
                    ouGoal="3.50"
                    ouOverOdds={-0.61}
                    ouUnderOdds={0.51}
                    oneXTwoHome={2.10}
                    oneXTwoAway={3.40}
                    oneXTwoDraw={3.20}
                    moreCount={17}
                  />

                  {/* POPULAR BET BUILDER @4.133 MATCHING SCREENSHOT 3 */}
                  <SbobetBetBuilder
                    matchId="match-benfica-sporting-01"
                    homeTeam="Benfica"
                    awayTeam="Sporting CP"
                  />

                  {/* LIGA PORTUGAL ACCORDIONS WITH CORNERS [2:1] (SCREENSHOT 3) */}
                  <div className="p-2">
                    <SbobetLigaPortugalAccordion
                      matchId="match-benfica-sporting-01"
                      homeTeam="Benfica"
                      awayTeam="Sporting CP"
                      cornerScore="[2:1]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW G: PARLAY / OUTRIGHT */}
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

          {/* 6. SBOBET FOOTER TOOLBAR & BOTTOM ACTION BUTTONS */}
          <SbobetFooterBar subMarketCount={subMarketCount} />

          {/* 7. SLIDE-OVER BET SLIP DRAWER */}
          <SbobetBetSlipDrawer />

          {/* 8. 4-GRID MASTER LOBBY MODAL */}
          <LobbyHubModal />

          {/* 9. AUTH MODAL (LOGIN & REGISTER) */}
          <SbobetAuthModal />

          {/* 10. A-Z LEAGUE & TEAM SORTING MODAL */}
          <SbobetAZModal />

          {/* 11. INITIAL ADMIN DASHBOARD MODAL */}
          <SbobetAdminModal />

        </div>

        {/* DESKTOP RIGHT SIDEBAR (PERSISTENT PINNED BET SLIP ON lg: SCREENS) */}
        <aside className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col h-screen sticky top-0 overflow-y-auto p-3 space-y-3 shrink-0 shadow-xs select-none">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="font-black text-[#0B4DA2] text-sm flex items-center gap-1.5">
              <span>Phiếu Cược Desktop</span>
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {slipSelections.length}
              </span>
            </div>
            {slipSelections.length > 0 && (
              <button
                onClick={() => clearSlip()}
                className="text-[11px] text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa hết</span>
              </button>
            )}
          </div>

          {/* Desktop Slip Items List */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {slipSelections.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                Chưa có vé cược nào được chọn.<br />
                <span className="text-[11px] text-gray-500 mt-1 block">Nhấp vào tỷ lệ cược bất kỳ để thêm vào phiếu.</span>
              </div>
            ) : (
              slipSelections.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-200 text-xs space-y-1">
                  <div className="font-bold text-gray-900 truncate">{item.matchName}</div>
                  <div className="text-[11px] text-gray-500">{item.marketName}</div>
                  <div className="flex justify-between items-center pt-1 font-bold">
                    <span className="text-blue-700">{item.selectionName}</span>
                    <span className="font-mono text-emerald-600 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                      @{item.odds.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {slipSelections.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Tổng tiền cược:</span>
                <span className="font-mono text-gray-900">${(slipSelections.length * 50).toFixed(2)}</span>
              </div>
              <button
                onClick={() => setIsBetSlipOpen(true)}
                className="w-full py-2 bg-gradient-to-r from-[#FFC800] to-[#E6B400] hover:brightness-105 text-black font-black rounded-lg shadow-sm text-xs uppercase tracking-wide"
              >
                Đặt Cược Ngay (${(slipSelections.length * 50).toFixed(2)})
              </button>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
