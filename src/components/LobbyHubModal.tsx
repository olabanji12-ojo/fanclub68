import React from 'react';
import { X, Trophy, Swords, Dice5, Disc3, ArrowRight } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

export const LobbyHubModal: React.FC = () => {
  const { currentView, setCurrentView } = useSbobetStore();

  if (currentView !== 'lobby') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 font-sans animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header - SBOBET Royal Blue */}
        <div className="bg-[#0B4DA2] text-white p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400 text-sm font-black mr-0.5">3</span>
              <span className="text-lg font-black italic tracking-tighter">SBOBET</span>
              <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full ml-1.5">
                4-Grid Lobby
              </span>
            </div>
            <p className="text-[11px] text-blue-100 mt-0.5">Sảnh tổng hợp 4 trò chơi theo hợp đồng Fanclub68</p>
          </div>
          <button
            onClick={() => setCurrentView('sbobet')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2x2 GAME GRID CONTAINER - CLEAN SBOBET THEME */}
        <div className="p-3 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3 bg-[#F8FAFC]">
          
          {/* 1. SBOBET SPORTSBOOK */}
          <button
            onClick={() => setCurrentView('sbobet')}
            className="p-2.5 sm:p-3.5 rounded-xl bg-white border-2 border-[#0B4DA2] hover:border-blue-600 shadow-sm text-left transition-all hover:shadow-md group active:scale-98"
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-[#0B4DA2] text-white shadow-xs">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[9px] sm:text-[10px] bg-blue-100 text-[#0B4DA2] font-black px-1.5 sm:px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-black text-gray-900 group-hover:text-[#0B4DA2] transition-colors truncate">
              SBOBET Thể Thao
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">Bóng Đá & Tennis</div>
          </button>

          {/* 2. SV388 COCKFIGHT ARENA */}
          <button
            onClick={() => setCurrentView('cockfight')}
            className="p-2.5 sm:p-3.5 rounded-xl bg-white border-2 border-red-200 hover:border-red-600 shadow-sm text-left transition-all hover:shadow-md group active:scale-98"
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-[#C0392B] text-white shadow-xs">
                <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[9px] sm:text-[10px] bg-red-100 text-[#C0392B] font-black px-1.5 sm:px-2 py-0.5 rounded">
                7 BỒ ĐẤU
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-black text-gray-900 group-hover:text-[#C0392B] transition-colors truncate">
              Đá Gà SV388
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">CPC1 - PH3 Live</div>
          </button>

          {/* 3. 3D TÀI XỈU */}
          <button
            onClick={() => setCurrentView('taixiu')}
            className="p-2.5 sm:p-3.5 rounded-xl bg-white border-2 border-emerald-200 hover:border-emerald-600 shadow-sm text-left transition-all hover:shadow-md group active:scale-98"
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
                <Dice5 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[9px] sm:text-[10px] bg-emerald-100 text-emerald-700 font-black px-1.5 sm:px-2 py-0.5 rounded">
                40s LOOP
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-black text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
              3D Virtual Tài Xỉu
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">Soi Cầu 30 Ván</div>
          </button>

          {/* 4. 3D XÓC ĐĨA */}
          <button
            onClick={() => setCurrentView('xocdia')}
            className="p-2.5 sm:p-3.5 rounded-xl bg-white border-2 border-amber-200 hover:border-amber-600 shadow-sm text-left transition-all hover:shadow-md group active:scale-98"
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500 text-white shadow-xs">
                <Disc3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[9px] sm:text-[10px] bg-amber-100 text-amber-800 font-black px-1.5 sm:px-2 py-0.5 rounded">
                4 ĐỒNG XU
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-black text-gray-900 group-hover:text-amber-700 transition-colors truncate">
              3D Virtual Xóc Đĩa
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">Chẵn/Lẻ 1:1.98</div>
          </button>
        </div>

        {/* Footer Link */}
        <div className="p-3 border-t border-gray-200 bg-white text-center">
          <button
            onClick={() => setCurrentView('sbobet')}
            className="text-xs text-[#0B4DA2] hover:text-blue-800 font-bold inline-flex items-center gap-1"
          >
            <span>Đang ở sảnh: SBOBET Thể Thao (Bấm để quay lại)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
