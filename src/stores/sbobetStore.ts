import { create } from 'zustand';
import { Language, SportType, SbobetNavTab, BetSlipItem } from '../types';

interface SbobetState {
  language: Language;
  setLanguage: (lang: Language) => void;

  activeSport: SportType;
  setActiveSport: (sport: SportType) => void;

  activeTab: SbobetNavTab;
  setActiveTab: (tab: SbobetNavTab) => void;

  currentView: 'sbobet' | 'lobby' | 'cockfight' | 'taixiu' | 'xocdia';
  setCurrentView: (view: 'sbobet' | 'lobby' | 'cockfight' | 'taixiu' | 'xocdia') => void;

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
  loginDemo: () => void;
  logout: () => void;
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

  loginDemo: () => {
    set({
      isLoggedIn: true,
      user: {
        username: 'SbobetTrader_88',
        balance: 1000.0,
        vipLevel: 'VIP Master'
      }
    });
  },

  logout: () => {
    set({ isLoggedIn: false, user: null });
  }
}));
