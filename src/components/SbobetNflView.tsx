import React, { useState } from 'react';
import { ChevronUp, ChevronDown, RotateCw, Shield } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

export const SbobetNflView: React.FC = () => {
  const { language, addSelection, slipSelections, isRefreshing, refreshOdds } = useSbobetStore();
  const t = translations[language];

  const matchId = 'nfl-kc-sf-01';
  const homeTeam = 'Kansas City Chiefs';
  const awayTeam = 'San Francisco 49ers';

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    spread: true,
    total: true,
    moneyline: true,
    touchdown: false
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
          <Shield className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span className="truncate">NFL - Giải Bóng Bầu Dục Mỹ (Super Bowl Rematch)</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => refreshOdds()}
            disabled={isRefreshing}
            className="p-1 rounded hover:bg-white/50 text-[#0B4DA2] transition-all flex items-center justify-center active:scale-95"
            title="Làm mới tỷ lệ NFL"
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
              <span className="text-red-600 font-mono text-base">24 : 21</span>
              <span>{awayTeam}</span>
            </div>
            <div className="text-[11px] text-red-600 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              <span>Trực tiếp - Hiệp 4 (Q4) • 02:45</span>
            </div>
          </div>
          <div className="text-right">
            <span className="bg-blue-100 text-[#0B4DA2] font-black text-[10px] px-2 py-0.5 rounded">
              34 Kèo
            </span>
          </div>
        </div>

        {/* Primary Markets Grid */}
        <div className="p-2 space-y-2">
          {/* Point Spread */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => toggle('spread')}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 font-bold text-gray-800 text-left"
            >
              <span>{language === 'vi' ? 'Cược Chấp (Point Spread)' : 'Point Spread'}</span>
              {expanded.spread ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </button>
            {expanded.spread && (
              <div className="p-2 grid grid-cols-2 gap-2 bg-white">
                <button
                  onClick={() => handleBet('Cược Chấp', `${homeTeam} -2.5`, 1.95, '-2.5')}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Cược Chấp', `${homeTeam} -2.5`)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-blue-50/40 hover:bg-blue-100/60 border-blue-200'
                  }`}
                >
                  <span className="truncate">{homeTeam} <b className="text-blue-700">-2.5</b></span>
                  <span className="font-black">1.95</span>
                </button>
                <button
                  onClick={() => handleBet('Cược Chấp', `${awayTeam} +2.5`, 1.89, '+2.5')}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Cược Chấp', `${awayTeam} +2.5`)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-blue-50/40 hover:bg-blue-100/60 border-blue-200'
                  }`}
                >
                  <span className="truncate">{awayTeam} <b className="text-blue-700">+2.5</b></span>
                  <span className="font-black">1.89</span>
                </button>
              </div>
            )}
          </div>

          {/* Over / Under Points */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => toggle('total')}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 font-bold text-gray-800 text-left"
            >
              <span>{language === 'vi' ? 'Tổng Điểm Trên / Dưới (O/U 47.5)' : 'Total Points Over/Under (47.5)'}</span>
              {expanded.total ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </button>
            {expanded.total && (
              <div className="p-2 grid grid-cols-2 gap-2 bg-white">
                <button
                  onClick={() => handleBet('Tổng Điểm', 'Trên 47.5', 1.91, 'O 47.5')}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Tổng Điểm', 'Trên 47.5')
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-emerald-50/40 hover:bg-emerald-100/60 border-emerald-200'
                  }`}
                >
                  <span>{language === 'vi' ? 'Trên (Over)' : 'Over'} 47.5</span>
                  <span className="font-black text-emerald-800">1.91</span>
                </button>
                <button
                  onClick={() => handleBet('Tổng Điểm', 'Dưới 47.5', 1.93, 'U 47.5')}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Tổng Điểm', 'Dưới 47.5')
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-emerald-50/40 hover:bg-emerald-100/60 border-emerald-200'
                  }`}
                >
                  <span>{language === 'vi' ? 'Dưới (Under)' : 'Under'} 47.5</span>
                  <span className="font-black text-emerald-800">1.93</span>
                </button>
              </div>
            )}
          </div>

          {/* Moneyline */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => toggle('moneyline')}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 font-bold text-gray-800 text-left"
            >
              <span>{language === 'vi' ? 'Dòng Tiền Thắng Trận (Moneyline)' : 'Moneyline'}</span>
              {expanded.moneyline ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </button>
            {expanded.moneyline && (
              <div className="p-2 grid grid-cols-2 gap-2 bg-white">
                <button
                  onClick={() => handleBet('Moneyline', homeTeam, 1.75)}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Moneyline', homeTeam)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <span className="truncate">{homeTeam}</span>
                  <span className="font-black text-blue-700">1.75</span>
                </button>
                <button
                  onClick={() => handleBet('Moneyline', awayTeam, 2.15)}
                  className={`p-2 rounded border text-left flex justify-between items-center transition-all ${
                    isSelected('Moneyline', awayTeam)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <span className="truncate">{awayTeam}</span>
                  <span className="font-black text-blue-700">2.15</span>
                </button>
              </div>
            )}
          </div>

          {/* Touchdown Sub-Market */}
          <div className="border border-orange-200 rounded overflow-hidden">
            <button
              onClick={() => toggle('touchdown')}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-orange-50 hover:bg-orange-100 font-bold text-orange-900 text-left transition-colors"
            >
              <span>🏈 {language === 'vi' ? 'Cầu Thủ Ghi Touchdown (Travis Kelce & McCaffrey)' : 'Anytime Touchdown Scorer'}</span>
              {expanded.touchdown ? <ChevronUp className="w-3.5 h-3.5 text-orange-700" /> : <ChevronDown className="w-3.5 h-3.5 text-orange-700" />}
            </button>
            {expanded.touchdown && (
              <div className="p-2 space-y-1.5 bg-white">
                <div className="flex items-center justify-between p-2 bg-orange-50/50 rounded border border-orange-100">
                  <span className="font-semibold text-gray-800">Travis Kelce (KC): Ghi Touchdown bất kỳ lúc nào</span>
                  <button
                    onClick={() => handleBet('Touchdown', 'Travis Kelce Anytime TD', 2.10)}
                    className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold"
                  >
                    2.10
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50/50 rounded border border-orange-100">
                  <span className="font-semibold text-gray-800">Christian McCaffrey (SF): Ghi Touchdown bất kỳ lúc nào</span>
                  <button
                    onClick={() => handleBet('Touchdown', 'Christian McCaffrey Anytime TD', 1.70)}
                    className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold"
                  >
                    1.70
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
