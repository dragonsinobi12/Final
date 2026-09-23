import React from 'react';
import { Bug } from '../types';
import { CuteBugArt } from './CuteBugArt';
import { RARITY_BADGES } from '../data/seed';

interface SilhouetteBugProps {
  bug: Bug;
  discovered: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  onPress?: () => void;
  showDetails?: boolean;
}

export const SilhouetteBug: React.FC<SilhouetteBugProps> = ({
  bug,
  discovered,
  size = 'md',
  onPress,
  showDetails = false
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    hero: 'w-40 h-40'
  }[size];

  const rarityInfo = RARITY_BADGES[bug.rarity] || RARITY_BADGES.common;

  return (
    <div
      onClick={onPress}
      className={`group relative flex flex-col items-center rounded-2xl transition-all duration-300 p-2 ${
        onPress ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      }`}
    >
      <div
        className={`relative flex items-center justify-center rounded-2xl p-2 border transition-colors ${
          discovered
            ? 'bg-gradient-to-b from-stone-800/80 to-stone-900/90 border-stone-700/60 shadow-md group-hover:border-emerald-500/50'
            : 'bg-stone-900/90 border-stone-800/80 shadow-inner'
        }`}
      >
        <CuteBugArt bugId={bug.id} className={sizeClasses} discovered={discovered} />
      </div>

      {showDetails && (
        <div className="mt-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-sm font-semibold text-stone-200 line-clamp-1">
              {discovered ? bug.nameTh : 'สิ่งมีชีวิตลึกลับ'}
            </p>
          </div>
          {discovered ? (
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${rarityInfo.color} ${rarityInfo.bg} ${rarityInfo.border}`}
              >
                {rarityInfo.labelTh}
              </span>
              <span className="text-[10px] text-stone-400 font-mono italic">
                {bug.nameEn}
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-amber-400/90 font-medium mt-0.5">
              ยังไม่ถูกค้นพบ
            </p>
          )}
        </div>
      )}
    </div>
  );
};
