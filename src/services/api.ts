// API Client Service for Fanclub68 / SBOBET Platform
// Connects Frontend to Line 1 (Sports), Line 2 (Cockfight), Line 3 (Casino), and Core Delay Queue

const getBaseUrl = (): string => {
  // If Vite env VITE_API_URL is configured (e.g. Render production URL), use it
  const envApiUrl = (import.meta as any).env?.VITE_API_URL;
  if (envApiUrl) {
    return String(envApiUrl).replace(/\/$/, '');
  }
  // Otherwise in local dev default to port 3000
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  return '';
};

export const API_BASE_URL = getBaseUrl();

async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<{ data: T | null; error: string | null }> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      return { data: null, error: errJson?.error || errJson?.message || `HTTP ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message || 'Network error' };
  }
}

export interface QuotaMetricsData {
  monthlyLimit: number;
  usedCalls: number;
  remainingCalls: number;
  cacheHitRate: number;
  totalRequests: number;
  cacheHits: number;
  status: 'NOMINAL' | 'WARNING' | 'EMERGENCY_THROTTLE';
}

export interface BetQueueItem {
  id: string;
  userId: string;
  type: string;
  stake: number;
  potentialPayout: number;
  status: 'QUEUED' | 'CONFIRMED' | 'REJECTED';
  delayTier: 1 | 2 | 3;
  delaySeconds: number;
  placedAt: string;
  evaluatedAt?: string;
  rejectionReason?: string;
}

export const ApiService = {
  // Server Health Check
  async checkHealth() {
    return safeFetch<{
      status: string;
      service: string;
      environment: string;
      lines: Record<string, string>;
    }>('/health');
  },

  // LINE 1: Sports & Quota
  async getLiveMatches(sport: string = 'soccer') {
    return safeFetch<{
      line: string;
      sport: string;
      count: number;
      matches: any[];
    }>(`/api/line1/sports/live?sport=${sport}`);
  },

  async getQuotaMetrics() {
    return safeFetch<{
      line: string;
      metrics: QuotaMetricsData;
    }>('/api/line1/sports/quota');
  },

  // LINE 2: Cockfight
  async getCockfightArenas() {
    return safeFetch<{
      line: string;
      count: number;
      arenas: any[];
    }>('/api/line2/cockfight/arenas');
  },

  async placeCockfightBet(arenaId: string, choice: string, stake: number) {
    return safeFetch<{
      success: boolean;
      message: string;
    }>('/api/line2/cockfight/bet', {
      method: 'POST',
      body: JSON.stringify({ arenaId, choice, stake })
    });
  },

  // LINE 3: Casino & Telegram Webhook
  async getTaiXiuState() {
    return safeFetch<{
      line: string;
      state: any;
      isBettingOpen: boolean;
    }>('/api/line3/internal/casino/taixiu/state');
  },

  async getXocDiaState() {
    return safeFetch<{
      line: string;
      state: any;
    }>('/api/line3/internal/casino/xocdia/state');
  },

  async setAdminOverride(game: 'taixiu' | 'xocdia', target: string) {
    return safeFetch<{
      success: boolean;
      message: string;
    }>('/api/line3/internal/admin/override', {
      method: 'POST',
      body: JSON.stringify({ game, target })
    });
  },

  // Core Anti-Latency Delay Queue
  async placeBet(payload: {
    userId: string;
    type: string;
    selections: Array<{ matchId: string; type: string; oddsAtPlacement: number }>;
    stake: number;
  }) {
    return safeFetch<{
      success: boolean;
      bet?: BetQueueItem;
      message?: string;
      wallet?: { balance: number; inPlayBalance: number };
      error?: string;
    }>('/api/bets/place', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getQueue() {
    return safeFetch<{
      tier: 1 | 2 | 3;
      count: number;
      bets: BetQueueItem[];
    }>('/api/bets/queue');
  },

  async setPlatformTier(tier: 1 | 2 | 3) {
    return safeFetch<{
      success: boolean;
      tier: 1 | 2 | 3;
    }>('/api/bets/tier', {
      method: 'POST',
      body: JSON.stringify({ tier })
    });
  },

  // Double-Entry Wallet Ledger
  async getWallet() {
    return safeFetch<{
      balance: number;
      inPlayBalance: number;
      history: any[];
    }>('/api/wallet');
  },

  async depositWallet(amount: number) {
    return safeFetch<{
      success: boolean;
      wallet: { balance: number; inPlayBalance: number; history: any[] };
    }>('/api/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  },

  async resetWallet() {
    return safeFetch<{
      success: boolean;
      wallet: { balance: number; inPlayBalance: number };
    }>('/api/wallet/reset', {
      method: 'POST'
    });
  },

  // Milestone 2 Admin Management & Agent Hierarchy
  async getHierarchy() {
    return safeFetch<{
      success: boolean;
      totalAccounts: number;
      summary: {
        masters: number;
        agents: number;
        members: number;
        activeAccounts: number;
        suspendedAccounts: number;
      };
      accounts: Array<{
        id: string;
        username: string;
        name: string;
        role: 'SUPER_ADMIN' | 'MASTER' | 'AGENT' | 'MEMBER';
        uplineId: string | null;
        creditLimit: number;
        balance: number;
        status: 'ACTIVE' | 'SUSPENDED';
        activePlayersCount?: number;
        phone?: string;
        createdAt: string;
      }>;
    }>('/api/admin/hierarchy');
  },

  async distributeCredit(targetAccountId: string, amount: number, type: 'ALLOCATE' | 'RECALL' = 'ALLOCATE', note?: string) {
    return safeFetch<{
      success: boolean;
      message: string;
      targetAccount: any;
      transaction: any;
    }>('/api/admin/credit/distribute', {
      method: 'POST',
      body: JSON.stringify({ targetAccountId, amount, type, note })
    });
  },

  async toggleUserSuspension(accountId: string, reason?: string) {
    return safeFetch<{
      success: boolean;
      message: string;
      account: any;
      reason?: string;
    }>('/api/admin/users/toggle-suspend', {
      method: 'POST',
      body: JSON.stringify({ accountId, reason })
    });
  },

  async getAuditLogs() {
    return safeFetch<{
      success: boolean;
      count: number;
      logs: Array<{
        id: string;
        timestamp: string;
        sourceAccount: string;
        targetAccount: string;
        amount: number;
        type: 'ALLOCATE' | 'RECALL';
        note: string;
        executedBy: string;
      }>;
    }>('/api/admin/audit-logs');
  }
};

