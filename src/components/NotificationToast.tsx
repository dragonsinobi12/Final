import React, { useEffect, useState } from 'react';
import { Bell, ArrowRight, X, Sparkles } from 'lucide-react';
import { ScheduledReminder } from '../types';
import { soundService } from '../services/sound';

interface NotificationToastProps {
  reminders: ScheduledReminder[];
  onDismiss: (id: string) => void;
  onOpenSpot: (spotId: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  reminders,
  onDismiss,
  onOpenSpot
}) => {
  const [activeAlerts, setActiveAlerts] = useState<ScheduledReminder[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const due = reminders.filter((r) => r.triggerAt <= now);
      if (due.length > 0) {
        soundService.playTap();
        setActiveAlerts((prev) => {
          const newOnes = due.filter((d) => !prev.some((p) => p.id === d.id));
          return [...prev, ...newOnes];
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[9999] flex flex-col gap-2 pointer-events-none">
      {activeAlerts.map((alert) => (
        <div
          key={alert.id}
          className="pointer-events-auto bg-stone-900/95 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <Sparkles className="w-3 h-3" />
                <span>การแจ้งเตือนสำรวจ (Local Notification)</span>
              </div>
              <h4 className="text-sm font-bold text-stone-100 mt-0.5 line-clamp-1">
                ถึงเวลาสำรวจ: {alert.spotName}!
              </h4>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                มีแมลงประจำถิ่นรอให้คุณค้นพบอยู่ แตะเพื่อเปิดดูรายละเอียดพื้นที่
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenSpot(alert.spotId);
                    onDismiss(alert.id);
                    setActiveAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition"
                >
                  <span>เปิดพื้นที่สำรวจ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    onDismiss(alert.id);
                    setActiveAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-stone-400 hover:text-stone-200 text-xs font-medium"
                >
                  ปิด
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                onDismiss(alert.id);
                setActiveAlerts((prev) => prev.filter((a) => a.id !== alert.id));
              }}
              className="text-stone-400 hover:text-stone-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
