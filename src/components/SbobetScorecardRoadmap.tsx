import React, { useState } from 'react';

export type BeadType = 'C' | 'L' | 'T' | 'X' | 'M' | 'W' | 'B' | 'H';

export interface ScorecardItem {
  round: number;
  result: BeadType;
  detail: string; // e.g. "3 Đỏ 1 Trắng", "4 + 5 + 5 = 14", "Meron thắng KO"
  subText?: string;
}

interface ScorecardProps {
  title: string;
  gameType: 'xocdia' | 'taixiu' | 'cockfight';
  items: ScorecardItem[];
  rows?: number; // Standard casino bead road uses 6 rows
}

export const SbobetScorecardRoadmap: React.FC<ScorecardProps> = ({
  title,
  gameType,
  items,
  rows = 6
}) => {
  const [selectedItem, setSelectedItem] = useState<ScorecardItem | null>(null);

  // Organize items into standard casino 6-row columns (top-to-bottom, left-to-right)
  const columnsCount = Math.max(Math.ceil(items.length / rows), 10);
  const matrix: (ScorecardItem | null)[][] = Array.from({ length: rows }, () =>
    Array(columnsCount).fill(null)
  );

  items.forEach((item, index) => {
    const col = Math.floor(index / rows);
    const row = index % rows;
    if (col < columnsCount) {
      matrix[row][col] = item;
    }
  });

  // Calculate statistics
  const total = items.length;
  const countA = items.filter(i => i.result === 'C' || i.result === 'T' || i.result === 'M').length;
  const countB = items.filter(i => i.result === 'L' || i.result === 'X' || i.result === 'W').length;
  const countC = items.filter(i => i.result === 'B').length;

  const percentA = total > 0 ? Math.round((countA / total) * 100) : 50;
  const percentB = total > 0 ? Math.round((countB / total) * 100) : 50;
  const percentC = total > 0 ? Math.round((countC / total) * 100) : 0;

  // Streak detection
  let currentStreak = 1;
  if (items.length > 1) {
    const lastResult = items[items.length - 1].result;
    for (let i = items.length - 2; i >= 0; i--) {
      if (items[i].result === lastResult) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  const renderBead = (item: ScorecardItem | null, rIdx: number, cIdx: number) => {
    if (!item) {
      return (
        <div
          key={`${rIdx}-${cIdx}`}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 bg-gray-50/50 flex items-center justify-center shrink-0"
        />
      );
    }

    let bgClass = 'bg-gray-400 text-white';
    let ringClass = 'border-gray-300';
    let label: string = item.result;

    if (item.result === 'C') {
      bgClass = 'bg-[#0B4DA2] text-white';
      ringClass = 'border-blue-400 shadow-blue-200';
      label = 'C';
    } else if (item.result === 'L') {
      bgClass = 'bg-[#D32F2F] text-white';
      ringClass = 'border-red-400 shadow-red-200';
      label = 'L';
    } else if (item.result === 'T') {
      bgClass = 'bg-[#D32F2F] text-white';
      ringClass = 'border-red-400 shadow-red-200';
      label = 'T';
    } else if (item.result === 'X') {
      bgClass = 'bg-[#0B4DA2] text-white';
      ringClass = 'border-blue-400 shadow-blue-200';
      label = 'X';
    } else if (item.result === 'M') {
      bgClass = 'bg-[#C0392B] text-white';
      ringClass = 'border-red-400 shadow-red-200';
      label = 'M';
    } else if (item.result === 'W') {
      bgClass = 'bg-[#1877F2] text-white';
      ringClass = 'border-blue-400 shadow-blue-200';
      label = 'W';
    } else if (item.result === 'B') {
      bgClass = 'bg-[#27AE60] text-white';
      ringClass = 'border-emerald-400 shadow-emerald-200';
      label = 'H';
    }

    const isSelected = selectedItem?.round === item.round;

    return (
      <button
        key={`${rIdx}-${cIdx}`}
        onClick={() => setSelectedItem(isSelected ? null : item)}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex flex-col items-center justify-center text-[10px] sm:text-[11px] font-black shadow-xs border-2 transition-transform transform active:scale-90 hover:scale-105 shrink-0 ${bgClass} ${ringClass} ${
          isSelected ? 'ring-2 ring-yellow-400 scale-110' : ''
        }`}
        title={`Ván #${item.round}: ${item.detail}`}
      >
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs font-sans space-y-2.5 w-full max-w-full overflow-x-hidden">
      {/* 1. Header with Stats Bar matching Asian Casino Boards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-black text-gray-800 uppercase tracking-wide">
            {title}
          </span>
        </div>

        {/* Dynamic Percentage Stats */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold flex-wrap">
          {gameType === 'xocdia' && (
            <>
              <span className="text-[#0B4DA2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Chẵn (C): {countA} ({percentA}%)
              </span>
              <span className="text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Lẻ (L): {countB} ({percentB}%)
              </span>
              <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Cầu: {currentStreak}{items[items.length - 1]?.result || 'C'}
              </span>
            </>
          )}

          {gameType === 'taixiu' && (
            <>
              <span className="text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Tài (T): {countA} ({percentA}%)
              </span>
              <span className="text-[#0B4DA2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Xỉu (X): {countB} ({percentB}%)
              </span>
              <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Cầu: {currentStreak}{items[items.length - 1]?.result || 'T'}
              </span>
            </>
          )}

          {gameType === 'cockfight' && (
            <>
              <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Meron: {countA} ({percentA}%)
              </span>
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Wala: {countB} ({percentB}%)
              </span>
              {countC > 0 && (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Hòa: {countC} ({percentC}%)
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. Authentic 6-Row Bead Road Matrix Table */}
      <div className="overflow-x-auto no-scrollbar py-1">
        <div className="inline-grid gap-1 bg-[#F4F6F9] p-2 rounded-lg border border-gray-200 shadow-inner">
          {matrix.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1">
              {row.map((item, cIdx) => renderBead(item, rIdx, cIdx))}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Detail Popover when a bead is tapped */}
      {selectedItem && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs flex items-center justify-between text-amber-900 animate-in fade-in duration-150">
          <div>
            <span className="font-black text-amber-800 mr-1.5">Ván #{selectedItem.round}:</span>
            <span className="font-bold">{selectedItem.detail}</span>
          </div>
          <button
            onClick={() => setSelectedItem(null)}
            className="text-amber-700 hover:text-amber-900 font-bold px-1.5 py-0.5 text-[11px]"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. Legend Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100">
        <span>Nhấp vào hạt tròn để xem chi tiết từng ván</span>
        <span className="font-semibold text-gray-600">30 Ván Gần Nhất</span>
      </div>
    </div>
  );
};
