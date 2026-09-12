import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Swords,
  ShieldAlert,
  Globe,
  Clock,
  ChevronDown,
  Lock,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  AlertOctagon,
  Play
} from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';
import { SbobetScorecardRoadmap } from './SbobetScorecardRoadmap';
import { ApiService } from '../services/api';

interface ArenaInfo {
  id: string;
  name: string;
  location: string;
  status: 'BETTING_OPEN' | 'GATE_LOCKED' | 'FIGHTING' | 'SETTLING';
  meronOdds: number;
  walaOdds: number;
  bddOdds: number;
  timeRemainingSeconds: number;
  streamUrl: string;
  currentMatch: number;
}

const DEFAULT_ARENAS: ArenaInfo[] = [
  { id: 'CPC1', name: 'Thomo CPC1 VIP Arena', location: 'Campuchia', status: 'BETTING_OPEN', meronOdds: 0.88, walaOdds: 0.96, bddOdds: 8.00, timeRemainingSeconds: 28, streamUrl: '', currentMatch: 42 },
  { id: 'CPC2', name: 'Thomo CPC2 Grand Arena', location: 'Campuchia', status: 'BETTING_OPEN', meronOdds: 0.85, walaOdds: 0.98, bddOdds: 8.00, timeRemainingSeconds: 19, streamUrl: '', currentMatch: 35 },
  { id: 'CPC3', name: 'Thomo CPC3 Iron Spur', location: 'Campuchia', status: 'BETTING_OPEN', meronOdds: 0.90, walaOdds: 0.92, bddOdds: 8.00, timeRemainingSeconds: 34, streamUrl: '', currentMatch: 28 },
  { id: 'CPC4', name: 'Thomo CPC4 Derby', location: 'Campuchia', status: 'BETTING_OPEN', meronOdds: 0.86, walaOdds: 0.95, bddOdds: 8.00, timeRemainingSeconds: 12, streamUrl: '', currentMatch: 19 },
  { id: 'PH1', name: 'Pasay City PH1 Colosseum', location: 'Philippines', status: 'BETTING_OPEN', meronOdds: 0.89, walaOdds: 0.94, bddOdds: 8.00, timeRemainingSeconds: 22, streamUrl: '', currentMatch: 50 },
  { id: 'PH2', name: 'Davao PH2 Cockpit Arena', location: 'Philippines', status: 'BETTING_OPEN', meronOdds: 0.87, walaOdds: 0.97, bddOdds: 8.00, timeRemainingSeconds: 15, streamUrl: '', currentMatch: 44 },
  { id: 'PH3', name: 'Cebu PH3 Live Cockpit', location: 'Philippines', status: 'BETTING_OPEN', meronOdds: 0.91, walaOdds: 0.91, bddOdds: 8.00, timeRemainingSeconds: 38, streamUrl: '', currentMatch: 31 },
];

interface ArenaMatchStream {
  round: number;
  playUrl: string;
  name: string;
}

const ARENA_MATCHES: Record<string, ArenaMatchStream[]> = {
  CPC1: [
    { round: 1, playUrl: 'https://player.videosv388.com/?play=a254ad13-c625-4dfe-bf75-50beb9db8967', name: 'Trận 1 (Thomo CPC1)' },
    { round: 2, playUrl: 'https://player.videosv388.com/?play=54119d80-ba88-46c0-acb4-06589027db5d', name: 'Trận 2 (Thomo CPC1)' },
    { round: 3, playUrl: 'https://player.videosv388.com/?play=9258d9b1-816c-4990-bb9d-342b717e9ea6', name: 'Trận 3 (Thomo CPC1)' },
    { round: 4, playUrl: 'https://player.videosv388.com/?play=0de89302-2ad7-4f02-ae63-83ce3c78f22a', name: 'Trận 4 (Thomo CPC1)' },
  ],
  CPC2: [
    { round: 1, playUrl: 'https://player.videosv388.com/?play=0de89302-2ad7-4f02-ae63-83ce3c78f22a', name: 'Trận 1 (Thomo CPC2)' },
    { round: 2, playUrl: 'https://player.videosv388.com/?play=f59dd1ea-5880-4c7f-8f0c-23ea2f2bc6ea', name: 'Trận 2 (Thomo CPC2)' },
    { round: 3, playUrl: 'https://player.videosv388.com/?play=62a2c246-ceb5-4a7b-91f2-6a549f7b4d02', name: 'Trận 3 (Thomo CPC2)' },
    { round: 4, playUrl: 'https://player.videosv388.com/?play=b7b736e2-fb20-4653-9f02-9eace2f4289f', name: 'Trận 4 (Thomo CPC2)' },
    { round: 5, playUrl: 'https://player.videosv388.com/?play=e9c51fae-6b79-4cbd-9792-b154abb1d9d0', name: 'Trận 5 (Thomo CPC2)' },
  ],
  CPC3: [
    { round: 1, playUrl: 'https://player.videosv388.com/?play=c14547a2-b7fd-4ea6-8ddc-995ef8d6a782', name: 'Trận 1 (Thomo CPC3)' },
    { round: 2, playUrl: 'https://player.videosv388.com/?play=6556ea54-8448-46e4-9244-b832677e6967', name: 'Trận 2 (Thomo CPC3)' },
    { round: 3, playUrl: 'https://player.videosv388.com/?play=b18e6293-cf3a-4f17-b353-6b361e9bc055', name: 'Trận 3 (Thomo CPC3)' },
  ],
  CPC4: [
    { round: 1, playUrl: 'https://player.videosv388.com/?play=8fe9b578-8bd6-4197-90ae-1f9ea6fc1a3a', name: 'Trận 1 (Thomo CPC4)' },
    { round: 2, playUrl: 'https://player.videosv388.com/?play=2ed5512c-3026-4489-a3bb-84c2b2b4dbf2', name: 'Trận 2 (Thomo CPC4)' },
  ],
  PH1: [
    { round: 1, playUrl: 'https://player.videosv388.com/?play=9e08a521-b9a0-44a1-8452-5d224bbfe64f', name: 'Trận 1 (Pasay Colosseum)' },
    { round: 2, playUrl: 'https://player.videosv388.com/?play=ec701903-2715-41f1-a843-87b0762341a8', name: 'Trận 2 (Pasay Colosseum)' },
  ],
  PH2: [
    { round: 1, playUrl: 'https://player.videosv388.com/?play=98238cef-89ca-4216-a29d-3d0e8c348216', name: 'Trận 1 (Davao Cockpit)' },
    { round: 2, playUrl: 'https://player.videosv388.com/?play=a254ad13-c625-4dfe-bf75-50beb9db8967', name: 'Trận 2 (Davao Cockpit)' },
  ],
  PH3: [
    { round: 1, playUrl: 'https://player.videosv388.com/?play=0de89302-2ad7-4f02-ae63-83ce3c78f22a', name: 'Trận 1 (Cebu Live)' },
    { round: 2, playUrl: 'https://player.videosv388.com/?play=54119d80-ba88-46c0-acb4-06589027db5d', name: 'Trận 2 (Cebu Live)' },
  ]
};

const ARENA_YOUTUBE_STREAMS: Record<string, string> = {
  CPC1: 'gkW4a0awqZU',
  CPC2: 'mAEbl-oJ6bQ',
  CPC3: 'YlFAY7ONdcQ',
  CPC4: 'pPUHtor817s',
  PH1: 'gkW4a0awqZU',
  PH2: 'mAEbl-oJ6bQ',
  PH3: 'YlFAY7ONdcQ'
};

export const SbobetCockfightView: React.FC = () => {
  const { setCurrentView, addSelection, language, setLanguage, user, depositBalance } = useSbobetStore();
  const t = translations[language];

  const arenaKeys = ['CPC1', 'CPC2', 'CPC3', 'CPC4', 'PH1', 'PH2', 'PH3'];
  const [activeArena, setActiveArena] = useState<string>('CPC1');
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [arenasData, setArenasData] = useState<ArenaInfo[]>(DEFAULT_ARENAS);
  const [viewMode, setViewMode] = useState<'video' | 'radar'>('video');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedStake, setSelectedStake] = useState<number>(100);
  const [betFeedback, setBetFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Arena Data
  const currentArena = arenasData.find(a => a.id === activeArena) || arenasData[0];
  const isGateLocked = currentArena.status === 'GATE_LOCKED' || currentArena.status === 'FIGHTING' || currentArena.timeRemainingSeconds <= 3;

  // Soi Cầu history for current arena (M: Meron, W: Wala, B: BDD)
  const history: ('M' | 'W' | 'B')[] = ['M', 'W', 'M', 'M', 'W', 'B', 'M', 'W', 'W', 'M', 'M', 'W', 'M', 'M', 'W'];

  // 1. Fetch live backend arenas every 2 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchArenas = async () => {
      try {
        const res = await ApiService.getCockfightArenas();
        if (isMounted && res.data && res.data.arenas && res.data.arenas.length > 0) {
          setArenasData(res.data.arenas);
        }
      } catch (err) {
        // Fallback gracefully to autonomous local clock
      }
    };

    fetchArenas();
    const interval = setInterval(fetchArenas, 2000);

    // Smooth local second countdown ticker
    const ticker = setInterval(() => {
      setArenasData(prev => prev.map(a => {
        let newSec = a.timeRemainingSeconds - 1;
        let newStatus = a.status;

        if (newSec <= 3 && a.status === 'BETTING_OPEN') {
          newStatus = 'GATE_LOCKED';
        }

        if (newSec <= 0) {
          if (a.status === 'GATE_LOCKED') {
            newStatus = 'FIGHTING';
            newSec = 25;
          } else if (a.status === 'FIGHTING') {
            newStatus = 'SETTLING';
            newSec = 5;
          } else {
            newStatus = 'BETTING_OPEN';
            newSec = 35;
          }
        }
        return {
          ...a,
          timeRemainingSeconds: Math.max(0, newSec),
          status: newStatus
        };
      }));
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(ticker);
    };
  }, []);

  // 2. High-Performance HTML5 Cockfight Arena Video Stream Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    // Arena fighter physics simulation
    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Dark Broadcast Arena Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a0d14');
      bgGrad.addColorStop(0.5, '#161b26');
      bgGrad.addColorStop(1, '#0e121a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Arena Sand Ring Pit (Perspective Oval)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.65, w * 0.42, h * 0.28, 0, 0, Math.PI * 2);
      const sandGrad = ctx.createRadialGradient(w / 2, h * 0.65, 10, w / 2, h * 0.65, w * 0.42);
      sandGrad.addColorStop(0, '#c29b63');
      sandGrad.addColorStop(0.7, '#8f6834');
      sandGrad.addColorStop(1, '#543b1c');
      ctx.fillStyle = sandGrad;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#dfba7f';
      ctx.stroke();
      ctx.restore();

      // Stadium Overhead Spotlight Beam
      ctx.save();
      const spotGrad = ctx.createRadialGradient(w / 2, h * 0.6, 20, w / 2, h * 0.6, w * 0.35);
      spotGrad.addColorStop(0, 'rgba(255, 255, 230, 0.25)');
      spotGrad.addColorStop(1, 'rgba(255, 255, 230, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.6, w * 0.35, h * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dynamic Fighter Roosters Positioning
      const isFighting = currentArena.status === 'FIGHTING';
      const bounce = Math.sin(frame * 0.12) * (isFighting ? 14 : 4);
      const lunge = isFighting ? Math.cos(frame * 0.2) * 25 : Math.sin(frame * 0.05) * 8;

      // Meron (Red Cock) Position
      const meronX = w * 0.38 + lunge;
      const meronY = h * 0.63 - Math.abs(bounce);

      // Wala (Blue Cock) Position
      const walaX = w * 0.62 - lunge;
      const walaY = h * 0.63 - Math.abs(Math.cos(frame * 0.12) * (isFighting ? 14 : 4));

      // Shadows
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(meronX, h * 0.68, 22, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(walaX, h * 0.68, 22, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw Meron (Red Fighter)
      ctx.save();
      ctx.translate(meronX, meronY);
      // Red body
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 16, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Comb
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(14, -14, 6, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(12, -8, 8, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(19, -8);
      ctx.lineTo(27, -5);
      ctx.lineTo(19, -2);
      ctx.closePath();
      ctx.fill();
      // Tail Feathers (Gold & Dark Red)
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-18, -4);
      ctx.quadraticCurveTo(-35, -20 + bounce * 0.5, -28, -28);
      ctx.stroke();
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-16, 2);
      ctx.quadraticCurveTo(-38, -10 + bounce * 0.5, -32, -18);
      ctx.stroke();
      // Spur
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(4, 12);
      ctx.lineTo(8, 20);
      ctx.stroke();
      ctx.restore();

      // Draw Wala (Blue Fighter)
      ctx.save();
      ctx.translate(walaX, walaY);
      // Blue body
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Comb
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-14, -14, 6, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#1e40af';
      ctx.beginPath();
      ctx.arc(-12, -8, 8, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-19, -8);
      ctx.lineTo(-27, -5);
      ctx.lineTo(-19, -2);
      ctx.closePath();
      ctx.fill();
      // Tail Feathers (Cyan & Navy)
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(18, -4);
      ctx.quadraticCurveTo(35, -20 + bounce * 0.5, 28, -28);
      ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(16, 2);
      ctx.quadraticCurveTo(38, -10 + bounce * 0.5, 32, -18);
      ctx.stroke();
      // Spur
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-4, 12);
      ctx.lineTo(-8, 20);
      ctx.stroke();
      ctx.restore();

      // Fighting Clashing Sparks / Dust effect when fighting
      if (isFighting && frame % 4 === 0) {
        ctx.fillStyle = 'rgba(255, 220, 150, 0.8)';
        ctx.beginPath();
        ctx.arc((meronX + walaX) / 2 + (Math.random() - 0.5) * 20, h * 0.6 + (Math.random() - 0.5) * 20, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Authentic SV388 Broadcast Scanlines & Vignette
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1.5);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeArena, currentArena.status]);

  // Anti-Vét 3-Second Verification & Wallet Balance Deduction
  const handlePlaceCockfightBet = (side: 'MERON' | 'WALA' | 'BDD', odds: number) => {
    setBetFeedback(null);

    // 1. Strict Anti-Vét Gate Lock Enforced
    if (isGateLocked) {
      setBetFeedback({
        text: 'CỔNG CƯỢC ĐÃ KHÓA: Trọng tài đã thả gà / khóa sổ (Anti-Vét 3s Gate Lock)',
        isError: true
      });
      return;
    }

    // 2. Validate user balance
    if (user && user.balance < selectedStake) {
      setBetFeedback({
        text: 'Số dư ví không đủ để đặt cược!',
        isError: true
      });
      return;
    }

    // 3. Immediate Wallet Balance Deduction
    depositBalance(-selectedStake);

    // 4. Dispatch bet to backend API & slip
    ApiService.placeCockfightBet(activeArena, side, selectedStake).then(({ data, error }) => {
      if (error && !data) {
        setBetFeedback({
          text: error,
          isError: true
        });
        return;
      }
      setBetFeedback({
        text: `Đã chấp nhận cược ${side} bồ ${activeArena} (-$${selectedStake.toFixed(2)})!`,
        isError: false
      });
    });

    // Also register into user bet slip
    addSelection({
      matchId: `cockfight-${activeArena}-${Date.now()}`,
      matchName: `Đá Gà SV388 [${activeArena}] - Trận #${currentArena.currentMatch}`,
      marketName: 'Kèo Trực Tiếp',
      selectionName: side === 'MERON' ? 'Meron (Gà Đỏ)' : side === 'WALA' ? 'Wala (Gà Xanh)' : 'BDD (Hòa)',
      odds,
      stake: selectedStake
    });

    setTimeout(() => {
      setBetFeedback(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 font-sans flex flex-col w-full max-w-full overflow-x-hidden">
      {/* 1. SBOBET ROYAL BLUE HEADER */}
      <header className="bg-[#0B4DA2] text-white shadow-md sticky top-0 z-40 w-full">
        <div className="flex items-center justify-between px-2.5 sm:px-3 py-2 border-b border-[#0A3E82]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('sbobet')}
              className="p-1 hover:bg-[#08356E] rounded text-white flex items-center gap-1 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Thể Thao</span>
            </button>
            <div className="flex items-center gap-1 ml-1 cursor-pointer" onClick={() => setCurrentView('sbobet')}>
              <span className="text-yellow-400 text-sm font-black">3</span>
              <span className="text-base font-black italic tracking-tight">SBOBET</span>
              <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded ml-1 uppercase shadow-xs">
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

            {/* User Wallet Balance */}
            <div className="bg-[#08356E] px-2.5 py-1 rounded text-right border border-[#165AB8] shadow-xs">
              <div className="text-[9px] text-blue-200 uppercase font-semibold leading-none">Số dư ví</div>
              <div className="text-xs font-black text-yellow-300 font-mono">
                ${user?.balance.toFixed(2) || '1,000.00'}
              </div>
            </div>
          </div>
        </div>

        {/* TITLE BAR */}
        <div className="bg-[#0A438D] px-2.5 sm:px-3 py-1.5 flex items-center justify-between text-xs font-bold text-white gap-2">
          <div className="flex items-center gap-1.5 text-red-300 min-w-0">
            <Swords className="w-4 h-4 text-red-400 shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">ĐÁ GÀ SV388 (7 BỒ ĐẤU LIVE THOMO & PASAY)</span>
          </div>
          <button
            onClick={() => setCurrentView('sbobet')}
            className="text-[10px] sm:text-[11px] text-yellow-300 hover:underline flex items-center gap-1 font-bold shrink-0 whitespace-nowrap"
          >
            ← Về Sảnh Thể Thao
          </button>
        </div>
      </header>

      {/* 2. 7-ARENA RESPONSIVE TAB BAR */}
      <div className="bg-[#0A2A54] border-b-2 border-[#082245] px-2 py-1.5 flex items-center gap-1.5 w-full shadow-inner overflow-x-auto no-scrollbar">
        {arenaKeys.map((arenaId) => {
          const arenaObj = arenasData.find(a => a.id === arenaId);
          const isArenaLocked = arenaObj && (arenaObj.status === 'GATE_LOCKED' || arenaObj.status === 'FIGHTING' || arenaObj.timeRemainingSeconds <= 3);

          return (
            <button
              key={arenaId}
              onClick={() => { setActiveArena(arenaId); setSelectedRound(1); setBetFeedback(null); }}
              className={`flex-1 min-w-[44px] py-1.5 sm:py-2 px-1 rounded-md text-[11px] sm:text-xs font-black text-center transition-all whitespace-nowrap shrink-0 relative ${activeArena === arenaId
                ? 'bg-[#C0392B] text-white shadow-md border border-red-300 ring-1 ring-red-400'
                : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/10'
                }`}
            >
              <span>{arenaId}</span>
              {isArenaLocked && (
                <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full ring-1 ring-black" title="Khóa cược" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. MAIN COCKFIGHT ARENA VIEWPORT & BETTING BOARD */}
      <main className="flex-1 p-2 sm:p-3 space-y-2.5 sm:space-y-3 overflow-y-auto max-w-4xl mx-auto w-full overflow-x-hidden">

        {/* VIDEO VIEWPORT CONTAINER WITH BROADCAST HUD */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md w-full max-w-full">
          {/* Responsive Header of Video Box */}
          <div className="p-2 sm:p-2.5 bg-[#FAFAFA] border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold gap-2">
            <div className="flex items-center gap-1.5 text-red-600 min-w-0">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
              <span className="truncate text-[11px] sm:text-xs font-black uppercase">
                BỒ {activeArena} • {currentArena.name} ({currentArena.location})
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
              {/* Camera Switcher: SV388 Video Feed vs 3D Arena Radar */}
              <div className="flex items-center bg-gray-200/80 p-0.5 rounded-md border border-gray-300 text-[9px] sm:text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('video')}
                  className={`px-1.5 sm:px-2 py-0.5 rounded transition-all flex items-center gap-1 ${viewMode === 'video' ? 'bg-[#0B4DA2] text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  title="Xem luồng phát sóng video SV388 trực tiếp"
                >
                  <span>🎥 SV388 Feed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('radar')}
                  className={`px-1.5 sm:px-2 py-0.5 rounded transition-all flex items-center gap-1 ${viewMode === 'radar' ? 'bg-[#0B4DA2] text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  title="Xem mô phỏng sàn đấu 3D Radar"
                >
                  <span>🎯 3D Radar</span>
                </button>
              </div>

              {/* Play / Pause Toggle Button */}
              {viewMode === 'video' && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${isPlaying ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    }`}
                  title={isPlaying ? 'Tạm dừng video' : 'Bật phát video'}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isPlaying ? 'Tạm Dừng' : 'Phát Video'}</span>
                </button>
              )}

              <button
                onClick={() => setIsAudioActive(!isAudioActive)}
                className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                title={isAudioActive ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-blue-600" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${isGateLocked
                ? 'bg-red-100 border border-red-300 text-red-700 animate-pulse'
                : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                }`}>
                {isGateLocked ? <Lock className="w-3 h-3 text-red-600" /> : <ShieldAlert className="w-3 h-3 text-emerald-600" />}
                <span>{isGateLocked ? 'CỔNG KHÓA 3S' : `MỞ: ${currentArena.timeRemainingSeconds}s`}</span>
              </div>
            </div>
          </div>

          {/* SV388 Match Round Selector Bar */}
          {viewMode === 'video' && (
            <div className="bg-[#0A2A54] text-white px-2.5 py-1.5 flex items-center gap-2 border-b border-[#082245] overflow-x-auto no-scrollbar w-full max-w-full">
              <div className="flex items-center gap-1 shrink-0 text-yellow-300 font-bold text-[10px]">
                <span>Trận đấu hôm nay:</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(ARENA_MATCHES[activeArena] || ARENA_MATCHES['CPC2']).map((m) => (
                  <button
                    key={m.round}
                    type="button"
                    onClick={() => { setSelectedRound(m.round); setIsPlaying(true); }}
                    className={`px-2 py-0.5 rounded text-[10px] font-black transition-all shrink-0 ${selectedRound === m.round
                      ? 'bg-[#FFC800] text-black shadow-xs font-black'
                      : 'bg-white/15 text-gray-200 hover:bg-white/25'
                      }`}
                  >
                    Trận #{m.round}
                  </button>
                ))}
              </div>
              <div className="shrink-0 text-[9px] text-gray-400 font-mono hidden md:block ml-auto">
                Feed: player.videosv388.com
              </div>
            </div>
          )}

          {/* Active Live Video Stream or 3D Canvas with Full Broadcast HUD Overlay */}
          <div className="relative aspect-video bg-black overflow-hidden select-none w-full max-w-full">
            {viewMode === 'video' ? (
              <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
                {(() => {
                  const matchStreams = ARENA_MATCHES[activeArena] || ARENA_MATCHES['CPC2'];
                  const currentMatch = matchStreams.find(m => m.round === selectedRound) || matchStreams[0];
                  return (
                    <iframe
                      key={`${activeArena}-${currentMatch.playUrl}`}
                      src={currentMatch.playUrl}
                      title={`SV388 Cockfight Live Player ${activeArena} Trận ${currentMatch.round}`}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                      referrerPolicy="no-referrer"
                      allowFullScreen
                    />
                  );
                })()}

                {/* Big Prominent Center Play Button Overlay */}
                {!isPlaying && (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer z-20 transition-all hover:bg-black/50 group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-2xl ring-4 ring-white/40 group-hover:scale-110 transition-transform duration-200">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
                    </div>
                    <div className="mt-3 flex flex-col items-center gap-1">
                      <span className="text-white font-black text-xs sm:text-sm tracking-wider uppercase bg-black/80 px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                        ▶ PHÁT VIDEO TRẬN ĐẤU
                      </span>
                      <span className="text-gray-300 text-[10px] font-semibold">
                        Bấm để bắt đầu xem video SV388
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-cover block"
              />
            )}

            {/* Live Broadcast HUD - Top Left (pointer-events-none so video is 100% clickable) */}
            <div className="absolute top-2.5 left-3 flex items-center gap-2 pointer-events-none z-10">
              <div className="flex items-center gap-1 bg-red-600/90 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-black shadow-xs">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>TRỰC TIẾP</span>
              </div>
              <div className="bg-black/60 backdrop-blur-xs text-gray-200 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                1080P • 60FPS
              </div>
            </div>

            {/* Live Broadcast HUD - Top Right Match & Round Info */}
            <div className="absolute top-2.5 right-3 flex items-center gap-2 pointer-events-none z-10">
              <div className="bg-yellow-500/90 text-black px-2 py-0.5 rounded text-[10px] font-black shadow-xs font-mono">
                TRẬN #{currentArena.currentMatch}
              </div>
            </div>

            {/* Corner Indicators Inside Broadcast */}
            <div className="absolute bottom-10 left-3 bg-red-700/85 backdrop-blur text-white px-2.5 py-1 rounded-md text-[10px] font-black border border-red-500/50 shadow-md pointer-events-none z-10">
              🔴 MERON: @{currentArena.meronOdds.toFixed(2)}
            </div>
            <div className="absolute bottom-10 right-3 bg-blue-700/85 backdrop-blur text-white px-2.5 py-1 rounded-md text-[10px] font-black border border-blue-500/50 shadow-md pointer-events-none z-10">
              🔵 WALA: @{currentArena.walaOdds.toFixed(2)}
            </div>

            {/* Bottom Stream Status Bar (Unobtrusive & Non-blocking) */}
            <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-between text-[10px] sm:text-[11px] bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 text-gray-200 pointer-events-none z-10">
              <span className="font-semibold">Bồ: {currentArena.name}</span>
              <span className="font-mono text-yellow-400 font-bold">
                {currentArena.status === 'FIGHTING' ? 'GÀ ĐANG THẢ ĐẤU' : currentArena.status === 'GATE_LOCKED' ? 'KHÓA CỔNG TRỌNG TÀI (ANTI-VÉT)' : `ĐẾM NGƯỢC: ${currentArena.timeRemainingSeconds}s`}
              </span>
            </div>
          </div>
        </div>

        {/* Stake Quick Selection */}
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-gray-700 shrink-0">
            <span>Tiền cược (Điểm):</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 flex-1 max-w-xs">
            {[50, 100, 200, 300].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setSelectedStake(val)}
                className={`py-1 text-xs font-bold rounded-md border transition-all text-center ${selectedStake === val ? 'bg-[#0B4DA2] text-white border-[#0B4DA2] shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Bet Feedback Alert */}
        {betFeedback && (
          <div className={`p-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${betFeedback.isError ? 'bg-red-100 border border-red-300 text-red-800' : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
            }`}>
            {betFeedback.isError ? <AlertOctagon className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{betFeedback.text}</span>
          </div>
        )}

        {/* 4. BETTING BOARD: MERON (RED) / BDD (DRAW) / WALA (BLUE) */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* MERON (RED COCK) */}
          <button
            onClick={() => handlePlaceCockfightBet('MERON', currentArena.meronOdds)}
            disabled={isGateLocked}
            className={`p-3 sm:p-4 rounded-xl border-2 shadow-xs transition-all flex flex-col justify-between h-full min-h-[105px] ${isGateLocked
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-white border-red-500 hover:bg-red-50 text-gray-900 active:scale-98'
              }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] sm:text-[11px] uppercase font-black text-red-600 tracking-wider">MERON</span>
              {isGateLocked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
            </div>
            <div className="text-xl sm:text-2xl font-black text-red-700 my-0.5">
              {currentArena.meronOdds.toFixed(2)}
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">
              Gà Đỏ Chấp (Ăn {Math.round(selectedStake * currentArena.meronOdds)} pts)
            </div>
          </button>

          {/* BDD (DRAW) */}
          <button
            onClick={() => handlePlaceCockfightBet('BDD', currentArena.bddOdds)}
            disabled={isGateLocked}
            className={`p-3 sm:p-4 rounded-xl border-2 shadow-xs transition-all flex flex-col justify-between h-full min-h-[105px] ${isGateLocked
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-white border-emerald-500 hover:bg-emerald-50 text-gray-900 active:scale-98'
              }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] sm:text-[11px] uppercase font-black text-emerald-600 tracking-wider">BDD (HÒA)</span>
              {isGateLocked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 my-0.5">
              1 : {currentArena.bddOdds}
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">
              Hòa 1 Ăn 8 ({selectedStake * 8} pts)
            </div>
          </button>

          {/* WALA (BLUE COCK) */}
          <button
            onClick={() => handlePlaceCockfightBet('WALA', currentArena.walaOdds)}
            disabled={isGateLocked}
            className={`p-3 sm:p-4 rounded-xl border-2 shadow-xs transition-all flex flex-col justify-between h-full min-h-[105px] ${isGateLocked
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-white border-[#0B4DA2] hover:bg-blue-50 text-gray-900 active:scale-98'
              }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] sm:text-[11px] uppercase font-black text-[#0B4DA2] tracking-wider">WALA</span>
              {isGateLocked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0B4DA2] my-0.5">
              {currentArena.walaOdds.toFixed(2)}
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">
              Gà Xanh (Ăn {Math.round(selectedStake * currentArena.walaOdds)} pts)
            </div>
          </button>
        </div>

        {/* 5. ROADMAP / BẢNG SOI CẦU BỒ ĐẤU (AUTHENTIC 6-ROW SV388 MATRIX) */}
        <SbobetScorecardRoadmap
          title={`BẢNG SOI CẦU BỒ ${activeArena}`}
          gameType="cockfight"
          items={history.map((res, idx) => ({
            round: idx + 1,
            result: res,
            detail: res === 'M' ? 'Meron (Gà Đỏ) Thắng KO' : res === 'W' ? 'Wala (Gà Xanh) Thắng' : 'BDD (Hòa 1 Ăn 8)'
          }))}
          rows={6}
        />

      </main>
    </div>
  );
};