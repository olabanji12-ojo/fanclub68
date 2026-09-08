import React, { useState, useEffect } from 'react';
import { ArrowLeft, Disc3, ShieldAlert, Globe, ChevronDown } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { SbobetScorecardRoadmap } from './SbobetScorecardRoadmap';

export const SbobetXocDiaView: React.FC = () => {
  const { setCurrentView, addSelection, language, setLanguage, user } = useSbobetStore();

  const [timeLeft, setTimeLeft] = useState<number>(34);
  const [tokens, setTokens] = useState<('R' | 'W')[]>(['R', 'R', 'W', 'W']);
  const [history, setHistory] = useState<('C' | 'L')[]>([
    'C', 'L', 'C', 'C', 'L', 'L', 'C', 'C', 'L', 'C', 'C', 'L', 'C', 'L'
  ]);
  const [isGateLocked, setIsGateLocked] = useState<boolean>(false);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const newTokens: ('R' | 'W')[] = Array.from({ length: 4 }, () => (Math.random() > 0.5 ? 'R' : 'W'));
          const redCount = newTokens.filter(t => t === 'R').length;
          const isEven = redCount % 2 === 0;
          setTokens(newTokens);
          setHistory(h => [...h.slice(-29), isEven ? 'C' : 'L']);
          setIsGateLocked(false);
          return 40;
        }

        if (prev <= 5) {
          setIsGateLocked(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBet = (side: 'CHẴN' | 'LẺ' | '4 ĐỎ' | '4 TRẮNG' | '3 ĐỎ 1 TRẮNG', odds = 1.98) => {
    if (isGateLocked) {
      alert('403 GATE_LOCKED: Cổng cược đã đóng trước 5 giây kết thúc ván!');
      return;
    }
    addSelection({
      matchId: 'xocdia-round',
      matchName: '3D Virtual Xóc Đĩa Live',
      marketName: 'Cược Ván',
      selectionName: side,
      odds,
      stake: 50
    });
  };

  const redCount = tokens.filter(t => t === 'R').length;
  const isEven = redCount % 2 === 0;

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
              <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded ml-1 uppercase">
                Xóc Đĩa Live
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
        <div className="bg-[#0A438D] px-3 py-1.5 flex items-center justify-between text-xs font-bold text-white">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Disc3 className="w-4 h-4 text-amber-400" />
            <span>XÓC ĐĨA 3D VIRTUAL (4 ĐỒNG XU)</span>
          </div>
          <button
            onClick={() => setCurrentView('sbobet')}
            className="text-[11px] text-yellow-300 hover:underline flex items-center gap-1 font-bold"
          >
            ← Về Sảnh Thể Thao
          </button>
        </div>
      </header>

      {/* 2. MAIN XÓC ĐĨA STAGE */}
      <main className="flex-1 p-3 space-y-3 overflow-y-auto">
        
        {/* WHITE STAGE CARD: TIMER, CERAMIC BOWL & TOKENS */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs text-center">
          
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 pb-2 border-b border-gray-100">
            <span>Phiên cược: #XD-992</span>
            <div className="flex items-center gap-1.5">
              <span>Thời gian:</span>
              <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${
                timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-amber-50 text-amber-700'
              }`}>
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>
          </div>

          {timeLeft <= 5 ? (
            <div className="my-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black border border-red-300 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>CỔNG KHÓA 5S ẨN ĐANG BẬT (403 GATE_LOCKED)</span>
              </span>
            </div>
          ) : (
            <div className="my-2 text-[11px] text-gray-500">
              Đang trong thời gian đặt cược • Khóa tự động ở 5 giây cuối
            </div>
          )}

          {/* CERAMIC WHITE BOWL & 4 DUAL-SIDED TOKENS */}
          <div className="w-36 h-36 sm:w-48 sm:h-48 mx-auto my-2 sm:my-3 rounded-full bg-gradient-to-b from-gray-50 to-gray-200 border-4 border-amber-600/30 flex items-center justify-center p-2 sm:p-3 shadow-inner">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {tokens.map((token, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 shadow-md flex items-center justify-center font-black text-[10px] sm:text-xs transition-transform transform hover:scale-105 ${
                    token === 'R'
                      ? 'bg-red-600 border-red-400 text-white'
                      : 'bg-white border-gray-300 text-black'
                  }`}
                >
                  {token === 'R' ? 'ĐỎ' : 'TRẮNG'}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs font-bold text-gray-700">
            Kết quả: <strong className="text-gray-900">{redCount} Đỏ {4 - redCount} Trắng</strong> —{' '}
            <span className={isEven ? 'text-[#0B4DA2] font-black' : 'text-red-600 font-black'}>
              {isEven ? 'CHẴN (EVEN)' : 'LẺ (ODD)'}
            </span>
          </div>
        </div>

        {/* 3. MAIN BETTING TILES (CHẴN / LẺ) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => handleBet('CHẴN', 1.98)}
            disabled={isGateLocked}
            className={`p-2.5 sm:p-4 rounded-xl text-center border-2 transition-all shadow-xs active:scale-98 ${
              isGateLocked
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                : 'bg-white border-[#0B4DA2] hover:bg-blue-50 text-[#0B4DA2]'
            }`}
          >
            <div className="text-sm sm:text-base font-black">CHẴN (EVEN)</div>
            <div className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">1 : 1.98</div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">4 Đỏ, 4 Trắng, 2Đ-2T</div>
          </button>

          <button
            onClick={() => handleBet('LẺ', 1.98)}
            disabled={isGateLocked}
            className={`p-2.5 sm:p-4 rounded-xl text-center border-2 transition-all shadow-xs active:scale-98 ${
              isGateLocked
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                : 'bg-white border-red-500 hover:bg-red-50 text-red-600'
            }`}
          >
            <div className="text-sm sm:text-base font-black">LẺ (ODD)</div>
            <div className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">1 : 1.98</div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">3 Đỏ 1T, 3 Trắng 1Đ</div>
          </button>
        </div>

        {/* 4. MULTIPLIER COMBOS (4 ĐỎ / 3 ĐỎ 1 TRẮNG) */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
          <div className="text-[11px] font-bold text-gray-600 mb-2">CƯỢC TỶ LỆ CAO</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBet('4 ĐỎ', 12.0)}
              disabled={isGateLocked}
              className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-center"
            >
              <div className="text-xs font-bold text-red-800">4 ĐỎ HOẶC 4 TRẮNG</div>
              <div className="text-sm font-black text-red-600">1 : 12.0</div>
            </button>
            <button
              onClick={() => handleBet('3 ĐỎ 1 TRẮNG', 4.0)}
              disabled={isGateLocked}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-center transition-colors"
            >
              <div className="text-xs font-bold text-blue-800">3 ĐỎ 1 TRẮNG</div>
              <div className="text-sm font-black text-[#0B4DA2]">1 : 4.0</div>
            </button>
          </div>
        </div>

        {/* 5. 30-ROUND SOI CẦU ROADMAP (AUTHENTIC 6-ROW CASINO BEAD MATRIX) */}
        <SbobetScorecardRoadmap
          title="BẢNG SOI CẦU CHẴN / LẺ 30 VÁN"
          gameType="xocdia"
          items={history.map((res, idx) => ({
            round: idx + 1,
            result: res,
            detail: res === 'C' ? 'Kết quả: Chẵn (2 Đỏ 2 Trắng hoặc Tứ Tử)' : 'Kết quả: Lẻ (3 Đỏ 1 Trắng hoặc 3 Trắng 1 Đỏ)'
          }))}
          rows={6}
        />

      </main>
    </div>
  );
};
