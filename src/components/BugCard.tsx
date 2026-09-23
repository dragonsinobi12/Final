import React from 'react';
import { Bug } from '../types';
import { CuteBugArt } from './CuteBugArt';
import { RARITY_BADGES } from '../data/seed';
import { Sparkles, ShieldAlert } from 'lucide-react';

interface BugCardProps {
  bug: Bug;
  discovered: boolean;
  onSelect?: () => void;
}

export const BugCard: React.FC<BugCardProps> = ({ bug, discovered, onSelect }) => {
  const rarity = RARITY_BADGES[bug.rarity] || RARITY_BADGES.common;

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
        onSelect ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
      } ${
        discovered
          ? 'bg-stone-900/90 hover:bg-stone-800/90 border-stone-800 hover:border-emerald-600/50 shadow-md'
          : 'bg-stone-900/50 border-stone-800/50 opacity-80'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 mb-2">
          {discovered ? (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${rarity.color} ${rarity.bg} ${rarity.border}`}
            >
              {rarity.labelTh}
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700/50">
              ปริศนา
            </span>
          )}

          {discovered && bug.conservation && (
            <span
              title={bug.conservation}
              className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded-full border border-amber-800/50"
            >
              <ShieldAlert className="w-3 h-3" />
              คุ้มครอง
            </span>
          )}
        </div>

        {/* Bug Art Center */}
        <div className="flex justify-center my-3">
          <div
            className={`w-24 h-24 rounded-2xl flex items-center justify-center border transition-all ${
              discovered
                ? 'bg-gradient-to-b from-stone-800/60 to-stone-900/80 border-stone-700/50 shadow-inner'
                : 'bg-stone-950/80 border-stone-800/60'
            }`}
          >
            <CuteBugArt bugId={bug.id} className="w-18 h-18" discovered={discovered} />
          </div>
        </div>

        {/* Bug Info */}
        <div className="text-center">
          <h4 className="text-sm font-bold text-stone-100 line-clamp-1">
            {discovered ? bug.nameTh : 'สิ่งมีชีวิตลึกลับ'}
          </h4>
          <p className="text-xs text-stone-400 font-mono italic mt-0.5">
            {discovered ? bug.scientificName : 'Unknown Species'}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-stone-800/80 text-center">
        {discovered ? (
          <p className="text-[11px] text-stone-400 line-clamp-1">
            📍 {bug.habitatText}
          </p>
        ) : (
          <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400/90 font-medium">
            <Sparkles className="w-3 h-3" />
            <span>เดินทางสำรวจเพื่อปลดล็อก</span>
          </div>
        )}
      </div>
    </div>
  );
};
