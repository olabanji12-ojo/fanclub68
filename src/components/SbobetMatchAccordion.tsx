import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

interface MatchAccordionProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  cornerScore?: string;
}

export const SbobetMatchAccordion: React.FC<MatchAccordionProps> = ({
  matchId,
  homeTeam,
  awayTeam,
  cornerScore = '[4:2]'
}) => {
  const { language, addSelection, slipSelections } = useSbobetStore();
  const t = translations[language];

  // Keep track of which accordion panels are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    odd_even: true, // Default open matching screenshot 1
    cs_ft: false,
    cs_ht: false,
    total_goals: false,
    double_chance: false,
    corners_hdp: false,
    corners_ou: false,
    fast_goal: false,
    player_props: false
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
    <div className="space-y-1 text-xs font-sans select-none">
      
      {/* 1. CHẴN / LẺ TOÀN TRẬN (ODD/EVEN FULL-TIME) - MATCHES SCREENSHOT 1 EXACTLY */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggleSection('odd_even')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.odd_even_ft}</span>
          {expandedSections.odd_even ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expandedSections.odd_even && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
            {/* LẺ (ODD) - Negative Odds in RED */}
            <button
              onClick={() => handleBetClick(t.odd_even_ft, t.odd, -0.92)}
              className={`py-3 px-4 rounded bg-white border text-center transition-all flex items-center justify-between shadow-sm active:scale-98 ${
                isSelected(t.odd_even_ft, t.odd)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium">{t.odd}</span>
              <span className="text-red-600 font-extrabold text-sm">-0.92</span>
            </button>

            {/* CHẴN (EVEN) - Positive Odds in BLACK */}
            <button
              onClick={() => handleBetClick(t.odd_even_ft, t.even, 0.82)}
              className={`py-3 px-4 rounded bg-white border text-center transition-all flex items-center justify-between shadow-sm active:scale-98 ${
                isSelected(t.odd_even_ft, t.even)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium">{t.even}</span>
              <span className="text-gray-900 font-extrabold text-sm">0.82</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. TỈ SỐ CHÍNH XÁC TOÀN TRẬN [2:0] (CORRECT SCORE FT) */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggleSection('cs_ft')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{t.correct_score_ft}</span>
            <span className="text-red-600 text-[11px] font-extrabold">[2:0]</span>
          </div>
          {expandedSections.cs_ft ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expandedSections.cs_ft && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {[
              { score: '1-0', odds: 7.50 },
              { score: '2-0', odds: 9.00 },
              { score: '2-1', odds: 8.50 },
              { score: '3-0', odds: 14.0 },
              { score: '0-0', odds: 11.0 },
              { score: '1-1', odds: 6.80 },
              { score: '2-2', odds: 13.5 },
              { score: '0-1', odds: 9.50 },
              { score: '0-2', odds: 18.0 },
              { score: '1-2', odds: 11.0 },
              { score: '3-1', odds: 16.0 },
              { score: 'AOS', odds: 22.0 }
            ].map(item => (
              <button
                key={item.score}
                onClick={() => handleBetClick(t.correct_score_ft, item.score, item.odds)}
                className={`p-2 rounded bg-white border text-center transition-all ${
                  isSelected(t.correct_score_ft, item.score)
                    ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <div className="text-gray-600 text-[11px] font-semibold">{item.score}</div>
                <div className="text-[#0B4DA2] font-black text-xs">{item.odds.toFixed(2)}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. TỔNG SỐ BÀN THẮNG [2:0] (TOTAL GOALS) */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggleSection('total_goals')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{t.total_goals}</span>
            <span className="text-red-600 text-[11px] font-extrabold">[2:0]</span>
          </div>
          {expandedSections.total_goals ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expandedSections.total_goals && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { label: '0 - 1', odds: 3.40 },
              { label: '2 - 3', odds: 1.95 },
              { label: '4 - 6', odds: 3.80 },
              { label: '7+', odds: 18.00 }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => handleBetClick(t.total_goals, item.label, item.odds)}
                className={`p-2.5 rounded bg-white border text-center transition-all flex items-center justify-between ${
                  isSelected(t.total_goals, item.label)
                    ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <span className="text-gray-700 font-medium">{item.label}</span>
                <span className="text-gray-900 font-extrabold">{item.odds.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. 1X2 CHÂU Á TOÀN TRẬN */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggleSection('1x2')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.one_x_two_ft}</span>
          {expandedSections['1x2'] ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expandedSections['1x2'] && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-3 gap-2">
            {[
              { name: homeTeam, odds: 1.85 },
              { name: 'Hòa (X)', odds: 3.60 },
              { name: awayTeam, odds: 4.20 }
            ].map(item => (
              <button
                key={item.name}
                onClick={() => handleBetClick(t.one_x_two_ft, item.name, item.odds)}
                className={`p-2 rounded bg-white border text-center transition-all ${
                  isSelected(t.one_x_two_ft, item.name)
                    ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <div className="text-gray-600 text-[10px] truncate">{item.name}</div>
                <div className="text-gray-900 font-black text-xs">{item.odds.toFixed(2)}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. PHẠT GÓC - KÈO CHẤP [DYNAMIC CORNER SCORE] */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggleSection('corners_hdp')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{t.corners_handicap_ft}</span>
            <span className="text-red-600 text-[11px] font-extrabold">{cornerScore}</span>
          </div>
          {expandedSections.corners_hdp ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expandedSections.corners_hdp && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBetClick(t.corners_handicap_ft, `${homeTeam} -1.5`, 0.94)}
              className={`p-2 rounded bg-white border text-center transition-all flex items-center justify-between gap-1 shadow-xs ${
                isSelected(t.corners_handicap_ft, `${homeTeam} -1.5`)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium truncate text-left">{homeTeam} -1.5</span>
              <span className="text-gray-900 font-extrabold shrink-0">0.94</span>
            </button>
            <button
              onClick={() => handleBetClick(t.corners_handicap_ft, `${awayTeam} +1.5`, 0.88)}
              className={`p-2 rounded bg-white border text-center transition-all flex items-center justify-between gap-1 shadow-xs ${
                isSelected(t.corners_handicap_ft, `${awayTeam} +1.5`)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium truncate text-left">{awayTeam} +1.5</span>
              <span className="text-gray-900 font-extrabold shrink-0">0.88</span>
            </button>
          </div>
        )}
      </div>

      {/* 5B. PHẠT GÓC - TÀI / XỈU TOÀN TRẬN */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggleSection('corners_ou')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{t.corners_ou_ft}</span>
            <span className="text-red-600 text-[11px] font-extrabold">{cornerScore}</span>
          </div>
          {expandedSections.corners_ou ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expandedSections.corners_ou && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBetClick(t.corners_ou_ft, `${language === 'vi' ? 'Tài' : 'Over'} 9.5`, 0.91)}
              className={`p-2 rounded bg-white border text-center transition-all flex items-center justify-between gap-1 shadow-xs ${
                isSelected(t.corners_ou_ft, `${language === 'vi' ? 'Tài' : 'Over'} 9.5`)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium truncate text-left">{language === 'vi' ? 'Tài' : 'Over'} 9.5</span>
              <span className="text-gray-900 font-extrabold shrink-0">0.91</span>
            </button>
            <button
              onClick={() => handleBetClick(t.corners_ou_ft, `${language === 'vi' ? 'Xỉu' : 'Under'} 9.5`, 0.91)}
              className={`p-2 rounded bg-white border text-center transition-all flex items-center justify-between gap-1 shadow-xs ${
                isSelected(t.corners_ou_ft, `${language === 'vi' ? 'Xỉu' : 'Under'} 9.5`)
                  ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium truncate text-left">{language === 'vi' ? 'Xỉu' : 'Under'} 9.5</span>
              <span className="text-gray-900 font-extrabold shrink-0">0.91</span>
            </button>
          </div>
        )}
      </div>

      {/* 6. CƯỢC BÀN THẮNG NHANH (1 PHÚT & 5 PHÚT) */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggleSection('fast_goal')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.fast_goal_1min}</span>
          {expandedSections.fast_goal ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expandedSections.fast_goal && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBetClick(t.fast_goal_1min, 'Có bàn thắng (Yes)', 6.50)}
              className={`p-2 rounded bg-white border text-center transition-all flex items-center justify-between gap-1 shadow-xs ${
                isSelected(t.fast_goal_1min, 'Có bàn thắng (Yes)')
                  ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium truncate text-left">Có bàn thắng</span>
              <span className="text-gray-900 font-extrabold shrink-0">6.50</span>
            </button>
            <button
              onClick={() => handleBetClick(t.fast_goal_1min, 'Không bàn thắng (No)', 1.08)}
              className={`p-2 rounded bg-white border text-center transition-all flex items-center justify-between gap-1 shadow-xs ${
                isSelected(t.fast_goal_1min, 'Không bàn thắng (No)')
                  ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <span className="text-gray-700 font-medium truncate text-left">Không bàn thắng</span>
              <span className="text-gray-900 font-extrabold shrink-0">1.08</span>
            </button>
          </div>
        )}
      </div>

      {/* 7. PLAYER PROPS (ANYTIME GOALSCORER) */}
      <div className="border border-[#F3C7B9] rounded overflow-hidden">
        <button
          onClick={() => toggleSection('player_props')}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FDEEE9] hover:bg-[#FCDFD7] text-gray-800 font-bold text-left transition-colors"
        >
          <span>{t.anytime_goalscorer}</span>
          {expandedSections.player_props ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {expandedSections.player_props && (
          <div className="p-2 bg-[#FAF3F0] grid grid-cols-2 gap-2">
            {[
              { player: 'Robert Lewandowski', odds: 2.10 },
              { player: 'Raphinha', odds: 2.75 },
              { player: 'Lamine Yamal', odds: 3.10 },
              { player: 'Ferran Torres', odds: 3.40 }
            ].map(item => (
              <button
                key={item.player}
                onClick={() => handleBetClick(t.anytime_goalscorer, item.player, item.odds)}
                className={`p-2 rounded bg-white border text-center transition-all flex items-center justify-between gap-1 shadow-xs ${
                  isSelected(t.anytime_goalscorer, item.player)
                    ? 'border-[#0B4DA2] bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <span className="text-gray-700 font-medium truncate flex-1 text-left">{item.player}</span>
                <span className="text-gray-900 font-extrabold shrink-0">{item.odds.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
