import React, { useState, useEffect } from 'react';
import { RotateCw, Shield, Trash2, Search, Filter, X } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { SbobetHeader } from './SbobetHeader';
import { SbobetSubNav } from './SbobetSubNav';
import { SbobetSearchBar } from './SbobetSearchBar';
import { SbobetOddsTable } from './SbobetOddsTable';
import { SbobetBetBuilder } from './SbobetBetBuilder';
import { SbobetMatchAccordion } from './SbobetMatchAccordion';
import { SbobetTodayAccordion } from './SbobetTodayAccordion';
import { SbobetLigaPortugalAccordion } from './SbobetLigaPortugalAccordion';
import { SbobetTennisAccordion } from './SbobetTennisAccordion';
import { SbobetBasketballView } from './SbobetBasketballView';
import { SbobetNflView } from './SbobetNflView';
import { SbobetFooterBar } from './SbobetFooterBar';
import { SbobetBetSlipDrawer } from './SbobetBetSlipDrawer';
import { LobbyHubModal } from './LobbyHubModal';
import { SbobetAuthModal } from './SbobetAuthModal';
import { SbobetPullToRefresh } from './SbobetPullToRefresh';
import { SbobetAZModal } from './SbobetAZModal';
import { SbobetAdminModal } from './SbobetAdminModal';
import { translations } from '../locales/translations';

export interface FootballFixture {
  matchId: string;
  leagueId: 'EPL' | 'LALIGA' | 'UCL' | 'SERIE_B' | 'PORTUGAL';
  leagueName: string;
  homeTeam: string;
  awayTeam: string;
  scoreHome: number;
  scoreAway: number;
  liveTime: string;
  isLive: boolean;
  handicapTeam?: 'home' | 'away';
  homeHandicap: string;
  homeOdds: number;
  awayHandicap: string;
  awayOdds: number;
  ouGoal: string;
  ouOverOdds: number;
  ouUnderOdds: number;
  oneXTwoHome: number;
  oneXTwoAway: number;
  oneXTwoDraw: number;
  moreCount: number;
  hasBetBuilder?: boolean;
  hasAccordion?: boolean;
  cornerScore?: string;
  hasTodayAccordion?: boolean;
  hasLigaAccordion?: boolean;
}

export const FOOTBALL_FIXTURES: FootballFixture[] = [
  // --- PREMIER LEAGUE (EPL) ---
  {
    matchId: 'match-arsenal-chelsea-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    scoreHome: 2,
    scoreAway: 1,
    liveTime: "64' (H2)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.50',
    homeOdds: -0.84,
    awayHandicap: '+0.50',
    awayOdds: 0.76,
    ouGoal: '3.50',
    ouOverOdds: 0.91,
    ouUnderOdds: -0.99,
    oneXTwoHome: 1.72,
    oneXTwoAway: 4.40,
    oneXTwoDraw: 3.60,
    moreCount: 22,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[5:3]'
  },
  {
    matchId: 'match-mancity-tottenham-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham Hotspur',
    scoreHome: 1,
    scoreAway: 0,
    liveTime: "28' (H1)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-1.25',
    homeOdds: 0.95,
    awayHandicap: '+1.25',
    awayOdds: -0.85,
    ouGoal: '3.25',
    ouOverOdds: -0.92,
    ouUnderOdds: 0.82,
    oneXTwoHome: 1.45,
    oneXTwoAway: 6.20,
    oneXTwoDraw: 4.80,
    moreCount: 26,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[2:1]'
  },
  {
    matchId: 'match-liverpool-astonvilla-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Liverpool',
    awayTeam: 'Aston Villa',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: "12' (H1)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.75',
    homeOdds: 0.88,
    awayHandicap: '+0.75',
    awayOdds: -0.96,
    ouGoal: '2.75',
    ouOverOdds: 0.85,
    ouUnderOdds: -0.95,
    oneXTwoHome: 1.60,
    oneXTwoAway: 5.10,
    oneXTwoDraw: 4.10,
    moreCount: 18,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[1:1]'
  },
  {
    matchId: 'match-manutd-newcastle-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Manchester United',
    awayTeam: 'Newcastle United',
    scoreHome: 1,
    scoreAway: 1,
    liveTime: "52' (H2)",
    isLive: true,
    handicapTeam: 'away',
    homeHandicap: '+0.25',
    homeOdds: -0.90,
    awayHandicap: '-0.25',
    awayOdds: 0.82,
    ouGoal: '3.00',
    ouOverOdds: 0.94,
    ouUnderOdds: -0.88,
    oneXTwoHome: 2.85,
    oneXTwoAway: 2.45,
    oneXTwoDraw: 3.30,
    moreCount: 20,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[4:4]'
  },

  // --- LA LIGA ---
  {
    matchId: 'match-realmadrid-barcelona-01',
    leagueId: 'LALIGA',
    leagueName: 'Giải Tây Ban Nha (La Liga)',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    scoreHome: 1,
    scoreAway: 2,
    liveTime: "78' (H2)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '0.00',
    homeOdds: 0.98,
    awayHandicap: '0.00',
    awayOdds: -0.92,
    ouGoal: '4.50',
    ouOverOdds: 0.89,
    ouUnderOdds: -0.97,
    oneXTwoHome: 2.60,
    oneXTwoAway: 2.50,
    oneXTwoDraw: 3.50,
    moreCount: 30,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[6:5]'
  },
  {
    matchId: 'match-atletico-sevilla-01',
    leagueId: 'LALIGA',
    leagueName: 'Giải Tây Ban Nha (La Liga)',
    homeTeam: 'Atletico Madrid',
    awayTeam: 'Sevilla',
    scoreHome: 2,
    scoreAway: 0,
    liveTime: "88' (H2)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-1.00',
    homeOdds: -0.75,
    awayHandicap: '+1.00',
    awayOdds: 0.65,
    ouGoal: '2.50',
    ouOverOdds: -0.95,
    ouUnderOdds: 0.85,
    oneXTwoHome: 1.35,
    oneXTwoAway: 8.50,
    oneXTwoDraw: 4.90,
    moreCount: 15,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[7:2]'
  },

  // --- UEFA CHAMPIONS LEAGUE (UCL) ---
  {
    matchId: 'match-bayern-psg-01',
    leagueId: 'UCL',
    leagueName: 'Cúp C1 Châu Âu (Champions League)',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Paris Saint-Germain',
    scoreHome: 0,
    scoreAway: 1,
    liveTime: "34' (H1)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.25',
    homeOdds: 0.90,
    awayHandicap: '+0.25',
    awayOdds: -0.98,
    ouGoal: '3.25',
    ouOverOdds: 0.88,
    ouUnderOdds: -0.96,
    oneXTwoHome: 2.15,
    oneXTwoAway: 3.10,
    oneXTwoDraw: 3.65,
    moreCount: 28,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[3:2]'
  },
  {
    matchId: 'match-inter-real-01',
    leagueId: 'UCL',
    leagueName: 'Cúp C1 Châu Âu (Champions League)',
    homeTeam: 'Inter Milan',
    awayTeam: 'Borussia Dortmund',
    scoreHome: 2,
    scoreAway: 2,
    liveTime: "71' (H2)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.50',
    homeOdds: -0.80,
    awayHandicap: '+0.50',
    awayOdds: 0.70,
    ouGoal: '4.75',
    ouOverOdds: -0.86,
    ouUnderOdds: 0.76,
    oneXTwoHome: 1.85,
    oneXTwoAway: 3.90,
    oneXTwoDraw: 3.50,
    moreCount: 24,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[5:6]'
  }
];

export const matchesLeague = (leagueId: string, leagueName: string, selectedLeague: string): boolean => {
  if (selectedLeague === 'ALL') return true;
  if (selectedLeague === 'EPL') return leagueId === 'EPL' || (leagueName || '').toLowerCase().includes('premier') || (leagueName || '').toLowerCase().includes('anh');
  if (selectedLeague === 'LALIGA') return leagueId === 'LALIGA' || (leagueName || '').toLowerCase().includes('la liga') || (leagueName || '').toLowerCase().includes('spain');
  if (selectedLeague === 'UCL') return leagueId === 'UCL' || (leagueName || '').toLowerCase().includes('champions') || (leagueName || '').toLowerCase().includes('cúp c1');
  if (selectedLeague === 'SERIE_B') return leagueId === 'SERIE_B' || (leagueName || '').toLowerCase().includes('serie b') || (leagueName || '').toLowerCase().includes('ý');
  if (selectedLeague === 'PORTUGAL') return leagueId === 'PORTUGAL' || (leagueName || '').toLowerCase().includes('portugal') || (leagueName || '').toLowerCase().includes('bồ đào nha');
  return true;
};

export const matchesSearch = (homeTeam: string, awayTeam: string, leagueName: string, searchTerm: string): boolean => {
  if (!searchTerm || !searchTerm.trim()) return true;
  const q = searchTerm.trim().toLowerCase();
  return (
    (homeTeam || '').toLowerCase().includes(q) ||
    (awayTeam || '').toLowerCase().includes(q) ||
    (leagueName || '').toLowerCase().includes(q)
  );
};

export const SbobetSportsView: React.FC<{ showLobbyOnMount?: boolean }> = ({ showLobbyOnMount = false }) => {
  const {
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
    searchTerm,
    setSearchTerm,
    selectedLeague,
    setSelectedLeague,
    liveApiMatches
  } = useSbobetStore();

  const [startY, setStartY] = useState<number>(0);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);

  // Filtered fixtures
  const filteredLiveApiMatches = (liveApiMatches || []).filter((m: any) =>
    matchesLeague(m.leagueId || '', m.league || m.sport_title || '', selectedLeague) &&
    matchesSearch(m.homeTeam || '', m.awayTeam || '', m.league || m.sport_title || '', searchTerm)
  );

  const filteredFootballMatches = FOOTBALL_FIXTURES.filter(m =>
    matchesLeague(m.leagueId, m.leagueName, selectedLeague) &&
    matchesSearch(m.homeTeam, m.awayTeam, m.leagueName, searchTerm)
  );

  useEffect(() => {
    refreshOdds();
  }, []);

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
        
        {/* DESKTOP LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-screen sticky top-0 overflow-y-auto p-3 space-y-4 shrink-0 shadow-xs select-none">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="text-yellow-500 font-black text-2xl">3</span>
            <span className="font-black text-xl italic tracking-tight text-[#0B4DA2]">SBOBET</span>
            <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded uppercase ml-auto">
              Live
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
              Thể Thao Chính
            </div>
            {[
              { id: 'football' as const, label: 'Bóng Đá', count: 18 },
              { id: 'basketball' as const, label: 'Bóng Rổ', count: 9 },
              { id: 'tennis' as const, label: 'Quần Vợt', count: 14 },
              { id: 'nfl' as const, label: 'Bóng Bầu Dục (NFL)', count: 6 },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSport(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-bold transition-all ${
                  activeSport === item.id 
                    ? 'bg-[#0B4DA2] text-white shadow-xs' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeSport === item.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-1 pt-2 border-t border-gray-100">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
              Giải Đấu Hàng Đầu
            </div>
            {[
              { id: 'ALL', name: 'Tất Cả Giải Đấu' },
              { id: 'EPL', name: 'Ngoại Hạng Anh (EPL)' },
              { id: 'LALIGA', name: 'Tây Ban Nha (La Liga)' },
              { id: 'UCL', name: 'Cúp C1 (Champions League)' },
              { id: 'SERIE_B', name: 'Ý Serie B' },
              { id: 'PORTUGAL', name: 'Bồ Đào Nha Liga' }
            ].map(league => (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                  selectedLeague === league.id
                    ? 'font-black text-[#0B4DA2] bg-blue-50/80'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-1">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
              Khám Phá Sảnh Chơi
            </div>
            <a
              href="/cockfight"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              <span>🐓 Đá Gà SV388</span>
              <span className="text-[9px] bg-red-600 text-white font-black px-1 rounded uppercase">Live 3s</span>
            </a>
            <a
              href="/taixiu"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-bold text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
            >
              <span>🎲 Tài Xỉu 3D Casino</span>
              <span className="text-[9px] bg-emerald-600 text-white font-black px-1 rounded uppercase">30s</span>
            </a>
            <a
              href="/xocdia"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              <span>🪙 Xóc Đĩa 3D MD5</span>
              <span className="text-[9px] bg-indigo-600 text-white font-black px-1 rounded uppercase">30s</span>
            </a>
            <a
              href="/admin"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <span>🛡️ Admin Command Hub</span>
              <span className="text-[9px] bg-[#0B4DA2] text-white font-black px-1 rounded uppercase">Master</span>
            </a>
          </div>
        </aside>

        {/* MAIN COLUMN (RESPONSIVE VIEWPORT) */}
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl bg-white border-x border-gray-200 shadow-2xl min-h-screen flex flex-col relative select-none">
          
          <SbobetHeader />
          <SbobetSubNav />
          <SbobetSearchBar />

          <main 
            className="flex-1 pb-16 bg-[#F0F2F5] relative overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <SbobetPullToRefresh pullDistance={pullDistance} isPulling={isPulling} />

            {activeSport === 'football' && (
              <>
                <div className="px-2 pt-2">
                  <SbobetBetBuilder
                    matchId="match-benfica-sporting-01"
                    homeTeam="Benfica"
                    awayTeam="Sporting CP"
                  />
                </div>

                {activeTab === 'live' && (
                  <div className="space-y-2 mt-1">
                    {filteredLiveApiMatches.length > 0 && (
                      <div className="space-y-2">
                        {filteredLiveApiMatches.map((m: any) => (
                          <SbobetOddsTable key={m.matchId || m.id} {...m} />
                        ))}
                      </div>
                    )}
                    {filteredFootballMatches.map(fixture => (
                      <SbobetOddsTable key={fixture.matchId} {...fixture} />
                    ))}
                  </div>
                )}

                {activeTab === 'today' && (
                  <SbobetTodayAccordion
                    matchId="match-atletico-sevilla-01"
                    homeTeam="Atlético Madrid"
                    awayTeam="Sevilla"
                  />
                )}
                {activeTab === 'matches' && <SbobetLigaPortugalAccordion />}
                {activeTab === 'parlay' && (
                  <div className="p-3">
                    <div className="bg-white rounded-lg border p-3">
                      <div className="font-black text-[#0B4DA2] text-sm mb-2">Cược Vô Địch (Outright)</div>
                      <div className="space-y-1.5 text-xs">
                        {[
                          { title: 'Ngoại Hạng Anh 2026/27 — Đội Vô Địch', fav: 'Arsenal @2.25' },
                          { title: 'Cúp C1 Châu Âu — Đội Vô Địch', fav: 'Real Madrid @3.50' },
                          { title: 'La Liga 2026/27 — Đội Vô Địch', fav: 'Barcelona @1.90' }
                        ].map((item, idx) => (
                          <div key={idx} className="p-2.5 bg-gray-50 border rounded flex items-center justify-between">
                            <span className="font-semibold text-gray-800">{item.title}</span>
                            <span className="font-black text-blue-800">{item.fav}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeSport === 'basketball' && <SbobetBasketballView />}
            {activeSport === 'tennis' && <SbobetTennisAccordion />}
            {activeSport === 'nfl' && <SbobetNflView />}
          </main>

          <SbobetFooterBar subMarketCount={subMarketCount} />
          <SbobetBetSlipDrawer />
          <LobbyHubModal />
          <SbobetAuthModal />
          <SbobetAZModal />
          <SbobetAdminModal />

        </div>

        {/* DESKTOP RIGHT SIDEBAR */}
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
};
