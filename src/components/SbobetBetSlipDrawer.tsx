import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

export const SbobetBetSlipDrawer: React.FC = () => {
  const {
    language,
    slipSelections,
    removeSelection,
    clearSlip,
    isBetSlipOpen,
    setIsBetSlipOpen,
    user
  } = useSbobetStore();

  const [stake, setStake] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(8);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = translations[language];

  if (!isBetSlipOpen) return null;

  // Calculate potential payout
  const totalOdds = slipSelections.reduce((acc, s) => acc * (s.odds > 0 ? s.odds : 1 + Math.abs(s.odds)), 1);
  const potentialPayout = (stake * totalOdds).toFixed(2);

  const handlePlaceBet = () => {
    setErrorMsg(null);

    // Enforce 300-Point Hard Cap (Milestone 2 Contract Rule)
    if (stake > 300) {
      setErrorMsg('Vượt quá giới hạn! Tối đa 300 điểm cho mỗi phiếu cược (300-Point Hard Cap).');
      return;
    }

    if (stake <= 0) {
      setErrorMsg('Vui lòng nhập số tiền cược hợp lệ.');
      return;
    }

    // Initiate 8-Second Anti-Latency Delay Queue (Milestone 4 Rule)
    setIsProcessing(true);
    setCountdown(8);

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            clearSlip();
            setIsBetSlipOpen(false);
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        onClick={() => !isProcessing && setIsBetSlipOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col animate-fade-in border-l border-gray-300">
        
        {/* Header */}
        <div className="bg-[#0B4DA2] text-white p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm uppercase">{t.bet_slip}</span>
            <span className="bg-yellow-400 text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
              {slipSelections.length}
            </span>
          </div>
          <button
            onClick={() => setIsBetSlipOpen(false)}
            disabled={isProcessing}
            className="p-1 hover:bg-[#08356E] rounded text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-Fraud Notice Banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-3 py-1.5 text-[11px] text-blue-900 flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Anti-Latency Protection: 8s delay queue</span>
          </span>
          <span className="font-bold text-blue-800">Max 300 pts</span>
        </div>

        {/* Selections List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {slipSelections.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-6">
              <p className="text-sm font-semibold">{t.empty_slip}</p>
              <p className="text-xs text-gray-400 mt-1">Chọn bất kỳ tỷ lệ cược nào để thêm vào phiếu cược.</p>
            </div>
          ) : (
            slipSelections.map((item, idx) => (
              <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg relative shadow-xs">
                <button
                  onClick={() => removeSelection(item.matchId, item.marketName)}
                  disabled={isProcessing}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="text-[11px] text-gray-500 font-semibold">{item.matchName}</div>
                <div className="text-xs font-bold text-gray-800 mt-0.5">{item.marketName}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs font-black text-blue-900">{item.selectionName}</span>
                  <span className="text-sm font-black text-red-600">
                    {item.odds > 0 ? `@${item.odds.toFixed(2)}` : `@${item.odds.toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Stake & Action Area */}
        {slipSelections.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            {/* Stake Input with Quick Presets */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1">
                <span>Số tiền cược (Điểm):</span>
                <span className="text-[11px] text-gray-500">Số dư: ${user?.balance.toFixed(2) || '1,000.00'}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  disabled={isProcessing}
                  max={300}
                  className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-600"
                />
                {[50, 100, 200, 300].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStake(val)}
                    disabled={isProcessing}
                    className={`px-2 py-1.5 text-xs font-bold rounded border ${
                      stake === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Potential Payout */}
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <span className="text-gray-600">Tiền thắng ước tính:</span>
              <span className="text-emerald-700 text-base font-black">${potentialPayout}</span>
            </div>

            {errorMsg && (
              <div className="p-2 bg-red-100 border border-red-300 text-red-700 text-xs rounded flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Place Bet Button / Countdown */}
            {isProcessing ? (
              <div className="w-full py-3 bg-blue-700 text-white font-black text-xs uppercase rounded flex items-center justify-center gap-2 shadow">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Đang kiểm tra biến động tỷ lệ... ({countdown}s)</span>
              </div>
            ) : isSuccess ? (
              <div className="w-full py-3 bg-emerald-600 text-white font-black text-xs uppercase rounded flex items-center justify-center gap-2 shadow">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cược đã được chấp nhận thành công!</span>
              </div>
            ) : (
              <button
                onClick={handlePlaceBet}
                className="w-full py-3 bg-[#FFC800] hover:bg-[#F0BB00] text-black font-black text-sm uppercase rounded shadow-md transition-transform active:scale-98"
              >
                Đặt cược ({stake} Điểm)
              </button>
            )}

            <button
              onClick={clearSlip}
              disabled={isProcessing}
              className="w-full text-center text-xs text-gray-500 hover:text-red-500 font-semibold"
            >
              Xóa tất cả phiếu cược
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
