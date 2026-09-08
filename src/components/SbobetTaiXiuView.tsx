import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Menu, RotateCcw, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

type GamePhase = 'BETTING' | 'WARNING' | 'ROLLING' | 'REVEAL';

export const SbobetTaiXiuView: React.FC = () => {
  const { setCurrentView, user, openAuthModal } = useSbobetStore();

  // 1. TIMING STATE MACHINE (30s Cycle)
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [phase, setPhase] = useState<GamePhase>('BETTING');
  const [dice, setDice] = useState<[number, number, number]>([3, 4, 5]);
  const [history, setHistory] = useState<('T' | 'X')[]>([
    'T', 'X', 'T', 'T', 'X', 'T', 'X', 'X', 'T', 'T', 'X', 'T', 'X', 'T', 'T'
  ]);

  // 2. LIVE SIMULATED POOLS & BETTORS (Sunwin style)
  const [taiPool, setTaiPool] = useState<number>(525042127);
  const [taiBettors, setTaiBettors] = useState<number>(969);
  const [xiuPool, setXiuPool] = useState<number>(700721500);
  const [xiuBettors, setXiuBettors] = useState<number>(887);

  // 3. WAGERING & CHIPS
  const [selectedSide, setSelectedSide] = useState<'TÀI' | 'XỈU' | null>(null);
  const [activeChip, setActiveChip] = useState<number>(50000);
  const [currentStake, setCurrentStake] = useState<number>(0);
  const [placedBetSide, setPlacedBetSide] = useState<'TÀI' | 'XỈU' | null>(null);
  const [placedBetAmount, setPlacedBetAmount] = useState<number>(0);
  const [betFeedback, setBetFeedback] = useState<string | null>(null);

  // 4. USER STATS
  const [userStats, setUserStats] = useState({ total: 0, wins: 0, losses: 0 });
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Casino Chips definitions
  const chips = [
    { value: 10000, label: '10K', color: 'from-[#1E56A0] via-[#153B75] to-[#0D254C]', border: 'border-[#3B82F6]', ring: 'ring-blue-400' },
    { value: 50000, label: '50K', color: 'from-[#6D28D9] via-[#581C87] to-[#3B0764]', border: 'border-[#A855F7]', ring: 'ring-purple-400' },
    { value: 100000, label: '100K', color: 'from-[#059669] via-[#047857] to-[#064E3B]', border: 'border-[#34D399]', ring: 'ring-emerald-400' },
    { value: 200000, label: '200K', color: 'from-[#D97706] via-[#B45309] to-[#78350F]', border: 'border-[#FBBF24]', ring: 'ring-amber-400' },
    { value: 500000, label: '500K', color: 'from-[#DC2626] via-[#B91C1C] to-[#7F1D1D]', border: 'border-[#F87171]', ring: 'ring-red-400' },
  ];

  // Sum calculation
  const sum = useMemo(() => dice[0] + dice[1] + dice[2], [dice]);
  const isTai = useMemo(() => sum >= 11 && sum <= 17, [sum]);
  const isBao = useMemo(() => dice[0] === dice[1] && dice[1] === dice[2], [dice]);
  const winRate = userStats.total > 0 ? Math.round((userStats.wins / userStats.total) * 100) : 0;

  // 30s Master Loop with Rolling Cup
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // At 0s: Transition to ROLLING phase (shaking cup & rolling dice)
        if (prev <= 1) {
          setPhase('ROLLING');

          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          const d3 = Math.floor(Math.random() * 6) + 1;
          const finalSum = d1 + d2 + d3;
          const wonTai = finalSum >= 11 && finalSum <= 17 && !(d1 === d2 && d2 === d3);

          // 3.5s of rolling and shaking cup
          setTimeout(() => {
            setDice([d1, d2, d3]);
            setPhase('REVEAL');
            setHistory(h => [...h.slice(-19), wonTai ? 'T' : 'X']);

            // Settle bet
            if (placedBetSide) {
              const won = (wonTai && placedBetSide === 'TÀI') || (!wonTai && placedBetSide === 'XỈU');
              setUserStats(s => ({
                total: s.total + 1,
                wins: won ? s.wins + 1 : s.wins,
                losses: !won ? s.losses + 1 : s.losses,
              }));
              if (won) {
                setBetFeedback(`🎉 Thắng lớn! +${(placedBetAmount * 1.98).toLocaleString()} VND`);
              } else {
                setBetFeedback(`Rất tiếc! Phiên này về ${wonTai ? 'TÀI' : 'XỈU'} (${finalSum} điểm).`);
              }
            }

            // 5s of reveal before resetting round
            setTimeout(() => {
              setPhase('BETTING');
              setPlacedBetSide(null);
              setPlacedBetAmount(0);
              setCurrentStake(0);
              setBetFeedback(null);
              setTimeLeft(30);
            }, 5500);

          }, 3500);

          return 0;
        }

        if (prev === 6) {
          setPhase('WARNING');
        }

        // Live pool increments
        if (prev > 0) {
          if (Math.random() > 0.4) {
            setTaiPool(p => p + Math.floor(Math.random() * 700000 + 150000));
            if (Math.random() > 0.6) setTaiBettors(b => b + 1);
          }
          if (Math.random() > 0.4) {
            setXiuPool(p => p + Math.floor(Math.random() * 700000 + 150000));
            if (Math.random() > 0.6) setXiuBettors(b => b + 1);
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [placedBetSide, placedBetAmount]);

  // Chip click adds to stake
  const handleChipClick = (val: number) => {
    setActiveChip(val);
    setCurrentStake(prev => prev + val);
  };

  // Clear selection
  const handleClear = () => {
    if (phase === 'ROLLING' || phase === 'REVEAL') return;
    setSelectedSide(null);
    setCurrentStake(0);
    setBetFeedback(null);
  };

  // Confirm bet
  const handlePlaceBet = () => {
    if (phase !== 'BETTING' && phase !== 'WARNING') {
      alert('Cổng cược đang đóng hoặc xúc xắc đang lắc!');
      return;
    }
    if (!selectedSide) {
      alert('Vui lòng chọn cửa cược: TÀI hoặc XỈU!');
      return;
    }
    if (currentStake <= 0) {
      alert('Vui lòng chọn số tiền cược bằng các chip bên dưới!');
      return;
    }

    setPlacedBetSide(selectedSide);
    setPlacedBetAmount(currentStake);
    setBetFeedback(`✅ Đã đặt cược thành công: ${selectedSide} (${currentStake.toLocaleString()} VND)`);
  };

  // Render 3D Dice Face with authentic dots/pips
  const renderDiceFace = (val: number) => {
    const dotPositions: Record<number, string[]> = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'center-left', 'center-right', 'bottom-left', 'bottom-right']
    };

    const isRedDie = true; // Authentic red casino dice
    const pips = dotPositions[val] || ['center'];

    return (
      <div 
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#E62E2E] via-[#C91A1A] to-[#8A0F0F] border-2 border-red-300 shadow-xl relative p-1.5 flex items-center justify-center transform hover:rotate-6 transition-all"
        style={{
          boxShadow: '0 4px 10px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.4)'
        }}
      >
        <div className="w-full h-full relative">
          {pips.map((pos, idx) => {
            let posClass = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
            if (pos === 'top-left') posClass = 'top-0 left-0';
            if (pos === 'top-right') posClass = 'top-0 right-0';
            if (pos === 'bottom-left') posClass = 'bottom-0 left-0';
            if (pos === 'bottom-right') posClass = 'bottom-0 right-0';
            if (pos === 'center-left') posClass = 'top-1/2 -translate-y-1/2 left-0';
            if (pos === 'center-right') posClass = 'top-1/2 -translate-y-1/2 right-0';

            return (
              <span
                key={idx}
                className={`absolute ${posClass} w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white shadow-inner`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white font-sans flex flex-col select-none relative overflow-x-hidden">
      
      {/* CSS KEYFRAMES FOR DICE SHAKING & ROLLING */}
      <style>{`
        @keyframes cupShake {
          0% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-8px, -4px) rotate(-4deg); }
          20% { transform: translate(8px, 4px) rotate(4deg); }
          30% { transform: translate(-7px, 5px) rotate(-3deg); }
          40% { transform: translate(7px, -4px) rotate(3deg); }
          50% { transform: translate(-9px, -3px) rotate(-4deg); }
          60% { transform: translate(9px, 5px) rotate(4deg); }
          70% { transform: translate(-6px, 3px) rotate(-2deg); }
          80% { transform: translate(6px, -4px) rotate(3deg); }
          90% { transform: translate(-4px, 2px) rotate(-1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-cup-shake {
          animation: cupShake 0.35s infinite ease-in-out;
        }
        @keyframes diceTumble {
          0% { transform: rotate(0deg) scale(0.9); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(0.95); }
          75% { transform: rotate(270deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-dice-tumble {
          animation: diceTumble 0.25s infinite linear;
        }
      `}</style>

      {/* 1. TOP HEADER (MATCHING SBOBET / CASINO 3D THEME) */}
      <header className="bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] border-b border-[#255485]/60 shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Menu & Back Button */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentView('sbobet')}
              className="p-1.5 hover:bg-black/30 rounded-lg text-white/90 transition-colors flex items-center gap-1"
              title="Quay lại Thể Thao"
            >
              <Menu className="w-5 h-5 text-yellow-400" />
            </button>
            <button
              onClick={() => setCurrentView('sbobet')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-yellow-300 hover:text-yellow-200 transition-colors bg-black/20 px-2 py-1 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>SBOBET Thể Thao</span>
            </button>
          </div>

          {/* Center Tài Xỉu Ornate Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#1A0900] flex items-center justify-center text-yellow-400 font-black text-xs">
                TX
              </div>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-sm font-black text-yellow-300 tracking-wider drop-shadow-sm uppercase">
                Tài Xỉu 3D
              </span>
              <span className="text-[9px] text-yellow-400/80 font-semibold">
                Sunwin SicBo Engine
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openAuthModal('login')}
              className="bg-gradient-to-b from-[#B86B1C] to-[#783E08] border border-[#E5A84B]/80 text-white text-[11px] font-black px-2.5 py-1.5 rounded-md shadow-md active:scale-95"
            >
              ĐĂNG NHẬP
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="bg-gradient-to-b from-[#D31818] to-[#880808] border border-[#FF6B6B]/80 text-white text-[11px] font-black px-2.5 py-1.5 rounded-md shadow-md active:scale-95"
            >
              ĐĂNG KÝ
            </button>
          </div>
        </div>

        {/* User Balance Strip */}
        <div className="bg-[#05111E] px-3 py-1 flex items-center justify-between border-t border-[#16385B] text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Số dư:</span>
            <span className="font-mono font-black text-yellow-400">
              ${user?.balance.toFixed(2) || '1,000.00'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Phiên: <strong className="text-yellow-300">#TX-260907</strong></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC STATUS TICKER BAR */}
      <div className="px-3 pt-2.5 pb-1">
        <div className={`py-1.5 px-3 rounded-lg border text-center text-xs font-semibold transition-all ${
          phase === 'WARNING' 
            ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 animate-pulse'
            : phase === 'ROLLING'
              ? 'bg-red-950/80 border-red-500/80 text-red-300 font-bold'
              : phase === 'REVEAL'
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold'
                : 'bg-[#101827] border-[#1F293D] text-gray-300'
        }`}>
          {phase === 'BETTING' && `Cổng cược đang mở. Còn ${timeLeft} giây.`}
          {phase === 'WARNING' && `Sắp khóa cược! Còn ${timeLeft} giây.`}
          {phase === 'ROLLING' && `Đã khóa cược. Đang lắc bát & đảo xúc xắc...`}
          {phase === 'REVEAL' && `Kết quả: ${dice.join(' + ')} = ${sum} Điểm (${isTai ? 'TÀI' : 'XỈU'}). ${
            placedBetSide 
              ? (placedBetSide === (isTai ? 'TÀI' : 'XỈU') ? '🎉 Chúc mừng bạn đã thắng!' : 'Rất tiếc bạn chưa trúng.') 
              : 'Bạn chưa đặt cược nên điểm không thay đổi.'
          }`}
        </div>
      </div>

      {/* 3. CENTER DICE CUP & ROLLING STAGE */}
      <div className="relative px-3 py-2 flex flex-col items-center justify-center">
        
        {/* GOLDEN CIRCULAR TRAY BASE */}
        <div className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-[#2E1F0F] via-[#1A1208] to-[#0A0703] border-4 border-[#D4AF37]/80 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center justify-center p-4">
          
          {/* Inner Golden Bevel */}
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#FFD700]/30 pointer-events-none"></div>

          {/* INNER FELT WITH 3 DICE (UNDERNEATH CUP) */}
          <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-[#113B2E] to-[#08221A] border-2 border-[#1E5D48] shadow-inner flex flex-col items-center justify-center p-3 relative">
            
            {/* 3 Red Casino Dice */}
            <div className={`flex items-center gap-2.5 z-0 ${phase === 'ROLLING' ? 'animate-dice-tumble' : ''}`}>
              {dice.map((d, i) => (
                <div key={i}>
                  {renderDiceFace(d)}
                </div>
              ))}
            </div>

            {/* Total Sum Badge (Appears during REVEAL) */}
            {phase === 'REVEAL' && (
              <div className="absolute inset-x-4 -bottom-3 bg-[#0A101D]/95 border-2 border-yellow-400 rounded-xl px-3 py-1 shadow-2xl text-center z-30 animate-bounce">
                <div className="text-[10px] font-black text-gray-300 uppercase">
                  {dice.join(' - ')} • TỔNG {sum} ĐIỂM
                </div>
                <div className="text-base font-black text-yellow-400 tracking-wider">
                  {isTai ? 'TÀI (LỚN)' : 'XỈU (NHỎ)'}
                </div>
              </div>
            )}
          </div>

          {/* THE 3D SCULPTED METALLIC CUP / COVER */}
          <div 
            className={`absolute inset-3 rounded-full transition-all duration-700 ease-out z-20 flex flex-col items-center justify-center ${
              phase === 'ROLLING'
                ? 'animate-cup-shake'
                : phase === 'REVEAL'
                  ? 'translate-x-16 -translate-y-12 rotate-12 opacity-85 pointer-events-none scale-90'
                  : 'translate-x-0 translate-y-0 rotate-0 opacity-100'
            }`}
            style={{
              background: 'radial-gradient(circle at 35% 35%, #8A6834 0%, #4D3818 45%, #241A0A 85%, #0D0903 100%)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.85), inset 0 2px 6px rgba(255,215,0,0.5), inset 0 -4px 10px rgba(0,0,0,0.9)'
            }}
          >
            {/* Golden Ornamental Trim */}
            <div className="absolute inset-1.5 rounded-full border-4 border-[#E5A84B]/70 shadow-inner"></div>
            <div className="absolute inset-3.5 rounded-full border border-yellow-500/30"></div>

            {/* Cup Center Countdown Dial (Visible when cup covers dice) */}
            {phase !== 'REVEAL' && (
              <div className="relative flex flex-col items-center justify-center">
                <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                  phase === 'WARNING'
                    ? 'border-yellow-400 bg-yellow-950/60 shadow-[0_0_18px_rgba(250,204,21,0.8)] animate-pulse'
                    : phase === 'ROLLING'
                      ? 'border-red-500 bg-red-950/80 shadow-[0_0_20px_rgba(239,68,68,0.9)]'
                      : 'border-yellow-500/80 bg-black/60 shadow-lg'
                }`}>
                  <span className="text-xl sm:text-2xl font-black font-mono text-yellow-300 leading-none">
                    {phase === 'ROLLING' ? '0' : timeLeft}
                  </span>
                </div>

                <span className={`mt-1.5 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                  phase === 'WARNING'
                    ? 'bg-amber-500 text-black font-bold animate-bounce'
                    : phase === 'ROLLING'
                      ? 'bg-red-600 text-white font-black animate-pulse'
                      : 'text-yellow-200/90'
                }`}>
                  {phase === 'WARNING' ? 'SẮP KHÓA CƯỢC' : phase === 'ROLLING' ? 'ĐANG LẮC XÚC XẮC' : 'ĐANG NHẬN CƯỢC'}
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 4. TWO MAIN NEON WAGERING CARDS (TÀI vs XỈU) */}
      <div className="px-3 py-1 grid grid-cols-2 gap-2.5 sm:gap-3">
        
        {/* CARD 1: TÀI (11 - 17) */}
        <div
          onClick={() => {
            if (phase === 'BETTING' || phase === 'WARNING') {
              setSelectedSide('TÀI');
            }
          }}
          className={`relative rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all active:scale-98 ${
            selectedSide === 'TÀI'
              ? 'ring-2 ring-yellow-400 shadow-[0_0_25px_rgba(255,43,94,0.7)]'
              : ''
          } ${
            phase === 'REVEAL' && isTai
              ? 'bg-gradient-to-b from-[#571223] to-[#2E0B16] border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,200,0,0.8)]'
              : 'bg-gradient-to-b from-[#2E0B16]/95 via-[#22070F]/90 to-[#150408]/95 border-2 border-[#FF2B5E] shadow-[0_0_15px_rgba(255,43,94,0.35)] hover:border-[#FF577F]'
          }`}
        >
          {selectedSide === 'TÀI' && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black p-0.5 rounded-full shadow">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}

          <div className="text-xl sm:text-2xl font-black text-[#FF3366] tracking-wider drop-shadow-sm">
            TÀI
          </div>
          <div className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-tight">
            11 - 17 ĐIỂM
          </div>

          <div className="text-xs sm:text-sm font-black text-[#FFD043] my-1.5 flex items-center justify-center gap-1">
            <span>ĂN 1 : 1.98</span>
          </div>

          <div className="text-sm sm:text-base font-black text-[#FFC800] font-mono tracking-wide">
            {taiPool.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 font-medium mt-0.5">
            {taiBettors} NGƯỜI ĐANG CHỌN
          </div>
        </div>

        {/* CARD 2: XỈU (4 - 10) */}
        <div
          onClick={() => {
            if (phase === 'BETTING' || phase === 'WARNING') {
              setSelectedSide('XỈU');
            }
          }}
          className={`relative rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all active:scale-98 ${
            selectedSide === 'XỈU'
              ? 'ring-2 ring-yellow-400 shadow-[0_0_25px_rgba(30,107,255,0.7)]'
              : ''
          } ${
            phase === 'REVEAL' && !isTai
              ? 'bg-gradient-to-b from-[#123674] to-[#0A1A38] border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,200,0,0.8)]'
              : 'bg-gradient-to-b from-[#0D1F3C]/95 via-[#0A1830]/90 to-[#071120]/95 border-2 border-[#1E6BFF] shadow-[0_0_15px_rgba(30,107,255,0.35)] hover:border-[#4B8BFF]'
          }`}
        >
          {selectedSide === 'XỈU' && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black p-0.5 rounded-full shadow">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}

          <div className="text-xl sm:text-2xl font-black text-[#2B82FF] tracking-wider drop-shadow-sm">
            XỈU
          </div>
          <div className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-tight">
            4 - 10 ĐIỂM
          </div>

          <div className="text-xs sm:text-sm font-black text-[#FFD043] my-1.5 flex items-center justify-center gap-1">
            <span>ĂN 1 : 1.98</span>
          </div>

          <div className="text-sm sm:text-base font-black text-[#FFC800] font-mono tracking-wide">
            {xiuPool.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 font-medium mt-0.5">
            {xiuBettors} NGƯỜI ĐANG CHỌN
          </div>
        </div>

      </div>

      {/* 5. HISTORY ROADMAP (T/X BEADS) */}
      <div className="px-3 py-1.5">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-1">
          LỊCH SỬ KẾT QUẢ TÀI / XỈU
        </div>
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-2 bg-[#0B101D] border border-[#1C263D] rounded-xl">
          {history.map((item, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md shrink-0 ${
                item === 'T'
                  ? 'bg-gradient-to-b from-[#EF4444] to-[#B91C1C] border border-red-300'
                  : 'bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] border border-blue-300'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* 6. CASINO CHIPS SELECTION & BET CONTROLS */}
      <div className="px-3 py-2 space-y-2">
        {/* Status indicator: Selected Gate & Stake */}
        <div className="flex items-center justify-between text-xs px-2 py-1 bg-[#0D1524] rounded-lg border border-[#1E2B45]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Cửa đã chọn:</span>
            <span className="font-black text-yellow-400">
              {selectedSide ? selectedSide : 'Chưa chọn'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Điểm cược:</span>
            <span className="font-mono font-black text-yellow-300">
              {currentStake.toLocaleString()} VND
            </span>
          </div>
        </div>

        {/* 3D Casino Chips Row */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 px-1 py-1">
          {chips.map(chip => (
            <button
              key={chip.value}
              onClick={() => handleChipClick(chip.value)}
              className={`relative flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${
                activeChip === chip.value ? '-translate-y-1.5 scale-105' : 'hover:-translate-y-0.5'
              }`}
            >
              <div 
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${chip.color} border-2 ${chip.border} flex items-center justify-center shadow-lg relative cursor-pointer ${
                  activeChip === chip.value ? `ring-2 ${chip.ring} shadow-[0_0_15px_rgba(255,200,0,0.6)]` : ''
                }`}
              >
                <div className="absolute inset-0.5 rounded-full border border-dashed border-white/40 pointer-events-none"></div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 border border-white/30 flex items-center justify-center">
                  <span className="text-[10px] sm:text-[11px] font-black text-white drop-shadow font-mono">
                    {chip.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback Message */}
        {betFeedback && (
          <div className="text-center text-xs font-bold text-yellow-300 bg-yellow-950/60 border border-yellow-500/50 py-1.5 px-3 rounded-lg animate-fade-in">
            {betFeedback}
          </div>
        )}

        {/* Action Buttons: XÓA vs ĐẶT CƯỢC */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleClear}
            disabled={phase === 'ROLLING' || phase === 'REVEAL'}
            className="py-2.5 px-3 rounded-xl bg-[#111A2D] hover:bg-[#1A2846] border border-[#23355A] text-gray-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>XÓA LỰA CHỌN</span>
          </button>

          {phase === 'BETTING' || phase === 'WARNING' ? (
            <button
              onClick={handlePlaceBet}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D49B24] via-[#F3C452] to-[#B87C0D] hover:brightness-110 text-black font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>ĐẶT CƯỢC</span>
            </button>
          ) : (
            <button
              disabled
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#7D5A1E] to-[#4F360E] border border-yellow-600/30 text-yellow-200/60 font-black text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
            >
              <span>⏳ CHỜ PHIÊN MỚI</span>
            </button>
          )}
        </div>
      </div>

      {/* 7. USER STATISTICS BAR */}
      <div className="px-3 py-2">
        <div className="grid grid-cols-4 gap-1 bg-[#0D1524] border border-[#1C283F] rounded-xl p-2.5 text-center">
          <div className="border-r border-gray-800">
            <div className="text-[9px] text-gray-400 font-semibold">VÁN ĐÃ CƯỢC</div>
            <div className="text-xs font-black text-white font-mono mt-0.5">{userStats.total}</div>
          </div>
          <div className="border-r border-gray-800">
            <div className="text-[9px] text-gray-400 font-semibold">THẮNG</div>
            <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">{userStats.wins}</div>
          </div>
          <div className="border-r border-gray-800">
            <div className="text-[9px] text-gray-400 font-semibold">THUA</div>
            <div className="text-xs font-black text-red-400 font-mono mt-0.5">{userStats.losses}</div>
          </div>
          <div>
            <div className="text-[9px] text-gray-400 font-semibold">TỶ LỆ THẮNG</div>
            <div className="text-xs font-black text-yellow-400 font-mono mt-0.5">{winRate}%</div>
          </div>
        </div>
      </div>

      {/* 8. GAME RULES ACCORDION */}
      <div className="px-3 py-2 pb-6">
        <div className="bg-[#0B101D] border border-[#1A253C] rounded-xl overflow-hidden">
          <button
            onClick={() => setIsRulesOpen(!isRulesOpen)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-1.5 text-yellow-400">
              📜 Luật Tài Xỉu SicBo
            </span>
            {isRulesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isRulesOpen && (
            <div className="px-3 pb-3 text-[11px] text-gray-400 space-y-1.5 border-t border-gray-800/60 pt-2 leading-relaxed">
              <p>
                • Sử dụng <strong>3 viên xúc xắc (xí ngầu) 6 mặt</strong> (từ 1 đến 6).
              </p>
              <p>
                • <strong>TÀI</strong>: Tổng điểm 3 viên từ <strong>11 đến 17</strong> (Tỷ lệ ăn 1 : 1.98).
              </p>
              <p>
                • <strong>XỈU</strong>: Tổng điểm 3 viên từ <strong>4 đến 10</strong> (Tỷ lệ ăn 1 : 1.98).
              </p>
              <p>
                • Trường hợp <strong>Bão (3 viên cùng số)</strong>: Nhà cái thu cược hoặc hoàn theo quy định.
              </p>
              <p>
                • Cổng cược tự động khóa ở 5 giây cuối trước khi xúc xắc đảo lắc.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
