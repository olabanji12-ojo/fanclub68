import React from 'react';
import { RotateCw, Check } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

interface PullToRefreshProps {
  pullDistance: number;
  isPulling: boolean;
}

export const SbobetPullToRefresh: React.FC<PullToRefreshProps> = ({ pullDistance, isPulling }) => {
  const { isRefreshing, language } = useSbobetStore();
  const isVi = language === 'vi';

  if (!isRefreshing && pullDistance <= 0) return null;

  const currentHeight = isRefreshing ? 48 : Math.min(pullDistance, 60);
  const rotation = Math.min(pullDistance * 4, 360);
  const isThresholdMet = pullDistance >= 50;

  return (
    <div
      style={{ height: `${currentHeight}px` }}
      className="w-full flex items-center justify-center transition-all duration-150 overflow-hidden bg-gradient-to-b from-[#DCE7F5]/60 to-transparent"
    >
      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-blue-200">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[#0B4DA2] ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          style={!isRefreshing ? { transform: `rotate(${rotation}deg)` } : undefined}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </div>

        <span className="text-[11px] font-bold text-gray-700">
          {isRefreshing
            ? (isVi ? 'Đang làm mới tỷ lệ cược...' : 'Updating live odds...')
            : isThresholdMet
              ? (isVi ? 'Thả ra để làm mới' : 'Release to refresh')
              : (isVi ? 'Kéo xuống để làm mới' : 'Pull down to refresh')}
        </span>
      </div>
    </div>
  );
};
