import React, { useState } from 'react';
import { X, Shield, Activity, Bot, DollarSign, Cpu, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

export const SbobetAdminModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    platformTier,
    setPlatformTier,
    quotaUsed,
    simulateQuota,
    resetQuota,
    casinoOverride,
    setCasinoOverride,
    depositBalance,
    user,
    language
  } = useSbobetStore();

  const [activeTab, setActiveTab] = useState<'TIER' | 'QUOTA' | 'RNG' | 'WALLET'>('TIER');
  const [depositInput, setDepositInput] = useState<string>('500');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAdminModalOpen) return null;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositInput);
    if (!isNaN(amt) && amt > 0) {
      depositBalance(amt);
      setSuccessMsg(`Đã cộng $${amt.toFixed(2)} vào ví!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-700">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-[#071E3D] via-[#0B4DA2] to-[#0E3970] text-white px-4 py-3 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wide flex items-center gap-2">
                <span>SBOBET ADMIN ENGINE</span>
                <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-bold uppercase">
                  Line 1-3 Active
                </span>
              </div>
              <div className="text-[10px] text-blue-200">
                Anti-Fraud Controller • Quota Shield • RNG Overrule
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold divide-x divide-gray-200">
          <button
            onClick={() => setActiveTab('TIER')}
            className={`flex-1 py-2.5 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'TIER'
                ? 'bg-white text-[#0B4DA2] border-b-2 border-[#0B4DA2]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Anti-Latency</span>
          </button>

          <button
            onClick={() => setActiveTab('QUOTA')}
            className={`flex-1 py-2.5 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'QUOTA'
                ? 'bg-white text-[#0B4DA2] border-b-2 border-[#0B4DA2]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Quota Shield</span>
          </button>

          <button
            onClick={() => setActiveTab('RNG')}
            className={`flex-1 py-2.5 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'RNG'
                ? 'bg-white text-[#0B4DA2] border-b-2 border-[#0B4DA2]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>RNG Overrule</span>
          </button>

          <button
            onClick={() => setActiveTab('WALLET')}
            className={`flex-1 py-2.5 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'WALLET'
                ? 'bg-white text-[#0B4DA2] border-b-2 border-[#0B4DA2]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Ví & Settle</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 text-xs font-sans space-y-4">
          
          {/* TAB 1: ANTI-LATENCY TIERS */}
          {activeTab === 'TIER' && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <Shield className="w-4 h-4 text-blue-700" />
                  <span>Redis Asynchronous Delay Queue & Anti-Vét Gate</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Bảo vệ chống đánh chênh lệch độ trễ (latency arbitrage). Vé cược được lưu tạm và đối chiếu lại tỷ lệ sau thời gian trễ đã chọn.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-gray-700 block">Chọn Cấp Độ Trễ (Delay Tier):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { tier: 1 as const, name: 'Tier 1 (Chuẩn)', delay: '8 Giây', desc: 'Trạng thái bình thường' },
                    { tier: 2 as const, name: 'Tier 2 (Biến Động)', delay: '15 Giây', desc: 'Thị trường rung lắc' },
                    { tier: 3 as const, name: 'Tier 3 (Đóng Băng)', delay: '25 Giây', desc: 'Phạt đền / VAR / Thẻ đỏ' }
                  ].map(item => (
                    <button
                      key={item.tier}
                      onClick={() => setPlatformTier(item.tier)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        platformTier === item.tier
                          ? 'border-[#0B4DA2] bg-blue-50/80 ring-2 ring-blue-400'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-black text-gray-900">{item.name}</div>
                      <div className="text-xs font-bold text-blue-700 mt-0.5">{item.delay}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5">
                <div className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Khóa Cửa Sổ Đá Gà SV388 (Anti-Vét 3s):</span>
                  <span className="text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded">ĐANG BẬT</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Tại giây thứ 3, nếu trọng tài đã thả gà (status = CLOSED), hệ thống tự động hủy vé cược và hoàn tiền 100% về ví.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTA SHIELD */}
          {activeTab === 'QUOTA' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-900">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>The Odds-API Quota Shield & In-Memory RAM Cache</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Bảo vệ gói 100,000 req/tháng ($59/mo) và trần 20 req/phút. RAM Cache 15s phục vụ 50+ người xem chỉ tốn 1 credit API!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Quota Tháng Này</div>
                  <div className="text-lg font-black text-gray-900 mt-1">
                    {quotaUsed.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ 100,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(quotaUsed / 100000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">
                    {((1 - quotaUsed / 100000) * 100).toFixed(1)}% Còn Lại
                  </div>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Tỷ Lệ Trúng Cache (RAM)</div>
                  <div className="text-lg font-black text-emerald-600 mt-1">98.4%</div>
                  <div className="text-[10px] text-gray-500 mt-2">
                    Tần suất: 15s (Live), 15m (Pre), 120m (Sớm)
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => simulateQuota(10)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all text-center"
                >
                  + Giả Lập 10 Lần Gọi API
                </button>
                <button
                  onClick={() => resetQuota()}
                  className="py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-all"
                >
                  Reset Quota
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RNG OVERRULE */}
          {activeTab === 'RNG' && (
            <div className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-purple-900">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <Bot className="w-4 h-4 text-purple-700" />
                  <span>Telegram Bot Webhook & 5-Second Invisible Buffer Interception</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  Tại giây thứ 35 của chu kỳ Tài Xỉu, engine kiểm tra lệnh ghi đè kết quả. Nếu có lệnh từ Admin, RNG tự nhiên sẽ được điều chỉnh theo ý muốn.
                </p>
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
                <label className="font-bold text-gray-800 block">Lệnh Ghi Đè Ván Kế Tiếp:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCasinoOverride(null)}
                    className={`py-2 px-2 rounded-lg font-bold border text-center transition-all ${
                      casinoOverride === null
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    🎲 Tự Nhiên (RNG)
                  </button>
                  <button
                    onClick={() => setCasinoOverride('tai')}
                    className={`py-2 px-2 rounded-lg font-bold border text-center transition-all ${
                      casinoOverride === 'tai'
                        ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-300'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                    }`}
                  >
                    🔴 Ép Ra TÀI (11-17)
                  </button>
                  <button
                    onClick={() => setCasinoOverride('xiu')}
                    className={`py-2 px-2 rounded-lg font-bold border text-center transition-all ${
                      casinoOverride === 'xiu'
                        ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                    }`}
                  >
                    🔵 Ép Ra XỈU (4-10)
                  </button>
                </div>

                <div className="text-[11px] text-gray-500 pt-1">
                  Trạng thái hiện tại:{' '}
                  <span className="font-bold text-gray-900">
                    {casinoOverride === null ? 'Ngẫu nhiên công bằng' : `Cố định ${casinoOverride.toUpperCase()}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WALLET & SETTLEMENT */}
          {activeTab === 'WALLET' && (
            <div className="space-y-3">
              <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                <div className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Số Dư Tài Khoản Người Dùng:</span>
                  <span className="text-sm font-black text-emerald-600 font-mono">
                    ${user?.balance.toFixed(2) || '1,000.00'}
                  </span>
                </div>

                <form onSubmit={handleDeposit} className="space-y-2">
                  <label className="font-semibold text-gray-700 block">Nạp Tiền Giả Lập Thử Nghiệm:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={depositInput}
                      onChange={(e) => setDepositInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono focus:border-blue-600 focus:outline-none"
                      placeholder="Nhập số tiền..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                    >
                      + Nạp Ngay
                    </button>
                  </div>
                  {successMsg && (
                    <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded">
                      {successMsg}
                    </div>
                  )}
                </form>

                <div className="flex gap-2 pt-1">
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => depositBalance(amt)}
                      className="flex-1 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-bold text-[11px]"
                    >
                      +${amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-100 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Fanclub68 SBOBET Core Engine</span>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="px-4 py-1.5 bg-gray-800 hover:bg-black text-white rounded-lg font-bold"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
