import React, { useState, useEffect } from 'react';
import { ArrowLeft, Dice5, ShieldAlert, Globe, ChevronDown } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

export const SbobetTaiXiuView: React.FC = () => {
  const { setCurrentView, addSelection, language, setLanguage, user } = useSbobetStore();

  const [timeLeft, setTimeLeft] = useState<number>(38);
  const [dice, setDice] = useState<[number, number, number]>([3, 4, 5]);
  const [history, setHistory] = useState<('T' | 'X')[]>([
    'T', 'X', 'T', 'T', 'X', 'T', 'X', 'X', 'T', 'T', 'X', 'T', 'X', 'T', 'T'
  ]);
  const [isGateLocked, setIsGateLocked] = useState<boolean>(false);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);

  // 40-Second Loop with 5-Second Invisible Buffer (Contract Rule)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          const d3 = Math.floor(Math.random() * 6) + 1;
          const sum = d1 + d2 + d3;
          setDice([d1, d2, d3]);
          setHistory(h => [...h.slice(-29), sum >= 11 ? 'T' : 'X']);
          setIsGateLocked(false);
          return 40;
        }

        // Invisible Gate Lock at 5th second before round end (at t=5)
        if (prev <= 5) {
          setIsGateLocked(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBet = (side: 'TÀI' | 'XỈU', odds = 1.98) => {
    if (isGateLocked) {
      alert('403 GATE_LOCKED: Cổng cược đã tự động đóng trước 5 giây kết thúc ván để bảo vệ chống gian lận độ trễ!');
      return;
    }
    addSelection({
      matchId: 'taixiu-round',
      matchName: '3D Virtual Tài Xỉu (SicBo)',
      marketName: 'Cược Phiên',
      selectionName: side,
      odds,
      stake: 50
    });
  };

  const sum = dice[0] + dice[1] + dice[2];

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
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded ml-1 uppercase">
                Casino 3D
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
          <div className="flex items-center gap-1.5 text-emerald-300">
            <Dice5 className="w-4 h-4 text-emerald-400" />
            <span>TÀI XỈU 3D VIRTUAL (40S LOOP)</span>
          </div>
          <button
            onClick={() => setCurrentView('sbobet')}
            className="text-[11px] text-yellow-300 hover:underline flex items-center gap-1 font-bold"
          >
            ← Về Sảnh Thể Thao
          </button>
        </div>
      </header>

      {/* 2. MAIN CASINO STAGE */}
      <main className="flex-1 p-3 space-y-3 overflow-y-auto">
        
        {/* WHITE STAGE CARD: TIMER, DICE TRAY & STATUS */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs text-center">
          
          {/* Header row inside card */}
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 pb-2 border-b border-gray-100">
            <span>Phiên cược: #TX-260907</span>
            <div className="flex items-center gap-1.5">
              <span>Thời gian:</span>
              <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${
                timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-700'
              }`}>
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>
          </div>

          {/* 5-Second Invisible Buffer Notice */}
          <div className="my-2">
            {timeLeft <= 5 ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black border border-red-300 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>CỔNG KHÓA 5S ẨN ĐANG BẬT (403 GATE_LOCKED)</span>
              </span>
            ) : (
              <span className="text-[11px] text-gray-500 font-medium">
                Cổng cược mở tự do • Tự động khóa trước 5 giây kết thúc ván
              </span>
            )}
          </div>

          {/* PORCELAIN SHAKING PLATE & 3D IVORY DICE DISPLAY */}
          <div className="w-56 h-36 mx-auto my-3 bg-gradient-to-b from-gray-100 to-gray-200 border-4 border-gray-300 rounded-full flex items-center justify-center p-3 shadow-inner relative">
            <div className="flex items-center gap-3">
              {dice.map((d, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-white border-2 border-gray-300 rounded-xl shadow-md flex items-center justify-center text-2xl font-black text-red-600 transform hover:rotate-6 transition-transform"
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs font-bold text-gray-700">
            Kết quả: <strong className="text-red-600 text-sm">{sum} Điểm</strong> —{' '}
            <span className={sum >= 11 ? 'text-red-600 font-black' : 'text-[#0B4DA2] font-black'}>
              {sum >= 11 ? 'TÀI' : 'XỈU'}
            </span>
          </div>
        </div>

        {/* 3. MAIN BETTING TILES (XỈU / TÀI) */}
        <div className="grid grid-cols-2 gap-3">
          {/* XỈU BUTTON */}
          <button
            onClick={() => handleBet('XỈU')}
            disabled={isGateLocked}
            className={`p-4 rounded-xl text-center border-2 transition-all shadow-xs active:scale-98 ${
              isGateLocked
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                : 'bg-white border-[#0B4DA2] hover:bg-blue-50 text-[#0B4DA2]'
            }`}
          >
            <div className="text-base font-black">XỈU (4 - 10)</div>
            <div className="text-xl font-black text-gray-900 mt-0.5">1 : 1.98</div>
            <div className="text-[10px] text-gray-500 mt-1">Hoàn tiền 100% nếu bão</div>
          </button>

          {/* TÀI BUTTON */}
          <button
            onClick={() => handleBet('TÀI')}
            disabled={isGateLocked}
            className={`p-4 rounded-xl text-center border-2 transition-all shadow-xs active:scale-98 ${
              isGateLocked
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                : 'bg-white border-red-500 hover:bg-red-50 text-red-600'
            }`}
          >
            <div className="text-base font-black">TÀI (11 - 17)</div>
            <div className="text-xl font-black text-gray-900 mt-0.5">1 : 1.98</div>
            <div className="text-[10px] text-gray-500 mt-1">Hoàn tiền 100% nếu bão</div>
          </button>
        </div>

        {/* 4. SUB-MARKETS (BÃO / TRIPLE) */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
          <div className="text-[11px] font-bold text-gray-600 mb-2">CƯỢC PHỤ ĐẶC BIỆT</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBet('TÀI', 30.0)}
              disabled={isGateLocked}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-center"
            >
              <div className="text-xs font-bold text-gray-800">CƯỢC BÃO BẤT KỲ</div>
              <div className="text-sm font-black text-red-600">1 : 30.0</div>
            </button>
            <button
              onClick={() => handleBet('XỈU', 5.0)}
              disabled={isGateLocked}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-center"
            >
              <div className="text-xs font-bold text-gray-800">CẶP ĐÔI BẤT KỲ</div>
              <div className="text-sm font-black text-[#0B4DA2]">1 : 5.0</div>
            </button>
          </div>
        </div>

        {/* 5. 30-ROUND SOI CẦU BEAD PLATE ROADMAP */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
            <span>BẢNG SOI CẦU 30 VÁN (TREND ROADMAP)</span>
            <span className="text-[10px] text-gray-500">
              Tài: {history.filter(h => h === 'T').length} | Xỉu: {history.filter(h => h === 'X').length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs ${
                  h === 'T'
                    ? 'bg-red-600 text-white'
                    : 'bg-[#0B4DA2] text-white'
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
