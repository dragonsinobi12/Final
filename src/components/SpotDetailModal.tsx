import React from 'react';
import { X, MapPin, Compass, Bell, Share2, Navigation, Camera, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Spot, Bug } from '../types';
import { HABITAT_LABELS } from '../data/seed';
import { formatDistance } from '../services/geo';
import { SilhouetteBug } from './SilhouetteBug';
import { soundService } from '../services/sound';

interface SpotDetailModalProps {
  spot: Spot;
  bugs: Bug[];
  discoveredBugIds: string[];
  distanceMeters: number | null;
  onClose: () => void;
  onStartCatch: () => void;
  onSelectBug: (bug: Bug) => void;
  onScheduleReminder: (spot: Spot, seconds: number) => void;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  bugs,
  discoveredBugIds,
  distanceMeters,
  onClose,
  onStartCatch,
  onSelectBug,
  onScheduleReminder
}) => {
  const habitat = HABITAT_LABELS[spot.habitat] || { th: 'ระบบนิเวศ', en: 'Nature', icon: '🌿' };
  const spotBugs = bugs.filter((b) => spot.bugIds.includes(b.id));
  const discoveredCount = spotBugs.filter((b) => discoveredBugIds.includes(b.id)).length;
  const isComplete = spotBugs.length > 0 && discoveredCount === spotBugs.length;

  const handleShare = async () => {
    soundService.playTap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BugQuest: ${spot.nameTh}`,
          text: `มาร่วมสำรวจระบบนิเวศ ${spot.nameTh} (${spot.province}) และสะสมแมลงประจำถิ่นเข้า Bugdex กันเถอะ!`,
          url: window.location.href
        });
      } catch {
        // Shared cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกลิงก์การสำรวจไปยังคลิปบอร์ดแล้ว!');
    }
  };

  const handleOpenNavigationApp = () => {
    soundService.playTap();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative my-auto">
        {/* Header with habitat badge and close button */}
        <div className={`p-6 bg-gradient-to-b ${spot.coverGradient} border-b border-stone-800 text-stone-100 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-md transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/15 mb-3">
            <span>{habitat.icon}</span>
            <span>{habitat.th}</span>
            <span className="opacity-60">• {habitat.en}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">{spot.nameTh}</h2>
          <p className="text-xs text-stone-300 font-mono mt-0.5">{spot.nameEn}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 mt-3 pt-3 border-t border-white/10">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {spot.province}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-emerald-300">
              <Compass className="w-3.5 h-3.5" />
              {formatDistance(distanceMeters)}
            </span>
            <span className="inline-flex items-center gap-1 text-stone-400">
              รัศมีสำรวจ {spot.radiusM} ม.
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Ecosystem Description */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              🌿 ระบบนิเวศและข้อมูลการศึกษา (Educational Info)
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
              {spot.description}
            </p>
          </div>

          {/* Best Exploration Time */}
          {spot.bestTime && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold">ช่วงเวลาที่เหมาะสำรวจ: </span>
                <span>{spot.bestTime}</span>
              </div>
            </div>
          )}

          {/* Bugs Inhabitants Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                🦗 แมลงประจำถิ่น ({discoveredCount}/{spotBugs.length} ชนิด)
              </h4>
              {isComplete ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-800/60">
                  <CheckCircle className="w-3 h-3" />
                  ค้นพบครบทุกชนิดแล้ว!
                </span>
              ) : (
                <span className="text-[11px] text-amber-400 font-medium">
                  มีแมลงปริศนาซ่อนอยู่
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {spotBugs.map((bug) => {
                const isDiscovered = discoveredBugIds.includes(bug.id);
                return (
                  <div
                    key={bug.id}
                    onClick={() => {
                      soundService.playTap();
                      onSelectBug(bug);
                    }}
                    className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800/90 hover:border-emerald-500/50 transition cursor-pointer flex flex-col items-center text-center"
                  >
                    <SilhouetteBug bug={bug} discovered={isDiscovered} size="md" />
                    <p className="text-xs font-bold text-stone-200 mt-2 line-clamp-1">
                      {isDiscovered ? bug.nameTh : 'สิ่งมีชีวิตลึกลับ'}
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono italic">
                      {isDiscovered ? bug.nameEn : '???'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions (Remind / Share / Navigate) */}
          <div className="pt-2 border-t border-stone-800/80 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                soundService.playTap();
                onScheduleReminder(spot, 10); // 10s demo timer
              }}
              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex flex-col items-center gap-1 transition"
              title="ตั้งเตือนล่วงหน้า 10 วินาที เพื่อสาธิต Local Notification & Deep Link"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>ตั้งเตือน (10 วิ)</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex flex-col items-center gap-1 transition"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>แชร์พื้นที่</span>
            </button>

            <button
              onClick={handleOpenNavigationApp}
              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex flex-col items-center gap-1 transition"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>นำทาง GPS</span>
            </button>
          </div>

          {/* Primary Action Button: Start Catch Expedition */}
          <button
            onClick={() => {
              soundService.playTap();
              onStartCatch();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 font-black text-sm shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            <span>เริ่มสำรวจและถ่ายภาพบรรยากาศ</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
