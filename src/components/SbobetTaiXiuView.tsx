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
  const renderDiceFace = (val: number, size: 'compact' | 'normal' = 'compact') => {
    const dotPositions: Record<number, string[]> = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'center-left', 'center-right', 'bottom-left', 'bottom-right']
    };

    const pips = dotPositions[val] || ['center'];
    const isComp = size === 'compact';

    return (
      <div 
        className={`${isComp ? 'w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] rounded-xs sm:rounded-sm' : 'w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl'} bg-gradient-to-br from-[#E62E2E] via-[#C91A1A] to-[#8A0F0F] border border-red-300 shadow-md relative p-0.5 flex items-center justify-center transform transition-transform`}
        style={{
          boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.4)'
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
                className={`absolute ${posClass} ${isComp ? 'w-[3px] h-[3px] sm:w-[4px] sm:h-[4px]' : 'w-2 h-2 sm:w-2.5 sm:h-2.5'} rounded-full bg-white shadow-inner`}
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
      {/* 1. AUTHENTIC SBOBET ROYAL BLUE HEADER */}
      <header className="bg-[#0B4DA2] text-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-[#0A3E82]">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentView('sbobet')}
              className="p-1 hover:bg-[#08356E] rounded text-white flex items-center gap-1 text-xs font-bold transition-colors shrink-0"
              title="Quay lại Thể Thao"
            >
              <ArrowLeft className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline font-bold">SBOBET Thể Thao</span>
            </button>
            <div className="flex items-center gap-1 ml-0.5 sm:ml-1">
              <span className="text-yellow-400 text-sm font-black">3</span>
              <span className="text-sm sm:text-base font-black italic tracking-tight">SBOBET</span>
              <span className="text-[9px] sm:text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded uppercase">
                Casino 3D
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 bg-[#08356E] px-1.5 sm:px-2 py-1 rounded text-[11px] sm:text-xs text-white border border-[#165AB8]"
              >
                <Globe className="w-3 h-3 text-[#A8CEFC]" />
                <span className="font-semibold">{language === 'vi' ? 'VI' : 'EN'}</span>
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
              <div className="bg-[#08356E] px-2 sm:px-2.5 py-1 rounded text-right border border-[#165AB8]">
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
                  className="bg-gradient-to-b from-[#B86B1C] to-[#783E08] border border-[#E5A84B]/80 text-white text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-1 rounded shadow-sm active:scale-95"
                >
                  {language === 'vi' ? 'ĐĂNG NHẬP' : 'LOG IN'}
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-b from-[#D31818] to-[#880808] border border-[#FF6B6B]/80 text-white text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-1 rounded shadow-sm active:scale-95"
                >
                  {language === 'vi' ? 'ĐĂNG KÝ' : 'REGISTER'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUB BAR: TITLE & SESSION INFO */}
        <div className="bg-[#0A438D] px-2 sm:px-3 py-1.5 flex items-center justify-between text-[11px] sm:text-xs font-bold text-white border-t border-[#08356E]">
          <div className="flex items-center gap-1.5 text-emerald-300 truncate">
            <Dice5 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 shrink-0" />
            <span className="tracking-wide truncate">TÀI XỈU 3D VIRTUAL (SICBO)</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            <span className="text-blue-200 text-[10px] sm:text-[11px]">
              Phiên: <strong className="text-yellow-300 font-mono">#TX-260907</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </header>

      {/* 2. MAIN CASINO STAGE */}
      <main className="flex-1 px-1.5 sm:px-3 py-1 sm:py-3 space-y-2 sm:space-y-3 w-full max-w-full overflow-x-hidden">
        {/* ========================================================= */}
        {/* SUNWIN GOLD CAPSULE CONSOLE (AUTHENTIC TO IMG_0915.MOV)  */}
        {/* ========================================================= */}
        <div className="relative w-full max-w-full mx-auto select-none pt-2 sm:pt-4 overflow-hidden">
          
          {/* 1. FLOATING 3D HEADER BADGE & CONTROLS */}
          <div className="relative z-30 flex items-center justify-between px-1 sm:px-4 -mb-2.5 sm:-mb-3.5 w-full max-w-full">
            
            {/* Left Utility Icons */}
            <div className="flex items-center gap-1 shrink-0">
              <button 
                type="button"
                onClick={() => setIsRulesOpen(!isRulesOpen)}
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#FFF2A8] via-[#D4AF37] to-[#8A6721] p-0.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                title="Hướng dẫn / Luật chơi"
              >
                <div className="w-full h-full rounded-full bg-[#2A170A] flex items-center justify-center text-[9px] sm:text-xs font-black text-amber-300">
                  ?
                </div>
              </button>
              <button 
                type="button"
                onClick={() => setIsRulesOpen(true)}
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#FFF2A8] via-[#D4AF37] to-[#8A6721] p-0.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                title="Thông tin phiên"
              >
                <div className="w-full h-full rounded-full bg-[#2A170A] flex items-center justify-center text-[9px] sm:text-xs font-black text-amber-300 italic font-serif">
                  i
                </div>
              </button>
            </div>

            {/* Center 3D Title Crest with Wings & Red Dice Accent */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-[#50100A] via-[#851810] to-[#50100A] border sm:border-2 border-[#FFE28A] shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                {/* 3D Dice Icon */}
                <div className="flex -space-x-1 shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded bg-red-600 border border-yellow-300 shadow flex items-center justify-center">
                    <span className="w-0.5 h-0.5 rounded-full bg-white" />
                  </div>
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded bg-red-700 border border-yellow-300 shadow flex items-center justify-center rotate-12">
                    <span className="w-0.5 h-0.5 rounded-full bg-white" />
                  </div>
                </div>

                {/* 3D Title Text */}
                <span className="text-[11px] sm:text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFF3B0] to-[#E6B033] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  TÀI XỈU
                </span>

                {/* Sparkling Icon */}
                <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-yellow-300 fill-yellow-300" />
              </div>

              {/* Round identifier pill */}
              <div className="mt-0.5 px-1.5 py-0.5 rounded-full bg-[#180C05]/90 border border-[#D4AF37]/50 text-[7px] sm:text-[9px] font-mono font-bold text-amber-200 shadow">
                #TX-260907
              </div>
            </div>

            {/* Right Utility Icons */}
            <div className="flex items-center gap-1 shrink-0">
              <button 
                type="button"
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#FFF2A8] via-[#D4AF37] to-[#8A6721] p-0.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                title="Bảng xếp hạng"
              >
                <div className="w-full h-full rounded-full bg-[#2A170A] flex items-center justify-center text-[9px] sm:text-xs">
                  🏆
                </div>
              </button>
              <button 
                type="button"
                onClick={() => setCurrentView('sbobet')}
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#FFF2A8] via-[#D4AF37] to-[#8A6721] p-0.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                title="Đóng / Quay lại"
              >
                <div className="w-full h-full rounded-full bg-[#2A170A] flex items-center justify-center text-[9px] sm:text-xs font-black text-amber-300">
                  ✕
                </div>
              </button>
            </div>
          </div>

          {/* 2. THE GOLD CAPSULE CHASSIS */}
          <div 
            className="rounded-2xl sm:rounded-[32px] p-1 sm:p-1.5 bg-gradient-to-b from-[#FFF0A5] via-[#D4AF37] to-[#784E0B] shadow-[0_12px_32px_rgba(0,0,0,0.45),0_2px_8px_rgba(212,175,55,0.4)] w-full max-w-full overflow-hidden"
          >
            {/* Inner Metallic Dark Onyx Housing */}
            <div 
              className="rounded-xl sm:rounded-[28px] p-1 sm:p-2 bg-gradient-to-b from-[#2B160B] via-[#190C05] to-[#0A0502] border border-[#FFE894]/40 relative overflow-hidden w-full max-w-full"
            >
              {/* Subtle luxury ambient sheen */}
              <div className="absolute top-0 left-1/4 right-1/4 h-8 bg-gradient-to-b from-yellow-300/10 to-transparent blur-md pointer-events-none" />

              {/* THREE-COLUMN CONSOLE: TÀI GATE (LEFT) | CIRCULAR VAULT (CENTER) | XỈU GATE (RIGHT) */}
              <div className="flex items-center justify-between gap-0.5 sm:gap-1.5 relative z-10 pt-1.5 pb-1 w-full max-w-full min-w-0">
                
                {/* ════════ LEFT WING: TÀI GATE ════════ */}
                <div 
                  onClick={() => (phase === 'BETTING' || phase === 'WARNING') && setSelectedSide('TÀI')}
                  className={`flex-1 min-w-0 flex flex-col items-center justify-between py-1 px-0.5 sm:px-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer relative ${
                    selectedSide === 'TÀI'
                      ? 'bg-gradient-to-b from-amber-500/35 via-yellow-500/20 to-transparent border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                      : phase === 'REVEAL' && isTai
                        ? 'bg-gradient-to-b from-amber-500/45 via-yellow-500/30 to-amber-700/25 border-2 border-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.9)] animate-pulse ring-2 ring-yellow-400'
                        : 'bg-gradient-to-b from-[#3E2312] via-[#241308] to-[#160A04] border border-[#855B25] hover:border-[#D4AF37]/80'
                  }`}
                  style={{ minHeight: '98px' }}
                >
                  {/* Selected checkmark indicator */}
                  {selectedSide === 'TÀI' && (
                    <div className="absolute top-0.5 left-0.5 bg-yellow-400 text-black p-0.5 rounded-full shadow">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </div>
                  )}

                  {/* Bettors Count Pill */}
                  <div className="px-1 py-0.5 rounded-full bg-[#1A0C04] border border-[#855B25] text-[7px] sm:text-[9px] font-mono text-amber-200/90 font-semibold leading-none">
                    {taiBettors}
                  </div>

                  {/* Title & Range */}
                  <div className="text-center my-0.5 w-full">
                    <div className="text-base sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FDE48B] to-[#D99A26] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                      TÀI
                    </div>
                    <div className="text-[7px] sm:text-[8px] text-amber-200/60 font-bold uppercase tracking-tight leading-none">
                      11 - 17
                    </div>
                  </div>

                  {/* Pool Amount */}
                  <div className="text-[8px] sm:text-[10px] font-mono font-black text-amber-300 truncate max-w-[78px] sm:max-w-full text-center px-0.5 leading-tight">
                    {taiPool.toLocaleString()}
                  </div>

                  {/* Embossed Bet Button */}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (phase === 'BETTING' || phase === 'WARNING') {
                        setSelectedSide('TÀI');
                        if (currentStake > 0) handlePlaceBet();
                      }
                    }}
                    className={`mt-0.5 w-full max-w-[62px] sm:max-w-[90px] py-0.5 px-0.5 rounded text-[8px] sm:text-[9px] font-black tracking-wider transition-all shadow-md active:scale-95 ${
                      selectedSide === 'TÀI'
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black border border-yellow-200 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                        : 'bg-gradient-to-r from-[#805018] via-[#B88628] to-[#693E0E] text-yellow-100 border border-yellow-600/50 hover:brightness-110'
                    }`}
                  >
                    {language === 'vi' ? 'ĐẶT CƯỢC' : 'BET'}
                  </button>
                </div>


                {/* ════════ CENTER VAULT: CIRCULAR DIAL (TIMER / 3D DICE) ════════ */}
                <div className="relative shrink-0 flex flex-col items-center justify-center mx-0.5">
                  
                  {/* Outer Beveled Gold Ring */}
                  <div 
                    className="w-[74px] h-[74px] sm:w-[94px] sm:h-[94px] md:w-28 md:h-28 rounded-full p-1 sm:p-1.5 bg-gradient-to-b from-[#FFF2A8] via-[#D4AF37] to-[#593412] shadow-[0_8px_20px_rgba(0,0,0,0.65)] flex items-center justify-center shrink-0"
                  >
                    {/* Inner Deep Onyx Pit */}
                    <div 
                      className="w-full h-full rounded-full bg-gradient-to-b from-[#1C0D07] via-[#0D0603] to-[#000000] border border-[#4A2E14] sm:border-2 flex flex-col items-center justify-center relative overflow-hidden shadow-inner p-0.5"
                    >
                      {/* Ambient radial lighting */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

                      {/* 1. COUNTDOWN STATE (BETTING / WARNING) */}
                      {phase !== 'REVEAL' ? (
                        <div className="flex flex-col items-center justify-center z-10">
                          <span 
                            className={`text-lg sm:text-2xl md:text-3xl font-black font-mono leading-none tracking-tight transition-colors ${
                              phase === 'WARNING'
                                ? 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse'
                                : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]'
                            }`}
                          >
                            {timeLeft}
                          </span>
                          <span 
                            className={`mt-0.5 text-[6px] sm:text-[7px] font-black uppercase px-1 py-0.2 rounded-full tracking-wider ${
                              phase === 'WARNING'
                                ? 'bg-red-600 text-white animate-bounce'
                                : 'bg-[#D4AF37]/25 text-amber-200 border border-[#D4AF37]/40'
                            }`}
                          >
                            {phase === 'WARNING'
                              ? (language === 'vi' ? 'SẮP KHÓA' : 'CLOSING')
                              : (language === 'vi' ? 'CƯỢC' : 'BETTING')}
                          </span>
                        </div>
                      ) : (
                        /* 2. 3D DICE REVEAL STATE (TRIANGULAR FORMATION - 1 TOP, 2 BOTTOM - 100% UNBLOCKED & FULLY FITTED) */
                        <div className="flex flex-col items-center justify-center -space-y-0.5 z-10">
                          {/* Soft golden/red glow behind dice */}
                          <div className="absolute w-8 h-8 rounded-full bg-red-500/20 blur-sm pointer-events-none" />
                          
                          {/* Top Center Die */}
                          <div className="z-10 animate-fade-in">
                            {renderDiceFace(dice[0], 'compact')}
                          </div>

                          {/* Bottom Two Dice Side-by-Side */}
                          <div className="flex items-center gap-0.5 z-10 animate-fade-in">
                            {renderDiceFace(dice[1], 'compact')}
                            {renderDiceFace(dice[2], 'compact')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>


                {/* ════════ RIGHT WING: XỈU GATE ════════ */}
                <div 
                  onClick={() => (phase === 'BETTING' || phase === 'WARNING') && setSelectedSide('XỈU')}
                  className={`flex-1 min-w-0 flex flex-col items-center justify-between py-1 px-0.5 sm:px-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer relative ${
                    selectedSide === 'XỈU'
                      ? 'bg-gradient-to-b from-blue-500/35 via-indigo-500/20 to-transparent border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                      : phase === 'REVEAL' && !isTai
                        ? 'bg-gradient-to-b from-amber-500/45 via-yellow-500/30 to-amber-700/25 border-2 border-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.9)] animate-pulse ring-2 ring-yellow-400'
                        : 'bg-gradient-to-b from-[#3E2312] via-[#241308] to-[#160A04] border border-[#855B25] hover:border-[#D4AF37]/80'
                  }`}
                  style={{ minHeight: '98px' }}
                >
                  {/* Selected checkmark indicator */}
                  {selectedSide === 'XỈU' && (
                    <div className="absolute top-0.5 right-0.5 bg-yellow-400 text-black p-0.5 rounded-full shadow">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </div>
                  )}

                  {/* Bettors Count Pill */}
                  <div className="px-1 py-0.5 rounded-full bg-[#1A0C04] border border-[#855B25] text-[7px] sm:text-[9px] font-mono text-amber-200/90 font-semibold leading-none">
                    {xiuBettors}
                  </div>

                  {/* Title & Range */}
                  <div className="text-center my-0.5 w-full">
                    <div className="text-base sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                      XỈU
                    </div>
                    <div className="text-[7px] sm:text-[8px] text-amber-200/60 font-bold uppercase tracking-tight leading-none">
                      4 - 10
                    </div>
                  </div>

                  {/* Pool Amount */}
                  <div className="text-[8px] sm:text-[10px] font-mono font-black text-amber-300 truncate max-w-[78px] sm:max-w-full text-center px-0.5 leading-tight">
                    {xiuPool.toLocaleString()}
                  </div>

                  {/* Embossed Bet Button */}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (phase === 'BETTING' || phase === 'WARNING') {
                        setSelectedSide('XỈU');
                        if (currentStake > 0) handlePlaceBet();
                      }
                    }}
                    className={`mt-0.5 w-full max-w-[62px] sm:max-w-[90px] py-0.5 px-0.5 rounded text-[8px] sm:text-[9px] font-black tracking-wider transition-all shadow-md active:scale-95 ${
                      selectedSide === 'XỈU'
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black border border-yellow-200 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                        : 'bg-gradient-to-r from-[#805018] via-[#B88628] to-[#693E0E] text-yellow-100 border border-yellow-600/50 hover:brightness-110'
                    }`}
                  >
                    {language === 'vi' ? 'ĐẶT CƯỢC' : 'BET'}
                  </button>
                </div>

              </div>

              {/* 3. INTEGRATED BOTTOM BEAD HISTORY TRACK (NEVER OVERFLOWS MOBILE) */}
              <div className="mt-1 pt-1 border-t border-[#855B25]/50 flex items-center justify-between px-0.5 w-full min-w-0">
                <div className="flex items-center gap-0.5 sm:gap-1 overflow-hidden min-w-0 flex-1 py-0.5">
                  {history.slice(-14).map((item, idx) => (
                    <div
                      key={idx}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center text-[7px] font-black shrink-0 transition-transform ${
                        item === 'T'
                          ? 'bg-gradient-to-b from-white to-gray-200 text-black border border-yellow-400 shadow-[0_0_3px_rgba(250,204,21,0.6)]'
                          : 'bg-gradient-to-b from-gray-900 to-black text-white border border-gray-600 shadow-sm'
                      } ${idx === history.slice(-14).length - 1 ? 'ring-1 ring-yellow-400 scale-105' : ''}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Mini Hand Icon / Stat Indicator */}
                <div className="ml-1 shrink-0 px-1 py-0.5 rounded bg-[#1A0C04] border border-[#855B25] text-[8px] font-mono text-amber-300 flex items-center gap-0.5">
                  <span>✋</span>
                  <span className="font-bold">{history.length}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Outcome Result Notification Banner (Below Console on Reveal) */}
          {phase === 'REVEAL' && (
            <div className="mt-2 text-center animate-fade-in w-full px-1">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 border border-yellow-400/80 shadow-md max-w-full">
                <span className="text-[10px] sm:text-xs font-black text-amber-900 shrink-0">
                  {language === 'vi' ? 'Kết quả:' : 'Result:'}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-900 truncate">
                  {dice.join(' + ')} = {sum} Điểm
                </span>
                <span className={`text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded shrink-0 ${isTai ? 'bg-red-600 text-white' : 'bg-[#0B4DA2] text-white'}`}>
                  {isTai ? 'TÀI' : 'XỈU'}
                </span>
              </div>
            </div>
          )}

          {/* 5-Second Buffer Notice */}
          <div className="mt-1.5 text-[9px] sm:text-[11px] text-gray-500 flex items-center justify-center gap-1 px-1 text-center">
            <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              {language === 'vi' 
                ? 'Cổng cược tự động khóa ở 5 giây cuối trước khi mở phiên'
                : 'Bets locked automatically at 5s before reveal'}
            </span>
          </div>

        </div>

        {/* 3. CASINO CHIPS & BETTING CONTROLS (DIRECTLY ACCESSIBLE ON MOBILE) */}
        <div className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3 shadow-xs space-y-2 sm:space-y-2.5">
          
          {/* Custom Stake Input & Quick Multipliers Box */}
          <div className="bg-slate-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 border border-slate-200 space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between gap-1 flex-wrap text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px] sm:text-xs">{language === 'vi' ? 'Cửa cược:' : 'Gate:'}</span>
                <span className="font-black text-red-600 text-xs">
                  {selectedSide || (language === 'vi' ? 'Chưa chọn' : 'None')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentStake(prev => Math.floor(prev / 2))}
                  className="px-1.5 sm:px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[9px] sm:text-[10px] font-bold text-gray-700 border border-gray-300 transition-colors shadow-2xs"
                  title="Giảm 1 nửa tiền cược"
                >
                  1/2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStake(prev => (prev === 0 ? 50000 : prev * 2))}
                  className="px-1.5 sm:px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[9px] sm:text-[10px] font-bold text-[#0B4DA2] border border-gray-300 transition-colors shadow-2xs"
                  title="Gấp đôi tiền cược"
                >
                  2X
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStake(prev => prev + 100000)}
                  className="px-1.5 sm:px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[9px] sm:text-[10px] font-bold text-amber-700 border border-gray-300 transition-colors shadow-2xs"
                >
                  +100K
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStake(1000000)}
                  className="px-1.5 sm:px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[9px] sm:text-[10px] font-bold text-emerald-600 border border-gray-300 transition-colors shadow-2xs"
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
                placeholder={language === 'vi' ? 'Nhập tiền cược (VND)...' : 'Enter stake amount...'}
                disabled={phase === 'REVEAL'}
                className="w-full bg-white border border-slate-300 focus:border-[#0B4DA2] rounded-lg py-1.5 sm:py-2 pl-3 pr-12 text-sm font-black text-[#0B4DA2] font-mono tracking-wider outline-none shadow-xs transition-colors"
              />
              <span className="absolute right-3 text-xs font-black text-gray-500 pointer-events-none">
                VND
              </span>
            </div>
          </div>

          {/* 3D Casino Chips Row for Fast Selection */}
          <div className="flex items-center justify-between gap-1 px-0.5 py-0.5 w-full">
            {chips.map(chip => (
              <button
                key={chip.value}
                onClick={() => handleChipClick(chip.value)}
                className={`relative flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${
                  activeChip === chip.value ? '-translate-y-1 scale-105' : 'hover:-translate-y-0.5'
                }`}
              >
                <div 
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br ${chip.color} border-2 ${chip.border} flex items-center justify-center shadow-md relative cursor-pointer ${
                    activeChip === chip.value ? `ring-2 ${chip.ring} shadow-[0_0_12px_rgba(234,179,8,0.6)]` : ''
                  }`}
                >
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-white/40 pointer-events-none" />
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/40 border border-white/30 flex items-center justify-center">
                    <span className="text-[8px] sm:text-[9px] font-black text-white drop-shadow font-mono">
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
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={handleClear}
              disabled={phase === 'REVEAL'}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'vi' ? 'XÓA LỰA CHỌN' : 'CLEAR'}</span>
            </button>

            {phase === 'BETTING' || phase === 'WARNING' ? (
              <button
                onClick={handlePlaceBet}
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#D49B24] via-[#F3C452] to-[#B87C0D] hover:brightness-105 text-black font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>{language === 'vi' ? 'ĐẶT CƯỢC' : 'PLACE BET'}</span>
              </button>
            ) : (
              <button
                disabled
                className="py-2 px-3 rounded-xl bg-slate-200 border border-slate-300 text-slate-500 font-black text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
              >
                <span>⏳ {language === 'vi' ? 'CHỜ PHIÊN MỚI' : 'NEXT ROUND'}</span>
              </button>
            )}
          </div>

        </div>

        {/* 4. HISTORY ROADMAP (BEAD MATRIX) - LIGHT THEME */}
        <div className="bg-white border border-gray-200 rounded-xl p-2.5 sm:p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
            <span>{language === 'vi' ? 'LỊCH SỬ KẾT QUẢ TÀI / XỈU' : 'RESULTS ROADMAP (T / X)'}</span>
            <span className="text-[10px] text-gray-500 font-medium">
              Tài: {history.filter(h => h === 'T').length} | Xỉu: {history.filter(h => h === 'X').length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
            {history.map((item, idx) => (
              <div
                key={idx}
                className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black text-white shadow-xs shrink-0 ${
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
