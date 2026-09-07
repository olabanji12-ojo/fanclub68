import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

export const SbobetLigaPortugalAccordion: React.FC = () => {
  const { language, addSelection, slipSelections } = useSbobetStore();
  const t = translations[language];

  const matchId = 'match-benfica-sporting-01';
  const homeTeam = 'Benfica';
  const awayTeam = 'Sporting CP';

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    oe: true, // Screenshot 3 has Odd/Even open
    cs_ft: false,
    cs_ht: false,
    cs_2h: false,
    tg: false,
    dc: false,
    one_x_two: false,
    c_hdp_ft: false,
    c_ou_ft: false,
    goal_2nd: false,
    fast_5min: false
  });

  const toggle = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSelected = (market: string, selection: string) => {
    return slipSelections.some(
      s => s.matchId === matchId && s.marketName === market && s.selectionName === selection
    );
  };

  const handleBetClick = (market: string, selection: string, odds: number) => {
    addSelection({
      matchId,
      matchName: `${homeTeam} vs ${awayTeam}`,
      marketName: market,
      selectionName: selection,
      odds,
      stake: 50
    });
  };

  return (
    <div className="space-y-1 text-xs font-sans select-none">
      
      {/* 1. CHẴN / LẺ TOÀN TRẬN (SCREENSHOT 3: LẺ 0.88 | CHẴN 1.00) */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('oe')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.odd_even_ft}</span>
          {expanded.oe ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expanded.oe && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBetClick(t.odd_even_ft, t.odd, 0.88)}
              className={`py-3 px-4 rounded bg-white border text-center transition-all flex items-center justify-between shadow-xs ${
                isSelected(t.odd_even_ft, t.odd)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium">{t.odd}</span>
              <span className="text-gray-900 font-extrabold text-sm">0.88</span>
            </button>

            <button
              onClick={() => handleBetClick(t.odd_even_ft, t.even, 1.00)}
              className={`py-3 px-4 rounded bg-white border text-center transition-all flex items-center justify-between shadow-xs ${
                isSelected(t.odd_even_ft, t.even)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium">{t.even}</span>
              <span className="text-gray-900 font-extrabold text-sm">1.00</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. TỈ SỐ CHÍNH XÁC TOÀN TRẬN [1:0] */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('cs_ft')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{t.correct_score_ft}</span>
            <span className="text-red-600 text-[11px] font-extrabold">[1:0]</span>
          </div>
          {expanded.cs_ft ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 3. TỈ SỐ CHÍNH XÁC NỬA TRẬN [1:0] */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('cs_ht')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{t.correct_score_ht}</span>
            <span className="text-red-600 text-[11px] font-extrabold">[1:0]</span>
          </div>
          {expanded.cs_ht ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 4. TỶ SỐ CHÍNH XÁC HIỆP 2 */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button onClick={() => toggle('cs_2h')} className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left">
          <span>{t.correct_score_2h}</span>
          {expanded.cs_2h ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 5. TỔNG SỐ BÀN THẮNG [1:0] */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button onClick={() => toggle('tg')} className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left">
          <div className="flex items-center gap-2">
            <span>{t.total_goals}</span>
            <span className="text-red-600 text-[11px] font-extrabold">[1:0]</span>
          </div>
          {expanded.tg ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 6. CƠ HỘI KÉP */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button onClick={() => toggle('dc')} className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left">
          <span>{t.double_chance}</span>
          {expanded.dc ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 7. 1X2 CHÂU Á TOÀN TRẬN & NỬA TRẬN */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button onClick={() => toggle('one_x_two')} className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left">
          <span>{t.one_x_two_ft}</span>
          {expanded.one_x_two ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 8. PHẠT GÓC - KÈO CHẤP & TÀI XỈU TOÀN TRẬN / NỬA TRẬN [2:1] */}
      {[
        { key: 'c_hdp_ft', title: t.corners_handicap_ft, tag: '[2:1]' },
        { key: 'c_hdp_ht', title: t.corners_handicap_ht, tag: '[2:1]' },
        { key: 'c_ou_ft', title: t.corners_ou_ft, tag: '[2:1]' },
        { key: 'c_ou_ht', title: t.corners_ou_ht, tag: '[2:1]' }
      ].map(item => (
        <div key={item.key} className="border border-[#F3C7B9] rounded overflow-hidden">
          <button onClick={() => toggle(item.key)} className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="truncate">{item.title}</span>
              <span className="text-red-600 text-[11px] font-extrabold shrink-0">{item.tag}</span>
            </div>
            {expanded[item.key] ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
          </button>
        </div>
      ))}

      {/* 9. 2ND GOAL - KÈO CHẤP TOÀN TRẬN */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button onClick={() => toggle('goal_2nd')} className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left">
          <span>2nd Goal - Kèo Chấp Toàn Trận</span>
          {expanded.goal_2nd ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 10. CƯỢC BÀN THẮNG NHANH - 5 PHÚT */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button onClick={() => toggle('fast_5min')} className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left">
          <span>{t.fast_goal_5min}</span>
          {expanded.fast_5min ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* LIGA PORTUGAL BOTTOM ACCORDION MATCHING SCREENSHOT 3 */}
      <div className="bg-[#DCE7F5] border border-[#BFD4EE] rounded px-3 py-2 flex items-center justify-between text-xs font-bold text-[#0B4DA2] mt-3">
        <span>LIGA PORTUGAL</span>
        <span className="bg-[#0B4DA2] text-white text-[10px] px-2 py-0.5 rounded font-black">
          1 ▴
        </span>
      </div>

    </div>
  );
};
