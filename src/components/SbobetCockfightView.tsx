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
  Play,
  Scale,
  Settings,
  Tv,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';
import { SbobetScorecardRoadmap } from './SbobetScorecardRoadmap';
import { ApiService, API_BASE_URL } from '../services/api';
import { SbobetLiveStreamPlayer, StreamSource } from './SbobetLiveStreamPlayer';

export interface RoosterProfile {
  breed: string;
  weightKg: number;
  spurType: string;
  record: string;
  tag: string;
}

export interface ArenaInfo {
  id: string;
  name: string;
  location: string;
  isOpen: boolean;
  operatingHours: string;
  status: 'BETTING_OPEN' | 'GATE_LOCKED' | 'FIGHTING' | 'SETTLING' | 'WEIGHING' | 'CLOSED';
  phase: 'CLOSED' | 'WEIGHING' | 'BETTING_OPEN' | 'GATE_LOCKED' | 'FIGHTING' | 'SETTLING';
  meronOdds: number;
  walaOdds: number;
  bddOdds: number;
  timeRemainingSeconds: number;
  streamUrl: string;
  currentMatch: number;
  meronRooster?: RoosterProfile;
  walaRooster?: RoosterProfile;
  customStreamUrl?: string;
}

const DEFAULT_ARENAS: ArenaInfo[] = [
  {
    id: 'CPC1',
    name: 'Thomo CPC1 VIP Arena',
    location: 'Campuchia',
    isOpen: true,
    operatingHours: '11:00 AM – 17:00 PM (GMT+7)',
    status: 'WEIGHING',
    phase: 'WEIGHING',
    meronOdds: 0.88,
    walaOdds: 0.96,
    bddOdds: 8.00,
    timeRemainingSeconds: 520,
    streamUrl: '',
    currentMatch: 42,
    meronRooster: { breed: 'Gà Asil Rặc', weightKg: 3.25, spurType: 'Cựa Sắt Tròn Thomo', record: '8W - 1L', tag: 'M-#4210' },
    walaRooster: { breed: 'Gà Tre Mỹ', weightKg: 3.20, spurType: 'Cựa Sắt Tròn Thomo', record: '6W - 2L', tag: 'W-#4211' }
  },
  {
    id: 'CPC2',
    name: 'Thomo CPC2 Grand Arena',
    location: 'Campuchia',
    isOpen: true,
    operatingHours: '11:00 AM – 17:00 PM (GMT+7)',
    status: 'BETTING_OPEN',
    phase: 'BETTING_OPEN',
    meronOdds: 0.85,
    walaOdds: 0.98,
    bddOdds: 8.00,
    timeRemainingSeconds: 45,
    streamUrl: '',
    currentMatch: 35,
    meronRooster: { breed: 'Gà Peru Lai', weightKg: 3.10, spurType: 'Cựa Tháp Sắt', record: '9W - 0L', tag: 'M-#3504' },
    walaRooster: { breed: 'Gà Kelso', weightKg: 3.12, spurType: 'Cựa Tháp Sắt', record: '7W - 1L', tag: 'W-#3505' }
  },
  {
    id: 'CPC3',
    name: 'Thomo CPC3 Iron Spur',
    location: 'Campuchia',
    isOpen: true,
    operatingHours: '11:00 AM – 17:00 PM (GMT+7)',
    status: 'WEIGHING',
    phase: 'WEIGHING',
    meronOdds: 0.90,
    walaOdds: 0.92,
    bddOdds: 8.00,
    timeRemainingSeconds: 480,
    streamUrl: '',
    currentMatch: 28,
    meronRooster: { breed: 'Gà Sweater', weightKg: 2.95, spurType: 'Cựa Tròn 2.5 Inch', record: '5W - 1L', tag: 'M-#2802' },
    walaRooster: { breed: 'Gà Cuban', weightKg: 2.98, spurType: 'Cựa Tròn 2.5 Inch', record: '6W - 3L', tag: 'W-#2803' }
  },
  {
    id: 'CPC4',
    name: 'Thomo CPC4 Derby',
    location: 'Campuchia',
    isOpen: true,
    operatingHours: '11:00 AM – 17:00 PM (GMT+7)',
    status: 'BETTING_OPEN',
    phase: 'BETTING_OPEN',
    meronOdds: 0.86,
    walaOdds: 0.95,
    bddOdds: 8.00,
    timeRemainingSeconds: 30,
    streamUrl: '',
    currentMatch: 19,
    meronRooster: { breed: 'Gà Asil Derby', weightKg: 3.05, spurType: 'Cựa Sắt Tròn Thomo', record: '4W - 0L', tag: 'M-#1901' },
    walaRooster: { breed: 'Gà Tre Chuối', weightKg: 3.02, spurType: 'Cựa Sắt Tròn Thomo', record: '5W - 1L', tag: 'W-#1902' }
  },
  {
    id: 'PH1',
    name: 'Pasay City PH1 Colosseum',
    location: 'Philippines',
    isOpen: true,
    operatingHours: '14:00 PM – 02:00 AM (GMT+7)',
    status: 'WEIGHING',
    phase: 'WEIGHING',
    meronOdds: 0.89,
    walaOdds: 0.94,
    bddOdds: 8.00,
    timeRemainingSeconds: 560,
    streamUrl: '',
    currentMatch: 50,
    meronRooster: { breed: 'Gà Hatch Slasher', weightKg: 2.85, spurType: 'Cựa Dao Slasher', record: '12W - 2L', tag: 'M-#5001' },
    walaRooster: { breed: 'Gà Roundhead', weightKg: 2.88, spurType: 'Cựa Dao Slasher', record: '10W - 1L', tag: 'W-#5002' }
  },
  {
    id: 'PH2',
    name: 'Davao PH2 Cockpit Arena',
    location: 'Philippines',
    isOpen: true,
    operatingHours: '14:00 PM – 02:00 AM (GMT+7)',
    status: 'BETTING_OPEN',
    phase: 'BETTING_OPEN',
    meronOdds: 0.87,
    walaOdds: 0.97,
    bddOdds: 8.00,
    timeRemainingSeconds: 22,
    streamUrl: '',
    currentMatch: 44,
    meronRooster: { breed: 'Gà Kelso Davao', weightKg: 2.92, spurType: 'Cựa Dao Double Blade', record: '8W - 3L', tag: 'M-#4401' },
    walaRooster: { breed: 'Gà Albany', weightKg: 2.95, spurType: 'Cựa Dao Double Blade', record: '7W - 2L', tag: 'W-#4402' }
  },
  {
    id: 'PH3',
    name: 'Cebu PH3 Live Cockpit',
    location: 'Philippines',
    isOpen: true,
    operatingHours: '14:00 PM – 02:00 AM (GMT+7)',
    status: 'WEIGHING',
    phase: 'WEIGHING',
    meronOdds: 0.91,
    walaOdds: 0.91,
    bddOdds: 8.00,
    timeRemainingSeconds: 420,
    streamUrl: '',
    currentMatch: 31,
    meronRooster: { breed: 'Gà Dan Gray', weightKg: 2.89, spurType: 'Cựa Dao Cebu Slasher', record: '5W - 2L', tag: 'M-#3101' },
    walaRooster: { breed: 'Gà Butcher', weightKg: 2.91, spurType: 'Cựa Dao Cebu Slasher', record: '6W - 1L', tag: 'W-#3102' }
  },
];

interface ActiveCockfightBet {
  id: string;
  arenaId: string;
  match: number;
  side: 'MERON' | 'WALA' | 'BDD';
  stake: number;
  odds: number;
}

const STREAM_PRESETS: Record<string, StreamSource[]> = {
  CPC1: [
    { id: 'sv388_cpc1_r1', name: 'SV388 Thomo CPC1 VIP (Trận 1)', url: 'https://player.videosv388.com/?play=a254ad13-c625-4dfe-bf75-50beb9db8967', type: 'iframe' },
    { id: 'sv388_cpc1_r2', name: 'SV388 Thomo CPC1 VIP (Trận 2)', url: 'https://player.videosv388.com/?play=54119d80-ba88-46c0-acb4-06589027db5d', type: 'iframe' },
    { id: 'sv388_cpc1_r3', name: 'SV388 Thomo CPC1 VIP (Trận 3)', url: 'https://player.videosv388.com/?play=9258d9b1-816c-4990-bb9d-342b717e9ea6', type: 'iframe' },
  ],
  CPC2: [
    { id: 'sv388_cpc2_r1', name: 'Thomo CPC2 Grand Arena (Trận 1)', url: 'https://player.videosv388.com/?play=0de89302-2ad7-4f02-ae63-83ce3c78f22a', type: 'iframe' },
    { id: 'sv388_cpc2_r2', name: 'Thomo CPC2 Grand Arena (Trận 2)', url: 'https://player.videosv388.com/?play=f59dd1ea-5880-4c7f-8f0c-23ea2f2bc6ea', type: 'iframe' },
    { id: 'sv388_cpc2_r3', name: 'Thomo CPC2 Grand Arena (Trận 3)', url: 'https://player.videosv388.com/?play=62a2c246-ceb5-4a7b-91f2-6a549f7b4d02', type: 'iframe' },
  ],
  CPC3: [
    { id: 'sv388_cpc3_r1', name: 'Thomo CPC3 Iron Spur (Trận 1)', url: 'https://player.videosv388.com/?play=c14547a2-b7fd-4ea6-8ddc-995ef8d6a782', type: 'iframe' },
    { id: 'sv388_cpc3_r2', name: 'Thomo CPC3 Iron Spur (Trận 2)', url: 'https://player.videosv388.com/?play=6556ea54-8448-46e4-9244-b832677e6967', type: 'iframe' },
  ],
  CPC4: [
    { id: 'sv388_cpc4_r1', name: 'Thomo CPC4 Derby (Trận 1)', url: 'https://player.videosv388.com/?play=8fe9b578-8bd6-4197-90ae-1f9ea6fc1a3a', type: 'iframe' },
    { id: 'sv388_cpc4_r2', name: 'Thomo CPC4 Derby (Trận 2)', url: 'https://player.videosv388.com/?play=2ed5512c-3026-4489-a3bb-84c2b2b4dbf2', type: 'iframe' },
  ],
  PH1: [
    { id: 'pasay_ph1_r1', name: 'Pasay Colosseum Sabong (Trận 1)', url: 'https://player.videosv388.com/?play=9e08a521-b9a0-44a1-8452-5d224bbfe64f', type: 'iframe' },
    { id: 'pasay_ph1_r2', name: 'Pasay Colosseum Sabong (Trận 2)', url: 'https://player.videosv388.com/?play=ec701903-2715-41f1-a843-87b0762341a8', type: 'iframe' },
  ],
  PH2: [
    { id: 'davao_ph2_r1', name: 'Davao Cockpit Arena (Trận 1)', url: 'https://player.videosv388.com/?play=98238cef-89ca-4216-a29d-3d0e8c348216', type: 'iframe' },
    { id: 'davao_ph2_r2', name: 'Davao Cockpit Arena (Trận 2)', url: 'https://player.videosv388.com/?play=a254ad13-c625-4dfe-bf75-50beb9db8967', type: 'iframe' },
  ],
  PH3: [
    { id: 'cebu_ph3_r1', name: 'Cebu Live Cockpit (Trận 1)', url: 'https://player.videosv388.com/?play=0de89302-2ad7-4f02-ae63-83ce3c78f22a', type: 'iframe' },
    { id: 'cebu_ph3_r2', name: 'Cebu Live Cockpit (Trận 2)', url: 'https://player.videosv388.com/?play=54119d80-ba88-46c0-acb4-06589027db5d', type: 'iframe' },
  ]
};

const TEACHING_FALLBACK_SOURCES = [
  {
    id: 'sv388_live_direct',
    name: 'SV388 Direct Live Player (Pasay/Thomo)',
    url: 'https://player.videosv388.com/?play=a254ad13-c625-4dfe-bf75-50beb9db8967',
    type: 'iframe' as const,
    badge: 'Đang Hoạt Động / Live 60FPS'
  },
  {
    id: 'fallback_hls',
    name: 'Source 2: Mux Live Stream (HLS 60FPS Backup)',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'hls' as const,
    badge: 'Native 60FPS HLS'
  },
  {
    id: 'source1',
    name: 'Source 3: ga6789.com (Thomo Center)',
    url: 'https://ga6789.com',
    type: 'proxy_iframe' as const,
    badge: 'Thomo Center'
  },
  {
    id: 'source2',
    name: 'Source 4: bj988.com (Pasay Center)',
    url: 'https://bj988.com/vn/vn',
    type: 'proxy_iframe' as const,
    badge: 'Pasay Center'
  },
  {
    id: 'source3',
    name: 'Source 5: daga88.net (Backup Feed)',
    url: 'https://daga88.net',
    type: 'proxy_iframe' as const,
    badge: 'Backup Feed'
  }
];

export const SbobetCockfightView: React.FC = () => {
  const { setCurrentView, addSelection, language, setLanguage, user, depositBalance } = useSbobetStore();
  const t = translations[language];

  const arenaKeys = ['CPC1', 'CPC2', 'CPC3', 'CPC4', 'PH1', 'PH2', 'PH3'];
  const [activeArena, setActiveArena] = useState<string>('CPC1');
  const [arenasData, setArenasData] = useState<ArenaInfo[]>(DEFAULT_ARENAS);
  const [selectedStake, setSelectedStake] = useState<number>(100);
  const [betFeedback, setBetFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState<boolean>(false);
  const [customStreamInput, setCustomStreamInput] = useState<string>('');
  const [selectedPresetSourceId, setSelectedPresetSourceId] = useState<string>('source1');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [classroomSpeed, setClassroomSpeed] = useState<boolean>(true);
  const [isFailoverActive, setIsFailoverActive] = useState<boolean>(false);
  const [activeSourceInfo, setActiveSourceInfo] = useState<{ name: string; status: string }>({
    name: 'ga6789.com (Thomo Center)',
    status: 'ONLINE'
  });

  // Active Stream Source
  const [activeStreamSource, setActiveStreamSource] = useState<StreamSource>(
    STREAM_PRESETS['CPC1'][0]
  );


  // Active Arena Data
  const currentArena = arenasData.find(a => a.id === activeArena) || arenasData[0];
  const isGateLocked =
    currentArena.phase === 'GATE_LOCKED' ||
    currentArena.phase === 'FIGHTING' ||
    currentArena.phase === 'CLOSED' ||
    (currentArena.phase === 'BETTING_OPEN' && currentArena.timeRemainingSeconds <= 3);

  // Active user bets
  const [activeBets, setActiveBets] = useState<ActiveCockfightBet[]>([]);
  const activeBetsRef = useRef<ActiveCockfightBet[]>(activeBets);
  activeBetsRef.current = activeBets;

  const settledMatchesRef = useRef<Set<string>>(new Set());

  // Dynamic Soi Cầu history for all 7 arenas (M: Meron, W: Wala, B: BDD)
  const [arenaHistories, setArenaHistories] = useState<Record<string, ('M' | 'W' | 'B')[]>>({
    CPC1: ['M', 'W', 'M', 'M', 'W', 'B', 'M', 'W', 'W', 'M', 'M', 'W', 'M', 'M', 'W'],
    CPC2: ['W', 'W', 'M', 'W', 'M', 'M', 'W', 'W', 'B', 'W', 'M', 'W', 'M', 'W'],
    CPC3: ['M', 'M', 'W', 'M', 'W', 'W', 'M', 'M', 'W', 'B', 'M', 'W', 'M'],
    CPC4: ['W', 'M', 'W', 'M', 'M', 'W', 'W', 'M', 'W', 'M', 'B', 'W'],
    PH1: ['M', 'W', 'M', 'B', 'M', 'W', 'W', 'M', 'M', 'W', 'M', 'W', 'M'],
    PH2: ['W', 'M', 'W', 'W', 'M', 'M', 'B', 'W', 'M', 'W', 'M', 'W'],
    PH3: ['M', 'M', 'W', 'W', 'M', 'W', 'M', 'B', 'M', 'W', 'W', 'M']
  });

  const history = arenaHistories[activeArena] || ['M', 'W', 'M', 'W'];

  // Auto-advance stream source when arena or match changes (100% Hands-Free)
  useEffect(() => {
    const presets = STREAM_PRESETS[activeArena] || STREAM_PRESETS['CPC1'];
    if (presets && presets.length > 0) {
      const matchIdx = Math.abs((currentArena.currentMatch - 1) % presets.length);
      setActiveStreamSource(presets[matchIdx]);
    }
  }, [activeArena, currentArena.currentMatch]);

  // Settle bets and award payouts on match conclusion
  const settleArenaMatch = (arenaId: string, matchNum: number) => {
    const key = `${arenaId}-${matchNum}`;
    if (settledMatchesRef.current.has(key)) return;
    settledMatchesRef.current.add(key);

    const rand = Math.random();
    const winner: 'MERON' | 'WALA' | 'BDD' = rand < 0.47 ? 'MERON' : (rand < 0.94 ? 'WALA' : 'BDD');
    const winnerCode: 'M' | 'W' | 'B' = winner === 'MERON' ? 'M' : (winner === 'WALA' ? 'W' : 'B');

    // Update arena roadmap
    setArenaHistories(prev => {
      const cur = prev[arenaId] || ['M', 'W'];
      return {
        ...prev,
        [arenaId]: [...cur.slice(-29), winnerCode]
      };
    });

    // Settle user bets
    const pendingBets = activeBetsRef.current.filter(b => b.arenaId === arenaId && b.match === matchNum);
    if (pendingBets.length > 0) {
      pendingBets.forEach(bet => {
        if (bet.side === winner) {
          const winPayout = Math.round(bet.stake * (1 + bet.odds) * 100) / 100;
          depositBalance(winPayout);
          setBetFeedback({
            text: `🎉 Bồ ${arenaId} Trận #${matchNum}: ${winner} THẮNG! Bạn nhận +$${winPayout.toFixed(2)} (+${winPayout} pts)`,
            isError: false
          });
        } else {
          setBetFeedback({
            text: `Trận #${matchNum} bồ ${arenaId}: ${winner} thắng. Rất tiếc bạn chưa trúng (-$${bet.stake.toFixed(2)}).`,
            isError: true
          });
        }
      });
      setActiveBets(prev => prev.filter(b => !(b.arenaId === arenaId && b.match === matchNum)));
    }
  };

  // Fetch live backend arenas every 2 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchArenas = async () => {
      try {
        const res = await ApiService.getCockfightArenas();
        if (isMounted && res.data && res.data.arenas && res.data.arenas.length > 0) {
          res.data.arenas.forEach((arena: ArenaInfo) => {
            if (arena.phase === 'SETTLING' || arena.status === 'SETTLING') {
              settleArenaMatch(arena.id, arena.currentMatch);
            }
          });
          setArenasData(res.data.arenas);
        }
      } catch (err) {
        // Fallback locally
      }
    };

    fetchArenas();
    const interval = setInterval(fetchArenas, 2000);

    // Smooth client second countdown
    const ticker = setInterval(() => {
      setArenasData(prev => prev.map(a => {
        let newSec = a.timeRemainingSeconds - 1;
        let newPhase = a.phase || a.status;
        let nextMatch = a.currentMatch;

        if (newSec <= 3 && newPhase === 'BETTING_OPEN') {
          newPhase = 'GATE_LOCKED';
        }

        if (newSec <= 0) {
          if (newPhase === 'WEIGHING') {
            newPhase = 'BETTING_OPEN';
            newSec = classroomSpeed ? 40 : 120;
          } else if (newPhase === 'GATE_LOCKED' || newPhase === 'BETTING_OPEN') {
            newPhase = 'FIGHTING';
            newSec = classroomSpeed ? 25 : 90;
          } else if (newPhase === 'FIGHTING') {
            newPhase = 'SETTLING';
            newSec = classroomSpeed ? 8 : 20;
            settleArenaMatch(a.id, a.currentMatch);
          } else {
            newPhase = 'WEIGHING';
            newSec = classroomSpeed ? 50 : 600;
            nextMatch = a.currentMatch + 1;
          }
        }
        return {
          ...a,
          timeRemainingSeconds: Math.max(0, newSec),
          phase: newPhase,
          status: newPhase as any,
          currentMatch: nextMatch
        };
      }));
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(ticker);
    };
  }, [classroomSpeed]);

  // Real-time Student Synchronization & Line 2 Failover Listener
  useEffect(() => {
    let isMounted = true;
    const syncActiveStream = async () => {
      try {
        const base = API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://game-bet-backend.onrender.com');
        const res = await fetch(`${base}/api/stream/active-source`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.activeSource) {
            setActiveSourceInfo({
              name: data.activeSource.name,
              status: data.activeSource.status
            });
            setIsFailoverActive(data.index > 0);
          }
        }
      } catch {
        // Offline mode
      }
    };

    syncActiveStream();
    const streamSyncInterval = setInterval(syncActiveStream, 3000);
    return () => {
      isMounted = false;
      clearInterval(streamSyncInterval);
    };
  }, []);

  // Handle Preset Source Selection from the 3 Dropdown Choices
  const handleSelectPresetSource = async (sourceId: string) => {
    setSelectedPresetSourceId(sourceId);
    setValidationError(null);
    const found = TEACHING_FALLBACK_SOURCES.find(s => s.id === sourceId);
    if (!found) return;

    setActiveStreamSource({
      id: found.id,
      name: found.name,
      url: found.url,
      type: found.type
    });

    setCustomStreamInput(found.url);

    try {
      const base = API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://game-bet-backend.onrender.com');
      await fetch(`${base}/api/stream/active-source`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      });
    } catch {
      // Offline fallback
    }
  };

  // Handle Custom URL injection with strict video verification
  const handleApplyCustomStream = async () => {
    setValidationError(null);
    if (!customStreamInput.trim()) return;
    const url = customStreamInput.trim();

    const isHls = url.endsWith('.m3u8') || url.includes('m3u8');
    const isDirectMp4 = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ts');
    const isEmbedPlayer =
      url.includes('player.videosv388.com') ||
      url.includes('youtube.com/embed') ||
      url.includes('youtu.be') ||
      url.includes('twitch.tv') ||
      url.includes('vimeo.com') ||
      url.includes('ga6789.com') ||
      url.includes('bj988.com') ||
      url.includes('daga88');

    if (!isHls && !isDirectMp4 && !isEmbedPlayer) {
      setValidationError('⚠️ URL này là trang web thông thường, không phải luồng video trực tiếp (.m3u8, .mp4 hoặc cổng video được hỗ trợ). Vui lòng chọn 1 trong các nguồn chuẩn bên dưới hoặc nhập link .m3u8.');
      return;
    }

    const isDirectEmbedPlayer =
      url.includes('player.videosv388.com') ||
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('vimeo.com') ||
      url.includes('twitch.tv');

    const isProxyIframe = !isHls && !isDirectMp4 && !isDirectEmbedPlayer && (url.includes('bj988') || url.includes('sv388') || url.includes('ga6789') || url.includes('daga88'));

    setActiveStreamSource({
      id: `custom-${Date.now()}`,
      name: `Luồng: ${url.substring(0, 32)}...`,
      url,
      type: isHls ? 'hls' : isDirectMp4 ? 'mp4' : isProxyIframe ? 'proxy_iframe' : 'iframe'
    });

    try {
      const base = API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://game-bet-backend.onrender.com');
      await fetch(`${base}/api/stream/active-source`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customUrl: url })
      });
    } catch {
      // Offline fallback
    }

    setIsInstructorModalOpen(false);
  };


  // Toggle Classroom vs Real-Time speed
  const handleToggleClassroomMode = async (enabled: boolean) => {
    setClassroomSpeed(enabled);
    try {
      const base = API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://game-bet-backend.onrender.com');
      await fetch(`${base}/api/stream/configure-arena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classroomMode: enabled })
      });
    } catch {
      // Offline fallback
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Anti-Vét 3-Second Verification & Hard Cap
  const handlePlaceCockfightBet = (side: 'MERON' | 'WALA' | 'BDD', odds: number) => {
    setBetFeedback(null);

    if (isGateLocked) {
      setBetFeedback({
        text: currentArena.phase === 'WEIGHING'
          ? 'Đang giai đoạn Ghép gà & Cân ký (Chưa mở cổng cược).'
          : 'CỔNG CƯỢC ĐÃ KHÓA: Trọng tài thả gà (Anti-Vét 3s Gate Lock)',
        isError: true
      });
      return;
    }

    if (selectedStake <= 0 || selectedStake > 300) {
      setBetFeedback({
        text: 'Điểm cược phải từ 1 đến 300 điểm!',
        isError: true
      });
      return;
    }

    if (user && user.balance < selectedStake) {
      setBetFeedback({
        text: 'Số dư ví không đủ để đặt cược!',
        isError: true
      });
      return;
    }

    depositBalance(-selectedStake);

    const betRecord: ActiveCockfightBet = {
      id: `${activeArena}-${currentArena.currentMatch}-${side}-${Date.now()}`,
      arenaId: activeArena,
      match: currentArena.currentMatch,
      side,
      stake: selectedStake,
      odds
    };
    setActiveBets(prev => [...prev, betRecord]);

    ApiService.placeCockfightBet(activeArena, side, selectedStake).then(({ data, error }) => {
      if (error && !data) {
        setBetFeedback({ text: error, isError: true });
        return;
      }
      setBetFeedback({
        text: `Đã cược ${side} Bồ ${activeArena} Trận #${currentArena.currentMatch} (-$${selectedStake.toFixed(2)})!`,
        isError: false
      });
    });

    addSelection({
      matchId: `cockfight-${activeArena}-${currentArena.currentMatch}`,
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
      <header className="bg-[#0B4DA2] text-white shadow-md sticky top-0 z-40 w-full max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-[#0A3E82] gap-1">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <button
              onClick={() => setCurrentView('sbobet')}
              className="p-1 hover:bg-[#08356E] rounded text-white flex items-center gap-1 text-xs font-bold transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Thể Thao</span>
            </button>
            <div className="flex items-center gap-1 cursor-pointer min-w-0" onClick={() => setCurrentView('sbobet')}>
              <span className="text-yellow-400 text-sm font-black shrink-0">3</span>
              <span className="text-base font-black italic tracking-tight shrink-0">SBOBET</span>
              <span className="text-[9px] sm:text-[10px] bg-red-600 text-white font-bold px-1 sm:px-1.5 py-0.5 rounded uppercase shadow-xs shrink-0">
                SV388 / BJ988
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Instructor Stream & Teaching Control */}
            <button
              onClick={() => setIsInstructorModalOpen(true)}
              className="flex items-center gap-1 bg-amber-600/90 hover:bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold shadow-xs transition"
              title="Cài đặt luồng video & tốc độ giảng dạy"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">📡 Kênh Live & Giảng Dạy</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 bg-[#08356E] px-1.5 sm:px-2 py-1 rounded text-xs text-white border border-[#165AB8]"
              >
                <Globe className="w-3 h-3 text-[#A8CEFC]" />
                <span className="font-semibold hidden sm:inline">{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                <span className="font-semibold sm:hidden">{language.toUpperCase()}</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
            <div className="bg-[#08356E] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-right border border-[#165AB8] shadow-xs">
              <div className="text-[8px] sm:text-[9px] text-blue-200 uppercase font-semibold leading-none">Ví Điểm</div>
              <div className="text-[11px] sm:text-xs font-black text-yellow-300 font-mono">
                ${user?.balance.toFixed(2) || '1,000.00'}
              </div>
            </div>
          </div>
        </div>

        {/* TITLE BAR & OPERATING HOURS BANNER */}
        <div className="bg-[#0A438D] px-2 sm:px-3 py-1 flex items-center justify-between text-[11px] font-bold text-white gap-2">
          <div className="flex items-center gap-1.5 text-amber-300 min-w-0">
            <Swords className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate uppercase font-black">
              SỚI THOMO & PHILIPPINES ({currentArena.operatingHours})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono">
              {classroomSpeed ? '⚡ Chế độ Giảng Dạy' : '🕒 Lịch Trình Thực Tế (15m)'}
            </span>
          </div>
        </div>
      </header>

      {/* 2. 7-ARENA RESPONSIVE TAB BAR */}
      <div className="bg-[#0A2A54] border-b-2 border-[#082245] px-1 sm:px-2 py-1.5 flex items-center gap-1 sm:gap-1.5 w-full shadow-inner overflow-x-auto">
        {arenaKeys.map((arenaId) => {
          const arenaObj = arenasData.find(a => a.id === arenaId);
          const isArenaLocked = arenaObj && (arenaObj.phase === 'GATE_LOCKED' || arenaObj.phase === 'FIGHTING' || arenaObj.phase === 'CLOSED');

          return (
            <button
              key={arenaId}
              onClick={() => { setActiveArena(arenaId); setBetFeedback(null); }}
              className={`flex-1 py-1.5 px-1 sm:px-2 rounded text-[11px] sm:text-xs font-black text-center transition-all whitespace-nowrap relative ${activeArena === arenaId
                ? 'bg-[#C0392B] text-white shadow-md border border-red-300 ring-1 ring-red-400'
                : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/10'
                }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span>{arenaId}</span>
                {arenaId.startsWith('CPC') ? <span className="text-[9px] text-amber-300 opacity-80">KH</span> : <span className="text-[9px] text-cyan-300 opacity-80">PH</span>}
              </div>
              {isArenaLocked && (
                <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full ring-1 ring-black" title="Khóa cược" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. MAIN COCKFIGHT ARENA VIEWPORT & BETTING BOARD */}
      <main className="flex-1 p-2 sm:p-3 space-y-2.5 sm:space-y-3 overflow-y-auto max-w-4xl mx-auto w-full overflow-x-hidden min-w-0">

        {/* LIVE STREAM VIDEO HUB PLAYER */}
        <div className="space-y-2">
          {/* Stream Preset Quick Buttons */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-amber-400 font-bold text-[11px] shrink-0 flex items-center gap-1">
                <Tv className="w-3.5 h-3.5" /> Luồng:
              </span>
              {(STREAM_PRESETS[activeArena] || STREAM_PRESETS['CPC1']).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setActiveStreamSource(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition ${
                    activeStreamSource.id === preset.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsInstructorModalOpen(true)}
              className="text-[10px] text-amber-300 hover:text-amber-200 underline font-bold shrink-0 ml-2"
            >
              + Nhập Link
            </button>
          </div>

          {/* Video Player Component */}
          <SbobetLiveStreamPlayer
            streamSource={activeStreamSource}
            arenaName={currentArena.name}
            matchNumber={currentArena.currentMatch}
            phase={currentArena.phase}
            isGateLocked={isGateLocked}
            failoverActive={isFailoverActive}
            activeSourceInfo={activeSourceInfo}
            onRefresh={() => setActiveStreamSource({ ...activeStreamSource })}
            onSwitchToTestStream={() => handleSelectPresetSource('fallback_hls')}
          />

          {/* PERSISTENT DISCLOSURE REQUIREMENT — INDEPENDENT VIDEO LAYER & SIMULATED BETTING ROUND */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-lg px-3 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-amber-200 gap-1 shadow-inner">
            <div className="flex items-center gap-1.5 font-bold text-[10.5px] sm:text-[11px]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              <span>🔴 Live Broadcast Feed (Independent) — Betting Round Timer Below (Simulated)</span>
            </div>
            <span className="text-[10px] text-amber-400/90 font-mono font-bold shrink-0">
              Ví Điểm Thực Hành / Virtual Points
            </span>
          </div>
        </div>

        {/* ROOSTER WEIGHING & MATCHMAKING PROFILE CARDS (AUTHENTIC 10-15M PREP) */}
        <div className="bg-white rounded-xl border border-gray-200 p-2.5 sm:p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
            <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs uppercase">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>HỒ SƠ CÂN KÝ & GHÉP CẶP TRẬN #{currentArena.currentMatch}</span>
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
              currentArena.phase === 'WEIGHING'
                ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                : currentArena.phase === 'BETTING_OPEN'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {currentArena.phase === 'WEIGHING'
                ? `⚖️ ĐANG CÂN KÝ (${formatTime(currentArena.timeRemainingSeconds)})`
                : currentArena.phase === 'BETTING_OPEN'
                ? `🟢 MỞ CƯỢC: ${currentArena.timeRemainingSeconds}s`
                : '🔒 ĐÃ KHÓA CỔNG'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* MERON ROOSTER CARD */}
            <div className="bg-red-50/70 border border-red-200 rounded-lg p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-red-700 uppercase tracking-wider text-[11px]">🔴 MERON (GÀ ĐỎ)</span>
                <span className="font-mono text-[10px] bg-red-200/80 text-red-900 px-1.5 py-0.2 rounded font-bold">
                  {currentArena.meronRooster?.tag || 'M-#421'}
                </span>
              </div>
              <div className="space-y-0.5 text-[11px] text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Giống gà:</span>
                  <span className="font-bold text-gray-900">{currentArena.meronRooster?.breed || 'Gà Asil'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cân nặng (Ký):</span>
                  <span className="font-black text-red-600">{currentArena.meronRooster?.weightKg.toFixed(2) || '3.20'} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Loại cựa:</span>
                  <span className="font-semibold text-gray-800">{currentArena.meronRooster?.spurType || 'Cựa Sắt'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Thành tích:</span>
                  <span className="font-bold text-emerald-700">{currentArena.meronRooster?.record || '7W - 1L'}</span>
                </div>
              </div>
            </div>

            {/* WALA ROOSTER CARD */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-[#0B4DA2] uppercase tracking-wider text-[11px]">🔵 WALA (GÀ XANH)</span>
                <span className="font-mono text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded font-bold">
                  {currentArena.walaRooster?.tag || 'W-#422'}
                </span>
              </div>
              <div className="space-y-0.5 text-[11px] text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Giống gà:</span>
                  <span className="font-bold text-gray-900">{currentArena.walaRooster?.breed || 'Gà Mỹ Tre'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cân nặng (Ký):</span>
                  <span className="font-black text-blue-600">{currentArena.walaRooster?.weightKg.toFixed(2) || '3.18'} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Loại cựa:</span>
                  <span className="font-semibold text-gray-800">{currentArena.walaRooster?.spurType || 'Cựa Sắt'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Thành tích:</span>
                  <span className="font-bold text-emerald-700">{currentArena.walaRooster?.record || '6W - 2L'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stake Quick Selection with Multipliers & Custom Input */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <div className="flex items-center gap-1.5">
              <span>Tiền cược (Điểm):</span>
              <span className="text-[#0B4DA2] font-black">{selectedStake} pts</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedStake(prev => Math.min(300, (prev === 0 ? 50 : prev * 2)))}
                className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-blue-700 border border-gray-300 transition-colors"
              >
                2X
              </button>
              <button
                type="button"
                onClick={() => setSelectedStake(prev => Math.min(300, prev + 50))}
                className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-amber-700 border border-gray-300 transition-colors"
              >
                +50
              </button>
              <button
                type="button"
                onClick={() => setSelectedStake(Math.min(300, Math.floor(user?.balance || 300)))}
                className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-emerald-700 border border-gray-300 transition-colors"
              >
                TẤT TAY
              </button>
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              inputMode="numeric"
              value={selectedStake > 0 ? selectedStake.toString() : ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                const val = raw ? parseInt(raw, 10) : 0;
                setSelectedStake(Math.min(300, val));
              }}
              placeholder="Nhập số điểm cược (pts)..."
              disabled={isGateLocked}
              className="w-full bg-gray-50 border border-gray-300 focus:border-[#0B4DA2] rounded-lg py-1.5 sm:py-2 pl-3 pr-12 text-sm font-black text-[#0B4DA2] font-mono tracking-wider outline-none shadow-2xs transition-colors"
            />
            <span className="absolute right-3 text-xs font-black text-gray-400 pointer-events-none">
              pts
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
            {[25, 50, 100, 200, 300].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setSelectedStake(val)}
                className={`py-1 text-xs font-bold rounded-md border transition-all text-center ${
                  selectedStake === val ? 'bg-[#0B4DA2] text-white border-[#0B4DA2] shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
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
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center w-full max-w-full">
          {/* MERON (RED COCK) */}
          <button
            onClick={() => handlePlaceCockfightBet('MERON', currentArena.meronOdds)}
            disabled={isGateLocked}
            className={`p-2 sm:p-3.5 rounded-xl border-2 shadow-xs transition-all flex flex-col justify-between h-full min-h-[95px] sm:min-h-[105px] ${isGateLocked
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-white border-red-500 hover:bg-red-50 text-gray-900 active:scale-98'
              }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] sm:text-[11px] uppercase font-black text-red-600 tracking-wider">MERON</span>
              {isGateLocked && <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />}
            </div>
            <div className="text-lg sm:text-2xl font-black text-red-700 my-0.5">
              {currentArena.meronOdds.toFixed(2)}
            </div>
            <div className="text-[8.5px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">
              <span>Ăn {Math.round(selectedStake * currentArena.meronOdds)} pts</span>
            </div>
          </button>

          {/* BDD (DRAW) */}
          <button
            onClick={() => handlePlaceCockfightBet('BDD', currentArena.bddOdds)}
            disabled={isGateLocked}
            className={`p-2 sm:p-3.5 rounded-xl border-2 shadow-xs transition-all flex flex-col justify-between h-full min-h-[95px] sm:min-h-[105px] ${isGateLocked
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-white border-emerald-500 hover:bg-emerald-50 text-gray-900 active:scale-98'
              }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] sm:text-[11px] uppercase font-black text-emerald-600 tracking-wider">BDD</span>
              {isGateLocked && <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />}
            </div>
            <div className="text-lg sm:text-2xl font-black text-emerald-700 my-0.5">
              1:{currentArena.bddOdds}
            </div>
            <div className="text-[8.5px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">
              <span>Ăn {selectedStake * 8} pts</span>
            </div>
          </button>

          {/* WALA (BLUE COCK) */}
          <button
            onClick={() => handlePlaceCockfightBet('WALA', currentArena.walaOdds)}
            disabled={isGateLocked}
            className={`p-2 sm:p-3.5 rounded-xl border-2 shadow-xs transition-all flex flex-col justify-between h-full min-h-[95px] sm:min-h-[105px] ${isGateLocked
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-white border-[#0B4DA2] hover:bg-blue-50 text-gray-900 active:scale-98'
              }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] sm:text-[11px] uppercase font-black text-[#0B4DA2] tracking-wider">WALA</span>
              {isGateLocked && <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />}
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#0B4DA2] my-0.5">
              {currentArena.walaOdds.toFixed(2)}
            </div>
            <div className="text-[8.5px] sm:text-[10px] text-gray-500 font-semibold truncate w-full">
              <span>Ăn {Math.round(selectedStake * currentArena.walaOdds)} pts</span>
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

      {/* 6. INSTRUCTOR & LIVE STREAM CONTROL MODAL */}
      {isInstructorModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-4 sm:p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-sm uppercase tracking-wide">Trung Tâm Giảng Dạy & Luồng Live</h3>
              </div>
              <button
                onClick={() => setIsInstructorModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Teaching Speed Switcher */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Tốc độ Chu Kỳ Trận Đấu
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {classroomSpeed ? '2 Phút (Nhanh)' : '15 Phút (Thực tế)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleClassroomMode(true)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    classroomSpeed
                      ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/50'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>⚡ Giảng Dạy (2 Phút)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleClassroomMode(false)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    !classroomSpeed
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>🕒 Thực Tế (15 Phút)</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Chế độ Giảng Dạy giúp bạn minh họa nhiều tình huống cược, khóa sổ 3s và soi cầu nhanh chóng trong giờ học mà không phải chờ 15 phút.
              </p>
            </div>

            {/* Custom URL Injector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                Nhập Link Video Trực Tiếp (.m3u8, MP4, Embed Video Player):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customStreamInput}
                  onChange={(e) => {
                    setCustomStreamInput(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="https://player.videosv388.com/?play=... hoặc .m3u8..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-amber-500 outline-none"
                />
                <button
                  onClick={handleApplyCustomStream}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs rounded-lg transition shadow-md shadow-amber-600/30 cursor-pointer"
                >
                  Áp Dụng
                </button>
              </div>

              {/* Quick 1-Click Stream Shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold">Nhanh:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomStreamInput('https://player.videosv388.com/?play=a254ad13-c625-4dfe-bf75-50beb9db8967');
                    handleSelectPresetSource('sv388_live_direct');
                  }}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>▶ SV388 Direct Live (a254ad13)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomStreamInput('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
                    handleSelectPresetSource('fallback_hls');
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>⚡ Mux HLS Backup</span>
                </button>
              </div>

              {validationError && (
                <div className="p-2.5 bg-red-950/80 border border-red-500/50 rounded-lg text-[11px] text-red-200 leading-relaxed flex items-start gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Preconfigured Fallback Dropdown Selector */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  Chọn Nguồn Phát Chuẩn (Teaching Fallback Sources):
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">⚡ 3s Auto-Failover</span>
              </label>
              <select
                value={selectedPresetSourceId}
                onChange={(e) => handleSelectPresetSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:border-amber-500 outline-none cursor-pointer"
              >
                {TEACHING_FALLBACK_SOURCES.map((src) => (
                  <option key={src.id} value={src.id} className="bg-slate-900 text-white">
                    {src.name} — [{src.badge}]
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Hệ thống tự động chuyển đổi giữa 3 nguồn này trong ≤ 3 giây nếu gặp sự cố mạng hoặc tường lửa.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsInstructorModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg text-slate-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};