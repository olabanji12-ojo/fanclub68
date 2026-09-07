export type Language = 'vi' | 'en';

export type SportType = 'football' | 'tennis' | 'basketball' | 'nfl';

export type SbobetNavTab = 'live' | 'today' | 'matches' | 'parlay';

export interface OddItem {
  id: string;
  name: string;
  odds: number;
  isNegative?: boolean;
  handicapValue?: string;
}

export interface MatchScore {
  home: number;
  away: number;
  halfTime?: { home: number; away: number };
  corners?: { home: number; away: number };
  tennisSets?: { set1?: string; set2?: string; set3?: string; currentSetScore?: string };
}

export interface SbobetMatch {
  id: string;
  sport: SportType;
  league: string;
  isTopLeague?: boolean;
  matchCountInLeague?: number;
  homeTeam: string;
  awayTeam: string;
  isLive: boolean;
  liveTime?: string; // e.g. "43'" or "Set 2 : 0"
  score: MatchScore;
  subMarketCount: number;
  
  // Main Odds Row
  mainMarkets: {
    handicap: {
      homeVal: string;
      homeOdds: number;
      awayVal: string;
      awayOdds: number;
    };
    overUnder: {
      total: string;
      overOdds: number;
      underOdds: number;
    };
    oneXTwo: {
      homeOdds: number;
      drawOdds: number;
      awayOdds: number;
    };
  };

  // Pre-configured Bet Builder / Popular Combo
  betBuilder?: {
    title: string;
    legs: Array<{ label: string; selection: string }>;
    combinedOdds: number;
  };
}

export interface BetSlipItem {
  matchId: string;
  matchName: string;
  marketName: string;
  selectionName: string;
  odds: number;
  handicap?: string;
  stake: number;
}
