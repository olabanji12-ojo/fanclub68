import React, { useState } from 'react';
import { ChevronUp, ChevronDown, RotateCw } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

export const SbobetTennisAccordion: React.FC = () => {
  const { language, addSelection, slipSelections } = useSbobetStore();
  const t = translations[language];

  const matchId = 'tennis-atp-usopen-01';
  const playerHome = 'Alex Michelsen';
  const playerAway = 'Tomas Martin Etcheverry';

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    set3_hdp: true, // Default open matching screenshot 2
    set3_ou: false,
    set3_oe: false,
    set3_ml: false,
    game5_winner: false,
    game5_p1: false,
    game5_deuce: false,
    cs_3rd: false
  });

  const toggle = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSelected = (market: string, selection: string) => {
    return slipSelections.some(
      s => s.matchId === matchId && s.marketName === market && s.selectionName === selection
    );
  };

  const handleBetClick = (market: string, selection: string, odds: number, handicap?: string) => {
    addSelection({
      matchId,
      matchName: `${playerHome} vs ${playerAway}`,
      marketName: market,
      selectionName: selection,
      odds,
      handicap,
      stake: 50
    });
  };

  return (
    <div className="space-y-2 text-xs font-sans select-none">
      
      {/* TOURNAMENT BANNER */}
      <div className="bg-[#D9E6F7] text-[#0B4DA2] px-3 py-1.5 font-bold flex items-center justify-between rounded-t border-b border-[#BFD4EE]">
        <span className="truncate">ATP - Giải Grand Slam Mỹ Mở rộng (Thể thức chấp điểm)</span>
        <span className="bg-[#1877F2] text-white px-1.5 py-0.5 rounded text-[10px]">2 ▴</span>
      </div>

      {/* LIVE ORANGE BANNER WITH REFRESH (SCREENSHOT 2) */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 flex items-center justify-between font-black italic tracking-wide rounded-sm shadow-sm">
        <span>TRỰC TIẾP ATP - Grand Slam US Open (Set Handicap)</span>
        <button className="hover:rotate-180 transition-transform duration-300">
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PLAYERS & SET SCORES */}
      <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
        <div className="flex items-center justify-between text-sm font-black text-gray-900 mb-2">
          <div className="flex-1 text-left">{playerHome}</div>
          <div className="text-center px-3">
            <div className="text-[10px] text-gray-500 font-semibold">Set 2 : 0</div>
            <div className="text-base text-red-600 font-black tracking-widest">2 : 2</div>
          </div>
          <div className="flex-1 text-right">{playerAway}</div>
        </div>

        {/* MAIN ODDS ROW: SET MONEY LINE / GAME HANDICAP / TOTAL GAMES */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-gray-100 text-center text-[11px]">
          <div>
            <div className="text-gray-500 text-[10px] mb-1">Set Cược Dòng Tiền</div>
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => handleBetClick('Set Moneyline', playerHome, 1.08)}
                className={`p-1.5 bg-gray-50 border rounded font-black ${
                  isSelected('Set Moneyline', playerHome) ? 'border-blue-600 bg-blue-50' : ''
                }`}
              >
                1.08
              </button>
              <button
                onClick={() => handleBetClick('Set Moneyline', playerAway, 8.14)}
                className={`p-1.5 bg-gray-50 border rounded font-black ${
                  isSelected('Set Moneyline', playerAway) ? 'border-blue-600 bg-blue-50' : ''
                }`}
              >
                8.14
              </button>
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-[10px] mb-1">Game Cược Chấp</div>
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => handleBetClick('Game Handicap', '-3.50', 0.33)}
                className="p-1.5 bg-gray-50 border rounded font-black text-blue-900"
              >
                <span className="text-[9px] text-blue-600 block">-3.50</span> 0.33
              </button>
              <button
                onClick={() => handleBetClick('Game Handicap', '-0.44', -0.44)}
                className="p-1.5 bg-gray-50 border rounded font-black text-red-600"
              >
                -0.44
              </button>
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-[10px] mb-1">Game Tài/Xỉu</div>
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => handleBetClick('Game Total', 'Over 34.50', 0.60)}
                className="p-1.5 bg-gray-50 border rounded font-black"
              >
                <span className="text-[9px] text-gray-500 block">34.50</span> 0.60
              </button>
              <button
                onClick={() => handleBetClick('Game Total', 'Under 34.50', -0.77)}
                className="p-1.5 bg-gray-50 border rounded font-black text-red-600"
              >
                -0.77
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EXPAND LIST BUTTON (ORANGE PEACH PILL MATCHING SCREENSHOT 2) */}
      <div className="text-center py-1">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 px-3 py-1 rounded-t shadow-sm">
          {t.expand_list} ▾
        </span>
      </div>

      {/* SET 3 - KÈO CHẤP TOÀN TRẬN (EXPANDED IN SCREENSHOT 2) */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('set3_hdp')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.tennis_set_handicap}</span>
          {expanded.set3_hdp ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expanded.set3_hdp && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBetClick(t.tennis_set_handicap, `${t.home_team} -1.50`, 0.95)}
              className={`p-2.5 rounded bg-white border text-center transition-all flex items-center justify-between shadow-sm ${
                isSelected(t.tennis_set_handicap, `${t.home_team} -1.50`)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200'
              }`}
            >
              <div className="text-left">
                <div className="text-gray-700 font-medium">{t.home_team}</div>
                <div className="text-blue-600 text-[10px] font-bold">-1.50</div>
              </div>
              <span className="text-gray-900 font-black text-sm">0.95</span>
            </button>

            <button
              onClick={() => handleBetClick(t.tennis_set_handicap, t.away_team, 0.85)}
              className={`p-2.5 rounded bg-white border text-center transition-all flex items-center justify-between shadow-sm ${
                isSelected(t.tennis_set_handicap, t.away_team)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200'
              }`}
            >
              <span className="text-gray-700 font-medium">{t.away_team}</span>
              <span className="text-gray-900 font-black text-sm">0.85</span>
            </button>
          </div>
        )}
      </div>

      {/* TENNIS SET 3 SUB-MARKETS (SCREENSHOT 5) */}
      {[
        { key: 'set3_ou', title: t.tennis_set_ou },
        { key: 'set3_oe', title: t.tennis_set_oe },
        { key: 'set3_ml', title: t.tennis_set_moneyline },
        { key: 'game5_winner', title: t.tennis_5th_game_winner },
        { key: 'game5_p1', title: t.tennis_5th_game_p1 },
        { key: 'game5_deuce', title: t.tennis_5th_game_deuce },
        { key: 'cs_3rd', title: t.tennis_3rd_set_score }
      ].map(item => (
        <div key={item.key} className="border border-[#F3C7B9] rounded overflow-hidden">
          <button
            onClick={() => toggle(item.key)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
          >
            <span className="truncate pr-2">{item.title}</span>
            {expanded[item.key] ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
          </button>

          {expanded[item.key] && (
            <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
              <button
                onClick={() => handleBetClick(item.title, 'Lựa chọn 1', 1.88)}
                className="p-2 bg-white border border-gray-200 rounded text-center flex items-center justify-between"
              >
                <span className="text-gray-700 font-medium">Over / Yes</span>
                <span className="font-bold text-gray-900">1.88</span>
              </button>
              <button
                onClick={() => handleBetClick(item.title, 'Lựa chọn 2', 1.92)}
                className="p-2 bg-white border border-gray-200 rounded text-center flex items-center justify-between"
              >
                <span className="text-gray-700 font-medium">Under / No</span>
                <span className="font-bold text-gray-900">1.92</span>
              </button>
            </div>
          )}
        </div>
      ))}

    </div>
  );
};
