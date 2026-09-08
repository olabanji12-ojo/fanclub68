import React, { useState } from 'react';
import { BarChart2, Tv, Layers, User, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
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
    logout,
    slipSelections,
    setIsBetSlipOpen,
    openAuthModal
  } = useSbobetStore();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const t = translations[language];

  // Collapsed Minimal Floating Badge: Frees up full screen space for lower markets
  if (isCollapsed) {
    return (
      <div className="fixed bottom-3 right-3 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-gradient-to-r from-[#F58220] to-[#E06E0E] hover:brightness-110 text-white px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-2xl border border-orange-300 active:scale-95 transition-all ring-2 ring-orange-400/40"
          title="Mở rộng thanh công cụ cược (Click to expand betting toolbar)"
        >
          <span>{subMarketCount}</span>
          <span className="text-xs font-bold">+</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <footer className="sticky bottom-0 z-40 bg-white border-t border-gray-300 shadow-[0_-4px_10px_rgba(0,0,0,0.06)] font-sans safe-bottom transition-all duration-200">
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

        {/* Orange Sub-Market Counter Pill: Click to collapse and free up space */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(true)}
            className="bg-[#F58220] hover:bg-[#E06E0E] text-white px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Thu gọn thanh công cụ để xem thêm các kèo bên dưới (Collapse toolbar)"
          >
            <span>{subMarketCount}</span>
            <span className="text-[10px] font-normal">−</span>
            <ChevronDown className="w-3 h-3 text-white/90" />
          </button>
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
              onClick={() => openAuthModal('register')}
              className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase rounded-lg border border-gray-300 shadow-sm transition-all active:scale-98 text-center"
            >
              {t.register}
            </button>

            <button
              onClick={() => openAuthModal('login')}
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
