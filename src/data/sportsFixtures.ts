export interface FootballFixture {
  matchId: string;
  leagueId: 'EPL' | 'LALIGA' | 'UCL' | 'SERIE_B' | 'PORTUGAL';
  leagueName: string;
  homeTeam: string;
  awayTeam: string;
  scoreHome: number;
  scoreAway: number;
  liveTime: string;
  isLive: boolean;
  handicapTeam?: 'home' | 'away';
  homeHandicap: string;
  homeOdds: number;
  awayHandicap: string;
  awayOdds: number;
  ouGoal: string;
  ouOverOdds: number;
  ouUnderOdds: number;
  oneXTwoHome: number;
  oneXTwoAway: number;
  oneXTwoDraw: number;
  moreCount: number;
  hasBetBuilder?: boolean;
  hasAccordion?: boolean;
  cornerScore?: string;
  hasTodayAccordion?: boolean;
  hasLigaAccordion?: boolean;
}

// ══════════════════════════════════════════════════════════════════
// 1. LIVE IN-PLAY FOOTBALL FIXTURES (Trực tiếp)
// ══════════════════════════════════════════════════════════════════
export const LIVE_FOOTBALL_FIXTURES: FootballFixture[] = [
  // --- PREMIER LEAGUE (EPL) ---
  {
    matchId: 'match-arsenal-chelsea-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    scoreHome: 2,
    scoreAway: 1,
    liveTime: "64' (H2)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.50',
    homeOdds: -0.84,
    awayHandicap: '+0.50',
    awayOdds: 0.76,
    ouGoal: '3.50',
    ouOverOdds: 0.91,
    ouUnderOdds: -0.99,
    oneXTwoHome: 1.72,
    oneXTwoAway: 4.40,
    oneXTwoDraw: 3.60,
    moreCount: 22,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[5:3]'
  },
  {
    matchId: 'match-mancity-tottenham-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham Hotspur',
    scoreHome: 1,
    scoreAway: 0,
    liveTime: "28' (H1)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-1.25',
    homeOdds: 0.95,
    awayHandicap: '+1.25',
    awayOdds: -0.85,
    ouGoal: '3.25',
    ouOverOdds: -0.92,
    ouUnderOdds: 0.82,
    oneXTwoHome: 1.45,
    oneXTwoAway: 6.20,
    oneXTwoDraw: 4.80,
    moreCount: 26,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[2:1]'
  },
  {
    matchId: 'match-liverpool-astonvilla-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Liverpool',
    awayTeam: 'Aston Villa',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: "12' (H1)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.75',
    homeOdds: 0.88,
    awayHandicap: '+0.75',
    awayOdds: -0.96,
    ouGoal: '2.75',
    ouOverOdds: 0.85,
    ouUnderOdds: -0.95,
    oneXTwoHome: 1.60,
    oneXTwoAway: 5.10,
    oneXTwoDraw: 4.10,
    moreCount: 18,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[1:1]'
  },
  {
    matchId: 'match-manutd-newcastle-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Manchester United',
    awayTeam: 'Newcastle United',
    scoreHome: 1,
    scoreAway: 1,
    liveTime: "52' (H2)",
    isLive: true,
    handicapTeam: 'away',
    homeHandicap: '+0.25',
    homeOdds: -0.90,
    awayHandicap: '-0.25',
    awayOdds: 0.82,
    ouGoal: '3.00',
    ouOverOdds: 0.94,
    ouUnderOdds: -0.88,
    oneXTwoHome: 2.85,
    oneXTwoAway: 2.45,
    oneXTwoDraw: 3.30,
    moreCount: 20,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[4:4]'
  },

  // --- LA LIGA ---
  {
    matchId: 'match-realmadrid-barcelona-01',
    leagueId: 'LALIGA',
    leagueName: 'Giải Tây Ban Nha (La Liga)',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    scoreHome: 1,
    scoreAway: 2,
    liveTime: "78' (H2)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '0.00',
    homeOdds: 0.98,
    awayHandicap: '0.00',
    awayOdds: -0.92,
    ouGoal: '4.50',
    ouOverOdds: 0.89,
    ouUnderOdds: -0.97,
    oneXTwoHome: 2.60,
    oneXTwoAway: 2.50,
    oneXTwoDraw: 3.50,
    moreCount: 30,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[6:5]'
  },

  // --- UEFA CHAMPIONS LEAGUE (UCL) ---
  {
    matchId: 'match-bayern-psg-01',
    leagueId: 'UCL',
    leagueName: 'Cúp C1 Châu Âu (Champions League)',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Paris Saint-Germain',
    scoreHome: 0,
    scoreAway: 1,
    liveTime: "34' (H1)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.25',
    homeOdds: 0.90,
    awayHandicap: '+0.25',
    awayOdds: -0.98,
    ouGoal: '3.25',
    ouOverOdds: 0.88,
    ouUnderOdds: -0.96,
    oneXTwoHome: 2.15,
    oneXTwoAway: 3.10,
    oneXTwoDraw: 3.65,
    moreCount: 28,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[3:2]'
  },
  {
    matchId: 'match-inter-dortmund-01',
    leagueId: 'UCL',
    leagueName: 'Cúp C1 Châu Âu (Champions League)',
    homeTeam: 'Inter Milan',
    awayTeam: 'Borussia Dortmund',
    scoreHome: 2,
    scoreAway: 2,
    liveTime: "71' (H2)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.50',
    homeOdds: -0.80,
    awayHandicap: '+0.50',
    awayOdds: 0.70,
    ouGoal: '4.75',
    ouOverOdds: -0.86,
    ouUnderOdds: 0.76,
    oneXTwoHome: 1.85,
    oneXTwoAway: 3.90,
    oneXTwoDraw: 3.50,
    moreCount: 24,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[5:6]'
  }
];

// ══════════════════════════════════════════════════════════════════
// 2. TODAY SCHEDULED FOOTBALL FIXTURES (Hôm nay)
// Matches kicking off today with full Asian odds tables and accordions
// ══════════════════════════════════════════════════════════════════
export const TODAY_FOOTBALL_FIXTURES: FootballFixture[] = [
  // --- LA LIGA (Milestone 1 Reference: Atlético Madrid vs Sevilla - IMG-20260907-WA0012) ---
  {
    matchId: 'match-atletico-sevilla-01',
    leagueId: 'LALIGA',
    leagueName: 'Giải Tây Ban Nha (La Liga)',
    homeTeam: 'Atlético Madrid',
    awayTeam: 'Sevilla',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: 'Hôm nay 21:00',
    isLive: false,
    handicapTeam: 'home',
    homeHandicap: '-1.00',
    homeOdds: -0.75,
    awayHandicap: '+1.00',
    awayOdds: 0.65,
    ouGoal: '2.50',
    ouOverOdds: -0.95,
    ouUnderOdds: 0.85,
    oneXTwoHome: 1.35,
    oneXTwoAway: 8.50,
    oneXTwoDraw: 4.90,
    moreCount: 18,
    hasBetBuilder: true,
    hasAccordion: true,
    hasTodayAccordion: true,
    cornerScore: '[0:0]'
  },
  {
    matchId: 'match-realmadrid-betis-01',
    leagueId: 'LALIGA',
    leagueName: 'Giải Tây Ban Nha (La Liga)',
    homeTeam: 'Real Madrid',
    awayTeam: 'Real Betis',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: 'Hôm nay 23:30',
    isLive: false,
    handicapTeam: 'home',
    homeHandicap: '-1.25',
    homeOdds: 0.95,
    awayHandicap: '+1.25',
    awayOdds: -0.85,
    ouGoal: '3.25',
    ouOverOdds: 0.90,
    ouUnderOdds: -0.98,
    oneXTwoHome: 1.35,
    oneXTwoAway: 7.50,
    oneXTwoDraw: 4.80,
    moreCount: 24,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[0:0]'
  },

  // --- PREMIER LEAGUE (EPL) ---
  {
    matchId: 'match-chelsea-wolves-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Chelsea',
    awayTeam: 'Wolverhampton',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: 'Hôm nay 20:00',
    isLive: false,
    handicapTeam: 'home',
    homeHandicap: '-0.75',
    homeOdds: 0.92,
    awayHandicap: '+0.75',
    awayOdds: -0.98,
    ouGoal: '2.75',
    ouOverOdds: 0.88,
    ouUnderOdds: -0.96,
    oneXTwoHome: 1.65,
    oneXTwoAway: 5.20,
    oneXTwoDraw: 3.80,
    moreCount: 26,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[0:0]'
  },
  {
    matchId: 'match-newcastle-everton-01',
    leagueId: 'EPL',
    leagueName: 'Giải Ngoại Hạng Anh (Premier League)',
    homeTeam: 'Newcastle United',
    awayTeam: 'Everton',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: 'Hôm nay 22:15',
    isLive: false,
    handicapTeam: 'home',
    homeHandicap: '-0.50',
    homeOdds: 0.85,
    awayHandicap: '+0.50',
    awayOdds: -0.95,
    ouGoal: '2.50',
    ouOverOdds: 0.82,
    ouUnderOdds: -0.90,
    oneXTwoHome: 1.80,
    oneXTwoAway: 4.30,
    oneXTwoDraw: 3.40,
    moreCount: 20,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[0:0]'
  },

  // --- UEFA CHAMPIONS LEAGUE (UCL) ---
  {
    matchId: 'match-dortmund-juventus-01',
    leagueId: 'UCL',
    leagueName: 'Cúp C1 Châu Âu (Champions League)',
    homeTeam: 'Borussia Dortmund',
    awayTeam: 'Juventus',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: 'Hôm nay 02:00',
    isLive: false,
    handicapTeam: 'home',
    homeHandicap: '-0.25',
    homeOdds: 0.91,
    awayHandicap: '+0.25',
    awayOdds: -0.99,
    ouGoal: '2.75',
    ouOverOdds: 0.94,
    ouUnderOdds: -0.88,
    oneXTwoHome: 2.10,
    oneXTwoAway: 3.30,
    oneXTwoDraw: 3.25,
    moreCount: 32,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[0:0]'
  },

  // --- PORTUGAL (Primeira Liga) ---
  {
    matchId: 'match-benfica-sporting-today',
    leagueId: 'PORTUGAL',
    leagueName: 'Giải Bồ Đào Nha (Liga Portugal)',
    homeTeam: 'Benfica',
    awayTeam: 'Sporting CP',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: 'Hôm nay 23:45',
    isLive: false,
    handicapTeam: 'home',
    homeHandicap: '-0.25',
    homeOdds: 0.94,
    awayHandicap: '+0.25',
    awayOdds: -0.86,
    ouGoal: '2.50',
    ouOverOdds: 0.92,
    ouUnderOdds: -0.98,
    oneXTwoHome: 2.15,
    oneXTwoAway: 3.25,
    oneXTwoDraw: 3.30,
    moreCount: 22,
    hasBetBuilder: true,
    hasAccordion: true,
    hasLigaAccordion: true,
    cornerScore: '[0:0]'
  },

  // --- SERIE B (Ý) ---
  {
    matchId: 'match-parma-spezia-01',
    leagueId: 'SERIE_B',
    leagueName: 'Giải Hạng 2 Ý (Serie B)',
    homeTeam: 'Parma',
    awayTeam: 'Spezia',
    scoreHome: 0,
    scoreAway: 0,
    liveTime: 'Hôm nay 20:30',
    isLive: false,
    handicapTeam: 'home',
    homeHandicap: '-0.50',
    homeOdds: 0.86,
    awayHandicap: '+0.50',
    awayOdds: -0.94,
    ouGoal: '2.25',
    ouOverOdds: 0.90,
    ouUnderOdds: -0.98,
    oneXTwoHome: 1.88,
    oneXTwoAway: 4.20,
    oneXTwoDraw: 3.20,
    moreCount: 16,
    hasBetBuilder: true,
    hasAccordion: true,
    cornerScore: '[0:0]'
  }
];

// ══════════════════════════════════════════════════════════════════
// 3. FEATURED MATCHES / EARLY MARKETS (Trận đấu)
// Milestone 1 Reference: Benfica vs Sporting CP (IMG-20260907-WA0011)
// ══════════════════════════════════════════════════════════════════
export const MATCHES_FOOTBALL_FIXTURES: FootballFixture[] = [
  {
    matchId: 'match-benfica-sporting-01',
    leagueId: 'PORTUGAL',
    leagueName: 'Giải Bồ Đào Nha (Liga Portugal)',
    homeTeam: 'Benfica',
    awayTeam: 'Sporting CP',
    scoreHome: 0,
    scoreAway: 1,
    liveTime: "38' (H1)",
    isLive: true,
    handicapTeam: 'home',
    homeHandicap: '-0.25',
    homeOdds: -0.54,
    awayHandicap: '+0.25',
    awayOdds: 0.46,
    ouGoal: '3.50',
    ouOverOdds: -0.61,
    ouUnderOdds: 0.51,
    oneXTwoHome: 2.10,
    oneXTwoAway: 3.40,
    oneXTwoDraw: 3.20,
    moreCount: 17,
    hasBetBuilder: true,
    hasAccordion: true,
    hasLigaAccordion: true,
    cornerScore: '[2:1]'
  },
  ...TODAY_FOOTBALL_FIXTURES.slice(0, 3)
];

// ══════════════════════════════════════════════════════════════════
// 4. COMBINED MASTER FIXTURES (For surveillance & unified queries)
// ══════════════════════════════════════════════════════════════════
export const ALL_FOOTBALL_FIXTURES: FootballFixture[] = [
  ...LIVE_FOOTBALL_FIXTURES,
  ...TODAY_FOOTBALL_FIXTURES
];

export const FOOTBALL_FIXTURES = ALL_FOOTBALL_FIXTURES;

// ══════════════════════════════════════════════════════════════════
// 5. HELPER FILTER FUNCTIONS
// ══════════════════════════════════════════════════════════════════
export const matchesLeague = (leagueId: string, leagueName: string, selectedLeague: string): boolean => {
  if (selectedLeague === 'ALL') return true;
  if (selectedLeague === 'EPL') return leagueId === 'EPL' || (leagueName || '').toLowerCase().includes('premier') || (leagueName || '').toLowerCase().includes('anh');
  if (selectedLeague === 'LALIGA') return leagueId === 'LALIGA' || (leagueName || '').toLowerCase().includes('la liga') || (leagueName || '').toLowerCase().includes('spain') || (leagueName || '').toLowerCase().includes('tây ban nha');
  if (selectedLeague === 'UCL') return leagueId === 'UCL' || (leagueName || '').toLowerCase().includes('champions') || (leagueName || '').toLowerCase().includes('cúp c1');
  if (selectedLeague === 'SERIE_B') return leagueId === 'SERIE_B' || (leagueName || '').toLowerCase().includes('serie b') || (leagueName || '').toLowerCase().includes('ý');
  if (selectedLeague === 'PORTUGAL') return leagueId === 'PORTUGAL' || (leagueName || '').toLowerCase().includes('portugal') || (leagueName || '').toLowerCase().includes('bồ đào nha');
  return true;
};

export const matchesSearch = (homeTeam: string, awayTeam: string, leagueName: string, searchTerm: string): boolean => {
  if (!searchTerm || !searchTerm.trim()) return true;
  const q = searchTerm.trim().toLowerCase();
  return (
    (homeTeam || '').toLowerCase().includes(q) ||
    (awayTeam || '').toLowerCase().includes(q) ||
    (leagueName || '').toLowerCase().includes(q)
  );
};
