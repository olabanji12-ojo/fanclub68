import React from 'react';
import { BarChart2, Tv, Trophy, Layers, User, LogOut } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';
import { translations } from '../locales/translations';

interface FooterBarProps {
  subMarketCount?: number;
}

export const SbobetFooterBar: React.FC<FooterBarProps> = ({ subMarketCount = 13 }) => {
  const {
    language,
    isLoggedIn,
    user,
    loginDemo,
    logout,
    slipSelections,
    setIsBetSlipOpen
  } = useSbobetStore();

  const t = translations[language];

  return (
    <footer className="sticky bottom-0 z-40 bg-white border-t border-gray-300 shadow-[0_-4px_10px_rgba(0,0,0,0.06)] font-sans safe-bottom">
      {/* TOOLBAR WITH STATS, TV STREAM, PITCH RADAR, SUB-MARKET COUNT */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-200 text-gray-700 bg-gray-50">
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-blue-700 transition-colors" title="Thống kê trận đấu">
            <BarChart2 className="w-5 h-5 text-[#0B4DA2]" />
          </button>
          <button className="text-gray-400 hover:text-blue-700 transition-colors" title="Trực tiếp Video">
            <Tv className="w-5 h-5 text-gray-400" />
          </button>
          <button className="text-gray-600 hover:text-blue-700 transition-colors" title="Mô phỏng sân bóng">
            <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-black text-gray-600">
              ⚽
            </div>
          </button>
        </div>

        {/* Orange Sub-Market Counter Pill matching screenshot 1 */}
        <div className="flex items-center gap-1">
          <span className="bg-[#F58220] text-white px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
            <span>{subMarketCount}</span>
            <span className="text-[10px] font-normal">−</span>
          </span>
        </div>
      </div>

      {/* BOTTOM ACTION BUTTONS: REGISTER & SIGN IN (OR BET SLIP / WALLET IF LOGGED IN) */}
      <div className="p-2.5 flex items-center gap-2.5 bg-white">
        {isLoggedIn && user ? (
          /* User is logged in: Show Wallet Balance + Bet Slip Button */
          <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2 py-1.5 rounded-lg min-w-0 shrink-0">
              <User className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <div className="text-left min-w-0">
                <div className="text-[10px] text-gray-500 font-semibold leading-tight truncate max-w-[65px] sm:max-w-[100px]">{user.username}</div>
                <div className="text-[11px] sm:text-xs font-black text-blue-900 whitespace-nowrap">${user.balance.toFixed(2)}</div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="text-gray-400 hover:text-red-500 p-0.5 ml-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bet Slip Drawer Trigger */}
            <button
              onClick={() => setIsBetSlipOpen(true)}
              className="flex-1 py-2 sm:py-2.5 px-2.5 sm:px-4 bg-[#FFC800] hover:bg-[#F0BB00] text-black font-black text-[11px] sm:text-xs uppercase rounded-lg shadow flex items-center justify-center gap-1.5 whitespace-nowrap transition-transform active:scale-98"
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{t.bet_slip} ({slipSelections.length})</span>
            </button>
          </div>
        ) : (
          /* User is guest: Show Đăng ký (White) and Đăng nhập (Blue) matching screenshots */
          <>
            <button
              onClick={loginDemo}
              className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase rounded-lg border border-gray-300 shadow-sm transition-all active:scale-98 text-center"
            >
              {t.register}
            </button>

            <button
              onClick={loginDemo}
              className="flex-1 py-2.5 bg-[#1877F2] hover:bg-[#1366D6] text-white font-black text-xs uppercase rounded-lg shadow transition-all active:scale-98 text-center"
            >
              {t.login}
            </button>
          </>
        )}
      </div>
    </footer>
  );
};
