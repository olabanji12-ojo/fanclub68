import React, { useState } from 'react';
import { RotateCw, BarChart2, Tv, Activity } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

interface OddsTableProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  scoreHome: number;
  scoreAway: number;
  liveTime: string;
  handicapTeam?: 'home' | 'away' | 'none';
  leagueName?: string;
  isLive?: boolean;
  homeHandicap?: string;
  awayHandicap?: string;
  homeOdds?: number;
  awayOdds?: number;
  ouGoal?: string;
  ouOverOdds?: number;
  ouUnderOdds?: number;
  oneXTwoHome?: number;
  oneXTwoAway?: number;
  oneXTwoDraw?: number;
  moreCount?: number;
}

export const SbobetOddsTable: React.FC<OddsTableProps> = ({
  matchId,
  homeTeam,
  awayTeam,
  scoreHome,
  scoreAway,
  liveTime,
  handicapTeam,
  leagueName,
  isLive = true,
  homeHandicap = '-0.25',
  awayHandicap = '+0.25',
  homeOdds = -0.54,
  awayOdds = 0.46,
  ouGoal = '3.50',
  ouOverOdds = -0.61,
  ouUnderOdds = 0.51,
  oneXTwoHome = 2.10,
  oneXTwoAway = 3.40,
  oneXTwoDraw = 3.20,
  moreCount = 17
}) => {
  const { language, addSelection, slipSelections, isRefreshing, refreshOdds } = useSbobetStore();
  const t = translations[language];
  const [activeSubTab, setActiveSubTab] = useState<'markets' | 'builder'>('markets');

  // Determine which team gives the handicap:
  // 1. Explicit prop handicapTeam takes priority
  // 2. Otherwise auto-detect: team with negative handicap (e.g. -0.25, -0.50) gives the handicap
  // 3. Fallback to 'home' if neither is set
  const isHomeGivingHandicap = handicapTeam === 'home' || 
    (handicapTeam === undefined && homeHandicap.startsWith('-'));
  const isAwayGivingHandicap = handicapTeam === 'away' || 
    (handicapTeam === undefined && !homeHandicap.startsWith('-') && awayHandicap.startsWith('-'));

  const isSelected = (market: string, selection: string) => {
    return slipSelections.some(
      s => s.matchId === matchId && s.marketName === market && s.selectionName === selection
    );
  };

  const handleBetClick = (market: string, selection: string, odds: number, handicap?: string) => {
    addSelection({
      matchId,
      matchName: `${homeTeam} vs ${awayTeam}`,
      marketName: market,
      selectionName: selection,
      odds,
      handicap,
      stake: 50
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 text-xs font-sans">
      {/* 1. SBOBET ORANGE LEAGUE BAR (MATCHING REFERENCE TEST2.JPG) */}
      {leagueName && (
        <div className="bg-gradient-to-r from-[#FF7A00] via-[#FF6600] to-[#F55200] px-3 py-1.5 flex items-center justify-between text-white font-bold text-xs shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            {isLive && (
              <span className="italic font-black text-yellow-200 tracking-wider text-[11px] shrink-0">
                TRỰC TIẾP
              </span>
            )}
            <span className="truncate tracking-wide">{leagueName}</span>
          </div>
          <button
            type="button"
            onClick={() => refreshOdds()}
            disabled={isRefreshing}
            className="text-white hover:text-yellow-200 transition-colors p-0.5 shrink-0 active:scale-95"
            title="Làm mới tỷ lệ cược"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      {/* 2. MATCH HEADER & TEAM NAMES LAYOUT (MATCHING REFERENCE TEST2.JPG): */}
      {/* Home Team (Left) | Time & Score (Center) | Away Team (Right) */}
      {/* Team giving the handicap is highlighted in RED (#D32F2F / text-red-600) */}
      <div className="px-3 pt-3 pb-2.5 bg-white flex items-center justify-between border-b border-gray-100">
        {/* HOME TEAM (LEFT ALIGNED) */}
        <div className={`flex-1 text-left pr-2 min-w-0 ${
          isHomeGivingHandicap
            ? 'text-[#D32F2F] font-black'
            : 'text-gray-900 font-extrabold'
        }`}>
          <span className="text-xs sm:text-sm tracking-tight block truncate">
            {homeTeam}
          </span>
        </div>

        {/* TIME & SCORE (CENTER ALIGNED) */}
        <div className="shrink-0 text-center px-1.5 sm:px-2 min-w-[76px] sm:min-w-[90px]">
          <div className="text-[10px] sm:text-[11px] font-bold text-gray-500 leading-tight tracking-tight">
            {liveTime}
          </div>
          <div className="text-base sm:text-lg font-black text-gray-900 leading-tight mt-0.5 tracking-wider font-sans">
            {scoreHome} : {scoreAway}
          </div>
        </div>

        {/* AWAY TEAM (RIGHT ALIGNED) */}
        <div className={`flex-1 text-right pl-2 min-w-0 ${
          isAwayGivingHandicap
            ? 'text-[#D32F2F] font-black'
            : 'text-gray-900 font-extrabold'
        }`}>
          <span className="text-xs sm:text-sm tracking-tight block truncate">
            {awayTeam}
          </span>
        </div>
      </div>

      {/* 3. SBOBET MARKET SUB-TABS (MATCHING TEST2.JPG: "Thị trường" | "Trình tạo Cược") */}
      <div className="flex items-center gap-6 px-3 border-b border-gray-200 text-xs bg-white">
        <button
          type="button"
          onClick={() => setActiveSubTab('markets')}
          className={`pb-1.5 pt-1.5 border-b-2 font-bold transition-colors ${
            activeSubTab === 'markets'
              ? 'border-[#0B4DA2] text-[#0B4DA2] font-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          {language === 'vi' ? 'Thị trường' : 'Markets'}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('builder')}
          className={`pb-1.5 pt-1.5 border-b-2 font-bold transition-colors ${
            activeSubTab === 'builder'
              ? 'border-[#0B4DA2] text-[#0B4DA2] font-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          {language === 'vi' ? 'Trình tạo Cược' : 'Bet Builder'}
        </button>
      </div>

      {/* 4. PRIMARY MARKETS: TOÀN TRẬN CƯỢC CHẤP / TÀI XỈU / 1X2 */}
      <div className="p-2 grid grid-cols-3 gap-1.5 text-center bg-white">
        {/* Handicap Column */}
        <div className="space-y-1">
          <div className="text-[10px] sm:text-[11px] text-gray-600 font-bold truncate">
            {language === 'vi' ? 'Toàn trận Cược Chấp' : 'Full Time Handicap'}
          </div>
          
          {/* Row N (Home) */}
          <button
            onClick={() => handleBetClick('Handicap FT', `${homeTeam} ${homeHandicap}`, homeOdds, homeHandicap)}
            className={`w-full px-1.5 py-1.5 sm:px-2 rounded bg-white border flex items-center justify-between gap-1 shadow-xs transition-all active:scale-98 ${
              isSelected('Handicap FT', `${homeTeam} ${homeHandicap}`)
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <span className="text-[10px] text-blue-600 font-black truncate">{homeHandicap}</span>
            <span className={`text-xs font-black shrink-0 ${homeOdds < 0 ? 'text-[#D32F2F]' : 'text-gray-900'}`}>
              {homeOdds > 0 ? homeOdds.toFixed(2) : homeOdds.toFixed(2)}
            </span>
          </button>

          {/* Row K (Away) */}
          <button
            onClick={() => handleBetClick('Handicap FT', `${awayTeam} ${awayHandicap}`, awayOdds, awayHandicap)}
            className={`w-full px-1.5 py-1.5 sm:px-2 rounded bg-white border flex items-center justify-between gap-1 shadow-xs transition-all active:scale-98 ${
              isSelected('Handicap FT', `${awayTeam} ${awayHandicap}`)
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <span className="text-[10px] text-blue-600 font-black truncate">{awayHandicap}</span>
            <span className={`text-xs font-black shrink-0 ${awayOdds < 0 ? 'text-[#D32F2F]' : 'text-gray-900'}`}>
              {awayOdds > 0 ? awayOdds.toFixed(2) : awayOdds.toFixed(2)}
            </span>
          </button>
        </div>

        {/* Over/Under Column */}
        <div className="space-y-1">
          <div className="text-[10px] sm:text-[11px] text-gray-600 font-bold truncate">
            {language === 'vi' ? 'Toàn trận Tài/Xỉu' : 'Full Time Over/Under'}
          </div>
          
          {/* Row T (Over) */}
          <button
            onClick={() => handleBetClick('Total Goals FT', `Tài ${ouGoal}`, ouOverOdds, ouGoal)}
            className={`w-full px-1.5 py-1.5 sm:px-2 rounded bg-white border flex items-center justify-between gap-1 shadow-xs transition-all active:scale-98 ${
              isSelected('Total Goals FT', `Tài ${ouGoal}`)
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <span className="text-[10px] text-gray-600 font-bold truncate">
              {ouGoal.startsWith('T') || ouGoal.startsWith('X') ? ouGoal : `T ${ouGoal}`}
            </span>
            <span className={`text-xs font-black shrink-0 ${ouOverOdds < 0 ? 'text-[#D32F2F]' : 'text-gray-900'}`}>
              {ouOverOdds > 0 ? ouOverOdds.toFixed(2) : ouOverOdds.toFixed(2)}
            </span>
          </button>

          {/* Row X (Under) */}
          <button
            onClick={() => handleBetClick('Total Goals FT', `Xỉu ${ouGoal}`, ouUnderOdds, ouGoal)}
            className={`w-full px-1.5 py-1.5 sm:px-2 rounded bg-white border flex items-center justify-between gap-1 shadow-xs transition-all active:scale-98 ${
              isSelected('Total Goals FT', `Xỉu ${ouGoal}`)
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <span className="text-[10px] text-gray-600 font-bold truncate">
              {ouGoal.startsWith('T') || ouGoal.startsWith('X') ? ouGoal : `X ${ouGoal}`}
            </span>
            <span className={`text-xs font-black shrink-0 ${ouUnderOdds < 0 ? 'text-[#D32F2F]' : 'text-gray-900'}`}>
              {ouUnderOdds > 0 ? ouUnderOdds.toFixed(2) : ouUnderOdds.toFixed(2)}
            </span>
          </button>
        </div>

        {/* 1X2 Column */}
        <div className="space-y-1">
          <div className="text-[10px] sm:text-[11px] text-gray-600 font-bold truncate">
            {language === 'vi' ? 'Toàn trận 1X2' : 'Full Time 1X2'}
          </div>
          
          {/* Row 1 (Home) */}
          <button
            onClick={() => handleBetClick('1X2 FT', 'Home', oneXTwoHome)}
            className={`w-full px-1.5 py-1.5 sm:px-2 rounded bg-white border flex items-center justify-between gap-1 shadow-xs transition-all active:scale-98 ${
              isSelected('1X2 FT', 'Home')
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <span className="text-[10px] text-gray-500 font-bold truncate">1</span>
            <span className="text-gray-900 font-black text-xs shrink-0">{oneXTwoHome.toFixed(2)}</span>
          </button>

          {/* Row 2 (Away) */}
          <button
            onClick={() => handleBetClick('1X2 FT', 'Away', oneXTwoAway)}
            className={`w-full px-1.5 py-1.5 sm:px-2 rounded bg-white border flex items-center justify-between gap-1 shadow-xs transition-all active:scale-98 ${
              isSelected('1X2 FT', 'Away')
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <span className="text-[10px] text-gray-500 font-bold truncate">2</span>
            <span className="text-gray-900 font-black text-xs shrink-0">{oneXTwoAway.toFixed(2)}</span>
          </button>
        </div>
      </div>

      {/* 5. MATCH FOOTER TOOLBAR: STATS, VIDEO, PITCH & EXPAND PILL (TEST1 & TEST2) */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#FAFBFD] border-t border-gray-100">
        {/* Left Live Interaction Icons */}
        <div className="flex items-center gap-3 text-gray-400">
          <button
            type="button"
            className="hover:text-blue-600 transition-colors"
            title="Thống kê trận đấu"
          >
            <BarChart2 className="w-4 h-4 text-blue-800/80" />
          </button>
          <button
            type="button"
            className="hover:text-blue-600 transition-colors"
            title="Trực tiếp Video / Animation"
          >
            <Tv className="w-4 h-4 text-gray-500" />
          </button>
          <button
            type="button"
            className="hover:text-blue-600 transition-colors"
            title="Sơ đồ trận đấu (Match Center)"
          >
            <Activity className="w-4 h-4 text-blue-700/80" />
          </button>
        </div>

        {/* Right SBOBET Orange Pill: Count & Expand */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-0.5 rounded shadow-xs cursor-pointer hover:brightness-105 active:scale-95 transition-all">
            <span>{moreCount}</span>
            <span>+</span>
          </span>
          <span className="text-[11px] font-bold text-orange-600 hidden sm:inline">
            {t.expand_list} ▾
          </span>
        </div>
      </div>
    </div>
  );
};
