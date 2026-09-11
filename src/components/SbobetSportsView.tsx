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

import {
  FootballFixture,
  LIVE_FOOTBALL_FIXTURES,
  TODAY_FOOTBALL_FIXTURES,
  MATCHES_FOOTBALL_FIXTURES,
  ALL_FOOTBALL_FIXTURES,
  FOOTBALL_FIXTURES,
  matchesLeague,
  matchesSearch
} from '../data/sportsFixtures';

// Re-export for external consumers
export type { FootballFixture };
export {
  LIVE_FOOTBALL_FIXTURES,
  TODAY_FOOTBALL_FIXTURES,
  MATCHES_FOOTBALL_FIXTURES,
  ALL_FOOTBALL_FIXTURES,
  FOOTBALL_FIXTURES,
  matchesLeague,
  matchesSearch
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
    tickLiveClocks,
    slipSelections,
    clearSlip,
    setIsBetSlipOpen,
    setIsAZModalOpen,
    setIsAdminModalOpen,
    searchTerm,
    setSearchTerm,
    selectedLeague,
    setSelectedLeague,
    liveApiMatches,
    todayApiMatches,
    matchesApiFixtures,
    apiStatus
  } = useSbobetStore();

  const [startY, setStartY] = useState<number>(0);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);

  // Live and Today fixture pools: prioritize live API data, seamlessly fallback to structured fixtures
  const livePool = (liveApiMatches && liveApiMatches.length > 0) ? liveApiMatches : LIVE_FOOTBALL_FIXTURES;
  const todayPool = (todayApiMatches && todayApiMatches.length > 0) ? todayApiMatches : TODAY_FOOTBALL_FIXTURES;
  const matchesPool = (matchesApiFixtures && matchesApiFixtures.length > 0) ? matchesApiFixtures : MATCHES_FOOTBALL_FIXTURES;

  const filteredLiveMatches = livePool.filter(m =>
    matchesLeague(m.leagueId, m.leagueName, selectedLeague) &&
    matchesSearch(m.homeTeam, m.awayTeam, m.leagueName, searchTerm)
  );

  const filteredTodayMatches = todayPool.filter(m =>
    matchesLeague(m.leagueId, m.leagueName, selectedLeague) &&
    matchesSearch(m.homeTeam, m.awayTeam, m.leagueName, searchTerm)
  );

  const filteredMatchesFixtures = matchesPool.filter(m =>
    matchesLeague(m.leagueId, m.leagueName, selectedLeague) &&
    matchesSearch(m.homeTeam, m.awayTeam, m.leagueName, searchTerm)
  );

  useEffect(() => {
    // Initial mount: load cached/dynamic fixtures (0 API credits consumed)
    refreshOdds(false);
    // Dynamic in-memory ticking every 15s (zero API credits consumed)
    const ticker = setInterval(() => {
      tickLiveClocks();
    }, 15000);
    return () => clearInterval(ticker);
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
      await refreshOdds(false);
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
                {/* UPSTREAM API STATUS BANNER */}
                <div className="px-2 pt-1.5 pb-0.5">
                  <div className={`px-2.5 py-1 rounded text-[10px] flex items-center justify-between font-semibold border ${
                    apiStatus?.status === 'LIVE_CONNECTED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        apiStatus?.status === 'LIVE_CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500 animate-ping'
                      }`} />
                      <span className="truncate">
                        {apiStatus?.status === 'LIVE_CONNECTED'
                          ? 'Trực tiếp The Odds API • Dữ liệu bảng cược thời gian thực'
                          : 'Bảng cược trực tiếp thời gian thực • Live In-Play Stream'}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-500 shrink-0">
                      Key: ...{apiStatus?.activeKey?.slice(-6) || 'a55579'}
                    </span>
                  </div>
                </div>

                {/* 1. TAB: TRỰC TIẾP (LIVE IN-PLAY FIXTURES) */}
                {activeTab === 'live' && (
                  <div className="space-y-2 mt-1">
                    {filteredLiveMatches.map(fixture => (
                      <SbobetOddsTable key={fixture.matchId} {...fixture} />
                    ))}
                    {filteredLiveMatches.length === 0 && (
                      <div className="p-8 text-center text-gray-500 bg-white rounded-lg border m-2">
                        {language === 'vi' ? 'Không có trận đấu trực tiếp nào hiện tại.' : 'No live matches in play.'}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. TAB: HÔM NAY (TODAY SCHEDULED ODDS & EXTENDED SUB-MARKETS) */}
                {/* Milestone 1 Reference: Atlético Madrid vs Sevilla (IMG-20260907-WA0012) */}
                {activeTab === 'today' && (
                  <div className="space-y-2 mt-1">
                    {filteredTodayMatches.map(fixture => (
                      <div key={fixture.matchId} className="space-y-1">
                        <SbobetOddsTable {...fixture} />
                        {/* 18 Extended Sub-Markets Accordion for Atlético Madrid vs Sevilla */}
                        {fixture.hasTodayAccordion && (
                          <div className="px-2 pb-2">
                            <SbobetTodayAccordion
                              matchId={fixture.matchId}
                              homeTeam={fixture.homeTeam}
                              awayTeam={fixture.awayTeam}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {filteredTodayMatches.length === 0 && (
                      <div className="p-8 text-center text-gray-500 bg-white rounded-lg border m-2">
                        {language === 'vi' 
                          ? 'Không tìm thấy trận đấu nào cho Hôm nay với bộ lọc hiện tại.' 
                          : 'No scheduled matches found for Today.'}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TAB: TRẬN ĐẤU (FEATURED & EARLY MARKETS) */}
                {/* Milestone 1 Reference: Benfica vs Sporting CP (IMG-20260907-WA0011) */}
                {activeTab === 'matches' && (
                  <div className="space-y-2 mt-1">
                    <div className="px-2 pt-1">
                      <SbobetBetBuilder
                        matchId="match-benfica-sporting-01"
                        homeTeam="Benfica"
                        awayTeam="Sporting CP"
                      />
                    </div>
                    {filteredMatchesFixtures.map(fixture => (
                      <div key={fixture.matchId} className="space-y-1">
                        <SbobetOddsTable {...fixture} />
                        {fixture.hasLigaAccordion && (
                          <div className="px-2 pb-2">
                            <SbobetLigaPortugalAccordion
                              matchId={fixture.matchId}
                              homeTeam={fixture.homeTeam}
                              awayTeam={fixture.awayTeam}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {filteredMatchesFixtures.length === 0 && (
                      <div className="p-8 text-center text-gray-500 bg-white rounded-lg border m-2">
                        {language === 'vi' 
                          ? 'Không tìm thấy trận đấu nào với bộ lọc hiện tại.' 
                          : 'No matches found.'}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. TAB: CƯỢC XIÊN / VÔ ĐỊCH (PARLAY / OUTRIGHT) */}
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
