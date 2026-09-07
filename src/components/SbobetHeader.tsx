import React, { useState } from 'react';
import { Menu, ChevronDown, Globe, LayoutGrid, Sparkles } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';
import { SportType } from '../types';

export const SbobetHeader: React.FC = () => {
  const {
    language,
    setLanguage,
    activeSport,
    setActiveSport,
    setCurrentView,
    currentView
  } = useSbobetStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSportOpen, setIsSportOpen] = useState(false);

  const t = translations[language];

  const sportsList: { id: SportType; labelKey: string }[] = [
    { id: 'football', labelKey: 'football' },
    { id: 'tennis', labelKey: 'tennis' },
    { id: 'basketball', labelKey: 'basketball' },
    { id: 'nfl', labelKey: 'nfl' }
  ];

  return (
    <header className="bg-[#0B4DA2] text-white shadow-md sticky top-0 z-40 font-sans select-none">
      {/* TOP ROW: MENU, LOGO, LANGUAGE DROPDOWN */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#0A3E82]">
        {/* Left: Hamburger & SBOBET Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView(currentView === 'lobby' ? 'sbobet' : 'lobby')}
            className="p-1 hover:bg-[#08356E] rounded text-white transition-colors"
            title="Toggle SBOBET Navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentView('sbobet')}>
            {/* SBOBET Official Style Typographic Wordmark */}
            <span className="text-xl font-black italic tracking-tighter text-white drop-shadow-sm flex items-center">
              <span className="text-[#FFC800] text-sm font-bold mr-1">3</span>SBOBET
            </span>
          </div>
        </div>

        {/* Right: Master 4-Grid Lobby Switcher & Language Dropdown */}
        <div className="flex items-center gap-2">
          {/* Master 4-Grid Lobby Shortcut */}
          <button
            onClick={() => setCurrentView('lobby')}
            className="flex items-center gap-1 bg-[#08356E] hover:bg-[#072B59] px-2 py-1 rounded text-xs font-semibold text-yellow-300 border border-[#165AB8] transition-all"
            title="4-Grid Main Lobby (Sports, Cockfight, Tài Xỉu, Xóc Đĩa)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-bold">4-Grid Hub</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 bg-[#08356E] hover:bg-[#072B59] px-2 py-1 rounded text-xs text-white border border-[#165AB8] transition-all"
            >
              <Globe className="w-3 h-3 text-[#A8CEFC]" />
              <span className="font-semibold">{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
              <ChevronDown className="w-3 h-3 text-white" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white text-gray-800 rounded shadow-xl border border-gray-200 overflow-hidden z-50 text-xs animate-fade-in">
                <button
                  onClick={() => { setLanguage('vi'); setIsLangOpen(false); }}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between ${
                    language === 'vi' ? 'font-bold text-[#0B4DA2] bg-blue-50/50' : ''
                  }`}
                >
                  <span>Tiếng Việt</span>
                  {language === 'vi' && <span className="text-[10px] text-blue-600 font-black">✓</span>}
                </button>
                <button
                  onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between border-t border-gray-100 ${
                    language === 'en' ? 'font-bold text-[#0B4DA2] bg-blue-50/50' : ''
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span className="text-[10px] text-blue-600 font-black">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECOND ROW: SPORT DROPDOWN & MIX PARLAY BUTTON */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0A438D] text-xs font-semibold">
        {/* Sport Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSportOpen(!isSportOpen)}
            className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            <span>{t.sports_label} › {t[sportsList.find(s => s.id === activeSport)?.labelKey || 'football']}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isSportOpen && (
            <div className="absolute left-0 mt-1 w-44 bg-white text-gray-800 rounded shadow-xl border border-gray-200 overflow-hidden z-50 text-xs">
              {sportsList.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => { setActiveSport(sport.id); setIsSportOpen(false); }}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 flex items-center justify-between ${
                    activeSport === sport.id ? 'font-bold text-[#0B4DA2] bg-blue-50' : ''
                  }`}
                >
                  <span>{t[sport.labelKey]}</span>
                  {activeSport === sport.id && <span className="text-[#0B4DA2]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mix Parlay Action Button (Cược Xiên) */}
        <button className="bg-white text-[#0B4DA2] hover:bg-yellow-300 hover:text-black px-2.5 py-0.5 rounded text-[11px] font-bold shadow-sm transition-colors uppercase">
          {t.mix_parlay}
        </button>
      </div>
    </header>
  );
};
