import React from 'react';
import { Heart, MapPin, Compass, Sparkles } from 'lucide-react';
import { Spot, Bug } from '../types';
import { HABITAT_LABELS } from '../data/seed';
import { formatDistance } from '../services/geo';
import { CuteBugArt } from './CuteBugArt';
import { soundService } from '../services/sound';

interface SpotCardProps {
  spot: Spot;
  bugs: Bug[];
  discoveredBugIds: string[];
  isFavorite: boolean;
  distanceMeters: number | null;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  bugs,
  discoveredBugIds,
  isFavorite,
  distanceMeters,
  onSelect,
  onToggleFavorite
}) => {
  const habitat = HABITAT_LABELS[spot.habitat] || { th: 'ระบบนิเวศธรรมชาติ', en: 'Nature', icon: '🌿' };
  const spotBugs = bugs.filter((b) => spot.bugIds.includes(b.id));
  const discoveredCount = spotBugs.filter((b) => discoveredBugIds.includes(b.id)).length;
  const isFullyExplored = spotBugs.length > 0 && discoveredCount === spotBugs.length;

  return (
    <div
      onClick={onSelect}
      className="group relative bg-stone-900/90 hover:bg-stone-800/90 border border-stone-800 hover:border-emerald-600/50 rounded-2xl p-4 transition-all duration-300 shadow-md cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Habitat & Favorite */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/90 text-stone-300 text-xs font-medium border border-stone-700/60">
            <span>{habitat.icon}</span>
            <span>{habitat.th}</span>
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              soundService.playTap();
              onToggleFavorite();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
              isFavorite
                ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60 scale-105'
                : 'bg-stone-800/70 text-stone-400 hover:text-stone-200 border border-stone-700/40 hover:bg-stone-700'
            }`}
            title={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Spot Title & Province */}
        <h3 className="text-base font-bold text-stone-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
          {spot.nameTh}
        </h3>
        <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            {spot.province}
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-400/90 font-mono">
            <Compass className="w-3.5 h-3.5" />
            {formatDistance(distanceMeters)}
          </span>
        </div>

        {/* Description preview */}
        <p className="text-xs text-stone-400/90 mt-2 line-clamp-2 leading-relaxed">
          {spot.description}
        </p>
      </div>

      {/* Bottom Area: Bug Inhabitants (Silhouette vs Caught) */}
      <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {spotBugs.map((bug) => {
            const isDiscovered = discoveredBugIds.includes(bug.id);
            return (
              <div
                key={bug.id}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  isDiscovered
                    ? 'bg-emerald-950/40 border-emerald-700/50 shadow-sm'
                    : 'bg-stone-800/60 border-stone-700/40 opacity-70'
                }`}
                title={isDiscovered ? `${bug.nameTh} (ค้นพบแล้ว)` : 'สิ่งมีชีวิตลึกลับยังไม่ถูกค้นพบ'}
              >
                <CuteBugArt bugId={bug.id} className="w-6 h-6" discovered={isDiscovered} />
              </div>
            );
          })}
        </div>

        <div className="text-right">
          {isFullyExplored ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
              <Sparkles className="w-3 h-3" />
              สำรวจครบแล้ว
            </span>
          ) : (
            <span className="text-[11px] text-stone-400">
              ค้นพบ <strong className="text-emerald-400">{discoveredCount}</strong>/{spotBugs.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
