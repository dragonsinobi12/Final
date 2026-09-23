import React from 'react';
import { X, Sparkles, MapPin, ShieldAlert, Share2 } from 'lucide-react';
import { Bug, Spot } from '../types';
import { CuteBugArt } from './CuteBugArt';
import { RARITY_BADGES } from '../data/seed';
import { soundService } from '../services/sound';

interface BugDetailModalProps {
  bug: Bug;
  discovered: boolean;
  spots: Spot[];
  onClose: () => void;
  onNavigateToSpot?: (spot: Spot) => void;
}

export const BugDetailModal: React.FC<BugDetailModalProps> = ({
  bug,
  discovered,
  spots,
  onClose,
  onNavigateToSpot
}) => {
  const rarity = RARITY_BADGES[bug.rarity] || RARITY_BADGES.common;
  const relatedSpots = spots.filter((s) => bug.spotIds.includes(s.id));

  const handleShare = async () => {
    soundService.playTap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bugdex: ${bug.nameTh} (${bug.nameEn})`,
          text: `ฉันค้นพบ ${bug.nameTh} (${bug.scientificName}) ในแอป BugQuest แล้ว!`,
          url: window.location.href
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกข้อมูลแมลงเรียบร้อย!');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative my-auto">
        {/* Header */}
        <div className="bg-stone-950/80 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                discovered
                  ? `${rarity.color} ${rarity.bg} ${rarity.border}`
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {discovered ? rarity.labelTh : 'ปริศนา'}
            </span>
            {discovered && (
              <span className="text-xs text-stone-400 font-mono">
                #{bug.id.replace('bug-', '00')}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bug Art Presentation */}
        <div className="p-6 text-center">
          <div className="relative w-36 h-36 mx-auto rounded-3xl bg-gradient-to-b from-stone-800/80 to-stone-900 border border-stone-700/60 shadow-xl flex items-center justify-center">
            <CuteBugArt bugId={bug.id} className="w-28 h-28" discovered={discovered} />
          </div>

          <h3 className="text-xl font-black text-stone-100 mt-4">
            {discovered ? bug.nameTh : 'สิ่งมีชีวิตลึกลับ'}
          </h3>
          <p className="text-xs text-stone-400 font-mono italic mt-0.5">
            {discovered ? `${bug.scientificName} • ${bug.nameEn}` : 'ยังไม่ถูกค้นพบ'}
          </p>

          {/* Conservation badge if applicable */}
          {discovered && bug.conservation && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/60 text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{bug.conservation}</span>
            </div>
          )}

          {/* Biology Facts */}
          {discovered ? (
            <div className="mt-5 space-y-3 text-left">
              <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ข้อเท็จจริงทางชีววิทยา (Verified Biology Facts)</span>
                </h4>
                <div className="space-y-1.5 text-xs text-stone-300">
                  {bug.facts.map((fact, idx) => (
                    <p key={idx} className="leading-relaxed pl-2 border-l-2 border-emerald-700/50">
                      {fact}
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 text-xs">
                <span className="font-bold text-stone-300">ถิ่นอาศัยจริงในธรรมชาติ: </span>
                <span className="text-stone-400">{bug.habitatText}</span>
              </div>
            </div>
          ) : (
            <div className="mt-5 p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 text-xs text-amber-300 text-center">
              <p className="font-bold mb-1">ยังไม่มีข้อมูลชีววิทยาในสมุดสะสม</p>
              <p className="text-stone-400 text-[11px]">
                เดินทางไปยังพื้นที่ถิ่นอาศัยเพื่อถ่ายภาพบรรยากาศและปลดล็อกข้อมูลจริง
              </p>
            </div>
          )}

          {/* Habitat Spots Links */}
          <div className="mt-5 text-left">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              📍 พบได้ในพื้นที่สำรวจ:
            </h4>
            <div className="space-y-2">
              {relatedSpots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => {
                    if (onNavigateToSpot) {
                      onClose();
                      onNavigateToSpot(spot);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-stone-950/80 hover:bg-stone-800/80 border border-stone-800 flex items-center justify-between transition cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-stone-200">{spot.nameTh}</span>
                    <span className="text-stone-400">({spot.province})</span>
                  </div>
                  <span className="text-emerald-400 font-medium text-[11px]">เปิดดู →</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          {discovered && (
            <div className="mt-6 pt-3 border-t border-stone-800 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>แชร์ความสำเร็จ</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
