import React, { useState } from 'react';
import { ArrowLeft, Swords, Tv, ShieldAlert, Globe, Clock, ChevronDown } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

export const SbobetCockfightView: React.FC = () => {
  const { setCurrentView, addSelection, language, setLanguage, user } = useSbobetStore();
  const t = translations[language];

  const arenas = ['CPC1', 'CPC2', 'CPC3', 'CPC4', 'PH1', 'PH2', 'PH3'];
  const [activeArena, setActiveArena] = useState<string>('CPC1');
  const [status, setStatus] = useState<'OPEN' | 'SUSPENDED'>('OPEN');
  const [delayCountdown, setDelayCountdown] = useState<number | null>(null);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);

  // Soi Cầu history for current arena (M: Meron, W: Wala, B: BDD)
  const history: ('M' | 'W' | 'B')[] = ['M', 'W', 'M', 'M', 'W', 'B', 'M', 'W', 'W', 'M', 'M', 'W', 'M'];

  // Anti-Vét 3-Second Verification Logic (Milestone 4 Rule)
  const handlePlaceCockfightBet = (side: 'MERON' | 'WALA' | 'BDD', odds: number) => {
    setDelayCountdown(3);

    const timer = setInterval(() => {
      setDelayCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setDelayCountdown(null);
          if (status === 'SUSPENDED') {
            alert('ANTI-VÉT GATE LOCK: Trọng tài đã thả gà/khóa sổ. Phiếu cược bị từ chối!');
          } else {
            addSelection({
              matchId: `cockfight-${activeArena}`,
              matchName: `Đá Gà SV388 [${activeArena}]`,
              marketName: 'Kèo Trực Tiếp',
              selectionName: side === 'MERON' ? 'Meron (Gà Đỏ)' : side === 'WALA' ? 'Wala (Gà Xanh)' : 'BDD (Hòa)',
              odds,
              stake: 100
            });
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 font-sans flex flex-col">
      {/* 1. SBOBET ROYAL BLUE HEADER */}
      <header className="bg-[#0B4DA2] text-white shadow-md sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#0A3E82]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('sbobet')}
              className="p-1 hover:bg-[#08356E] rounded text-white flex items-center gap-1 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Thể Thao</span>
            </button>
            <div className="flex items-center gap-1 ml-1">
              <span className="text-yellow-400 text-sm font-black">3</span>
              <span className="text-base font-black italic tracking-tight">SBOBET</span>
              <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded ml-1 uppercase">
                SV388 Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 bg-[#08356E] px-2 py-1 rounded text-xs text-white border border-[#165AB8]"
              >
                <Globe className="w-3 h-3 text-[#A8CEFC]" />
                <span className="font-semibold">{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white text-gray-800 rounded shadow-xl border text-xs z-50">
                  <button
                    onClick={() => { setLanguage('vi'); setIsLangOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 font-bold"
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 font-bold border-t"
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* User Balance */}
            <div className="bg-[#08356E] px-2.5 py-1 rounded text-right border border-[#165AB8]">
              <div className="text-[9px] text-blue-200 uppercase font-semibold leading-none">Số dư</div>
              <div className="text-xs font-black text-yellow-300 font-mono">
                ${user?.balance.toFixed(2) || '1,000.00'}
              </div>
            </div>
          </div>
        </div>

        {/* TITLE BAR */}
        <div className="bg-[#0A438D] px-3 py-1.5 flex items-center justify-between text-xs font-bold text-white gap-2">
          <div className="flex items-center gap-1.5 text-red-300 min-w-0">
            <Swords className="w-4 h-4 text-red-400 shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">ĐÁ GÀ SV388 (7 BỒ ĐẤU)</span>
          </div>
          <button
            onClick={() => setCurrentView('sbobet')}
            className="text-[10px] sm:text-[11px] text-yellow-300 hover:underline flex items-center gap-1 font-bold shrink-0 whitespace-nowrap"
          >
            ← Về Sảnh Thể Thao
          </button>
        </div>
      </header>

      {/* 2. 7-ARENA RESPONSIVE TAB BAR (ALL 7 ARENAS FIT PROPORTIONATELY ON ALL MOBILES) */}
      <div className="bg-[#0A2A54] border-b-2 border-[#082245] px-1.5 sm:px-2 py-1.5 flex items-center justify-between gap-1 w-full shadow-inner">
        {arenas.map((arena) => (
          <button
            key={arena}
            onClick={() => { setActiveArena(arena); setStatus('OPEN'); }}
            className={`flex-1 min-w-0 py-2 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-xs font-black text-center transition-all whitespace-nowrap ${
              activeArena === arena
                ? 'bg-[#C0392B] text-white shadow-md border border-red-300 ring-1 ring-red-400'
                : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/10'
            }`}
          >
            {arena}
          </button>
        ))}
      </div>

      {/* 3. MAIN COCKFIGHT ARENA VIEWPORT & BETTING BOARD */}
      <main className="flex-1 p-2.5 sm:p-3 space-y-2.5 sm:space-y-3 overflow-y-auto">
        
        {/* VIDEO VIEWPORT CONTAINER (WHITE CARD WITH MODERN SCREEN) */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          {/* Header of Video Box */}
          <div className="p-2.5 bg-[#FAFAFA] border-b border-gray-100 flex items-center justify-between text-xs font-bold gap-1.5">
            <div className="flex items-center gap-1.5 text-red-600 min-w-0">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0"></span>
              <span className="truncate text-[11px] sm:text-xs">BỒ: {activeArena} (TRỰC TIẾP)</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300 text-amber-800 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold shrink-0 whitespace-nowrap">
              <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Anti-Vét 3s Gate</span>
            </div>
          </div>

          {/* Video Simulation Canvas */}
          <div className="relative aspect-video bg-gradient-to-tr from-slate-900 via-slate-800 to-zinc-900 flex flex-col items-center justify-center text-white">
            <div className="text-center space-y-1.5 p-4">
              <Tv className="w-10 h-10 text-[#FFC800] mx-auto animate-pulse" />
              <div className="text-xs font-mono font-bold tracking-wide">
                HLS Feed: <span className="text-[#FFC800]">cdn.sv388.live/{activeArena}.m3u8</span>
              </div>
              <div className="text-[10px] text-emerald-400 bg-black/50 border border-emerald-500/40 px-2.5 py-0.5 rounded-full inline-block">
                Sub-300ms Zero-Reload Switch: Active
              </div>
            </div>

            {/* Bottom Stream Bar */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] bg-black/60 backdrop-blur px-3 py-1 rounded text-gray-300">
              <span>Trận số: #42</span>
              <span>Trọng tài: Sân Thomo Campuchia</span>
            </div>
          </div>
        </div>

        {/* 4. BETTING BOARD: MERON (RED) / BDD (DRAW) / WALA (BLUE) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
          {/* MERON (RED COCK) */}
          <button
            onClick={() => handlePlaceCockfightBet('MERON', 0.88)}
            disabled={delayCountdown !== null}
            className="p-2 sm:p-3.5 rounded-xl bg-white border-2 border-red-500 hover:bg-red-50 text-gray-900 shadow-xs transition-all active:scale-98 group flex flex-col justify-between h-full min-h-[95px]"
          >
            <div className="text-[10px] sm:text-[11px] uppercase font-black text-red-600 tracking-wider">MERON</div>
            <div className="text-xl sm:text-2xl font-black text-red-700 my-0.5">0.88</div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">Gà Đỏ Chấp</div>
          </button>

          {/* BDD (DRAW) */}
          <button
            onClick={() => handlePlaceCockfightBet('BDD', 8.00)}
            disabled={delayCountdown !== null}
            className="p-2 sm:p-3.5 rounded-xl bg-white border-2 border-emerald-500 hover:bg-emerald-50 text-gray-900 shadow-xs transition-all active:scale-98 group flex flex-col justify-between h-full min-h-[95px]"
          >
            <div className="text-[10px] sm:text-[11px] uppercase font-black text-emerald-600 tracking-wider">BDD (HÒA)</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 my-0.5">1 : 8</div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">Hòa 1 Ăn 8</div>
          </button>

          {/* WALA (BLUE COCK) */}
          <button
            onClick={() => handlePlaceCockfightBet('WALA', 0.96)}
            disabled={delayCountdown !== null}
            className="p-2 sm:p-3.5 rounded-xl bg-white border-2 border-[#0B4DA2] hover:bg-blue-50 text-gray-900 shadow-xs transition-all active:scale-98 group flex flex-col justify-between h-full min-h-[95px]"
          >
            <div className="text-[10px] sm:text-[11px] uppercase font-black text-[#0B4DA2] tracking-wider">WALA</div>
            <div className="text-xl sm:text-2xl font-black text-[#0B4DA2] my-0.5">0.96</div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">Gà Xanh Điểm</div>
          </button>
        </div>

        {/* Delay Countdown Alert */}
        {delayCountdown !== null && (
          <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-pulse">
            <Clock className="w-4 h-4 text-amber-700 animate-spin" />
            <span>Đang xác thực trạng thái bồ đấu với trọng tài... ({delayCountdown}s)</span>
          </div>
        )}

        {/* 5. ROADMAP / BẢNG SOI CẦU BỒ ĐẤU */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2 gap-1.5">
            <span className="truncate text-[11px] sm:text-xs">BẢNG SOI CẦU BỒ {activeArena}</span>
            <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0">
              Đ(M):7 | X(W):5 | H(B):1
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs ${
                  h === 'M'
                    ? 'bg-red-600 text-white'
                    : h === 'W'
                      ? 'bg-blue-600 text-white'
                      : 'bg-emerald-600 text-white'
                }`}
              >
                {h}
              </span>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
