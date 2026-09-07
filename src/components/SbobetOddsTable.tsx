import React from 'react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

interface OddsTableProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  scoreHome: number;
  scoreAway: number;
  liveTime: string;
}

export const SbobetOddsTable: React.FC<OddsTableProps> = ({
  matchId,
  homeTeam,
  awayTeam,
  scoreHome,
  scoreAway,
  liveTime
}) => {
  const { language, addSelection, slipSelections } = useSbobetStore();
  const t = translations[language];

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
      {/* MATCH HEADER & LIVE SCORE */}
      <div className="p-3 flex items-center justify-between border-b border-gray-100 bg-[#FAFAFA]">
        <div>
          <div className="font-extrabold text-gray-900 text-sm">{homeTeam}</div>
          <div className="font-extrabold text-gray-900 text-sm mt-0.5">{awayTeam}</div>
        </div>
        <div className="text-right">
          <div className="text-red-600 font-black text-sm tracking-wider">{scoreHome} - {scoreAway}</div>
          <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
            {liveTime}
          </div>
        </div>
      </div>

      {/* ODDS GRID: HANDICAP / OVER-UNDER / 1X2 */}
      <div className="p-2 grid grid-cols-3 gap-1.5 text-center">
        {/* Handicap Column */}
        <div className="space-y-1">
          <div className="text-[10px] text-gray-500 font-semibold">Kèo Chấp</div>
          <button
            onClick={() => handleBetClick('Handicap FT', `${homeTeam} -0.25`, -0.54, '-0.25')}
            className={`w-full p-2 rounded bg-white border flex items-center justify-between shadow-xs ${
              isSelected('Handicap FT', `${homeTeam} -0.25`) ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <span className="text-[10px] text-blue-600 font-bold">-0.25</span>
            <span className="text-red-600 font-black text-xs">-0.54</span>
          </button>
          <button
            onClick={() => handleBetClick('Handicap FT', `${awayTeam} +0.25`, 0.46, '+0.25')}
            className={`w-full p-2 rounded bg-white border flex items-center justify-between shadow-xs ${
              isSelected('Handicap FT', `${awayTeam} +0.25`) ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <span className="text-[10px] text-blue-600 font-bold">+0.25</span>
            <span className="text-gray-900 font-black text-xs">0.46</span>
          </button>
        </div>

        {/* Over/Under Column */}
        <div className="space-y-1">
          <div className="text-[10px] text-gray-500 font-semibold">Tài / Xỉu</div>
          <button
            onClick={() => handleBetClick('Total Goals FT', 'Tài 3.50', -0.61, '3.50')}
            className={`w-full p-2 rounded bg-white border flex items-center justify-between shadow-xs ${
              isSelected('Total Goals FT', 'Tài 3.50') ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <span className="text-[10px] text-gray-500 font-bold">T 3.50</span>
            <span className="text-red-600 font-black text-xs">-0.61</span>
          </button>
          <button
            onClick={() => handleBetClick('Total Goals FT', 'Xỉu 3.50', 0.51, '3.50')}
            className={`w-full p-2 rounded bg-white border flex items-center justify-between shadow-xs ${
              isSelected('Total Goals FT', 'Xỉu 3.50') ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <span className="text-[10px] text-gray-500 font-bold">X 3.50</span>
            <span className="text-gray-900 font-black text-xs">0.51</span>
          </button>
        </div>

        {/* 1X2 Column */}
        <div className="space-y-1">
          <div className="text-[10px] text-gray-500 font-semibold">1X2</div>
          <button
            onClick={() => handleBetClick('1X2 FT', 'Home', 2.10)}
            className={`w-full p-2 rounded bg-white border flex items-center justify-between shadow-xs ${
              isSelected('1X2 FT', 'Home') ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <span className="text-[10px] text-gray-500 font-bold">1</span>
            <span className="text-gray-900 font-black text-xs">2.10</span>
          </button>
          <button
            onClick={() => handleBetClick('1X2 FT', 'Away', 3.40)}
            className={`w-full p-2 rounded bg-white border flex items-center justify-between shadow-xs ${
              isSelected('1X2 FT', 'Away') ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <span className="text-[10px] text-gray-500 font-bold">2</span>
            <span className="text-gray-900 font-black text-xs">3.40</span>
          </button>
        </div>
      </div>

      {/* SBOBET EXPAND LIST PILL BUTTON (SCREENSHOT 1 & 3) */}
      <div className="text-center py-1 bg-[#FBE8E2]/50 border-t border-[#F5C8BA]/40">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 px-3.5 py-0.5 rounded-t shadow-xs">
          {t.expand_list} ▾
        </span>
      </div>
    </div>
  );
};
