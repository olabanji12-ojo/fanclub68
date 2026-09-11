import { create } from 'zustand';
import { Language, SportType, SbobetNavTab, BetSlipItem } from '../types';
import { ApiService } from '../services/api';

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
  refreshOdds: () => Promise<void>;

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
  liveApiMatches: any[];
  setLiveApiMatches: (matches: any[]) => void;
}

export const useSbobetStore = create<SbobetState>((set, get) => ({
  language: 'vi', // Default to Vietnamese matching reference screenshots
  setLanguage: (lang) => set({ language: lang }),

  activeSport: 'football',
  setActiveSport: (sport) => set({ activeSport: sport }),

  activeTab: 'live',
  setActiveTab: (tab) => set({ activeTab: tab }),

  currentView: 'sbobet',
  setCurrentView: (view) => set({ currentView: view }),

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

  isLoggedIn: false,
  user: null,

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

  isRefreshing: false,
  lastRefreshedTime: '13:34:05',
  refreshOdds: async () => {
    if (get().isRefreshing) return;
    set({ isRefreshing: true });
    
    try {
      const { data } = await ApiService.getLiveMatches('soccer');
      if (data?.matches && data.matches.length > 0) {
        set({ liveApiMatches: data.matches });
      }
    } catch {
      // Handled cleanly
    }

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    set({
      isRefreshing: false,
      lastRefreshedTime: timeString
    });
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
