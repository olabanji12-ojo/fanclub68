import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  DollarSign, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Bot, 
  Cpu, 
  ArrowLeft, 
  LogOut, 
  Key, 
  Search, 
  RefreshCw,
  ChevronRight,
  UserCheck,
  UserX,
  TrendingUp,
  History,
  Lock,
  Layers,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { ApiService, QuotaMetricsData } from '../services/api';

export interface AdminPortalAccount {
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
}

export interface CreditAuditItem {
  id: string;
  timestamp: string;
  sourceAccount: string;
  targetAccount: string;
  amount: number;
  type: 'ALLOCATE' | 'RECALL';
  note: string;
  executedBy: string;
}

export const SbobetAdminPortal: React.FC<{ isModal?: boolean; onClose?: () => void }> = ({ isModal = false, onClose }) => {
  const {
    setCurrentView,
    platformTier,
    setPlatformTier,
    casinoOverride,
    setCasinoOverride,
    quotaUsed,
    simulateQuota,
    resetQuota
  } = useSbobetStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Pre-authenticated for immediate staging test, but login gate can be toggled
  const [loginEmail, setLoginEmail] = useState<string>('superadmin@sbobet.com');
  const [loginPassword, setLoginPassword] = useState<string>('SuperAdmin2026!');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'HIERARCHY' | 'CREDIT' | 'SUSPENSION' | 'ANTILATENCY' | 'RNG'>('HIERARCHY');

  // Hierarchy Data
  const [accounts, setAccounts] = useState<AdminPortalAccount[]>([
    {
      id: 'ACC_ROOT_001',
      username: 'superadmin',
      name: 'Super Admin Master Core',
      role: 'SUPER_ADMIN',
      uplineId: null,
      creditLimit: 50000000,
      balance: 9425000,
      status: 'ACTIVE',
      createdAt: '2026-09-01T00:00:00Z'
    },
    {
      id: 'ACC_MST_001',
      username: 'master_hcm_01',
      name: 'Master Agent — Southern Vietnam',
      role: 'MASTER',
      uplineId: 'ACC_ROOT_001',
      creditLimit: 2000000,
      balance: 485000,
      status: 'ACTIVE',
      activePlayersCount: 42,
      phone: '+84 908 112 334',
      createdAt: '2026-09-02T10:30:00Z'
    },
    {
      id: 'ACC_MST_002',
      username: 'master_danang_02',
      name: 'Master Agent — Central Region',
      role: 'MASTER',
      uplineId: 'ACC_ROOT_001',
      creditLimit: 1000000,
      balance: 210000,
      status: 'ACTIVE',
      activePlayersCount: 19,
      phone: '+84 913 554 789',
      createdAt: '2026-09-03T11:15:00Z'
    },
    {
      id: 'ACC_AGT_001',
      username: 'agent_quan1',
      name: 'Agent District 1 (Ben Nghe)',
      role: 'AGENT',
      uplineId: 'ACC_MST_001',
      creditLimit: 250000,
      balance: 76500,
      status: 'ACTIVE',
      activePlayersCount: 24,
      phone: '+84 938 776 221',
      createdAt: '2026-09-04T09:00:00Z'
    },
    {
      id: 'ACC_AGT_002',
      username: 'agent_binhthanh',
      name: 'Agent Binh Thanh (D2 Hub)',
      role: 'AGENT',
      uplineId: 'ACC_MST_001',
      creditLimit: 180000,
      balance: 34200,
      status: 'ACTIVE',
      activePlayersCount: 18,
      phone: '+84 947 889 001',
      createdAt: '2026-09-04T14:20:00Z'
    },
    {
      id: 'ACC_AGT_003',
      username: 'agent_haichau',
      name: 'Agent Da Nang Hai Chau',
      role: 'AGENT',
      uplineId: 'ACC_MST_002',
      creditLimit: 150000,
      balance: 88000,
      status: 'ACTIVE',
      activePlayersCount: 19,
      phone: '+84 905 443 210',
      createdAt: '2026-09-05T08:45:00Z'
    },
    {
      id: 'ACC_USR_001',
      username: 'player88',
      name: 'Tran Van H.',
      role: 'MEMBER',
      uplineId: 'ACC_AGT_001',
      creditLimit: 20000,
      balance: 2450,
      status: 'ACTIVE',
      createdAt: '2026-09-06T12:00:00Z'
    },
    {
      id: 'ACC_USR_002',
      username: 'bettor_vip',
      name: 'Nguyen Minh T.',
      role: 'MEMBER',
      uplineId: 'ACC_AGT_001',
      creditLimit: 50000,
      balance: 8900,
      status: 'ACTIVE',
      createdAt: '2026-09-06T15:30:00Z'
    },
    {
      id: 'ACC_USR_003',
      username: 'lucky_strike',
      name: 'Le Hoang K.',
      role: 'MEMBER',
      uplineId: 'ACC_AGT_002',
      creditLimit: 10000,
      balance: 350,
      status: 'SUSPENDED',
      createdAt: '2026-09-07T16:10:00Z'
    }
  ]);

  // Credit Distribution Form State
  const [selectedTargetId, setSelectedTargetId] = useState<string>('master_hcm_01');
  const [creditAmount, setCreditAmount] = useState<string>('10000');
  const [creditType, setCreditType] = useState<'ALLOCATE' | 'RECALL'>('ALLOCATE');
  const [creditNote, setCreditNote] = useState<string>('Milestone 2 virtual credit allocation');
  const [distributionSuccess, setDistributionSuccess] = useState<string | null>(null);

  // Credit Audit Logs
  const [auditLogs, setAuditLogs] = useState<CreditAuditItem[]>([
    {
      id: 'TX_CRD_178904001',
      timestamp: '2026-09-08 09:12:00',
      sourceAccount: 'superadmin',
      targetAccount: 'master_hcm_01',
      amount: 100000,
      type: 'ALLOCATE',
      note: 'Initial Weekly Staging Allocation',
      executedBy: 'Super Admin'
    },
    {
      id: 'TX_CRD_178904002',
      timestamp: '2026-09-08 10:45:00',
      sourceAccount: 'master_hcm_01',
      targetAccount: 'agent_quan1',
      amount: 30000,
      type: 'ALLOCATE',
      note: 'Sub-tier credit distribution',
      executedBy: 'master_hcm_01'
    },
    {
      id: 'TX_CRD_178904003',
      timestamp: '2026-09-09 14:20:00',
      sourceAccount: 'agent_quan1',
      targetAccount: 'bettor_vip',
      amount: 5000,
      type: 'ALLOCATE',
      note: 'Member deposit grant',
      executedBy: 'agent_quan1'
    }
  ]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'MASTER' | 'AGENT' | 'MEMBER'>('ALL');

  // Simulated Account Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newAccName, setNewAccName] = useState<string>('');
  const [newAccUsername, setNewAccUsername] = useState<string>('');
  const [newAccRole, setNewAccRole] = useState<'MASTER' | 'AGENT' | 'MEMBER'>('AGENT');
  const [newAccUplineId, setNewAccUplineId] = useState<string>('ACC_ROOT_001');
  const [newAccCreditLimit, setNewAccCreditLimit] = useState<string>('50000');
  const [newAccInitialBalance, setNewAccInitialBalance] = useState<string>('10000');
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);

  // Quota & Health
  const [liveQuota, setLiveQuota] = useState<QuotaMetricsData | null>(null);
  const [backendHealth, setBackendHealth] = useState<string>('Connecting...');

  // Fetch real data from backend on mount
  useEffect(() => {
    fetchBackendHierarchy();
    ApiService.getQuotaMetrics().then(({ data }) => {
      if (data?.metrics) setLiveQuota(data.metrics);
    });
    ApiService.checkHealth().then(({ data, error }) => {
      if (data?.status === 'HEALTHY') {
        setBackendHealth('Line 1-3 Online (Port 3000)');
      } else {
        setBackendHealth(error ? 'Local Staging Standalone' : 'Active');
      }
    });
  }, []);

  const fetchBackendHierarchy = async () => {
    const { data } = await ApiService.getHierarchy();
    if (data?.accounts && data.accounts.length > 0) {
      setAccounts(data.accounts as AdminPortalAccount[]);
    }
    const logsRes = await ApiService.getAuditLogs();
    if (logsRes.data?.logs && logsRes.data.logs.length > 0) {
      setAuditLogs(logsRes.data.logs as CreditAuditItem[]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (loginEmail === 'superadmin@sbobet.com' || loginEmail === 'superadmin') &&
      loginPassword === 'SuperAdmin2026!'
    ) {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid Super Admin credentials. Use superadmin@sbobet.com / SuperAdmin2026!');
    }
  };

  const handleQuickLogin = () => {
    setLoginEmail('superadmin@sbobet.com');
    setLoginPassword('SuperAdmin2026!');
    setIsAuthenticated(true);
    setLoginError(null);
  };

  // Toggle User Suspension
  const handleToggleSuspend = async (accountId: string) => {
    // Optimistic UI update
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId || acc.username === accountId) {
        return {
          ...acc,
          status: acc.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        };
      }
      return acc;
    }));

    // Call backend API
    const res = await ApiService.toggleUserSuspension(accountId, 'Admin manual status toggle');
    if (res.data?.account) {
      setDistributionSuccess(`Toggled status for ${res.data.account.username}: ${res.data.account.status}`);
      setTimeout(() => setDistributionSuccess(null), 3500);
    }
  };

  // Manual Credit Distribution Execution
  const handleDistributeCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(creditAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid credit amount.');
      return;
    }

    const target = accounts.find(a => a.id === selectedTargetId || a.username === selectedTargetId);
    if (!target) return;

    if (target.status === 'SUSPENDED') {
      alert(`Cannot distribute: Account ${target.username} is SUSPENDED!`);
      return;
    }

    // Call backend API
    const res = await ApiService.distributeCredit(selectedTargetId, amt, creditType, creditNote);

    // Update local state
    setAccounts(prev => prev.map(acc => {
      if (acc.id === selectedTargetId || acc.username === selectedTargetId) {
        return {
          ...acc,
          balance: creditType === 'ALLOCATE' ? acc.balance + amt : Math.max(0, acc.balance - amt)
        };
      }
      return acc;
    }));

    // Prepend audit log
    const newTx: CreditAuditItem = {
      id: `TX_CRD_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sourceAccount: 'superadmin',
      targetAccount: target.username,
      amount: amt,
      type: creditType,
      note: creditNote,
      executedBy: 'Super Admin'
    };
    setAuditLogs(prev => [newTx, ...prev]);

    setDistributionSuccess(
      res.data?.message || `Successfully ${creditType === 'ALLOCATE' ? 'allocated' : 'recalled'} $${amt.toLocaleString()} for ${target.name} (${target.username})!`
    );
    setTimeout(() => setDistributionSuccess(null), 4000);
  };

  // Create Simulated Account (Milestone 2 User Verification)
  const handleCreateSimulatedAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccUsername.trim() || !newAccName.trim()) {
      alert('Please fill in Account Name and Username.');
      return;
    }

    setIsCreatingAccount(true);
    const limit = parseFloat(newAccCreditLimit) || 50000;
    const balance = parseFloat(newAccInitialBalance) || 0;

    const res = await ApiService.createAccount({
      username: newAccUsername,
      name: newAccName,
      role: newAccRole,
      uplineId: newAccUplineId,
      creditLimit: limit,
      initialBalance: balance
    });

    const cleanUser = newAccUsername.trim().toLowerCase().replace(/\s+/g, '_');
    const created: AdminPortalAccount = (res.data?.account as AdminPortalAccount) || {
      id: `ACC_${newAccRole.slice(0, 3)}_${Math.floor(100 + Math.random() * 900)}`,
      username: cleanUser,
      name: newAccName.trim(),
      role: newAccRole,
      uplineId: newAccUplineId,
      creditLimit: limit,
      balance: balance,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    setAccounts(prev => [created, ...prev]);

    if (balance > 0) {
      const tx: CreditAuditItem = {
        id: `TX_CRD_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        sourceAccount: newAccUplineId || 'superadmin',
        targetAccount: created.username,
        amount: balance,
        type: 'ALLOCATE',
        note: 'Initial simulated account creation grant',
        executedBy: 'Super Admin'
      };
      setAuditLogs(prev => [tx, ...prev]);
    }

    setIsCreatingAccount(false);
    setIsCreateModalOpen(false);
    setNewAccName('');
    setNewAccUsername('');
    setDistributionSuccess(`Simulated account "${created.name}" (@${created.username}) created successfully!`);
    setTimeout(() => setDistributionSuccess(null), 4000);
  };

  // Filtered accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = 
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || acc.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate totals
  const totalMasterCount = accounts.filter(a => a.role === 'MASTER').length;
  const totalAgentCount = accounts.filter(a => a.role === 'AGENT').length;
  const totalMemberCount = accounts.filter(a => a.role === 'MEMBER').length;
  const totalCirculatingCredit = accounts
    .filter(a => a.role !== 'SUPER_ADMIN')
    .reduce((sum, a) => sum + a.balance, 0);

  // 1. LOGIN GATE FOR TESTING
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070E20] flex items-center justify-center p-4 font-sans text-white select-none">
        <div className="max-w-md w-full bg-[#0D1836] border border-blue-900/60 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-yellow-400 to-emerald-500" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black font-black text-2xl shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>SBOBET ADMIN PORTAL</span>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded uppercase">Staging</span>
              </h1>
              <p className="text-xs text-blue-300">Milestone 2 Acceptance & Risk Center</p>
            </div>
          </div>

          <div className="bg-blue-950/70 border border-blue-800/80 rounded-xl p-3 mb-6 text-xs text-blue-200">
            <div className="font-bold text-yellow-400 flex items-center gap-1 mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Test Super Admin Credentials:</span>
            </div>
            <div className="font-mono text-[11px] space-y-0.5 text-white">
              <div>Username: <span className="text-amber-300">superadmin@sbobet.com</span></div>
              <div>Password: <span className="text-amber-300">SuperAdmin2026!</span></div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1">Admin Email / Username</label>
              <input
                type="text"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
                required
              />
            </div>

            {loginError && (
              <div className="text-xs text-red-400 bg-red-950/60 border border-red-800 p-2 rounded-lg">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-[#0B4DA2] hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-md text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Login to Admin Portal</span>
            </button>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>⚡ 1-Click Quick Login as Super Admin</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-blue-900/60 text-center">
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                else setCurrentView('sbobet');
              }}
              className="text-xs text-blue-400 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to SBOBET Sportsbook</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED SUPER ADMIN CONTROL PORTAL
  return (
    <div className={`${isModal ? 'fixed inset-0 z-50 overflow-y-auto' : 'min-h-screen'} bg-[#070E20] text-gray-100 font-sans flex flex-col select-none`}>
      
      {/* Top Corporate Command Bar */}
      <header className="bg-[#0B1530] border-b border-blue-900/70 sticky top-0 z-30 shadow-lg px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-white">SBOBET ADMIN PORTAL</span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Super Admin
                </span>
                <span className="text-[10px] bg-blue-900/80 text-blue-300 border border-blue-700 px-2 py-0.5 rounded-full hidden md:inline">
                  {backendHealth}
                </span>
              </div>
              <div className="text-[11px] text-blue-300">
                Milestone 2 Acceptance • Master/Agent Pyramid • Virtual Credit Ledger
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 bg-[#070D1F] border border-blue-900 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-gray-400">Reserve Vault:</span>
              <span className="font-black text-emerald-400 font-mono text-sm">
                ${accounts[0]?.balance.toLocaleString() || '9,425,000'}
              </span>
            </div>

            <button
              onClick={() => fetchBackendHierarchy()}
              className="p-1.5 bg-[#0D1D45] hover:bg-[#12285E] text-blue-200 hover:text-white rounded-lg border border-blue-800 transition-colors"
              title="Refresh Hierarchy Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (onClose) onClose();
                else setCurrentView('sbobet');
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>SBOBET Sports</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-2.5 py-1.5 bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-200 hover:text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Logout / Switch Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="bg-[#0A132B] border-b border-blue-900/60 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1">
          {[
            { id: 'HIERARCHY' as const, label: 'Master / Agent Hierarchy', icon: Users, count: accounts.length },
            { id: 'CREDIT' as const, label: 'Virtual Credit Distribution', icon: DollarSign },
            { id: 'SUSPENSION' as const, label: 'User Suspension Toggle', icon: Ban, count: accounts.filter(a => a.status === 'SUSPENDED').length },
            { id: 'ANTILATENCY' as const, label: 'Anti-Latency Delay (Redis)', icon: Activity },
            { id: 'RNG' as const, label: '5s Buffer RNG Overrule', icon: Bot }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-blue-900 text-blue-200'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">

        {/* Global Feedback Banner */}
        {distributionSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{distributionSuccess}</span>
          </div>
        )}

        {/* ════════ TAB 1: MASTER / AGENT HIERARCHY ════════ */}
        {activeTab === 'HIERARCHY' && (
          <div className="space-y-4">
            
            {/* Metric KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0D1A3B] border border-blue-900/80 rounded-xl p-3 sm:p-4">
                <div className="text-[11px] text-blue-300 font-bold uppercase">Master Agents</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">{totalMasterCount}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Super Senior Tier</div>
              </div>

              <div className="bg-[#0D1A3B] border border-blue-900/80 rounded-xl p-3 sm:p-4">
                <div className="text-[11px] text-blue-300 font-bold uppercase">Active Sub-Agents</div>
                <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">{totalAgentCount}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Level 2 Distributors</div>
              </div>

              <div className="bg-[#0D1A3B] border border-blue-900/80 rounded-xl p-3 sm:p-4">
                <div className="text-[11px] text-blue-300 font-bold uppercase">Active Members</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{totalMemberCount}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Bettors in Network</div>
              </div>

              <div className="bg-[#0D1A3B] border border-blue-900/80 rounded-xl p-3 sm:p-4">
                <div className="text-[11px] text-blue-300 font-bold uppercase">Circulating Credit</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
                  ${totalCirculatingCredit.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Allocated Virtual Value</div>
              </div>
            </div>

            {/* Hierarchy Tree Visual Explanation */}
            <div className="bg-gradient-to-r from-blue-950/40 via-[#0E204A] to-blue-950/40 border border-blue-800/60 rounded-xl p-4">
              <div className="text-xs font-black text-yellow-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Layers className="w-4 h-4" />
                <span>Asian Betting Agent Tree Architecture</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-black/40 border border-yellow-500/40 text-yellow-300">
                  <div className="font-bold text-[11px] text-yellow-400">LEVEL 0: Super Admin</div>
                  <div className="text-[10px] text-gray-300 mt-1">Holds Company Credit Pool ($50M). Allocates credits to Senior Masters.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-blue-500/40 text-blue-300">
                  <div className="font-bold text-[11px] text-blue-400">LEVEL 1: Master Agent</div>
                  <div className="text-[10px] text-gray-300 mt-1">Regional hubs (e.g. Master HCM, Master Danang). Holds $1M-$2M credit limit.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/40 text-emerald-300">
                  <div className="font-bold text-[11px] text-emerald-400">LEVEL 2: Sub-Agent</div>
                  <div className="text-[10px] text-gray-300 mt-1">Direct agent outlets (Quan 1, Binh Thanh). Distributes credit directly to members.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-purple-500/40 text-purple-300">
                  <div className="font-bold text-[11px] text-purple-400">LEVEL 3: Member</div>
                  <div className="text-[10px] text-gray-300 mt-1">End players. Place wagers on sports, casino, and cockfight.</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D1A3B] p-3 rounded-xl border border-blue-900/60">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search username, ID, or name..."
                    className="w-full bg-[#070D1F] border border-blue-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                {(['ALL', 'MASTER', 'AGENT', 'MEMBER'] as const).map(rf => (
                  <button
                    key={rf}
                    onClick={() => setRoleFilter(rf)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                      roleFilter === rf
                        ? 'bg-yellow-400 text-black'
                        : 'bg-[#070D1F] text-blue-200 hover:text-white border border-blue-800'
                    }`}
                  >
                    {rf}
                  </button>
                ))}

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="ml-2 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
                  title="Create a new simulated Master, Agent, or Member account"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Create Account</span>
                </button>
              </div>
            </div>

            {/* Hierarchy Accounts Table */}
            <div className="bg-[#0D1A3B] border border-blue-900/60 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#081229] text-gray-400 uppercase text-[10px] tracking-wider border-b border-blue-900/70">
                    <tr>
                      <th className="py-3 px-3">Tier / Account</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Upline Master</th>
                      <th className="py-3 px-3 text-right">Credit Limit</th>
                      <th className="py-3 px-3 text-right">Available Balance</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/40 text-gray-200">
                    {filteredAccounts.map(acc => {
                      const isSuper = acc.role === 'SUPER_ADMIN';
                      const isMaster = acc.role === 'MASTER';
                      const isAgent = acc.role === 'AGENT';
                      const isMember = acc.role === 'MEMBER';

                      return (
                        <tr 
                          key={acc.id}
                          className={`hover:bg-blue-950/40 transition-colors ${
                            acc.status === 'SUSPENDED' ? 'bg-red-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                acc.status === 'ACTIVE' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-500'
                              }`} />
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{acc.name}</span>
                                  {isSuper && <span className="text-[9px] bg-yellow-400 text-black px-1 rounded font-black">ROOT</span>}
                                </div>
                                <div className="text-[11px] text-blue-300 font-mono">@{acc.username} • {acc.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              isSuper ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-500/40' :
                              isMaster ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                              isAgent ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                              'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            }`}>
                              {acc.role}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-mono text-[11px] text-gray-400">
                            {acc.uplineId ? (
                              <span className="text-blue-300 hover:underline">{acc.uplineId}</span>
                            ) : (
                              <span className="text-gray-500">— (Company)</span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right font-mono font-semibold text-gray-300">
                            ${acc.creditLimit.toLocaleString()}
                          </td>

                          <td className="py-3 px-3 text-right font-mono font-black text-sm text-emerald-400">
                            ${acc.balance.toLocaleString()}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => !isSuper && handleToggleSuspend(acc.id)}
                              disabled={isSuper}
                              className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase transition-all flex items-center justify-center gap-1 mx-auto ${
                                acc.status === 'ACTIVE'
                                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/50'
                                  : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50'
                              } ${isSuper ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              title={isSuper ? 'Root account cannot be suspended' : 'Click to Toggle Suspension'}
                            >
                              {acc.status === 'ACTIVE' ? (
                                <>
                                  <UserCheck className="w-3 h-3 text-emerald-400" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <UserX className="w-3 h-3 text-red-400" />
                                  <span>Suspended</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedTargetId(acc.username);
                                  setActiveTab('CREDIT');
                                }}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-all cursor-pointer shadow"
                                title="Distribute virtual credit to this account"
                              >
                                + Distribute
                              </button>
                              
                              {!isSuper && (
                                <button
                                  onClick={() => handleToggleSuspend(acc.id)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                                    acc.status === 'ACTIVE'
                                      ? 'bg-red-950/60 hover:bg-red-900 border-red-800 text-red-300'
                                      : 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-800 text-emerald-300'
                                  }`}
                                >
                                  {acc.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ════════ TAB 2: MANUAL VIRTUAL CREDIT DISTRIBUTION ════════ */}
        {activeTab === 'CREDIT' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Credit Allocation Form */}
              <div className="lg:col-span-5 bg-[#0D1A3B] border border-blue-900/60 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="border-b border-blue-900/70 pb-3">
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Manual Virtual Credit Allocator</span>
                  </div>
                  <div className="text-[11px] text-blue-300 mt-0.5">
                    Direct top-up / recall framework from Super Admin to any downline account
                  </div>
                </div>

                <form onSubmit={handleDistributeCredit} className="space-y-4">
                  
                  {/* Select Account */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Target Account:
                    </label>
                    <select
                      value={selectedTargetId}
                      onChange={e => setSelectedTargetId(e.target.value)}
                      className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                    >
                      {accounts.map(a => (
                        <option key={a.id} value={a.username} disabled={a.status === 'SUSPENDED'}>
                          [{a.role}] {a.name} (@{a.username}) — Bal: ${a.balance.toLocaleString()} {a.status === 'SUSPENDED' ? '(SUSPENDED)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Allocation or Recall */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Action Type:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCreditType('ALLOCATE')}
                        className={`py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          creditType === 'ALLOCATE'
                            ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                            : 'bg-[#070D1F] text-gray-400 hover:text-white border border-blue-900'
                        }`}
                      >
                        <span>+ Allocate (Nạp Cược)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCreditType('RECALL')}
                        className={`py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          creditType === 'RECALL'
                            ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                            : 'bg-[#070D1F] text-gray-400 hover:text-white border border-blue-900'
                        }`}
                      >
                        <span>- Recall (Thu Hồi)</span>
                      </button>
                    </div>
                  </div>

                  {/* Amount Input & Quick Chips */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Credit Amount (USD / Points):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="100"
                        step="100"
                        value={creditAmount}
                        onChange={e => setCreditAmount(e.target.value)}
                        className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-sm text-yellow-400 font-mono font-black focus:outline-none focus:border-yellow-400"
                        placeholder="Enter amount..."
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                        CREDIT
                      </span>
                    </div>

                    {/* Quick Amount Chips */}
                    <div className="grid grid-cols-5 gap-1 mt-2">
                      {['1000', '5000', '10000', '50000', '100000'].map(chipVal => (
                        <button
                          key={chipVal}
                          type="button"
                          onClick={() => setCreditAmount(chipVal)}
                          className="py-1 bg-[#070D1F] hover:bg-blue-900 border border-blue-800 rounded text-[10px] font-mono text-blue-200 transition-colors cursor-pointer"
                        >
                          +${parseInt(chipVal) >= 1000 ? `${parseInt(chipVal) / 1000}k` : chipVal}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Memo Note */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Ledger Memo / Note:
                    </label>
                    <input
                      type="text"
                      value={creditNote}
                      onChange={e => setCreditNote(e.target.value)}
                      className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Weekly agent settlement, bonus grant"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Execute Virtual Credit Transfer</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Real-Time Audit Ledger */}
              <div className="lg:col-span-7 bg-[#0D1A3B] border border-blue-900/60 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-blue-900/70 pb-3">
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-400" />
                    <span>Credit Distribution Audit Trail</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {auditLogs.length} Transactions Logged
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#081229] text-gray-400 uppercase text-[9px] tracking-wider sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Tx ID / Time</th>
                        <th className="py-2.5 px-3">Target Account</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Memo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-900/40 text-gray-200">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-blue-950/40">
                          <td className="py-2.5 px-3 font-mono text-[10px]">
                            <div className="text-blue-300 font-bold">{log.id}</div>
                            <div className="text-gray-500">{log.timestamp}</div>
                          </td>

                          <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-white">
                            @{log.targetAccount}
                          </td>

                          <td className="py-2.5 px-3 text-right font-mono font-black text-xs text-emerald-400">
                            {log.type === 'ALLOCATE' ? '+' : '-'}${log.amount.toLocaleString()}
                          </td>

                          <td className="py-2.5 px-3">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                              log.type === 'ALLOCATE' 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {log.type}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-[11px] text-gray-400 truncate max-w-[160px]">
                            {log.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ════════ TAB 3: USER SUSPENSION CONTROLLER ════════ */}
        {activeTab === 'SUSPENSION' && (
          <div className="space-y-4">
            
            <div className="bg-red-950/30 border border-red-800/60 rounded-xl p-4 text-xs text-red-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">Real-Time User Suspension & Safety Locking</div>
                <p className="mt-1 text-red-300 text-[11px] leading-relaxed">
                  Toggling an account to <b>SUSPENDED</b> immediately revokes its betting gate permissions, blocks all incoming ticket packets, and freezes virtual credit balance transfers across all transmission lines.
                </p>
              </div>
            </div>

            <div className="bg-[#0D1A3B] border border-blue-900/60 rounded-xl overflow-hidden shadow-xl">
              <div className="p-3 border-b border-blue-900/70 flex items-center justify-between">
                <span className="font-bold text-xs text-white">All Master, Agent, and Member Accounts</span>
                <span className="text-[10px] text-gray-400">Click any switch to toggle suspension</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#081229] text-gray-400 uppercase text-[10px] tracking-wider border-b border-blue-900/70">
                    <tr>
                      <th className="py-3 px-3">Account</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3 text-right">Available Credit</th>
                      <th className="py-3 px-3 text-center">Current Status</th>
                      <th className="py-3 px-3 text-center">Suspension Switch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/40">
                    {accounts.map(acc => {
                      const isSuper = acc.role === 'SUPER_ADMIN';
                      const isSuspended = acc.status === 'SUSPENDED';

                      return (
                        <tr key={acc.id} className={isSuspended ? 'bg-red-950/30' : 'hover:bg-blue-950/30'}>
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">@{acc.username}</div>
                            <div className="text-[11px] text-gray-400">{acc.name} • {acc.id}</div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                              {acc.role}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                            ${acc.balance.toLocaleString()}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              isSuspended
                                ? 'bg-red-600 text-white'
                                : 'bg-emerald-600 text-white'
                            }`}>
                              {acc.status}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            {isSuper ? (
                              <span className="text-[10px] text-gray-500">Root Account</span>
                            ) : (
                              <button
                                onClick={() => handleToggleSuspend(acc.id)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                  isSuspended
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                    : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                }`}
                              >
                                {isSuspended ? '✓ Reinstate (Unsuspend)' : '⛔ Suspend User'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ════════ TAB 4: ANTI-LATENCY DELAY QUEUES (REDIS) ════════ */}
        {activeTab === 'ANTILATENCY' && (
          <div className="space-y-4">
            
            <div className="bg-[#0D1A3B] border border-blue-900/60 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-blue-300">
                <Activity className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm text-white">Redis Asynchronous Bet Delay Queue</span>
              </div>
              <p className="text-xs text-blue-200 leading-relaxed">
                Prevents latency arbitrage by queuing all bet tickets in lightweight Redis delay buffers before matching against latest live odds.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { tier: 1 as const, name: 'Tier 1 (Standard)', delay: '8s Delay', desc: 'Active in standard market flows' },
                  { tier: 2 as const, name: 'Tier 2 (Volatile)', delay: '15s Delay', desc: 'Dangerous attack / momentum spikes' },
                  { tier: 3 as const, name: 'Tier 3 (Critical Freeze)', delay: '25s Delay', desc: 'VAR check / Red Card / Penalty' }
                ].map(t => (
                  <button
                    key={t.tier}
                    onClick={() => {
                      setPlatformTier(t.tier);
                      ApiService.setPlatformTier(t.tier);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      platformTier === t.tier
                        ? 'border-yellow-400 bg-blue-900/70 ring-2 ring-yellow-400'
                        : 'border-blue-900 bg-[#070D1F] hover:bg-blue-950/40'
                    }`}
                  >
                    <div className="font-black text-white text-sm">{t.name}</div>
                    <div className="text-xs font-black text-yellow-400 mt-1 font-mono">{t.delay}</div>
                    <div className="text-[11px] text-gray-400 mt-2">{t.desc}</div>
                  </button>
                ))}
              </div>

              <div className="p-3.5 bg-black/40 border border-blue-900 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">SV388 Cockfight 3s Anti-Vét Gate</div>
                  <div className="text-[11px] text-gray-400">Auto-cancels bets and refunds 100% wallet balance at 3s if fight starts.</div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                  ACTIVE & ENFORCED
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ════════ TAB 5: 5s BUFFER RNG OVERRULE ════════ */}
        {activeTab === 'RNG' && (
          <div className="space-y-4">
            
            <div className="bg-[#0D1A3B] border border-blue-900/60 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-purple-300">
                <Bot className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-sm text-white">5-Second Invisible Buffer RNG Overrule Controller</span>
              </div>
              <p className="text-xs text-blue-200 leading-relaxed">
                During the 5-second invisible buffer period (seconds 35–40) of the Tài Xỉu cycle, this override injects a target outcome into the settlement engine, bypassing standard natural RNG.
              </p>

              <div className="p-4 bg-[#070D1F] border border-blue-900 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-gray-300">Force Next Tài Xỉu Outcome:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setCasinoOverride(null);
                    }}
                    className={`py-2 px-3 rounded-lg font-bold text-xs border text-center transition-all cursor-pointer ${
                      casinoOverride === null
                        ? 'bg-white text-black border-white shadow-lg'
                        : 'bg-black/40 text-gray-300 hover:text-white border-blue-900'
                    }`}
                  >
                    🎲 Natural Fair RNG
                  </button>

                  <button
                    onClick={() => {
                      setCasinoOverride('tai');
                      ApiService.setAdminOverride('taixiu', 'TAI');
                    }}
                    className={`py-2 px-3 rounded-lg font-black text-xs border text-center transition-all cursor-pointer ${
                      casinoOverride === 'tai'
                        ? 'bg-red-600 text-white border-red-400 ring-2 ring-red-400 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                        : 'bg-red-950/40 text-red-300 hover:bg-red-900/60 border-red-800'
                    }`}
                  >
                    🔴 Force TÀI (11-17)
                  </button>

                  <button
                    onClick={() => {
                      setCasinoOverride('xiu');
                      ApiService.setAdminOverride('taixiu', 'XIU');
                    }}
                    className={`py-2 px-3 rounded-lg font-black text-xs border text-center transition-all cursor-pointer ${
                      casinoOverride === 'xiu'
                        ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                        : 'bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 border-blue-800'
                    }`}
                  >
                    🔵 Force XỈU (4-10)
                  </button>
                </div>

                <div className="text-[11px] text-gray-400 pt-1">
                  Active Override Status:{' '}
                  <span className="font-bold text-yellow-400">
                    {casinoOverride === null ? 'Natural RNG (No Override)' : `FORCED ${casinoOverride.toUpperCase()}`}
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ════════ MODAL: CREATE SIMULATED ACCOUNT ════════ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1530] border border-blue-800/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-blue-900/70 pb-3">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span>Create Simulated Account</span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-bold px-2 py-1 rounded-md hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSimulatedAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-blue-200 font-semibold mb-1">Account Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agent Hanoi Central Hub"
                  value={newAccName}
                  onChange={e => setNewAccName(e.target.value)}
                  className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-blue-200 font-semibold mb-1">Account Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                  <input
                    type="text"
                    required
                    placeholder="agent_hanoi_test"
                    value={newAccUsername}
                    onChange={e => setNewAccUsername(e.target.value)}
                    className="w-full bg-[#070D1F] border border-blue-800 rounded-lg pl-7 pr-3 py-2 text-white placeholder-gray-500 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-blue-200 font-semibold mb-1">Account Tier / Role</label>
                  <select
                    value={newAccRole}
                    onChange={e => setNewAccRole(e.target.value as any)}
                    className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="MASTER">MASTER Agent</option>
                    <option value="AGENT">Sub-AGENT</option>
                    <option value="MEMBER">Player / MEMBER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-blue-200 font-semibold mb-1">Parent Upline Master</label>
                  <select
                    value={newAccUplineId}
                    onChange={e => setNewAccUplineId(e.target.value)}
                    className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {accounts.filter(a => a.role !== 'MEMBER').map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-blue-200 font-semibold mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    value={newAccCreditLimit}
                    onChange={e => setNewAccCreditLimit(e.target.value)}
                    className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 font-semibold mb-1">Initial Starting Credit ($)</label>
                  <input
                    type="number"
                    value={newAccInitialBalance}
                    onChange={e => setNewAccInitialBalance(e.target.value)}
                    className="w-full bg-[#070D1F] border border-blue-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingAccount}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white rounded-lg font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isCreatingAccount ? 'Creating...' : 'Create Simulated Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
