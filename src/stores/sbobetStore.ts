import { create } from 'zustand';
import { Language, SportType, SbobetNavTab, BetSlipItem } from '../types';
import { ApiService } from '../services/api';
import { LiveSportsService, ApiStatusInfo } from '../services/liveSportsService';
import { FootballFixture } from '../data/sportsFixtures';

interface SbobetState {
  language: Language;
  setLanguage: (lang: Language) => void;

  activeSport: SportType;
  setActiveSport: (sport: SportType) => void;

  activeTab: SbobetNavTab;
  setActiveTab: (tab: SbobetNavTab) => void;

  currentView: 'sbobet' | 'lobby' | 'cockfight' | 'taixiu' | 'xocdia' | 'admin';
  setCurrentView: (view: 'sbobet' | 'lobby' | 'cockfight' | 'taixiu' | 'xocdia' | 'admin') => void;

  // Bet Slip
  slipSelections: BetSlipItem[];
  isBetSlipOpen: boolean;
  setIsBetSlipOpen: (open: boolean) => void;
  addSelection: (item: BetSlipItem) => void;
  removeSelection: (matchId: string, marketName: string) => void;
  clearSlip: () => void;

  // User Authentication & Balance
  isLoggedIn: boolean;
  user: {
    username: string;
    balance: number;
    vipLevel: string;
  } | null;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  loginUser: (username: string) => void;
  registerUser: (username: string, phone?: string) => void;
  loginDemo: () => void;
  logout: () => void;

  // Live Odds Refresh & Pull-to-Refresh
  isRefreshing: boolean;
  lastRefreshedTime: string;
  refreshOdds: (forceUpstream?: boolean) => Promise<void>;
  syncUpstreamOdds: () => Promise<{ success: boolean; message: string; remaining?: number }>;
  tickLiveClocks: () => void;

  // Search & A-Z Sorting
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLeague: string;
  setSelectedLeague: (league: string) => void;
  isAZModalOpen: boolean;
  setIsAZModalOpen: (open: boolean) => void;

  // Admin Dashboard & Platform Controls
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  platformTier: 1 | 2 | 3;
  setPlatformTier: (tier: 1 | 2 | 3) => void;
  quotaUsed: number;
  simulateQuota: (delta: number) => void;
  resetQuota: () => void;
  casinoOverride: 'tai' | 'xiu' | null;
  setCasinoOverride: (val: 'tai' | 'xiu' | null) => void;
  depositBalance: (amount: number) => void;
  liveApiMatches: FootballFixture[];
  setLiveApiMatches: (matches: FootballFixture[]) => void;
  todayApiMatches: FootballFixture[];
  setTodayApiMatches: (matches: FootballFixture[]) => void;
  matchesApiFixtures: FootballFixture[];
  setMatchesApiFixtures: (matches: FootballFixture[]) => void;
  otherSportsApiMatches: Record<string, any[]>;
  apiStatus: ApiStatusInfo;
  setApiStatus: (status: ApiStatusInfo) => void;
}

export const useSbobetStore = create<SbobetState>((set, get) => ({
  language: 'vi', // Default to Vietnamese matching reference screenshots
  setLanguage: (lang) => set({ language: lang }),

  activeSport: 'football',
  setActiveSport: (sport) => set({ activeSport: sport }),

  activeTab: 'live',
  setActiveTab: (tab) => set({ activeTab: tab }),

  currentView: (() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'admin') return 'admin';
      if (path === 'taixiu' || path === 'casino') return 'taixiu';
      if (path === 'cockfight') return 'cockfight';
      if (path === 'xocdia') return 'xocdia';
      if (path === 'lobby') return 'lobby';
    }
    return 'sbobet';
  })(),
  setCurrentView: (view) => {
    set({ currentView: view });
    if (typeof window !== 'undefined') {
      const targetPath = view === 'sbobet' ? '/' : `/${view}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  },

  slipSelections: [],
  isBetSlipOpen: false,
  setIsBetSlipOpen: (open) => set({ isBetSlipOpen: open }),

  addSelection: (item) => {
    const { slipSelections } = get();
    // Check if already in slip
    const exists = slipSelections.find(
      s => s.matchId === item.matchId && s.marketName === item.marketName && s.selectionName === item.selectionName
    );
    if (exists) {
      // Remove if tapped again
      set({
        slipSelections: slipSelections.filter(
          s => !(s.matchId === item.matchId && s.marketName === item.marketName && s.selectionName === item.selectionName)
        )
      });
    } else {
      // Replace existing selection on same market or add new
      const filtered = slipSelections.filter(
        s => !(s.matchId === item.matchId && s.marketName === item.marketName)
      );
      set({ slipSelections: [...filtered, item] });
    }
  },

  removeSelection: (matchId, marketName) => {
    set(state => ({
      slipSelections: state.slipSelections.filter(
        s => !(s.matchId === matchId && s.marketName === marketName)
      )
    }));
  },

  clearSlip: () => set({ slipSelections: [] }),

  isLoggedIn: true,
  user: {
    username: 'SbobetTrader_88',
    balance: 1000.0,
    vipLevel: 'VIP Master'
  },

  isAuthModalOpen: false,
  authModalTab: 'login',

  openAuthModal: (tab = 'login') => {
    set({ isAuthModalOpen: true, authModalTab: tab });
  },

  closeAuthModal: () => {
    set({ isAuthModalOpen: false });
  },

  loginUser: (username) => {
    set({
      isLoggedIn: true,
      isAuthModalOpen: false,
      user: {
        username: username.trim() || 'SbobetTrader_88',
        balance: 1000.0,
        vipLevel: 'VIP Gold'
      }
    });
  },

  registerUser: (username) => {
    set({
      isLoggedIn: true,
      isAuthModalOpen: false,
      user: {
        username: username.trim() || 'NewMember_68',
        balance: 1000.0,
        vipLevel: 'Member 2026'
      }
    });
  },

  loginDemo: () => {
    set({
      isLoggedIn: true,
      isAuthModalOpen: false,
      user: {
        username: 'SbobetTrader_88',
        balance: 1000.0,
        vipLevel: 'VIP Master'
      }
    });
  },

  logout: () => {
    set({ isLoggedIn: false, user: null });
  },

  liveApiMatches: [],
  setLiveApiMatches: (matches) => set({ liveApiMatches: matches }),
  todayApiMatches: [],
  setTodayApiMatches: (matches) => set({ todayApiMatches: matches }),
  matchesApiFixtures: [],
  setMatchesApiFixtures: (matches) => set({ matchesApiFixtures: matches }),
  otherSportsApiMatches: {},
  apiStatus: LiveSportsService.getApiStatus(),
  setApiStatus: (status) => set({ apiStatus: status }),

  isRefreshing: false,
  lastRefreshedTime: '13:34:05',
  refreshOdds: async (forceUpstream: boolean = false) => {
    if (get().isRefreshing) return;
    set({ isRefreshing: true });
    
    try {
      const liveData = await LiveSportsService.fetchAllSportsData(forceUpstream);
      if (liveData.liveMatches && liveData.liveMatches.length > 0) {
        set({ liveApiMatches: liveData.liveMatches });
      }
      if (liveData.todayMatches && liveData.todayMatches.length > 0) {
        set({ todayApiMatches: liveData.todayMatches });
      }
      if (liveData.matchesFixtures && liveData.matchesFixtures.length > 0) {
        set({ matchesApiFixtures: liveData.matchesFixtures });
      }
      if (liveData.otherSports) {
        set({ otherSportsApiMatches: liveData.otherSports });
      }
      if (liveData.apiStatus) {
        set({ apiStatus: liveData.apiStatus });
      }
    } catch (err) {
      console.warn('[STORE] Live odds refresh error:', err);
    }

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    set({
      isRefreshing: false,
      lastRefreshedTime: timeString
    });
  },

  syncUpstreamOdds: async () => {
    set({ isRefreshing: true });
    try {
      const res = await LiveSportsService.manualSyncUpstream();
      await get().refreshOdds(true);
      return res;
    } finally {
      set({ isRefreshing: false });
    }
  },

  tickLiveClocks: () => {
    const { liveApiMatches } = get();
    if (!liveApiMatches || liveApiMatches.length === 0) return;

    const nowSeconds = new Date().getSeconds();
    const updated = liveApiMatches.map((match, idx) => {
      // Parse current minute e.g. "32' (H1)"
      const minuteMatch = match.liveTime.match(/(\d+)'/);
      let currentMinute = minuteMatch ? parseInt(minuteMatch[1], 10) : 25 + idx * 7;

      // Advance minute smoothly every 30s tick cycle
      if (nowSeconds % 30 < 15 && currentMinute < 90) {
        currentMinute = Math.min(90, currentMinute + 1);
      }
      const isH2 = currentMinute > 45;
      const newLiveTime = `${currentMinute}' (${isH2 ? 'H2' : 'H1'})`;

      // Micro odds drift (±0.01) to simulate active bookmaker trading without external API calls
      const shouldDrift = (nowSeconds + idx) % 4 === 0;
      const drift = shouldDrift ? (Math.random() > 0.5 ? 0.01 : -0.01) : 0;
      const newHomeOdds = Number(Math.max(0.2, match.homeOdds + drift).toFixed(2));
      const newAwayOdds = Number(Math.max(0.2, match.awayOdds - drift).toFixed(2));

      return {
        ...match,
        liveTime: newLiveTime,
        homeOdds: newHomeOdds,
        awayOdds: newAwayOdds
      };
    });

    set({ liveApiMatches: updated });
  },

  // Search & A-Z Sorting
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  selectedLeague: 'ALL',
  setSelectedLeague: (league) => set({ selectedLeague: league }),
  isAZModalOpen: false,
  setIsAZModalOpen: (open) => set({ isAZModalOpen: open }),

  // Admin Dashboard & Platform Controls
  isAdminModalOpen: false,
  setIsAdminModalOpen: (open) => set({ isAdminModalOpen: open }),
  platformTier: 1,
  setPlatformTier: (tier) => set({ platformTier: tier }),
  quotaUsed: 14320,
  simulateQuota: (delta) => set((s) => ({ quotaUsed: Math.min(s.quotaUsed + delta, 100000) })),
  resetQuota: () => set({ quotaUsed: 0 }),
  casinoOverride: null,
  setCasinoOverride: (val) => set({ casinoOverride: val }),
  depositBalance: (amount) => set((s) => ({
    user: s.user ? { ...s.user, balance: Math.max(0, s.user.balance + amount) } : {
      username: 'SbobetTrader_88',
      balance: Math.max(0, 1000.0 + amount),
      vipLevel: 'VIP Master'
    }
  }))
}));
