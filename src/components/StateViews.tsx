import React from 'react';
import { RefreshCw, AlertCircle, SearchX, WifiOff } from 'lucide-react';

export const LoadingView: React.FC<{ message?: string }> = ({
  message = 'กำลังโหลดข้อมูลการสำรวจ...'
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="relative mb-4">
      <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
      <span className="absolute inset-0 flex items-center justify-center text-lg">
        🌿
      </span>
    </div>
    <p className="text-sm text-stone-300 font-medium">{message}</p>
    <p className="text-xs text-stone-500 mt-1">กำลังเชื่อมต่อพิกัดและฐานข้อมูลชีวภาพ</p>
  </div>
);

export const EmptyView: React.FC<{
  title?: string;
  message?: string;
  onClear?: () => void;
  clearLabel?: string;
}> = ({
  title = 'ไม่พบข้อมูลการค้นหา',
  message = 'ลองเปลี่ยนคำค้นหา หรือตรวจสอบตัวสะกดชื่อพื้นที่หรือชื่อแมลง',
  onClear,
  clearLabel = 'ล้างคำค้นหา'
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-stone-900/40 rounded-2xl border border-stone-800/80 my-4">
    <div className="w-14 h-14 rounded-2xl bg-stone-800/80 flex items-center justify-center text-stone-400 mb-4">
      <SearchX className="w-7 h-7" />
    </div>
    <h3 className="text-base font-semibold text-stone-200">{title}</h3>
    <p className="text-xs text-stone-400 max-w-xs mt-1.5 leading-relaxed">{message}</p>
    {onClear && (
      <button
        onClick={onClear}
        className="mt-4 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition"
      >
        {clearLabel}
      </button>
    )}
  </div>
);

export const ErrorView: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'การเชื่อมต่อขัดข้อง',
  message = 'ไม่สามารถดึงข้อมูลล่าสุดได้ ระบบกำลังใช้ฐานข้อมูลแคชออฟไลน์ในเครื่อง',
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-red-950/20 border border-red-800/40 rounded-2xl my-4">
    <div className="w-12 h-12 rounded-2xl bg-red-900/30 flex items-center justify-center text-red-400 mb-3">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-semibold text-red-200">{title}</h3>
    <p className="text-xs text-stone-300 max-w-xs mt-1 leading-relaxed">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/50 text-red-200 text-xs font-medium border border-red-700/50 transition"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        ลองใหม่อีกครั้ง
      </button>
    )}
  </div>
);

export const OfflineBanner: React.FC<{
  isOffline: boolean;
  pendingCount: number;
  onSync?: () => void;
}> = ({ isOffline, pendingCount, onSync }) => {
  if (!isOffline && pendingCount === 0) return null;

  return (
    <div className="bg-amber-950/90 border-y border-amber-600/40 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200 transition-all">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          {isOffline
            ? 'โหมดออฟไลน์: กำลังแสดงแคชล่าสุดในอุปกรณ์'
            : `มีข้อมูลรอซิงก์ ${pendingCount} รายการ`}
        </span>
      </div>
      {pendingCount > 0 && onSync && (
        <button
          onClick={onSync}
          className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-[11px] transition shrink-0"
        >
          ซิงก์ ({pendingCount})
        </button>
      )}
    </div>
  );
};
