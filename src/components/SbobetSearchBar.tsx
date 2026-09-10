import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowDownAZ } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

export const SbobetSearchBar: React.FC = () => {
  const {
    language,
    searchTerm,
    setSearchTerm,
    selectedLeague,
    setSelectedLeague,
    setIsAZModalOpen,
    setActiveSport,
    setActiveTab
  } = useSbobetStore();

  const leagues = [
    { id: 'ALL', label: language === 'vi' ? 'Tất cả giải' : 'All Leagues', sport: 'football', tab: 'live' },
    { id: 'EPL', label: 'Premier League', sport: 'football', tab: 'live' },
    { id: 'LALIGA', label: 'La Liga', sport: 'football', tab: 'live' },
    { id: 'UCL', label: 'Champions League', sport: 'football', tab: 'live' },
    { id: 'SERIE_B', label: 'Serie B Brazil', sport: 'football', tab: 'live' },
    { id: 'PORTUGAL', label: 'Liga Portugal', sport: 'football', tab: 'live' },
    { id: 'USOPEN', label: 'US Open', sport: 'tennis', tab: 'live' },
    { id: 'NBA', label: 'NBA', sport: 'basketball', tab: 'live' },
    { id: 'NFL', label: 'NFL', sport: 'nfl', tab: 'live' }
  ];

  const isPillActive = (pillId: string) => {
    if (selectedLeague === pillId) return true;
    const s = (selectedLeague || '').toLowerCase().replace(/[-_]/g, '');
    const p = pillId.toLowerCase().replace(/[-_]/g, '');
    if (p === 'ucl' && (s === 'uefacl' || s === 'ucl')) return true;
    if (p === 'epl' && s === 'epl') return true;
    if (p === 'laliga' && s === 'laliga') return true;
    if (p === 'portugal' && (s === 'ligaportugal' || s === 'benficaliga' || s === 'portugal')) return true;
    if (p === 'serieb' && s === 'serieb') return true;
    if (p === 'usopen' && (s === 'atpusopen' || s === 'usopen')) return true;
    return s === p;
  };

  const handleSelectLeague = (l: typeof leagues[0]) => {
    if (isPillActive(l.id) && l.id !== 'ALL') {
      setSelectedLeague('ALL');
      return;
    }
    setSelectedLeague(l.id);
    setActiveSport(l.sport as any);
    setActiveTab(l.tab as any);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-2 space-y-1.5 text-xs font-sans">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 focus-within:border-[#0B4DA2] focus-within:bg-white transition-colors">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm kiếm đội bóng, giải đấu (Barca, Arsenal, Man City, Real...)' : 'Search team or tournament (Barca, Arsenal, Man City, Real...)'}
            className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold shrink-0 px-1"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => setIsAZModalOpen(true)}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-gray-600 transition-colors flex items-center gap-1 shrink-0 active:scale-95"
          title={language === 'vi' ? 'Sắp xếp giải đấu A-Z' : 'A-Z Tournament Sorting'}
        >
          <ArrowDownAZ className="w-4 h-4 text-[#0B4DA2]" />
          <span className="text-[10px] font-black text-[#0B4DA2] hidden sm:inline">A-Z</span>
        </button>
      </div>

      {/* League Filter Quick Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
        {leagues.map((l) => {
          const active = isPillActive(l.id);
          return (
            <button
              key={l.id}
              onClick={() => handleSelectLeague(l)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                active
                  ? 'bg-[#0B4DA2] text-white shadow-xs scale-[1.02] ring-1 ring-[#08356E]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
