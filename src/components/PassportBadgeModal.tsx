import React, { useRef } from 'react';
import { X, Award, CheckCircle, Share2, Download, Sparkles, ShieldCheck } from 'lucide-react';
import { Bug } from '../types';
import { soundService } from '../services/sound';

interface PassportBadgeModalProps {
  explorerName: string;
  email: string;
  discoveredBugs: Bug[];
  totalBugs: number;
  catchCount: number;
  onClose: () => void;
}

export const PassportBadgeModal: React.FC<PassportBadgeModalProps> = ({
  explorerName,
  email,
  discoveredBugs,
  totalBugs,
  catchCount,
  onClose,
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const percentage = Math.round((discoveredBugs.length / totalBugs) * 100);

  const getRank = () => {
    if (percentage >= 100) return { title: 'ปรมาจารย์กีฏวิทยาแห่งชาติ (Master Entomologist)', level: 5, color: 'text-amber-400' };
    if (percentage >= 75) return { title: 'นักสำรวจภาคสนามระดับสูง (Senior Field Naturalist)', level: 4, color: 'text-emerald-400' };
    if (percentage >= 50) return { title: 'นักกีฏวิทยาชำนาญการ (Expert Entomologist)', level: 3, color: 'text-sky-400' };
    if (percentage >= 25) return { title: 'ผู้พิทักษ์ความหลากหลายชีวภาพ (Biodiversity Ranger)', level: 2, color: 'text-teal-400' };
    return { title: 'นักสำรวจแมลงฝึกหัด (Junior Bug Explorer)', level: 1, color: 'text-stone-300' };
  };

  const rank = getRank();

  const handleShare = async () => {
    soundService.playTap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `เกียรติบัตรนักสำรวจ BugQuest: ${explorerName}`,
          text: `ฉันค้นพบแมลงประจำถิ่นแล้ว ${discoveredBugs.length}/${totalBugs} ชนิด ในฐานะ "${rank.title}" บนแอป BugQuest!`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(
        `[BugQuest Explorer Certificate] ${explorerName} ได้รับตำแหน่ง ${rank.title} ค้นพบแมลง ${discoveredBugs.length}/${totalBugs} ชนิด!`
      );
      alert('คัดลอกข้อความเกียรติบัตรสำหรับแชร์เรียบร้อยแล้ว!');
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full shadow-2xl relative my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-stone-950/90 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100">
                เกียรติบัตรพาสปอร์ตนักสำรวจ (Explorer Passport)
              </h3>
              <p className="text-xs text-stone-400">
                หลักฐานยืนยันความก้าวหน้าและการลงพื้นที่สำรวจจริง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Card Content */}
        <div className="p-6">
          <div
            ref={certRef}
            className="rounded-3xl bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-2 border-amber-500/40 p-6 relative overflow-hidden shadow-2xl"
          >
            {/* Top Ornamental corner stamps */}
            <div className="absolute top-3 left-3 text-amber-500/30 text-xs font-mono">✦ BUGQUEST ✦</div>
            <div className="absolute top-3 right-3 text-amber-500/30 text-xs font-mono">№ {Date.now().toString().slice(-6)}</div>

            {/* Emblem */}
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-lg shadow-amber-500/20 mb-3">
                <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-3xl">
                  🦗
                </div>
              </div>
              <span className="text-[10px] tracking-widest text-amber-400 font-bold uppercase">
                Department of Insect Biodiversity Exploration
              </span>
              <h2 className="text-xl font-black text-stone-100 mt-1">
                พาสปอร์ตนักกีฏวิทยาไทย
              </h2>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                Official Explorer Certificate
              </p>
            </div>

            {/* Recipient Details */}
            <div className="mt-5 pt-4 border-t border-stone-800/80 text-center space-y-1">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">
                มอบให้แก่นักสำรวจ
              </div>
              <div className="text-lg font-black text-amber-200">
                {explorerName}
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                {email}
              </div>
            </div>

            {/* Rank & Stats */}
            <div className="mt-4 p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-center">
              <div className="text-[11px] text-stone-400">ตำแหน่งเกียรติยศ</div>
              <div className={`text-sm font-bold mt-0.5 ${rank.color}`}>
                {rank.title}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 pt-2.5 border-t border-stone-800 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] block">ค้นพบแมลง</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {discoveredBugs.length} / {totalBugs} ชนิด
                  </span>
                </div>
                <div className="w-px h-6 bg-stone-800" />
                <div>
                  <span className="text-stone-400 text-[10px] block">บันทึกภาพสถานที่</span>
                  <span className="font-mono text-sky-400 font-bold">
                    {catchCount} ครั้ง
                  </span>
                </div>
                <div className="w-px h-6 bg-stone-800" />
                <div>
                  <span className="text-stone-400 text-[10px] block">ความสำเร็จ</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Discovered Bug Badges */}
            <div className="mt-4">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 text-center">
                แมลงประจำถิ่นที่ถูกปลดล็อกในเล่มพาสปอร์ต
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {discoveredBugs.map((bug) => (
                  <span
                    key={bug.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900 border border-emerald-800/60 text-[11px] text-emerald-300 font-medium shadow-sm"
                  >
                    <span>{bug.emoji}</span>
                    <span>{bug.nameTh}</span>
                  </span>
                ))}
                {discoveredBugs.length === 0 && (
                  <span className="text-xs text-stone-500 italic">
                    ยังไม่มีการค้นพบ เริ่มสำรวจเพื่อรับตราประทับ
                  </span>
                )}
              </div>
            </div>

            {/* Official Stamp */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-800/80 text-[10px] text-stone-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold">VERIFIED EXPEDITION</span>
              </div>
              <div className="font-mono text-stone-500">
                DATE: {new Date().toLocaleDateString('th-TH')}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 mt-5">
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950/40"
            >
              <Share2 className="w-4 h-4" />
              <span>แชร์เกียรติบัตรนักสำรวจ</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
