import React, { useState } from 'react';
import { Flame, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

interface BetBuilderProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

export const SbobetBetBuilder: React.FC<BetBuilderProps> = ({ matchId, homeTeam, awayTeam }) => {
  const { language, addSelection, slipSelections } = useSbobetStore();
  const [isOpen, setIsOpen] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const t = translations[language];

  const handleAddToSlip = () => {
    addSelection({
      matchId,
      matchName: `${homeTeam} vs ${awayTeam}`,
      marketName: t.popular_bet_builder,
      selectionName: `${homeTeam} 0.00 & Over 3.25`,
      odds: 4.539,
      stake: 50
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-[#FBE8E2] border-t border-b border-[#F7C6B7] my-2 text-xs font-sans">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-[#C0392B] font-bold"
      >
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{t.popular_bet_builder}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-3 pb-3 pt-1 border-t border-[#F5D2C7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFF7F4]">
          <div className="space-y-1 text-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span className="text-[11px]">
                Full Time Handicap | <strong className="text-black">{homeTeam}</strong> 0.00
              </span>
              <span className="font-bold text-blue-900 ml-auto sm:ml-2">@4.539</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span className="text-[11px]">
                Full Time Total Goals Over/Under | <strong className="text-black">{t.over} 3.25</strong>
              </span>
            </div>
          </div>

          {/* SBOBET Yellow Action Button */}
          <button
            onClick={handleAddToSlip}
            className={`px-4 py-2.5 rounded font-black text-xs uppercase tracking-tight shadow transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FFC800] hover:bg-[#F0BB00] text-black border border-[#E5B200]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã thêm!</span>
              </>
            ) : (
              <span>{t.add_to_slip}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
