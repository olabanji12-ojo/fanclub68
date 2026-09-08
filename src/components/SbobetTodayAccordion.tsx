import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

interface TodayAccordionProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

export const SbobetTodayAccordion: React.FC<TodayAccordionProps> = ({
  matchId,
  homeTeam,
  awayTeam
}) => {
  const { language, addSelection, slipSelections } = useSbobetStore();
  const t = translations[language];

  // Expanded states for Screenshot 4 (IMG-20260907-WA0012.jpg)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    oe: true, // Odd/Even open matching screenshot 4
    cs_ft: false,
    cs_ht: false,
    cs_2h: false,
    tg: false,
    htft: false,
    flg: false,
    dc: false,
    c_hdp_ft: false,
    c_hdp_ht: false,
    c_ou_ft: false,
    c_ou_ht: false,
    c_oe_ft: false,
    c_1x2_ft: false,
    c_1x2_ht: false,
    first_gs: false,
    last_gs: false,
    anytime_gs: false
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
      
      {/* 1. CHẴN / LẺ TOÀN TRẬN (SCREENSHOT 4: LẺ 1.00 | CHẴN 0.90) */}
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
              onClick={() => handleBetClick(t.odd_even_ft, t.odd, 1.00)}
              className={`py-3 px-4 rounded bg-white border text-center transition-all flex items-center justify-between shadow-xs ${
                isSelected(t.odd_even_ft, t.odd)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium">{t.odd}</span>
              <span className="text-gray-900 font-extrabold text-sm">1.00</span>
            </button>

            <button
              onClick={() => handleBetClick(t.odd_even_ft, t.even, 0.90)}
              className={`py-3 px-4 rounded bg-white border text-center transition-all flex items-center justify-between shadow-xs ${
                isSelected(t.odd_even_ft, t.even)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium">{t.even}</span>
              <span className="text-gray-900 font-extrabold text-sm">0.90</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. TỈ SỐ CHÍNH XÁC TOÀN TRẬN */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('cs_ft')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.correct_score_ft}</span>
          {expanded.cs_ft ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expanded.cs_ft && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-3 gap-1.5">
            {['1-0', '2-0', '2-1', '0-0', '1-1', '0-1'].map(score => (
              <button
                key={score}
                onClick={() => handleBetClick(t.correct_score_ft, score, 8.50)}
                className="p-2 bg-white border rounded text-center"
              >
                <div className="text-gray-500 text-[10px]">{score}</div>
                <div className="font-bold text-blue-900 text-xs">8.50</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. TỈ SỐ CHÍNH XÁC NỬA TRẬN */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('cs_ht')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.correct_score_ht}</span>
          {expanded.cs_ht ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {expanded.cs_ht && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-3 gap-1.5">
            {['1-0', '0-0', '0-1'].map(score => (
              <button key={score} onClick={() => handleBetClick(t.correct_score_ht, score, 4.20)} className="p-2 bg-white border rounded text-center">
                <div className="text-gray-500 text-[10px]">{score}</div>
                <div className="font-bold text-blue-900 text-xs">4.20</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. TỶ SỐ CHÍNH XÁC HIỆP 2 */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('cs_2h')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.correct_score_2h}</span>
          {expanded.cs_2h ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 5. TỔNG SỐ BÀN THẮNG */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('tg')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.total_goals}</span>
          {expanded.tg ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 6. HT/TT (HALF TIME / FULL TIME) - SCREENSHOT 4 */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('htft')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.ht_ft}</span>
          {expanded.htft ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {expanded.htft && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-3 gap-1.5">
            {[
              { label: 'H/H', odds: 2.85 },
              { label: 'H/D', odds: 14.0 },
              { label: 'H/A', odds: 28.0 },
              { label: 'D/H', odds: 4.80 },
              { label: 'D/D', odds: 5.50 },
              { label: 'D/A', odds: 7.20 }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => handleBetClick(t.ht_ft, item.label, item.odds)}
                className="p-2 bg-white border rounded text-center"
              >
                <div className="text-gray-500 text-[10px]">{item.label}</div>
                <div className="font-bold text-blue-900 text-xs">{item.odds.toFixed(2)}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 7. BÀN THẮNG ĐẦU BÀN THẮNG CUỐI */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('flg')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.first_last_goal}</span>
          {expanded.flg ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* 8. CƠ HỘI KÉP (DOUBLE CHANCE) */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggle('dc')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.double_chance}</span>
          {expanded.dc ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {expanded.dc && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-3 gap-1.5">
            {[
              { code: '1X', desc: 'Chủ / Hòa', odds: 1.25 },
              { code: '12', desc: 'Chủ / Khách', odds: 1.30 },
              { code: 'X2', desc: 'Hòa / Khách', odds: 1.85 }
            ].map(item => (
              <button
                key={item.code}
                onClick={() => handleBetClick(t.double_chance, `${item.code} (${item.desc})`, item.odds)}
                className="p-1.5 sm:p-2 bg-white border rounded text-center shadow-xs hover:border-blue-400 transition-colors"
              >
                <div className="font-extrabold text-gray-800 text-xs">{item.code}</div>
                <div className="text-gray-500 text-[9px] truncate">{item.desc}</div>
                <div className="font-black text-blue-900 text-xs mt-0.5">{item.odds.toFixed(2)}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 9 - 15. CORNERS ACCORDIONS (ALL MATCHING SCREENSHOT 4 DYNAMICALLY) */}
      {[
        {
          key: 'c_hdp_ft',
          title: t.corners_handicap_ft,
          gridCols: 'grid-cols-2',
          options: [
            { name: `${homeTeam} -1.0`, odds: 0.95 },
            { name: `${awayTeam} +1.0`, odds: 0.87 }
          ]
        },
        {
          key: 'c_hdp_ht',
          title: t.corners_handicap_ht,
          gridCols: 'grid-cols-2',
          options: [
            { name: `${homeTeam} -0.5`, odds: 0.89 },
            { name: `${awayTeam} +0.5`, odds: 0.93 }
          ]
        },
        {
          key: 'c_ou_ft',
          title: t.corners_ou_ft,
          gridCols: 'grid-cols-2',
          options: [
            { name: `${language === 'vi' ? 'Tài' : 'Over'} 9.5`, odds: 0.94 },
            { name: `${language === 'vi' ? 'Xỉu' : 'Under'} 9.5`, odds: 0.88 }
          ]
        },
        {
          key: 'c_ou_ht',
          title: t.corners_ou_ht,
          gridCols: 'grid-cols-2',
          options: [
            { name: `${language === 'vi' ? 'Tài' : 'Over'} 4.5`, odds: 0.90 },
            { name: `${language === 'vi' ? 'Xỉu' : 'Under'} 4.5`, odds: 0.92 }
          ]
        },
        {
          key: 'c_oe_ft',
          title: t.corners_oe_ft,
          gridCols: 'grid-cols-2',
          options: [
            { name: language === 'vi' ? 'Chẵn (Even)' : 'Even', odds: 0.98 },
            { name: language === 'vi' ? 'Lẻ (Odd)' : 'Odd', odds: 0.94 }
          ]
        },
        {
          key: 'c_1x2_ft',
          title: t.corners_1x2_ft,
          gridCols: 'grid-cols-3',
          options: [
            { name: homeTeam, odds: 1.65 },
            { name: language === 'vi' ? 'Hòa (X)' : 'Draw', odds: 7.50 },
            { name: awayTeam, odds: 2.45 }
          ]
        },
        {
          key: 'c_1x2_ht',
          title: t.corners_1x2_ht,
          gridCols: 'grid-cols-3',
          options: [
            { name: homeTeam, odds: 1.85 },
            { name: language === 'vi' ? 'Hòa (X)' : 'Draw', odds: 4.20 },
            { name: awayTeam, odds: 2.65 }
          ]
        }
      ].map(c => (
        <div key={c.key} className="border border-[#F3C7B9] rounded overflow-hidden">
          <button
            onClick={() => toggle(c.key)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
          >
            <span className="truncate pr-2">{c.title}</span>
            {expanded[c.key] ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
          </button>
          {expanded[c.key] && (
            <div className={`p-2 bg-[#FAF3F0] grid ${c.gridCols} gap-2`}>
              {c.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleBetClick(c.title, opt.name, opt.odds)}
                  className={`p-2 bg-white border rounded text-center flex items-center justify-between gap-1 shadow-xs transition-all ${
                    isSelected(c.title, opt.name)
                      ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <span className="truncate text-left text-gray-700 font-medium">{opt.name}</span>
                  <span className="font-bold text-gray-900 shrink-0">{opt.odds.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* 16 - 18. GOALSCORER PROPS */}
      {[
        { key: 'first_gs', title: t.first_goalscorer },
        { key: 'last_gs', title: t.last_goalscorer },
        { key: 'anytime_gs', title: t.anytime_goalscorer }
      ].map(g => (
        <div key={g.key} className="border border-[#F3C7B9] rounded overflow-hidden">
          <button
            onClick={() => toggle(g.key)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
          >
            <span>{g.title}</span>
            {expanded[g.key] ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
          </button>
          {expanded[g.key] && (
            <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
              {['Antoine Griezmann (2.40)', 'Alexander Sørloth (2.80)', 'Lucas Ocampos (3.60)', 'Dodi Lukebakio (4.20)'].map(p => (
                <button key={p} onClick={() => handleBetClick(g.title, p, 2.50)} className="p-2 bg-white border rounded text-left text-[11px] font-medium">
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

    </div>
  );
};
