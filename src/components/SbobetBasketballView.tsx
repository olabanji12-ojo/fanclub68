import React, { useState } from 'react';
import { ChevronUp, ChevronDown, RotateCw, Flame } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

export const SbobetBasketballView: React.FC = () => {
  const { language, addSelection, slipSelections, isRefreshing, refreshOdds } = useSbobetStore();
  const t = translations[language];

  const matchId = 'nba-gsw-lal-01';
  const homeTeam = 'Golden State Warriors';
  const awayTeam = 'Los Angeles Lakers';

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    points_hdp: true,
    points_ou: true,
    moneyline: true,
    q1_winner: false,
    player_props: false
  });

  const toggle = (k: string) => setExpanded(p => ({ ...p, [k]: !p[k] }));

  const isSelected = (market: string, selection: string) => {
    return slipSelections.some(
      s => s.matchId === matchId && s.marketName === market && s.selectionName === selection
    );
  };

  const handleBet = (market: string, selection: string, odds: number, handicap?: string) => {
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
    <div className="space-y-2 text-xs font-sans select-none">
      {/* Tournament Banner */}
      <div className="bg-[#DCE7F5] border border-[#BFD4EE] rounded px-3 py-1.5 flex items-center justify-between font-bold text-[#0B4DA2]">
        <div className="flex items-center gap-1.5 min-w-0">
          <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span className="truncate">NBA - Giải Bóng Rổ Nhà Nghề Mỹ (Mùa Giải 2026/27)</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => refreshOdds()}
            disabled={isRefreshing}
            className="p-1 rounded hover:bg-white/50 text-[#0B4DA2] transition-all flex items-center justify-center active:scale-95"
            title="Làm mới tỷ lệ NBA"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <span className="bg-[#1877F2] text-white text-[10px] px-1.5 py-0.5 rounded font-black">
            ▲ TOP LEAGUE
          </span>
        </div>
      </div>

      {/* Main Odds Table Card */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-xs">
        {/* Match Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
          <div>
            <div className="font-black text-gray-900 text-sm flex items-center gap-2">
              <span>{homeTeam}</span>
              <span className="text-red-600 font-mono text-base">88 : 84</span>
              <span>{awayTeam}</span>
            </div>
            <div className="text-[11px] text-red-600 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              <span>Trực tiếp - Hiệp 3 (Q3) • 04:12</span>
            </div>
          </div>
          <div className="text-right">
            <span className="bg-blue-100 text-[#0B4DA2] font-black text-[10px] px-2 py-0.5 rounded">
              28 Kèo
            </span>
          </div>
        </div>

        {/* Primary Markets Grid */}
        <div className="p-2 space-y-2">
          {/* Point Spread (Handicap) */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => toggle('points_hdp')}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 font-bold text-gray-800 text-left"
            >
              <span>{language === 'vi' ? 'Cược Chấp Điểm (Point Spread)' : 'Point Spread'}</span>
              {expanded.points_hdp ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </button>
            {expanded.points_hdp && (
              <div className="p-2 grid grid-cols-2 gap-2 bg-white">
                <button
                  onClick={() => handleBet('Cược Chấp', `${homeTeam} -3.5`, 1.92, '-3.5')}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Cược Chấp', `${homeTeam} -3.5`)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-blue-50/40 hover:bg-blue-100/60 border-blue-200'
                  }`}
                >
                  <span className="truncate">{homeTeam} <b className="text-blue-700">-3.5</b></span>
                  <span className="font-black">1.92</span>
                </button>
                <button
                  onClick={() => handleBet('Cược Chấp', `${awayTeam} +3.5`, 1.92, '+3.5')}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Cược Chấp', `${awayTeam} +3.5`)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-blue-50/40 hover:bg-blue-100/60 border-blue-200'
                  }`}
                >
                  <span className="truncate">{awayTeam} <b className="text-blue-700">+3.5</b></span>
                  <span className="font-black">1.92</span>
                </button>
              </div>
            )}
          </div>

          {/* Over / Under Points */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => toggle('points_ou')}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 font-bold text-gray-800 text-left"
            >
              <span>{language === 'vi' ? 'Tổng Điểm Trên / Dưới (O/U 224.5)' : 'Total Points Over/Under (224.5)'}</span>
              {expanded.points_ou ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </button>
            {expanded.points_ou && (
              <div className="p-2 grid grid-cols-2 gap-2 bg-white">
                <button
                  onClick={() => handleBet('Tổng Điểm', 'Trên 224.5', 1.90, 'O 224.5')}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Tổng Điểm', 'Trên 224.5')
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-emerald-50/40 hover:bg-emerald-100/60 border-emerald-200'
                  }`}
                >
                  <span>{language === 'vi' ? 'Trên (Over)' : 'Over'} 224.5</span>
                  <span className="font-black text-emerald-800">1.90</span>
                </button>
                <button
                  onClick={() => handleBet('Tổng Điểm', 'Dưới 224.5', 1.94, 'U 224.5')}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Tổng Điểm', 'Dưới 224.5')
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-emerald-50/40 hover:bg-emerald-100/60 border-emerald-200'
                  }`}
                >
                  <span>{language === 'vi' ? 'Dưới (Under)' : 'Under'} 224.5</span>
                  <span className="font-black text-emerald-800">1.94</span>
                </button>
              </div>
            )}
          </div>

          {/* Moneyline (Dòng Tiền Thắng Trận) */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => toggle('moneyline')}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 font-bold text-gray-800 text-left"
            >
              <span>{language === 'vi' ? 'Dòng Tiền Thắng Trận (Moneyline)' : 'Moneyline (To Win)'}</span>
              {expanded.moneyline ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </button>
            {expanded.moneyline && (
              <div className="p-2 grid grid-cols-2 gap-2 bg-white">
                <button
                  onClick={() => handleBet('Moneyline', homeTeam, 1.65)}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Moneyline', homeTeam)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <span className="truncate">{homeTeam}</span>
                  <span className="font-black text-blue-700">1.65</span>
                </button>
                <button
                  onClick={() => handleBet('Moneyline', awayTeam, 2.25)}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Moneyline', awayTeam)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <span className="truncate">{awayTeam}</span>
                  <span className="font-black text-blue-700">2.25</span>
                </button>
              </div>
            )}
          </div>

          {/* Player Props Sub-Market */}
          <div className="border border-purple-200 rounded overflow-hidden">
            <button
              onClick={() => toggle('player_props')}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-purple-50 hover:bg-purple-100/70 font-bold text-purple-900 text-left transition-colors"
            >
              <span>⭐ {language === 'vi' ? 'Cược Cầu Thủ (Player Props - Curry & LeBron)' : 'Player Props (Curry & LeBron)'}</span>
              {expanded.player_props ? <ChevronUp className="w-3.5 h-3.5 text-purple-700" /> : <ChevronDown className="w-3.5 h-3.5 text-purple-700" />}
            </button>
            {expanded.player_props && (
              <div className="p-2 space-y-1.5 bg-white">
                <div className="flex items-center justify-between p-2 bg-purple-50/50 rounded border border-purple-100">
                  <span className="font-semibold text-gray-800">Steph Curry: Trên 28.5 Điểm</span>
                  <button
                    onClick={() => handleBet('Player Props', 'Steph Curry > 28.5 pts', 1.87)}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold"
                  >
                    1.87
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50/50 rounded border border-purple-100">
                  <span className="font-semibold text-gray-800">LeBron James: Trên 24.5 Điểm</span>
                  <button
                    onClick={() => handleBet('Player Props', 'LeBron James > 24.5 pts', 1.85)}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold"
                  >
                    1.85
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
