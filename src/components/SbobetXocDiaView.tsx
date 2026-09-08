import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Menu, ChevronDown, ChevronUp, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

type TokenColor = 'R' | 'W';
type GameState = 'BETTING' | 'WARNING' | 'SHAKING' | 'REVEAL';

export const SbobetXocDiaView: React.FC = () => {
  const { setCurrentView, user, openAuthModal } = useSbobetStore();

  // 1. TIMING STATE MACHINE (30s Cycle)
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameState, setGameState] = useState<GameState>('BETTING');
  const [tokens, setTokens] = useState<TokenColor[]>(['R', 'W', 'W', 'W']);
  const [history, setHistory] = useState<('C' | 'L')[]>([
    'L', 'L', 'C', 'C', 'L', 'L', 'C', 'L'
  ]);

  // 2. LIVE SIMULATED POOLS & BETTORS
  const [chanPool, setChanPool] = useState<number>(684371396);
  const [chanBettors, setChanBettors] = useState<number>(285);
  const [lePool, setLePool] = useState<number>(502064579);
  const [leBettors, setLeBettors] = useState<number>(263);

  // 3. USER WAGERING STATE
  const [selectedSide, setSelectedSide] = useState<'CHẴN' | 'LẺ' | null>(null);
  const [activeChip, setActiveChip] = useState<number>(50000);
  const [currentStake, setCurrentStake] = useState<number>(0);
  const [hasPlacedBet, setHasPlacedBet] = useState<boolean>(false);
  const [placedBetSide, setPlacedBetSide] = useState<'CHẴN' | 'LẺ' | null>(null);
  const [placedBetAmount, setPlacedBetAmount] = useState<number>(0);
  const [betFeedback, setBetFeedback] = useState<string | null>(null);

  // 4. USER STATS
  const [userStats, setUserStats] = useState({
    total: 0,
    wins: 0,
    losses: 0
  });

  // 5. ACCORDION / EXPANDABLE RULES
  const [isRulesExpanded, setIsRulesExpanded] = useState<boolean>(false);

  // Casino Chips definitions matching reference.png
  const chips = [
    { value: 10000, label: '10K', color: 'from-[#1E56A0] via-[#153B75] to-[#0D254C]', border: 'border-[#3B82F6]', ring: 'ring-blue-400' },
    { value: 50000, label: '50K', color: 'from-[#6D28D9] via-[#581C87] to-[#3B0764]', border: 'border-[#A855F7]', ring: 'ring-purple-400' },
    { value: 100000, label: '100K', color: 'from-[#059669] via-[#047857] to-[#064E3B]', border: 'border-[#34D399]', ring: 'ring-emerald-400' },
    { value: 200000, label: '200K', color: 'from-[#D97706] via-[#B45309] to-[#78350F]', border: 'border-[#FBBF24]', ring: 'ring-amber-400' },
    { value: 500000, label: '500K', color: 'from-[#DC2626] via-[#B91C1C] to-[#7F1D1D]', border: 'border-[#F87171]', ring: 'ring-red-400' },
  ];

  // Derived calculations
  const redCount = useMemo(() => tokens.filter(t => t === 'R').length, [tokens]);
  const isEven = useMemo(() => redCount % 2 === 0, [redCount]);
  const winRate = userStats.total > 0 ? Math.round((userStats.wins / userStats.total) * 100) : 0;

  // 30s Autonomous Master Game Loop
  useEffect(() => {
    // Guard: Do not run timer during SHAKING or REVEAL so tokens remain static
    if (gameState === 'REVEAL' || gameState === 'SHAKING') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // When timer reaches 0:
        if (prev <= 1) {
          clearInterval(timer);

          // 1. Generate final secret outcome under the closed cover
          const newTokens: TokenColor[] = Array.from({ length: 4 }, () => (Math.random() > 0.5 ? 'R' : 'W'));
          const newRedCount = newTokens.filter(t => t === 'R').length;
          const newIsEven = newRedCount % 2 === 0;

          // 2. Bowl tilts gently 2 times left-right (1.2s) while keeping outcome 100% concealed
          setGameState('SHAKING');

          // 3. On 3rd motion: slide to upper-right and reveal final outcome
          setTimeout(() => {
            setTokens(newTokens);
            setGameState('REVEAL');
            setHistory(h => [...h.slice(-19), newIsEven ? 'C' : 'L']);

            // Settle user bet if placed
            if (placedBetSide) {
              const userWon = (newIsEven && placedBetSide === 'CHẴN') || (!newIsEven && placedBetSide === 'LẺ');
              setUserStats(s => ({
                total: s.total + 1,
                wins: userWon ? s.wins + 1 : s.wins,
                losses: !userWon ? s.losses + 1 : s.losses,
              }));
              if (userWon) {
                setBetFeedback(`🎉 Thắng lớn! +${(placedBetAmount * 1.96).toLocaleString()} VND`);
              } else {
                setBetFeedback(`Rất tiếc! Bạn chưa trúng phiên này.`);
              }
            }

            // 4. Stay open at upper-right for 5.5s, then slide back down to center and restart
            setTimeout(() => {
              setHasPlacedBet(false);
              setPlacedBetSide(null);
              setPlacedBetAmount(0);
              setCurrentStake(0);
              setBetFeedback(null);
              setTimeLeft(30);
              setGameState('BETTING');
            }, 5500);

          }, 1200);

          return 0;
        }

        // B. 5s WARNING ALERT
        if (prev === 6) {
          setGameState('WARNING');
        }

        // Slight live pool increments during betting to simulate live players
        if (prev > 0) {
          if (Math.random() > 0.4) {
            setChanPool(p => p + Math.floor(Math.random() * 800000 + 100000));
            if (Math.random() > 0.6) setChanBettors(b => b + 1);
          }
          if (Math.random() > 0.4) {
            setLePool(p => p + Math.floor(Math.random() * 800000 + 100000));
            if (Math.random() > 0.6) setLeBettors(b => b + 1);
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, placedBetSide, placedBetAmount]);

  // Handle Chip Click
  const handleChipClick = (value: number) => {
    setActiveChip(value);
    setCurrentStake(prev => prev + value);
  };

  // Clear Selection
  const handleClearSelection = () => {
    if (gameState === 'SHAKING' || gameState === 'REVEAL') return;
    setSelectedSide(null);
    setCurrentStake(0);
    setBetFeedback(null);
  };

  // Place Bet Action
  const handleConfirmBet = () => {
    if (gameState !== 'BETTING') {
      alert('Cổng cược đã đóng hoặc phiên đang xóc!');
      return;
    }
    if (!selectedSide) {
      alert('Vui lòng chọn cửa cược (CHẴN hoặc LẺ) trước khi đặt!');
      return;
    }
    if (currentStake <= 0) {
      alert('Vui lòng chọn chip cược!');
      return;
    }

    setHasPlacedBet(true);
    setPlacedBetSide(selectedSide);
    setPlacedBetAmount(currentStake);
    setBetFeedback(`✅ Đã đặt cược thành công: ${selectedSide} (${currentStake.toLocaleString()} VND)`);
  };

  // Dynamic status text
  const getStatusText = () => {
    if (gameState === 'BETTING') {
      return `Phiên đang nhận cược. Còn ${timeLeft} giây.`;
    }
    if (gameState === 'WARNING') {
      return `Phiên đang nhận cược. Còn ${timeLeft} giây.`;
    }
    if (gameState === 'SHAKING') {
      return `Đã khóa cược. Phiên ván tự xóc dù bạn chưa đặt cược.`;
    }
    if (gameState === 'REVEAL') {
      const outcomeText = isEven ? 'CHẴN' : 'LẺ';
      return `Kết quả: ${redCount} đỏ - ${4 - redCount} trắng = ${outcomeText}. ${
        placedBetSide 
          ? (placedBetSide === outcomeText ? 'Chúc mừng bạn đã thắng!' : 'Rất tiếc bạn chưa trúng.') 
          : 'Bạn chưa đặt cược nên điểm không thay đổi.'
      }`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white font-sans flex flex-col select-none relative overflow-x-hidden">
      

      {/* 1. TOP HEADER (DEEP CRIMSON WITH GOLD TRIM - MATCHING REFERENCE.PNG) */}
      <header className="bg-gradient-to-r from-[#5B0909] via-[#851111] to-[#5B0909] border-b border-[#A62B2B]/60 shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Hamburger Menu & Back to SBOBET */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentView('sbobet')}
              className="p-1.5 hover:bg-black/30 rounded-lg text-white/90 transition-colors flex items-center gap-1"
              title="Quay lại SBOBET"
            >
              <Menu className="w-5 h-5 text-yellow-400" />
            </button>
            <button
              onClick={() => setCurrentView('sbobet')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-yellow-300 hover:text-yellow-200 transition-colors bg-black/20 px-2 py-1 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>SBOBET</span>
            </button>
          </div>

          {/* Center 3D Ornate Xóc Đĩa Logo */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#3B0707] flex items-center justify-center text-yellow-300 font-black text-xs italic tracking-tighter">
                  XĐ
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-sm font-black text-yellow-300 tracking-wider drop-shadow-sm uppercase">
                Xóc Đĩa
              </span>
              <span className="text-[9px] text-yellow-400/80 font-semibold tracking-tight">
                Live 3D Arena
              </span>
            </div>
          </div>

          {/* Right Action Buttons (ĐĂNG NHẬP / ĐĂNG KÝ) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openAuthModal('login')}
              className="bg-gradient-to-b from-[#B86B1C] via-[#9E5712] to-[#783E08] hover:brightness-110 border border-[#E5A84B]/80 text-white text-[11px] font-black px-2.5 sm:px-3 py-1.5 rounded-md shadow-md active:scale-95 transition-transform"
            >
              ĐĂNG NHẬP
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="bg-gradient-to-b from-[#D31818] via-[#B51010] to-[#880808] hover:brightness-110 border border-[#FF6B6B]/80 text-white text-[11px] font-black px-2.5 sm:px-3 py-1.5 rounded-md shadow-md active:scale-95 transition-transform"
            >
              ĐĂNG KÝ
            </button>
          </div>
        </div>

        {/* SUB BAR: USER WALLET / FAST STATUS */}
        <div className="bg-[#2E0505] px-3 py-1 flex items-center justify-between border-t border-[#A62B2B]/30 text-[11px]">
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="text-gray-400">Số dư:</span>
            <span className="font-mono font-black text-yellow-400">
              ${user?.balance.toFixed(2) || '1,000.00'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Phiên: <strong className="text-yellow-300">#XD-992</strong></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC STATUS TICKER BAR */}
      <div className="px-3 pt-2.5 pb-1 notranslate" translate="no">
        <div className={`py-1.5 px-3 rounded-lg border text-center text-xs font-semibold transition-all ${
          gameState === 'WARNING' 
            ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 animate-pulse'
            : gameState === 'SHAKING'
              ? 'bg-red-950/80 border-red-500/80 text-red-300 font-bold'
              : gameState === 'REVEAL'
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold'
                : 'bg-[#101827] border-[#1F293D] text-gray-300'
        }`}>
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* 3. CENTER ARENA: FLOATING TIMER/RESULT INDICATOR & 3D ELLIPTICAL BOWL/PLATE MATCHING REFERENCE */}
      <div className="relative px-2 sm:px-3 pt-1 pb-2 flex flex-col items-center justify-center overflow-hidden max-w-full notranslate" translate="no">
        
        {/* A. FLOATING CIRCULAR BADGE (HOVERS DIRECTLY ABOVE PLATE - MATCHING VIDEO 00:00 - 00:04) */}
        <div className="flex flex-col items-center justify-center mb-1 z-30 notranslate" translate="no">
          <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[#08101E] border-2 border-[#255485] shadow-[0_4px_16px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black font-mono text-yellow-400 leading-none">
              {gameState === 'REVEAL' ? redCount : gameState === 'SHAKING' ? 0 : timeLeft}
            </span>
          </div>
          <span className="mt-1 text-[10px] font-black uppercase tracking-wider text-gray-300">
            {gameState === 'REVEAL' && `${redCount} ĐỎ • ${4 - redCount} TRẮNG`}
            {gameState === 'SHAKING' && 'ĐANG XÓC'}
            {gameState === 'WARNING' && 'SẮP KHÓA CƯỢC'}
            {gameState === 'BETTING' && 'ĐANG NHẬN CƯỢC'}
          </span>
        </div>

        {/* B. 3D PERSPECTIVE ELLIPTICAL PLATE (MATCHING REFERENCE.PNG & VIDEO) */}
        <div 
          className="relative w-64 sm:w-84 h-40 sm:h-48 rounded-[50%] flex items-center justify-center p-2.5 sm:p-3 transition-all"
          style={{
            background: 'radial-gradient(ellipse at center, #263347 0%, #121824 60%, #060911 100%)',
            border: '4px solid #D4AF37',
            boxShadow: '0 18px 40px rgba(0,0,0,0.95), inset 0 2px 6px rgba(255,215,0,0.6), inset 0 -4px 12px rgba(0,0,0,0.95)'
          }}
        >
          {/* Concentric Dashed Gold Accent on Plate */}
          <div className="absolute inset-1 rounded-[50%] border border-dashed border-amber-400/40 pointer-events-none" />

          {/* INNER FELT BED WITH TOKENS (UNDERNEATH) */}
          <div 
            className="w-[88%] h-[84%] rounded-[50%] flex flex-col items-center justify-center relative shadow-inner overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at center, #134B38 0%, #0C3326 65%, #061C14 100%)',
              border: '2px solid #1E5D48'
            }}
          >
            {/* 4 CASINO PIECES/BALLS (SMALLER, CLEAN WITHOUT TEXT, DENOTED STRICTLY BY COLOR, NATURAL STAGGERED ARC) */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 z-10 pt-1">
              {tokens.map((token, i) => {
                // Natural staggered arc offsets matching reference video
                const staggerOffsets = ['translate-y-1', '-translate-y-1.5', 'translate-y-1.5', '-translate-y-0.5'];
                const stagger = staggerOffsets[i % staggerOffsets.length];

                return (
                  <div
                    key={i}
                    className={`w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-full border transform transition-all duration-300 ${stagger} ${
                      token === 'R'
                        ? 'bg-gradient-to-br from-[#FF4D4D] via-[#D31010] to-[#780000] border-[#FF8A8A] shadow-[0_4px_10px_rgba(220,38,38,0.85)]'
                        : 'bg-gradient-to-br from-[#FFFFFF] via-[#F1F5F9] to-[#CBD5E1] border-white shadow-[0_4px_10px_rgba(255,255,255,0.7)]'
                    }`}
                    style={{
                      boxShadow: token === 'R'
                        ? '0 3px 6px rgba(0,0,0,0.65), inset 0 2px 4px rgba(255,255,255,0.85), inset 0 -2px 5px rgba(0,0,0,0.6)'
                        : '0 3px 6px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 5px rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Concentric 3D Spherical Specular Glare (Gives tactile glossy bead depth with zero text) */}
                    <div className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden pointer-events-none">
                      <div className="absolute top-0.5 left-1 w-2.5 h-1.5 rounded-full bg-white/70 blur-[0.4px] transform -rotate-12" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LOWER RESULT PILL (APPEARS DURING REVEAL IN LOWER HALF OF PLATE - MATCHING VIDEO) */}
            {gameState === 'REVEAL' && (
              <div className="mt-2 bg-[#0A101D]/95 border border-yellow-500/80 rounded-full px-4 sm:px-5 py-0.5 sm:py-1 shadow-2xl text-center z-10 animate-fade-in notranslate" translate="no">
                <div className="text-[8px] sm:text-[9px] font-black text-gray-300 uppercase tracking-wider">
                  <span>{redCount} ĐỎ • {4 - redCount} TRẮNG</span>
                </div>
                <div className="text-sm sm:text-base font-black text-yellow-400 tracking-widest leading-none mt-0.5">
                  <span>{isEven ? 'CHẴN' : 'LẺ'}</span>
                </div>
              </div>
            )}
          </div>

          {/* C. THE SCULPTED 3D DOME BOWL (LIFTS UP AND RIGHT TO FULLY CLEAR ALL 4 BALLS MATCHING REFERENCE VIDEO) */}
          <div 
            className={`absolute w-[92%] h-[92%] rounded-[50%] z-20 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ease-out ${
              gameState === 'SHAKING'
                ? 'animate-gentle-tilt-2x'
                : ''
            } ${
              gameState === 'REVEAL'
                ? 'translate-x-[75px] -translate-y-[80px] rotate-[30deg] scale-[0.8] sm:translate-x-[125px] sm:-translate-y-[110px] sm:rotate-[36deg] sm:scale-[0.84] opacity-95'
                : 'translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100'
            }`}
            style={{
              background: 'radial-gradient(ellipse at 40% 22%, #FFF8D6 0%, #F5CE68 22%, #B38217 55%, #593C08 85%, #241602 100%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.95), inset 0 4px 10px rgba(255,255,255,0.7), inset 0 -8px 18px rgba(0,0,0,0.95)',
              border: '4px solid #FCD34D'
            }}
          >
            {/* Specular Light Highlight Ridge */}
            <div className="absolute inset-x-8 top-2.5 h-6 rounded-[50%] border-t-2 border-white/70 pointer-events-none" />
            
            {/* Concentric Golden Ring Accent */}
            <div className="absolute inset-2.5 sm:inset-3.5 rounded-[50%] border border-yellow-300/40 pointer-events-none" />
            
            {/* Authentic Vietnamese "Bát Úp" Inverted Ceramic Foot-Rim on Top of Bowl */}
            <div className="w-16 sm:w-20 h-7 sm:h-9 rounded-[50%] bg-gradient-to-b from-[#E6C364] via-[#C89B32] to-[#805810] border border-[#FFF0A0]/90 shadow-[0_4px_8px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none mb-1">
              <div className="w-12 sm:w-15 h-4 sm:h-5 rounded-[50%] bg-[#5E3C0B] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />
            </div>
          </div>

        </div>

      </div>

      {/* 4. TWO MAIN NEON BETTING CARDS (CHẴN vs LẺ) */}
      <div className="px-2 sm:px-3 py-1 grid grid-cols-2 gap-2 sm:gap-3">
        
        {/* CARD 1: CHẴN (NEON BLUE BORDER - MATCHING REFERENCE.PNG) */}
        <div
          onClick={() => {
            if (gameState === 'BETTING') {
              setSelectedSide('CHẴN');
            }
          }}
          className={`relative rounded-xl p-2.5 sm:p-4 text-center cursor-pointer transition-all active:scale-98 ${
            selectedSide === 'CHẴN'
              ? 'ring-2 ring-yellow-400 shadow-[0_0_25px_rgba(30,107,255,0.7)]'
              : ''
          } ${
            gameState === 'REVEAL' && isEven
              ? 'bg-gradient-to-b from-[#123674] to-[#0A1A38] border-2 border-yellow-400 glow-gold'
              : 'bg-gradient-to-b from-[#0D1F3C]/95 via-[#0A1830]/90 to-[#071120]/95 border-2 border-[#1E6BFF] shadow-[0_0_15px_rgba(30,107,255,0.35)] hover:border-[#4B8BFF]'
          }`}
        >
          {/* Active selection badge */}
          {selectedSide === 'CHẴN' && (
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-yellow-400 text-black p-0.5 rounded-full shadow">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}

          <div className="text-xl sm:text-2xl font-black text-[#2B82FF] tracking-wider drop-shadow-sm">
            CHẴN
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-tight">
            0, 2 HOẶC 4 QUÂN ĐỎ
          </div>

          <div className="text-xs sm:text-sm font-black text-[#FFD043] my-1 sm:my-1.5 flex items-center justify-center gap-1">
            <span>ĂN 1 : 0.96</span>
          </div>

          {/* Live Pool Total */}
          <div className="text-xs sm:text-sm md:text-base font-black text-[#FFC800] font-mono tracking-wide truncate">
            {chanPool.toLocaleString()}
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 truncate">
            {chanBettors} NGƯỜI ĐANG CHỌN
          </div>
        </div>

        {/* CARD 2: LẺ (NEON RED BORDER - MATCHING REFERENCE.PNG) */}
        <div
          onClick={() => {
            if (gameState === 'BETTING') {
              setSelectedSide('LẺ');
            }
          }}
          className={`relative rounded-xl p-2.5 sm:p-4 text-center cursor-pointer transition-all active:scale-98 ${
            selectedSide === 'LẺ'
              ? 'ring-2 ring-yellow-400 shadow-[0_0_25px_rgba(255,43,94,0.7)]'
              : ''
          } ${
            gameState === 'REVEAL' && !isEven
              ? 'bg-gradient-to-b from-[#571223] to-[#2E0B16] border-2 border-yellow-400 glow-gold'
              : 'bg-gradient-to-b from-[#2E0B16]/95 via-[#22070F]/90 to-[#150408]/95 border-2 border-[#FF2B5E] shadow-[0_0_15px_rgba(255,43,94,0.35)] hover:border-[#FF577F]'
          }`}
        >
          {/* Active selection badge */}
          {selectedSide === 'LẺ' && (
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-yellow-400 text-black p-0.5 rounded-full shadow">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}

          <div className="text-xl sm:text-2xl font-black text-[#FF3366] tracking-wider drop-shadow-sm">
            LẺ
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-tight">
            1 HOẶC 3 QUÂN ĐỎ
          </div>

          <div className="text-xs sm:text-sm font-black text-[#FFD043] my-1 sm:my-1.5 flex items-center justify-center gap-1">
            <span>ĂN 1 : 0.96</span>
          </div>

          {/* Live Pool Total */}
          <div className="text-xs sm:text-sm md:text-base font-black text-[#FFC800] font-mono tracking-wide truncate">
            {lePool.toLocaleString()}
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 truncate">
            {leBettors} NGƯỜI ĐANG CHỌN
          </div>
        </div>

      </div>

      {/* 5. LỊCH SỬ KẾT QUẢ (ROADMAP BEAD ROW) */}
      <div className="px-3 py-1.5">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-1">
          LỊCH SỬ KẾT QUẢ
        </div>
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-2 bg-[#0B101D] border border-[#1C263D] rounded-xl">
          {history.map((item, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md shrink-0 ${
                item === 'L'
                  ? 'bg-gradient-to-b from-[#EF4444] to-[#B91C1C] border border-red-300'
                  : 'bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] border border-blue-300'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* 6. CASINO CHIPS & CUSTOM STAKE INPUT CONTROLS */}
      <div className="px-3 py-2 space-y-2.5">
        {/* Custom Bet Stake Input & Multipliers Box */}
        <div className="bg-[#0D1524] rounded-xl p-2.5 border border-[#1E2B45] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Cửa cược:</span>
              <span className="font-black text-yellow-400">{selectedSide || 'Chưa chọn'}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentStake(prev => Math.floor(prev / 2))}
                className="px-2 py-0.5 rounded bg-[#162238] hover:bg-[#1E2E4B] text-[10px] font-bold text-gray-300 border border-gray-700 transition-colors"
                title="Giảm 1 nửa tiền cược"
              >
                1/2
              </button>
              <button
                type="button"
                onClick={() => setCurrentStake(prev => (prev === 0 ? 50000 : prev * 2))}
                className="px-2 py-0.5 rounded bg-[#162238] hover:bg-[#1E2E4B] text-[10px] font-bold text-yellow-400 border border-gray-700 transition-colors"
                title="Gấp đôi tiền cược"
              >
                2X
              </button>
              <button
                type="button"
                onClick={() => setCurrentStake(prev => prev + 100000)}
                className="px-2 py-0.5 rounded bg-[#162238] hover:bg-[#1E2E4B] text-[10px] font-bold text-blue-300 border border-gray-700 transition-colors"
              >
                +100K
              </button>
              <button
                type="button"
                onClick={() => setCurrentStake(1000000)}
                className="px-2 py-0.5 rounded bg-[#162238] hover:bg-[#1E2E4B] text-[10px] font-bold text-emerald-400 border border-gray-700 transition-colors"
                title="Đặt mức tối đa"
              >
                TẤT TAY
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
              placeholder="Nhập số tiền cược tùy ý (VND)..."
              disabled={gameState === 'REVEAL'}
              className="w-full bg-[#070A12] border border-[#23355A] focus:border-yellow-400 rounded-lg py-2 pl-3 pr-14 text-sm font-black text-yellow-300 font-mono tracking-wider outline-none transition-colors"
            />
            <span className="absolute right-3 text-xs font-black text-gray-400 pointer-events-none">
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
              {/* Chip Outer Body */}
              <div 
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${chip.color} border-2 ${chip.border} flex items-center justify-center shadow-lg relative cursor-pointer ${
                  activeChip === chip.value ? `ring-2 ${chip.ring} shadow-[0_0_15px_rgba(255,200,0,0.6)]` : ''
                }`}
              >
                {/* Casino Chip Edge Notches/Stripes */}
                <div className="absolute inset-0.5 rounded-full border border-dashed border-white/40 pointer-events-none"></div>
                
                {/* Chip Center Disc */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 border border-white/30 flex items-center justify-center">
                  <span className="text-[10px] sm:text-[11px] font-black text-white drop-shadow font-mono">
                    {chip.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback alert message if bet placed */}
        {betFeedback && (
          <div className="text-center text-xs font-bold text-yellow-300 bg-yellow-950/60 border border-yellow-500/50 py-1.5 px-3 rounded-lg animate-fade-in">
            {betFeedback}
          </div>
        )}

        {/* Action Buttons: XÓA LỰA CHỌN vs ĐẶT CƯỢC / CHỜ PHIÊN MỚI */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleClearSelection}
            disabled={gameState === 'SHAKING' || gameState === 'REVEAL'}
            className="py-2.5 px-3 rounded-xl bg-[#111A2D] hover:bg-[#1A2846] border border-[#23355A] text-gray-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>XÓA LỰA CHỌN</span>
          </button>

          {gameState === 'BETTING' || gameState === 'WARNING' ? (
            <button
              onClick={handleConfirmBet}
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

      {/* 7. USER STATISTICS BAR (MATCHING REFERENCE.PNG FOOTER STATS) */}
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

      {/* 8. PROMOTIONAL BANNER ("CHƠI HAY, WIN NGAY" - MATCHING REFERENCE.PNG) */}
      <div className="px-3 py-1">
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-[#3B0764] via-[#6D28D9] to-[#9333EA] p-2.5 flex items-center justify-between border border-[#A855F7]/40 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="bg-amber-400 text-purple-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
              HAY CLUB
            </div>
            <div className="text-xs font-black text-white tracking-wider">
              CHƠI HAY, WIN NGAY
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-black text-yellow-300">
            <span>100 TỶ</span>
            <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              LIÊN HOÀN
            </span>
          </div>
        </div>
      </div>

      {/* 9. COLLAPSIBLE GAME RULES ("LUẬT XÓC ĐĨA") */}
      <div className="px-3 py-2 pb-6">
        <div className="bg-[#0B101D] border border-[#1A253C] rounded-xl overflow-hidden">
          <button
            onClick={() => setIsRulesExpanded(!isRulesExpanded)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-1.5 text-yellow-400">
              📜 Luật Xóc Đĩa
            </span>
            {isRulesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isRulesExpanded && (
            <div className="px-3 pb-3 text-[11px] text-gray-400 space-y-1.5 border-t border-gray-800/60 pt-2 leading-relaxed">
              <p>
                • Dùng <strong>4 quân hai mặt</strong>: Đỏ và Trắng. Hệ thống tự xóc, mở bát và công bố kết quả mỗi phiên 30 giây.
              </p>
              <p>
                • <strong>CHẴN</strong>: Kết quả xuất hiện 4 Đỏ, 4 Trắng hoặc 2 Đỏ 2 Trắng (Tỷ lệ ăn 1 : 0.96).
              </p>
              <p>
                • <strong>LẺ</strong>: Kết quả xuất hiện 3 Đỏ 1 Trắng hoặc 3 Trắng 1 Đỏ (Tỷ lệ ăn 1 : 0.96).
              </p>
              <p>
                • Cổng cược tự động khóa ở 5 giây cuối trước khi xóc đĩa.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
