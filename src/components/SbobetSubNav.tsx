import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';
import { SbobetNavTab } from '../types';

export const SbobetSubNav: React.FC = () => {
  const { language, activeTab, setActiveTab, activeSport } = useSbobetStore();
  const t = translations[language];

  // Dynamic badge counts matching reference screenshots
  const counts = activeSport === 'tennis' 
    ? { live: 6, today: 92, matches: 23, parlay: 6 }
    : { live: 91, today: 144, matches: 236, parlay: 19 };

  const tabs: { id: SbobetNavTab; labelKey: string; count: number; hasDropdown?: boolean }[] = [
    { id: 'live', labelKey: 'live', count: counts.live },
    { id: 'today', labelKey: 'today', count: counts.today },
    { id: 'matches', labelKey: 'matches', count: counts.matches, hasDropdown: true },
    { id: 'parlay', labelKey: 'outright', count: counts.parlay }
  ];

  return (
    <nav className="bg-[#0A2A54] text-white flex items-center border-b-2 border-[#082245] text-xs font-semibold overflow-x-auto no-scrollbar">
      <div className="flex items-center w-full min-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[76px] sm:min-w-0 py-2.5 px-1.5 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 transition-all relative whitespace-nowrap text-[11px] sm:text-xs ${
                isActive
                  ? 'bg-[#0E3970] text-white font-bold border-b-2 border-[#FFC800]'
                  : 'text-gray-300 hover:text-white hover:bg-[#0C3262]'
              }`}
            >
              <span className="truncate">{t[tab.labelKey]}</span>
              {/* Badge Counter matching SBOBET style */}
              <span className={`px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold shrink-0 ${
                isActive ? 'bg-[#1877F2] text-white' : 'bg-[#12427E] text-blue-200'
              }`}>
                {tab.count}
              </span>
              {tab.hasDropdown && <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-300 shrink-0" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
