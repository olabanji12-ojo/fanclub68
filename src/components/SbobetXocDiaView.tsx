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
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // A. ROUND SETTLEMENT & TRANSITION TO SHAKING AT 0s
        if (prev <= 1) {
          setGameState('SHAKING');
          
          // Generate new secret outcome
          const newTokens: TokenColor[] = Array.from({ length: 4 }, () => (Math.random() > 0.5 ? 'R' : 'W'));
          const newRedCount = newTokens.filter(t => t === 'R').length;
          const newIsEven = newRedCount % 2 === 0;

          // After 3.5s of shaking -> Reveal the bowl
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

            // After 5s of reveal -> Start new 30s round
            setTimeout(() => {
              setGameState('BETTING');
              setHasPlacedBet(false);
              setPlacedBetSide(null);
              setPlacedBetAmount(0);
              setCurrentStake(0);
              setBetFeedback(null);
              setTimeLeft(30);
            }, 5500);

          }, 3500);

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
  }, [placedBetSide, placedBetAmount]);

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
      
      {/* CSS KEYFRAMES FOR AUTHENTIC BOWL SHAKING & LIFTING */}
      <style>{`
        @keyframes bowlShakeEffect {
          0% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-7px, -4px) rotate(-3deg); }
          20% { transform: translate(7px, 3px) rotate(3deg); }
          30% { transform: translate(-6px, 4px) rotate(-2deg); }
          40% { transform: translate(6px, -3px) rotate(2deg); }
          50% { transform: translate(-8px, -2px) rotate(-3deg); }
          60% { transform: translate(8px, 4px) rotate(3deg); }
          70% { transform: translate(-5px, 2px) rotate(-1.5deg); }
          80% { transform: translate(5px, -3px) rotate(2deg); }
          90% { transform: translate(-3px, 2px) rotate(-1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-bowl-shake {
          animation: bowlShakeEffect 0.35s infinite ease-in-out;
        }
        @keyframes pulseGlowGold {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 200, 0, 0.4); }
          50% { box-shadow: 0 0 30px rgba(255, 200, 0, 0.85); }
        }
        .glow-gold {
          animation: pulseGlowGold 1.5s infinite;
        }
      `}</style>

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
      <div className="px-3 pt-2.5 pb-1">
        <div className={`py-1.5 px-3 rounded-lg border text-center text-xs font-semibold transition-all ${
          gameState === 'WARNING' 
            ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 animate-pulse'
            : gameState === 'SHAKING'
              ? 'bg-red-950/80 border-red-500/80 text-red-300 font-bold'
              : gameState === 'REVEAL'
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold'
                : 'bg-[#101827] border-[#1F293D] text-gray-300'
        }`}>
          {getStatusText()}
        </div>
      </div>

      {/* 3. CENTER CERAMIC SHAKING BOWL & TOKENS REVEAL STAGE */}
      <div className="relative px-3 py-2 flex flex-col items-center justify-center">
        
        {/* INNER GREEN/WHITE CERAMIC BASE PLATE */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-[#1C2433] via-[#0E1524] to-[#080D17] border-4 border-[#C9983E]/70 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center p-4">
          
          {/* Outer Decorative Gold Ring */}
          <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#FFC800]/30 pointer-events-none"></div>

          {/* INNER FELT WITH 4 TOKENS (ALWAYS PRESENT UNDERNEATH) */}
          <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-[#0F392B] to-[#082219] border-2 border-[#1B5E4B] shadow-inner flex flex-col items-center justify-center p-3 relative">
            
            {/* 4 Dual-Sided Tokens (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3 z-0">
              {tokens.map((token, i) => (
                <div
                  key={i}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 shadow-lg flex items-center justify-center font-black text-xs transition-all transform ${
                    token === 'R'
                      ? 'bg-gradient-to-br from-[#FF2B2B] via-[#D31010] to-[#800606] border-white/90 text-white shadow-[0_2px_8px_rgba(255,40,40,0.6)]'
                      : 'bg-gradient-to-br from-[#FFFFFF] via-[#F3F4F6] to-[#D1D5DB] border-gray-400 text-gray-800 shadow-[0_2px_8px_rgba(255,255,255,0.4)]'
                  }`}
                >
                  <span className="drop-shadow-sm font-black">
                    {token === 'R' ? 'ĐỎ' : 'TRẮNG'}
                  </span>
                </div>
              ))}
            </div>

            {/* Floating Outcome Result Pill (Appears during REVEAL) */}
            {gameState === 'REVEAL' && (
              <div className="absolute inset-x-2 -bottom-3 bg-[#0A101D]/95 border-2 border-yellow-400 rounded-xl px-3 py-1 shadow-2xl text-center z-30 animate-bounce">
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-wide">
                  {redCount} ĐỎ • {4 - redCount} TRẮNG
                </div>
                <div className="text-base font-black text-yellow-400 tracking-wider">
                  {isEven ? 'CHẴN' : 'LẺ'}
                </div>
              </div>
            )}
          </div>

          {/* THE 3D CERAMIC METALLIC BOWL (COVERS THE TOKENS) */}
          <div 
            className={`absolute inset-3 rounded-full transition-all duration-700 ease-out z-20 flex flex-col items-center justify-center ${
              gameState === 'SHAKING'
                ? 'animate-bowl-shake'
                : gameState === 'REVEAL'
                  ? 'translate-x-16 -translate-y-12 rotate-12 opacity-80 pointer-events-none scale-95'
                  : 'translate-x-0 translate-y-0 rotate-0 opacity-100'
            }`}
            style={{
              background: 'radial-gradient(circle at 35% 35%, #7D5C2C 0%, #3D2910 45%, #1F1406 85%, #0A0602 100%)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.85), inset 0 2px 6px rgba(255,215,0,0.5), inset 0 -4px 10px rgba(0,0,0,0.9)'
            }}
          >
            {/* Sculpted Outer Gold Rim */}
            <div className="absolute inset-1 rounded-full border-4 border-[#E5A84B]/70 shadow-inner"></div>
            <div className="absolute inset-3 rounded-full border border-yellow-500/30"></div>

            {/* Bowl Center Countdown Dial (Only visible when bowl is closed) */}
            {gameState !== 'REVEAL' && (
              <div className="relative flex flex-col items-center justify-center">
                {/* Circular Progress Ring */}
                <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                  gameState === 'WARNING'
                    ? 'border-yellow-400 bg-yellow-950/60 shadow-[0_0_18px_rgba(250,204,21,0.8)] animate-pulse'
                    : gameState === 'SHAKING'
                      ? 'border-red-500 bg-red-950/80 shadow-[0_0_20px_rgba(239,68,68,0.9)]'
                      : 'border-yellow-500/80 bg-black/50 shadow-lg'
                }`}>
                  <span className="text-xl sm:text-2xl font-black font-mono text-yellow-300 leading-none">
                    {gameState === 'SHAKING' ? '0' : timeLeft}
                  </span>
                </div>

                {/* Status Sub-badge */}
                <span className={`mt-1.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                  gameState === 'WARNING'
                    ? 'bg-amber-500 text-black font-bold animate-bounce'
                    : gameState === 'SHAKING'
                      ? 'bg-red-600 text-white font-black animate-pulse'
                      : 'text-yellow-200/90'
                }`}>
                  {gameState === 'WARNING' ? 'SẮP KHÓA CƯỢC' : gameState === 'SHAKING' ? 'ĐANG XÓC' : 'ĐANG NHẬN CƯỢC'}
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 4. TWO MAIN NEON BETTING CARDS (CHẴN vs LẺ) */}
      <div className="px-3 py-1 grid grid-cols-2 gap-2.5 sm:gap-3">
        
        {/* CARD 1: CHẴN (NEON BLUE BORDER - MATCHING REFERENCE.PNG) */}
        <div
          onClick={() => {
            if (gameState === 'BETTING') {
              setSelectedSide('CHẴN');
            }
          }}
          className={`relative rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all active:scale-98 ${
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
            <div className="absolute top-2 right-2 bg-yellow-400 text-black p-0.5 rounded-full shadow">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}

          <div className="text-xl sm:text-2xl font-black text-[#2B82FF] tracking-wider drop-shadow-sm">
            CHẴN
          </div>
          <div className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-tight">
            0, 2 HOẶC 4 QUÂN ĐỎ
          </div>

          <div className="text-xs sm:text-sm font-black text-[#FFD043] my-1.5 flex items-center justify-center gap-1">
            <span>ĂN 1 : 0.96</span>
          </div>

          {/* Live Pool Total */}
          <div className="text-sm sm:text-base font-black text-[#FFC800] font-mono tracking-wide">
            {chanPool.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 font-medium mt-0.5">
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
          className={`relative rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all active:scale-98 ${
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
            <div className="absolute top-2 right-2 bg-yellow-400 text-black p-0.5 rounded-full shadow">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}

          <div className="text-xl sm:text-2xl font-black text-[#FF3366] tracking-wider drop-shadow-sm">
            LẺ
          </div>
          <div className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-tight">
            1 HOẶC 3 QUÂN ĐỎ
          </div>

          <div className="text-xs sm:text-sm font-black text-[#FFD043] my-1.5 flex items-center justify-center gap-1">
            <span>ĂN 1 : 0.96</span>
          </div>

          {/* Live Pool Total */}
          <div className="text-sm sm:text-base font-black text-[#FFC800] font-mono tracking-wide">
            {lePool.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 font-medium mt-0.5">
            {leBettors} NGƯỜI ĐANG CHỌN
          </div>
        </div>

      </div>

      {/* 5. LỊCH SỬ KẾT QUẢ (ROADMAP BEAD ROW) */}
      <div className="px-3 py-1.5">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-1">
          LỊCH SỬ KẾT QUẢ
        </div>
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-2 bg-[#0B101D] border border-[#1C263D] rounded-xl">
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

      {/* 6. CASINO CHIPS SELECTION & WAGER CONTROLS (CIRCLED IN RED IN REFERENCE.PNG) */}
      <div className="px-3 py-2 space-y-2">
        {/* Status: Cửa đã chọn & Điểm cược */}
        <div className="flex items-center justify-between text-xs px-2 py-1 bg-[#0D1524] rounded-lg border border-[#1E2B45]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Cửa:</span>
            <span className="font-black text-yellow-400">
              {selectedSide ? selectedSide : 'Chưa chọn'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Điểm cược:</span>
            <span className="font-mono font-black text-yellow-300">
              {currentStake.toLocaleString()}
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
