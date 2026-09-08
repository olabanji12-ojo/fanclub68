import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Dice5, ShieldAlert, Globe, ChevronDown, ChevronUp, RotateCcw, Sparkles, Check } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

type GamePhase = 'BETTING' | 'WARNING' | 'REVEAL';

export const SbobetTaiXiuView: React.FC = () => {
  const { setCurrentView, language, setLanguage, user, openAuthModal } = useSbobetStore();

  // 1. TIMING STATE MACHINE (30s Cycle)
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [phase, setPhase] = useState<GamePhase>('BETTING');
  const [dice, setDice] = useState<[number, number, number]>([3, 4, 5]);
  const [history, setHistory] = useState<('T' | 'X')[]>([
    'T', 'X', 'T', 'T', 'X', 'T', 'X', 'X', 'T', 'T', 'X', 'T', 'X', 'T', 'T'
  ]);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // 2. LIVE SIMULATED POOLS & BETTORS
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

  // Casino Chips definitions
  const chips = [
    { value: 10000, label: '10K', color: 'from-[#1E56A0] via-[#153B75] to-[#0D254C]', border: 'border-[#3B82F6]', ring: 'ring-blue-400' },
    { value: 50000, label: '50K', color: 'from-[#6D28D9] via-[#581C87] to-[#3B0764]', border: 'border-[#A855F7]', ring: 'ring-purple-400' },
    { value: 100000, label: '100K', color: 'from-[#059669] via-[#047857] to-[#064E3B]', border: 'border-[#34D399]', ring: 'ring-emerald-400' },
    { value: 200000, label: '200K', color: 'from-[#D97706] via-[#B45309] to-[#78350F]', border: 'border-[#FBBF24]', ring: 'ring-amber-400' },
    { value: 500000, label: '500K', color: 'from-[#DC2626] via-[#B91C1C] to-[#7F1D1D]', border: 'border-[#F87171]', ring: 'ring-red-400' },
  ];

  // Sum calculations
  const sum = useMemo(() => dice[0] + dice[1] + dice[2], [dice]);
  const isTai = useMemo(() => sum >= 11 && sum <= 17, [sum]);
  const isGateLocked = phase === 'WARNING' || phase === 'REVEAL';
  const winRate = userStats.total > 0 ? Math.round((userStats.wins / userStats.total) * 100) : 0;

  // 30s Master Loop with Smooth Opening Cup (No Rapid Shaking, Dice 100% frozen on open)
  useEffect(() => {
    // Guard: Do not run timer during REVEAL so dice remain 100% static while cup is open
    if (phase === 'REVEAL') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // At 0s: Smoothly lift cover ONCE to reveal dice outcome
        if (prev <= 1) {
          clearInterval(timer);

          // Generate final dice roll under the cover BEFORE it lifts
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          const d3 = Math.floor(Math.random() * 6) + 1;
          const finalSum = d1 + d2 + d3;
          const wonTai = finalSum >= 11 && finalSum <= 17 && !(d1 === d2 && d2 === d3);

          // Freeze final dice in place
          setDice([d1, d2, d3]);
          setPhase('REVEAL');
          setHistory(h => [...h.slice(-19), wonTai ? 'T' : 'X']);

          // Settle bet if placed
          if (placedBetSide) {
            const won = (wonTai && placedBetSide === 'TÀI') || (!wonTai && placedBetSide === 'XỈU');
            setUserStats(s => ({
              total: s.total + 1,
              wins: won ? s.wins + 1 : s.wins,
              losses: !won ? s.losses + 1 : s.losses,
            }));
            if (won) {
              setBetFeedback(language === 'vi' 
                ? `🎉 Thắng lớn! +${(placedBetAmount * 1.98).toLocaleString()} VND`
                : `🎉 Big Win! +$${((placedBetAmount * 1.98) / 25000).toFixed(2)}`
              );
            } else {
              setBetFeedback(language === 'vi'
                ? `Rất tiếc! Phiên này về ${wonTai ? 'TÀI' : 'XỈU'} (${finalSum} điểm).`
                : `Result was ${wonTai ? 'TÀI (OVER)' : 'XỈU (UNDER)'} (${finalSum} pts).`
              );
            }
          }

          // Keep cover smoothly open for 5.5s to display frozen final result, then close smoothly once
          setTimeout(() => {
            setPlacedBetSide(null);
            setPlacedBetAmount(0);
            setCurrentStake(0);
            setBetFeedback(null);
            setTimeLeft(30);
            setPhase('BETTING');
          }, 5500);

          return 0;
        }

        // 5s Warning Alert
        if (prev === 6) {
          setPhase('WARNING');
        }

        // Live simulated pool increments
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
  }, [phase, placedBetSide, placedBetAmount, language]);

  // Chip click adds to stake
  const handleChipClick = (val: number) => {
    setActiveChip(val);
    setCurrentStake(prev => prev + val);
  };

  // Clear selection
  const handleClear = () => {
    if (phase === 'REVEAL') return;
    setSelectedSide(null);
    setCurrentStake(0);
    setBetFeedback(null);
  };

  // Confirm bet
  const handlePlaceBet = () => {
    if (phase !== 'BETTING' && phase !== 'WARNING') {
      alert(language === 'vi' ? 'Cổng cược đang đóng hoặc phiên đang mở bát!' : 'Betting gate is closed!');
      return;
    }
    if (!selectedSide) {
      alert(language === 'vi' ? 'Vui lòng chọn cửa cược: TÀI hoặc XỈU!' : 'Please select TÀI or XỈU!');
      return;
    }
    if (currentStake <= 0) {
      alert(language === 'vi' ? 'Vui lòng chọn số tiền cược bằng các chip bên dưới!' : 'Please select chip stake amount!');
      return;
    }

    setPlacedBetSide(selectedSide);
    setPlacedBetAmount(currentStake);
    setBetFeedback(language === 'vi'
      ? `✅ Đã đặt cược thành công: ${selectedSide} (${currentStake.toLocaleString()} VND)`
      : `✅ Bet confirmed: ${selectedSide} (${currentStake.toLocaleString()} VND)`
    );
  };

  // Render 3D Casino Dice Face with authentic pips
  const renderDiceFace = (val: number) => {
    const dotPositions: Record<number, string[]> = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'center-left', 'center-right', 'bottom-left', 'bottom-right']
    };

    const pips = dotPositions[val] || ['center'];

    return (
      <div 
        className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-[#E62E2E] via-[#C91A1A] to-[#8A0F0F] border-2 border-red-300 shadow-md relative p-1.5 flex items-center justify-center transform hover:rotate-6 transition-all"
        style={{
          boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)'
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
                className={`absolute ${posClass} w-2.5 h-2.5 rounded-full bg-white shadow-inner`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 font-sans flex flex-col select-none relative overflow-x-hidden">
      
      {/* 1. AUTHENTIC SBOBET ROYAL BLUE HEADER */}
      <header className="bg-[#0B4DA2] text-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#0A3E82]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('sbobet')}
              className="p-1 hover:bg-[#08356E] rounded text-white flex items-center gap-1 text-xs font-bold transition-colors"
              title="Quay lại Thể Thao"
            >
              <ArrowLeft className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline font-bold">SBOBET Thể Thao</span>
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

            {/* User Balance or Auth */}
            {user ? (
              <div className="bg-[#08356E] px-2.5 py-1 rounded text-right border border-[#165AB8]">
                <div className="text-[9px] text-blue-200 uppercase font-semibold leading-none">
                  {language === 'vi' ? 'Số dư' : 'Balance'}
                </div>
                <div className="text-xs font-black text-yellow-300 font-mono">
                  ${user.balance.toFixed(2)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openAuthModal('login')}
                  className="bg-gradient-to-b from-[#B86B1C] to-[#783E08] border border-[#E5A84B]/80 text-white text-[11px] font-black px-2 py-1 rounded shadow-sm active:scale-95"
                >
                  {language === 'vi' ? 'ĐĂNG NHẬP' : 'LOG IN'}
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-b from-[#D31818] to-[#880808] border border-[#FF6B6B]/80 text-white text-[11px] font-black px-2 py-1 rounded shadow-sm active:scale-95"
                >
                  {language === 'vi' ? 'ĐĂNG KÝ' : 'REGISTER'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUB BAR: TITLE & SESSION INFO */}
        <div className="bg-[#0A438D] px-3 py-1.5 flex items-center justify-between text-xs font-bold text-white border-t border-[#08356E]">
          <div className="flex items-center gap-1.5 text-emerald-300">
            <Dice5 className="w-4 h-4 text-yellow-400" />
            <span className="tracking-wide">TÀI XỈU 3D VIRTUAL (SICBO ARENA)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-200 text-[11px]">
              Phiên: <strong className="text-yellow-300 font-mono">#TX-260907</strong>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </header>

      {/* 2. MAIN CASINO STAGE - LIGHT THEME */}
      <main className="flex-1 p-3 space-y-3 max-w-2xl mx-auto w-full">
        
        {/* WHITE CARD STAGE: STATUS & 3D DICE TRAY WITH SMOOTH OPENING CUP */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-center">
          
          {/* Status announcement pill */}
          <div className="mb-3">
            <div className={`py-1.5 px-3 rounded-lg border text-center text-xs font-bold transition-all ${
              phase === 'WARNING'
                ? 'bg-amber-50 border-amber-300 text-amber-700 animate-pulse'
                : phase === 'REVEAL'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              {phase === 'BETTING' && (language === 'vi' ? `Phiên đang nhận cược. Còn ${timeLeft} giây.` : `Currently accepting bets. ${timeLeft}s remaining.`)}
              {phase === 'WARNING' && (language === 'vi' ? `Sắp khóa cược! Còn ${timeLeft} giây.` : `Closing bets soon! ${timeLeft}s remaining.`)}
              {phase === 'REVEAL' && (
                language === 'vi'
                  ? `Kết quả: ${dice.join(' + ')} = ${sum} Điểm (${isTai ? 'TÀI' : 'XỈU'}).`
                  : `Result: ${dice.join(' + ')} = ${sum} Points (${isTai ? 'TÀI / OVER' : 'XỈU / UNDER'}).`
              )}
            </div>
          </div>

          {/* 3D PORCELAIN TRAY & THE SMOOTH OPENING CUP (OPENS ONCE ON TIMER ZERO) */}
          <div className="relative py-2 flex flex-col items-center justify-center">
            
            {/* Outer Porcelain Plate with Metallic Rim */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-slate-100 via-white to-slate-200 border-4 border-slate-300 shadow-[0_8px_25px_rgba(0,0,0,0.12)] flex items-center justify-center p-3">
              
              {/* Decorative dotted gold ring */}
              <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-amber-400/40 pointer-events-none" />

              {/* Inner Green Casino Felt with 3 3D Dice */}
              <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-[#114B36] to-[#0A2E21] border-2 border-[#1B6B4D] shadow-inner flex flex-col items-center justify-center p-3 relative">
                
                {/* 3 Dice Array */}
                <div className="flex items-center gap-2 sm:gap-2.5 z-0">
                  {dice.map((d, i) => (
                    <div key={i}>
                      {renderDiceFace(d)}
                    </div>
                  ))}
                </div>

                {/* Floating Outcome Result Pill (Appears during REVEAL) */}
                {phase === 'REVEAL' && (
                  <div className="absolute inset-x-3 -bottom-3 bg-white border-2 border-amber-500 rounded-xl px-3 py-1 shadow-xl text-center z-30 animate-bounce">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-wide">
                      {dice.join(' - ')} • TỔNG {sum} ĐIỂM
                    </div>
                    <div className="text-base font-black text-red-600 tracking-wider">
                      {isTai ? 'TÀI (LỚN)' : 'XỈU (NHỎ)'}
                    </div>
                  </div>
                )}
              </div>

              {/* THE SLEEK SILVER/PORCELAIN CUP COVER (OPENS SMOOTHLY ONCE - NO RAPID SHAKING) */}
              <div 
                className={`absolute inset-3 rounded-full transition-all duration-700 ease-out z-20 flex flex-col items-center justify-center ${
                  phase === 'REVEAL'
                    ? '-translate-y-24 scale-90 opacity-80 pointer-events-none'
                    : 'translate-y-0 scale-100 opacity-100'
                }`}
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 85%, #64748B 100%)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,255,255,0.9), inset 0 -4px 10px rgba(0,0,0,0.2)'
                }}
              >
                {/* Polished Gold Rim */}
                <div className="absolute inset-1.5 rounded-full border-4 border-[#D4AF37]/80 shadow-inner" />
                <div className="absolute inset-3.5 rounded-full border border-yellow-500/40" />

                {/* Cup Center Countdown Dial (Visible when cup covers dice) */}
                {phase !== 'REVEAL' && (
                  <div className="relative flex flex-col items-center justify-center">
                    <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                      phase === 'WARNING'
                        ? 'border-red-500 bg-red-50/95 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                        : 'border-[#0B4DA2] bg-white/95 text-[#0B4DA2] shadow-md'
                    }`}>
                      <span className="text-xl sm:text-2xl font-black font-mono leading-none">
                        {timeLeft}
                      </span>
                    </div>
                    <span className={`mt-1.5 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs ${
                      phase === 'WARNING'
                        ? 'bg-red-600 text-white animate-bounce'
                        : 'bg-[#0B4DA2] text-white'
                    }`}>
                      {phase === 'WARNING' 
                        ? (language === 'vi' ? 'SẮP KHÓA CƯỢC' : 'CLOSING SOON')
                        : (language === 'vi' ? 'ĐANG NHẬN CƯỢC' : 'ACCEPTING BETS')}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* 5-Second Invisible Buffer Security Label */}
          <div className="mt-2 text-[11px] text-gray-500 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {language === 'vi' 
                ? 'Cổng cược tự động khóa ở 5 giây cuối trước khi mở bát'
                : 'Bets locked automatically at 5s before reveal'}
            </span>
          </div>
        </div>

        {/* 3. MAIN BETTING CARDS - AUTHENTIC WHITE THEME */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          
          {/* TÀI CARD */}
          <div
            onClick={() => (phase === 'BETTING' || phase === 'WARNING') && setSelectedSide('TÀI')}
            className={`relative rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all active:scale-98 border-2 shadow-sm ${
              selectedSide === 'TÀI'
                ? 'ring-2 ring-red-500 border-red-500 bg-red-50/70 shadow-md'
                : phase === 'REVEAL' && isTai
                  ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400'
                  : 'bg-white border-red-500 hover:bg-red-50/40'
            }`}
          >
            {selectedSide === 'TÀI' && (
              <div className="absolute top-2 right-2 bg-red-600 text-white p-0.5 rounded-full shadow">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <div className="text-xl sm:text-2xl font-black text-red-600 tracking-wider">
              TÀI
            </div>
            <div className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase tracking-tight">
              11 - 17 ĐIỂM
            </div>
            <div className="text-xs sm:text-sm font-black text-amber-600 my-1">
              ĂN 1 : 1.98
            </div>
            <div className="text-sm sm:text-base font-black text-gray-900 font-mono tracking-wide">
              {taiPool.toLocaleString()} VND
            </div>
            <div className="text-[10px] text-gray-500 font-medium mt-0.5">
              {taiBettors} {language === 'vi' ? 'NGƯỜI ĐANG CHỌN' : 'BETTORS'}
            </div>
          </div>

          {/* XỈU CARD */}
          <div
            onClick={() => (phase === 'BETTING' || phase === 'WARNING') && setSelectedSide('XỈU')}
            className={`relative rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all active:scale-98 border-2 shadow-sm ${
              selectedSide === 'XỈU'
                ? 'ring-2 ring-[#0B4DA2] border-[#0B4DA2] bg-blue-50/70 shadow-md'
                : phase === 'REVEAL' && !isTai
                  ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400'
                  : 'bg-white border-[#0B4DA2] hover:bg-blue-50/40'
            }`}
          >
            {selectedSide === 'XỈU' && (
              <div className="absolute top-2 right-2 bg-[#0B4DA2] text-white p-0.5 rounded-full shadow">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <div className="text-xl sm:text-2xl font-black text-[#0B4DA2] tracking-wider">
              XỈU
            </div>
            <div className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase tracking-tight">
              4 - 10 ĐIỂM
            </div>
            <div className="text-xs sm:text-sm font-black text-amber-600 my-1">
              ĂN 1 : 1.98
            </div>
            <div className="text-sm sm:text-base font-black text-gray-900 font-mono tracking-wide">
              {xiuPool.toLocaleString()} VND
            </div>
            <div className="text-[10px] text-gray-500 font-medium mt-0.5">
              {xiuBettors} {language === 'vi' ? 'NGƯỜI ĐANG CHỌN' : 'BETTORS'}
            </div>
          </div>

        </div>

        {/* 4. HISTORY ROADMAP (BEAD MATRIX) - LIGHT THEME */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
            <span>{language === 'vi' ? 'LỊCH SỬ KẾT QUẢ TÀI / XỈU' : 'RESULTS ROADMAP (T / X)'}</span>
            <span className="text-[10px] text-gray-500 font-medium">
              Tài: {history.filter(h => h === 'T').length} | Xỉu: {history.filter(h => h === 'X').length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-xs shrink-0 ${
                  item === 'T'
                    ? 'bg-red-600'
                    : 'bg-[#0B4DA2]'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* 5. CASINO CHIPS & BETTING CONTROLS - LIGHT THEME */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs space-y-2.5">
          
          {/* Custom Stake Input & Quick Multipliers Box */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">{language === 'vi' ? 'Cửa cược:' : 'Gate:'}</span>
                <span className="font-black text-red-600">
                  {selectedSide || (language === 'vi' ? 'Chưa chọn' : 'None')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentStake(prev => Math.floor(prev / 2))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[10px] font-bold text-gray-700 border border-gray-300 transition-colors shadow-2xs"
                  title="Giảm 1 nửa tiền cược"
                >
                  1/2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStake(prev => (prev === 0 ? 50000 : prev * 2))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[10px] font-bold text-[#0B4DA2] border border-gray-300 transition-colors shadow-2xs"
                  title="Gấp đôi tiền cược"
                >
                  2X
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStake(prev => prev + 100000)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[10px] font-bold text-amber-700 border border-gray-300 transition-colors shadow-2xs"
                >
                  +100K
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStake(1000000)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[10px] font-bold text-emerald-600 border border-gray-300 transition-colors shadow-2xs"
                  title="Đặt mức tối đa"
                >
                  {language === 'vi' ? 'TẤT TAY' : 'MAX'}
                </button>
              </div>
            </div>

            {/* Numeric Custom Input Field */}
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={currentStake > 0 ? currentStake.toLocaleString() : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setCurrentStake(raw ? parseInt(raw, 10) : 0);
                }}
                placeholder={language === 'vi' ? 'Nhập số tiền cược tùy ý (VND)...' : 'Enter custom stake amount...'}
                disabled={phase === 'REVEAL'}
                className="w-full bg-white border border-slate-300 focus:border-[#0B4DA2] rounded-lg py-2 pl-3 pr-14 text-sm font-black text-[#0B4DA2] font-mono tracking-wider outline-none shadow-xs transition-colors"
              />
              <span className="absolute right-3 text-xs font-black text-gray-500 pointer-events-none">
                VND
              </span>
            </div>
          </div>

          {/* 3D Casino Chips Row for Fast Selection */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 px-1 py-0.5">
            {chips.map(chip => (
              <button
                key={chip.value}
                onClick={() => handleChipClick(chip.value)}
                className={`relative flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${
                  activeChip === chip.value ? '-translate-y-1.5 scale-105' : 'hover:-translate-y-0.5'
                }`}
              >
                <div 
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${chip.color} border-2 ${chip.border} flex items-center justify-center shadow-md relative cursor-pointer ${
                    activeChip === chip.value ? `ring-2 ${chip.ring} shadow-[0_0_12px_rgba(234,179,8,0.6)]` : ''
                  }`}
                >
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-white/40 pointer-events-none" />
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
            <div className="text-center text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 py-1.5 px-3 rounded-lg animate-fade-in">
              {betFeedback}
            </div>
          )}

          {/* Action Buttons: XÓA vs ĐẶT CƯỢC */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleClear}
              disabled={phase === 'REVEAL'}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'vi' ? 'XÓA LỰA CHỌN' : 'CLEAR'}</span>
            </button>

            {phase === 'BETTING' || phase === 'WARNING' ? (
              <button
                onClick={handlePlaceBet}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D49B24] via-[#F3C452] to-[#B87C0D] hover:brightness-105 text-black font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>{language === 'vi' ? 'ĐẶT CƯỢC' : 'PLACE BET'}</span>
              </button>
            ) : (
              <button
                disabled
                className="py-2.5 px-3 rounded-xl bg-slate-200 border border-slate-300 text-slate-500 font-black text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
              >
                <span>⏳ {language === 'vi' ? 'CHỜ PHIÊN MỚI' : 'NEXT ROUND'}</span>
              </button>
            )}
          </div>

        </div>

        {/* 6. USER STATISTICS BAR - LIGHT THEME */}
        <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-xs">
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="border-r border-gray-200">
              <div className="text-[9px] text-gray-500 font-semibold uppercase">
                {language === 'vi' ? 'Ván cược' : 'Rounds'}
              </div>
              <div className="text-xs font-black text-gray-900 font-mono mt-0.5">{userStats.total}</div>
            </div>
            <div className="border-r border-gray-200">
              <div className="text-[9px] text-gray-500 font-semibold uppercase">
                {language === 'vi' ? 'Thắng' : 'Wins'}
              </div>
              <div className="text-xs font-black text-emerald-600 font-mono mt-0.5">{userStats.wins}</div>
            </div>
            <div className="border-r border-gray-200">
              <div className="text-[9px] text-gray-500 font-semibold uppercase">
                {language === 'vi' ? 'Thua' : 'Losses'}
              </div>
              <div className="text-xs font-black text-red-600 font-mono mt-0.5">{userStats.losses}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500 font-semibold uppercase">
                {language === 'vi' ? 'Tỷ lệ thắng' : 'Win Rate'}
              </div>
              <div className="text-xs font-black text-amber-600 font-mono mt-0.5">{winRate}%</div>
            </div>
          </div>
        </div>

        {/* 7. COLLAPSIBLE RULES ACCORDION */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs pb-4">
          <button
            onClick={() => setIsRulesOpen(!isRulesOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-bold text-gray-800 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-[#0B4DA2]">
              📜 {language === 'vi' ? 'Luật Tài Xỉu SicBo' : 'SicBo Game Rules'}
            </span>
            {isRulesOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
          
          {isRulesOpen && (
            <div className="px-3 pb-3 text-[11px] text-gray-600 space-y-1.5 border-t border-gray-100 pt-2 leading-relaxed">
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
                • Cổng cược tự động khóa ở 5 giây cuối trước khi mở bát công bố kết quả.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};
