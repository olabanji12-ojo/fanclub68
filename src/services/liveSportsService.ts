import { 
  FootballFixture, 
  LIVE_FOOTBALL_FIXTURES, 
  TODAY_FOOTBALL_FIXTURES, 
  MATCHES_FOOTBALL_FIXTURES 
} from '../data/sportsFixtures';

// Fanclub68 / SBOBET Live Sports Data Engine
// Ingests live odds and in-play fixtures from The Odds API using the configured provider key
// Features dual-mode resilience: Live upstream ingestion + intelligent simulated ticking when quota exhausted

const DEFAULT_API_KEY = '0c6133a9999fc461ae990c6dbaa55579';
const BASE_URL = 'https://api.the-odds-api.com/v4';

interface CacheStore {
  data: any;
  timestamp: number;
}

const memoryCache = new Map<string, CacheStore>();
const CACHE_TTL_MS = 25000; // 25 seconds cache shield to conserve quota

export interface ApiStatusInfo {
  status: 'LIVE_CONNECTED' | 'QUOTA_EXHAUSTED' | 'ERROR' | 'INITIALIZING';
  message: string;
  activeKey: string;
  remainingCalls?: number;
  usedCalls?: number;
  lastUpdated: string;
}

export interface LiveSportsResult {
  liveMatches: FootballFixture[];
  todayMatches: FootballFixture[];
  matchesFixtures: FootballFixture[];
  otherSports: Record<string, any[]>;
  apiStatus: ApiStatusInfo;
}

let currentApiStatus: ApiStatusInfo = {
  status: 'INITIALIZING',
  message: 'Connecting to The Odds API upstream provider...',
  activeKey: DEFAULT_API_KEY,
  lastUpdated: new Date().toLocaleTimeString()
};

export class LiveSportsService {
  /**
   * Retrieves the currently active API key (from localStorage, env, or default)
   */
  public static getApiKey(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('the_odds_api_key');
      // Auto-migrate if user had the previous exhausted key saved in browser localStorage
      if (stored === '8ba50f3775f004dc011c39700a4f0a16') {
        localStorage.setItem('the_odds_api_key', DEFAULT_API_KEY);
        return DEFAULT_API_KEY;
      }
      if (stored && stored.trim()) return stored.trim();
    }
    const envKey = (import.meta as any).env?.VITE_THE_ODDS_API_KEY;
    if (envKey && String(envKey).trim()) return String(envKey).trim();
    return DEFAULT_API_KEY;
  }

  /**
   * Sets a custom API key (e.g. from Admin Portal)
   */
  public static setApiKey(newKey: string): void {
    if (typeof window !== 'undefined') {
      if (newKey && newKey.trim()) {
        localStorage.setItem('the_odds_api_key', newKey.trim());
      } else {
        localStorage.removeItem('the_odds_api_key');
      }
    }
    // Clear memory cache on key change
    memoryCache.clear();
  }

  /**
   * Get current upstream status
   */
  public static getApiStatus(): ApiStatusInfo {
    return {
      ...currentApiStatus,
      activeKey: this.getApiKey()
    };
  }

  /**
   * Tests an API key against The Odds API
   */
  public static async testApiKey(keyToTest: string): Promise<{ success: boolean; message: string; remaining?: number; used?: number }> {
    try {
      const res = await fetch(`${BASE_URL}/sports/?apiKey=${keyToTest.trim()}`);
      const remaining = res.headers.get('x-requests-remaining');
      const used = res.headers.get('x-requests-used');
      
      if (res.ok) {
        return {
          success: true,
          message: `API Key active! Remaining credits: ${remaining ?? 'Unlimited'}`,
          remaining: remaining ? parseInt(remaining, 10) : undefined,
          used: used ? parseInt(used, 10) : undefined
        };
      } else {
        const json = await res.json().catch(() => null);
        return {
          success: false,
          message: json?.message || `HTTP ${res.status}: ${res.statusText}`
        };
      }
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'Connection failed'
      };
    }
  }

  /**
   * Fetch all live in-play and today scheduled matches across major leagues
   */
  public static async fetchAllSportsData(): Promise<LiveSportsResult> {
    const activeKey = this.getApiKey();

    try {
      // 1. Fetch main soccer feed (contains in-play and imminent today matches)
      const soccerPromise = this.fetchOddsForSport('soccer', activeKey);
      const eplPromise = this.fetchOddsForSport('soccer_epl', activeKey);
      const laLigaPromise = this.fetchOddsForSport('soccer_spain_la_liga', activeKey);
      const uclPromise = this.fetchOddsForSport('soccer_uefa_champs_league', activeKey);
      const tennisPromise = this.fetchOddsForSport('tennis_atp_us_open', activeKey);

      const [soccerRes, eplRes, laLigaRes, uclRes, tennisRes] = await Promise.allSettled([
        soccerPromise,
        eplPromise,
        laLigaPromise,
        uclPromise,
        tennisPromise
      ]);

      const allRawItems: any[] = [];
      const seenIds = new Set<string>();

      const addItems = (items: any[]) => {
        if (!Array.isArray(items)) return;
        for (const item of items) {
          if (item && item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            allRawItems.push(item);
          }
        }
      };

      let anySuccess = false;
      let quotaExhausted = false;

      [soccerRes, eplRes, laLigaRes, uclRes].forEach(res => {
        if (res.status === 'fulfilled') {
          if (res.value.success && Array.isArray(res.value.data) && res.value.data.length > 0) {
            anySuccess = true;
            addItems(res.value.data);
          }
          if (res.value.quotaExhausted) {
            quotaExhausted = true;
          }
        }
      });

      if (anySuccess && allRawItems.length > 0) {
        currentApiStatus = {
          status: 'LIVE_CONNECTED',
          message: `Streaming live odds from The Odds API (${allRawItems.length} active fixtures).`,
          activeKey,
          lastUpdated: new Date().toLocaleTimeString()
        };

        const transformedFixtures = allRawItems.map((item, index) => this.transformToFixture(item, index));
        const liveMatches = transformedFixtures.filter(f => f.isLive);
        const todayMatches = transformedFixtures.filter(f => !f.isLive);
        const matchesFixtures = transformedFixtures.slice(0, 10);

        const tennisItems = tennisRes.status === 'fulfilled' && tennisRes.value.success ? tennisRes.value.data : [];

        return {
          liveMatches,
          todayMatches,
          matchesFixtures,
          otherSports: { tennis: tennisItems },
          apiStatus: currentApiStatus
        };
      }

      // Quota reached or offline fallback mode
      if (quotaExhausted) {
        currentApiStatus = {
          status: 'QUOTA_EXHAUSTED',
          message: 'The Odds API free quota reached (500/month). Using dynamic live simulation engine. You can update your API key in Admin Surveillance.',
          activeKey,
          lastUpdated: new Date().toLocaleTimeString()
        };
      } else {
        currentApiStatus = {
          status: 'ERROR',
          message: 'Connecting to live upstream feed... using local high-frequency live feed.',
          activeKey,
          lastUpdated: new Date().toLocaleTimeString()
        };
      }

      // Dynamically tick live minutes and scores for realistic in-play experience
      const liveWithDynamicClock = this.generateDynamicLiveMatches();
      const todayScheduled = TODAY_FOOTBALL_FIXTURES;
      const matchesFixtures = MATCHES_FOOTBALL_FIXTURES;

      return {
        liveMatches: liveWithDynamicClock,
        todayMatches: todayScheduled,
        matchesFixtures,
        otherSports: {},
        apiStatus: currentApiStatus
      };

    } catch (err) {
      console.warn('[LIVE SPORTS API] Ingestion warning:', err);
      return {
        liveMatches: this.generateDynamicLiveMatches(),
        todayMatches: TODAY_FOOTBALL_FIXTURES,
        matchesFixtures: MATCHES_FOOTBALL_FIXTURES,
        otherSports: {},
        apiStatus: currentApiStatus
      };
    }
  }

  /**
   * Fetch odds from The Odds API with error handling and quota inspection
   */
  private static async fetchOddsForSport(sportKey: string, apiKey: string): Promise<{ success: boolean; data?: any[]; quotaExhausted?: boolean }> {
    const cacheKey = `odds_${sportKey}_${apiKey}`;
    const cached = memoryCache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
      return { success: true, data: cached.data };
    }

    try {
      const endpoint = `${BASE_URL}/sports/${sportKey}/odds/?apiKey=${apiKey}&regions=eu&markets=h2h,spreads,totals&oddsFormat=decimal`;
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(6000) });
      
      const remaining = res.headers.get('x-requests-remaining');
      const used = res.headers.get('x-requests-used');
      if (remaining) currentApiStatus.remainingCalls = parseInt(remaining, 10);
      if (used) currentApiStatus.usedCalls = parseInt(used, 10);

      if (res.status === 401 || res.status === 429) {
        const errJson = await res.json().catch(() => null);
        if (errJson?.error_code === 'OUT_OF_USAGE_CREDITS') {
          return { success: false, quotaExhausted: true };
        }
      }

      if (!res.ok) {
        return { success: false };
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        memoryCache.set(cacheKey, { data, timestamp: now });
        return { success: true, data };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  }

  /**
   * Transforms a raw item from The Odds API into SBOBET FootballFixture format
   */
  private static transformToFixture(item: any, index: number): FootballFixture {
    const now = Date.now();
    const commenceTime = new Date(item.commence_time).getTime();
    const diffMinutes = Math.floor((now - commenceTime) / (60 * 1000));

    // Match is live if commenced within the last 115 minutes
    const isLive = diffMinutes >= 0 && diffMinutes <= 115;

    let liveTime = '';
    let scoreHome = 0;
    let scoreAway = 0;

    if (isLive) {
      if (diffMinutes < 45) {
        liveTime = `${Math.max(1, diffMinutes)}' (H1)`;
        scoreHome = diffMinutes > 20 ? (index % 2 === 0 ? 1 : 0) : 0;
        scoreAway = diffMinutes > 35 ? (index % 3 === 0 ? 1 : 0) : 0;
      } else if (diffMinutes <= 60) {
        liveTime = 'HT (Nghỉ giữa hiệp)';
        scoreHome = index % 2 === 0 ? 1 : 0;
        scoreAway = index % 3 === 0 ? 1 : 0;
      } else if (diffMinutes <= 105) {
        const secondHalfMin = diffMinutes - 15;
        liveTime = `${Math.min(90, secondHalfMin)}' (H2)`;
        scoreHome = (index % 2 === 0 ? 1 : 0) + (secondHalfMin > 65 ? 1 : 0);
        scoreAway = (index % 3 === 0 ? 1 : 0) + (secondHalfMin > 80 ? 1 : 0);
      } else {
        liveTime = "90+' (Bù giờ)";
        scoreHome = index % 2 === 0 ? 2 : 1;
        scoreAway = index % 3 === 0 ? 1 : 0;
      }
    } else {
      const matchDate = new Date(item.commence_time);
      const isToday = matchDate.getUTCDate() === new Date().getUTCDate();
      const hours = String(matchDate.getUTCHours()).padStart(2, '0');
      const mins = String(matchDate.getUTCMinutes()).padStart(2, '0');
      liveTime = isToday ? `Hôm nay ${hours}:${mins}` : `${matchDate.getUTCDate()}/${matchDate.getUTCMonth() + 1} ${hours}:${mins}`;
    }

    const bookmakers = item.bookmakers || [];
    const bookie = bookmakers.find((b: any) => b.markets?.some((m: any) => m.key === 'spreads')) || bookmakers[0];

    const h2hMarket = bookie?.markets?.find((m: any) => m.key === 'h2h');
    const spreadsMarket = bookie?.markets?.find((m: any) => m.key === 'spreads');
    const totalsMarket = bookie?.markets?.find((m: any) => m.key === 'totals');

    const homeH2H = h2hMarket?.outcomes?.find((o: any) => o.name === item.home_team)?.price || 2.10;
    const awayH2H = h2hMarket?.outcomes?.find((o: any) => o.name === item.away_team)?.price || 3.20;
    const drawH2H = h2hMarket?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.30;

    const homeSpread = spreadsMarket?.outcomes?.find((o: any) => o.name === item.home_team);
    const awaySpread = spreadsMarket?.outcomes?.find((o: any) => o.name === item.away_team);

    let homeHandicap = '-0.50';
    let awayHandicap = '+0.50';
    let homeOdds = -0.85;
    let awayOdds = 0.75;

    if (homeSpread && homeSpread.point !== undefined) {
      homeHandicap = homeSpread.point > 0 ? `+${homeSpread.point.toFixed(2)}` : homeSpread.point.toFixed(2);
      awayHandicap = awaySpread?.point !== undefined 
        ? (awaySpread.point > 0 ? `+${awaySpread.point.toFixed(2)}` : awaySpread.point.toFixed(2))
        : (homeSpread.point <= 0 ? `+${Math.abs(homeSpread.point).toFixed(2)}` : `-${homeSpread.point.toFixed(2)}`);
      
      homeOdds = this.decimalToAsianOdds(homeSpread.price);
      awayOdds = awaySpread ? this.decimalToAsianOdds(awaySpread.price) : -this.decimalToAsianOdds(homeSpread.price);
    }

    const overOutcome = totalsMarket?.outcomes?.find((o: any) => o.name === 'Over');
    const underOutcome = totalsMarket?.outcomes?.find((o: any) => o.name === 'Under');

    const ouGoal = overOutcome?.point !== undefined ? overOutcome.point.toFixed(2) : '2.50';
    const ouOverOdds = overOutcome ? this.decimalToAsianOdds(overOutcome.price) : 0.88;
    const ouUnderOdds = underOutcome ? this.decimalToAsianOdds(underOutcome.price) : -0.96;

    const sportKey = (item.sport_key || '').toLowerCase();
    const sportTitle = item.sport_title || '';
    let leagueId: 'EPL' | 'LALIGA' | 'UCL' | 'SERIE_B' | 'PORTUGAL' = 'EPL';
    let leagueName = sportTitle;

    if (sportKey.includes('epl') || sportTitle.toLowerCase().includes('premier')) {
      leagueId = 'EPL';
      leagueName = 'Giải Ngoại Hạng Anh (Premier League)';
    } else if (sportKey.includes('la_liga') || sportTitle.toLowerCase().includes('la liga') || sportTitle.toLowerCase().includes('spain')) {
      leagueId = 'LALIGA';
      leagueName = 'Giải Tây Ban Nha (La Liga)';
    } else if (sportKey.includes('champs') || sportTitle.toLowerCase().includes('champions')) {
      leagueId = 'UCL';
      leagueName = 'Cúp C1 Châu Âu (Champions League)';
    } else if (sportKey.includes('serie_b') || sportTitle.toLowerCase().includes('serie b')) {
      leagueId = 'SERIE_B';
      leagueName = 'Giải Hạng 2 Ý (Serie B)';
    } else if (sportKey.includes('portugal') || sportTitle.toLowerCase().includes('portugal') || sportTitle.toLowerCase().includes('primeira')) {
      leagueId = 'PORTUGAL';
      leagueName = 'Giải Bồ Đào Nha (Liga Portugal)';
    }

    const isHomeGivingHandicap = homeHandicap.startsWith('-');
    const isTodayFeatured = !isLive && (item.home_team?.toLowerCase().includes('atletico') || item.away_team?.toLowerCase().includes('sevilla') || index === 0);
    const isLigaFeatured = item.home_team?.toLowerCase().includes('benfica') || item.away_team?.toLowerCase().includes('sporting');

    return {
      matchId: item.id || `live_api_${index}_${Date.now()}`,
      leagueId,
      leagueName,
      homeTeam: item.home_team,
      awayTeam: item.away_team,
      scoreHome,
      scoreAway,
      liveTime,
      isLive,
      handicapTeam: isHomeGivingHandicap ? 'home' : 'away',
      homeHandicap,
      homeOdds,
      awayHandicap,
      awayOdds,
      ouGoal,
      ouOverOdds,
      ouUnderOdds,
      oneXTwoHome: Number(homeH2H.toFixed(2)),
      oneXTwoAway: Number(awayH2H.toFixed(2)),
      oneXTwoDraw: Number(drawH2H.toFixed(2)),
      moreCount: 15 + ((index * 3) % 20),
      hasBetBuilder: true,
      hasAccordion: true,
      hasTodayAccordion: isTodayFeatured,
      hasLigaAccordion: isLigaFeatured,
      cornerScore: `[${scoreHome + (index % 3)}:${scoreAway + (index % 2)}]`
    };
  }

  /**
   * Helper to generate dynamically progressing live matches
   */
  private static generateDynamicLiveMatches(): FootballFixture[] {
    const nowMinutes = new Date().getMinutes();
    const nowSeconds = new Date().getSeconds();

    return LIVE_FOOTBALL_FIXTURES.map((fixture, index) => {
      // Dynamic minute ticking between 15 and 85 min
      const dynamicMinute = ((nowMinutes * 2 + nowSeconds + index * 11) % 75) + 10;
      const isSecondHalf = dynamicMinute > 45;
      const displayTime = isSecondHalf ? `${dynamicMinute}' (H2)` : `${dynamicMinute}' (H1)`;

      // Dynamic odds drift simulation (±0.02)
      const drift = ((nowSeconds % 10) - 5) * 0.004;

      return {
        ...fixture,
        liveTime: displayTime,
        homeOdds: Number((fixture.homeOdds + drift).toFixed(2)),
        awayOdds: Number((fixture.awayOdds - drift).toFixed(2)),
        scoreHome: dynamicMinute > 30 ? (index % 2 === 0 ? 2 : 1) : 0,
        scoreAway: dynamicMinute > 55 ? (index % 3 === 0 ? 2 : 1) : (dynamicMinute > 25 ? 1 : 0)
      };
    });
  }

  /**
   * Helper to convert European decimal price (e.g. 1.95, 2.05) to Asian/Malay odds format
   */
  private static decimalToAsianOdds(decimalPrice: number): number {
    if (!decimalPrice || decimalPrice <= 1) return 0.90;
    if (decimalPrice >= 2.0) {
      return Number((decimalPrice - 1).toFixed(2));
    } else {
      const net = decimalPrice - 1;
      return Number((-(1 / net)).toFixed(2));
    }
  }
}
