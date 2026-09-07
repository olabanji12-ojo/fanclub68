import React, { useState } from 'react';
import { X, ArrowDownAZ, Search, Trophy, ChevronRight } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { SportType } from '../types';

interface LeagueItem {
  id: string;
  nameVi: string;
  nameEn: string;
  sport: SportType;
  country: string;
  matchCount: number;
}

const ALL_LEAGUES: LeagueItem[] = [
  { id: 'atp-usopen', nameVi: 'ATP - Grand Slam Mỹ Mở Rộng', nameEn: 'ATP - US Open Grand Slam', sport: 'tennis', country: 'USA', matchCount: 8 },
  { id: 'atletico-matches', nameVi: 'Atlético Madrid - Trận Đấu Hôm Nay', nameEn: 'Atlético Madrid - Matches', sport: 'football', country: 'Spain', matchCount: 3 },
  { id: 'bundesliga', nameVi: 'Bundesliga Đức', nameEn: 'German Bundesliga', sport: 'football', country: 'Germany', matchCount: 9 },
  { id: 'benfica-liga', nameVi: 'Benfica - Liga Portugal Betclic', nameEn: 'Benfica - Liga Portugal', sport: 'football', country: 'Portugal', matchCount: 4 },
  { id: 'cockfight-cpc', nameVi: 'CPC1 - CPC4 Thomo Campuchia (SV388)', nameEn: 'CPC1 - CPC4 Thomo Cockfight', sport: 'football', country: 'Cambodia', matchCount: 14 },
  { id: 'epl', nameVi: 'Giải Ngoại Hạng Anh (Premier League)', nameEn: 'English Premier League', sport: 'football', country: 'England', matchCount: 10 },
  { id: 'laliga', nameVi: 'Giải La Liga Tây Ban Nha', nameEn: 'Spanish La Liga', sport: 'football', country: 'Spain', matchCount: 10 },
  { id: 'liga-portugal', nameVi: 'Liga Portugal Betclic', nameEn: 'Liga Portugal Betclic', sport: 'football', country: 'Portugal', matchCount: 6 },
  { id: 'nba', nameVi: 'Giải Bóng Rổ Nhà Nghề Mỹ (NBA)', nameEn: 'NBA Basketball USA', sport: 'basketball', country: 'USA', matchCount: 12 },
  { id: 'nfl', nameVi: 'Giải Bóng Bầu Dục Mỹ (NFL)', nameEn: 'NFL American Football', sport: 'nfl', country: 'USA', matchCount: 8 },
  { id: 'serie-a', nameVi: 'Giải Serie A Ý', nameEn: 'Italian Serie A', sport: 'football', country: 'Italy', matchCount: 10 },
  { id: 'uefa-cl', nameVi: 'UEFA Champions League Cúp C1', nameEn: 'UEFA Champions League', sport: 'football', country: 'Europe', matchCount: 16 }
];

export const SbobetAZModal: React.FC = () => {
  const { isAZModalOpen, setIsAZModalOpen, language, setActiveSport, setActiveTab, setSelectedLeague } = useSbobetStore();
  const [filterChar, setFilterChar] = useState<string>('ALL');
  const [query, setQuery] = useState<string>('');

  if (!isAZModalOpen) return null;

  const alphabet = ['ALL', 'A', 'B', 'C', 'E', 'L', 'N', 'S', 'U'];

  const filteredLeagues = ALL_LEAGUES.filter((league) => {
    const name = language === 'vi' ? league.nameVi : league.nameEn;
    const matchesQuery = name.toLowerCase().includes(query.toLowerCase());
    const matchesChar = filterChar === 'ALL' || name.toUpperCase().startsWith(filterChar);
    return matchesQuery && matchesChar;
  }).sort((a, b) => {
    const nameA = language === 'vi' ? a.nameVi : b.nameVi;
    const nameB = language === 'vi' ? a.nameVi : b.nameVi;
    return nameA.localeCompare(nameB);
  });

  const handleSelectLeague = (league: LeagueItem) => {
    setActiveSport(league.sport);
    if (league.sport === 'tennis') {
      setActiveTab('live');
    } else if (league.id === 'liga-portugal') {
      setActiveTab('matches');
    } else {
      setActiveTab('live');
    }
    setSelectedLeague(league.id);
    setIsAZModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0B4DA2] text-white px-4 py-3 flex items-center justify-between border-b border-[#0A3E82]">
          <div className="flex items-center gap-2">
            <ArrowDownAZ className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-sm sm:text-base">
              {language === 'vi' ? 'Sắp Xếp Giải Đấu A–Z' : 'A–Z Leagues & Teams Sorting'}
            </h3>
          </div>
          <button
            onClick={() => setIsAZModalOpen(false)}
            className="p-1 rounded hover:bg-[#08356E] text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside A-Z Modal */}
        <div className="p-3 bg-gray-50 border-b border-gray-200 space-y-2">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus-within:border-[#0B4DA2]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'vi' ? 'Tìm nhanh giải đấu (A-Z)...' : 'Filter leagues A-Z...'}
              className="w-full text-xs text-gray-800 bg-transparent focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 text-xs font-bold">
                ✕
              </button>
            )}
          </div>

          {/* Quick Alphabet Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {alphabet.map((char) => (
              <button
                key={char}
                onClick={() => setFilterChar(char)}
                className={`px-2 py-1 rounded text-[11px] font-bold shrink-0 transition-all ${
                  filterChar === char
                    ? 'bg-[#0B4DA2] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* League List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-100">
          {filteredLeagues.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              {language === 'vi' ? 'Không tìm thấy giải đấu phù hợp' : 'No leagues found matching criteria'}
            </div>
          ) : (
            filteredLeagues.map((league) => (
              <button
                key={league.id}
                onClick={() => handleSelectLeague(league)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-blue-50/60 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0B4DA2] flex items-center justify-center font-bold text-xs shrink-0">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 group-hover:text-[#0B4DA2] truncate">
                      {language === 'vi' ? league.nameVi : league.nameEn}
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium">
                      {league.country} • {league.sport.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {league.matchCount} {language === 'vi' ? 'trận' : 'matches'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0B4DA2]" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
          <span>{filteredLeagues.length} {language === 'vi' ? 'giải đấu được liệt kê' : 'leagues listed'}</span>
          <button
            onClick={() => setIsAZModalOpen(false)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-bold text-xs"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
