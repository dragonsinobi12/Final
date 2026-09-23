import React from 'react';

interface CuteBugArtProps {
  bugId: string;
  className?: string;
  discovered?: boolean;
}

export const CuteBugArt: React.FC<CuteBugArtProps> = ({
  bugId,
  className = 'w-16 h-16',
  discovered = true
}) => {
  // If not discovered, render silhouette with mystery badge
  const filterStyle = discovered ? '' : 'brightness-0 contrast-200 opacity-80';

  const renderGraphic = () => {
    switch (bugId) {
      case 'bug-1': // จิ้งหรีดถ้ำ (Cave Cricket)
        return (
          <svg viewBox="0 0 100 100" className={`w-full h-full ${filterStyle}`} fill="none" stroke="currentColor">
            {/* Long antennae */}
            <path d="M45 42 Q20 15 5 10" stroke="#a88358" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M55 42 Q80 15 95 10" stroke="#a88358" strokeWidth="2.5" strokeLinecap="round" />
            {/* Head & Big Eyes */}
            <circle cx="50" cy="45" r="12" fill="#8c6239" />
            <circle cx="45" cy="43" r="3.5" fill="#fef3c7" />
            <circle cx="55" cy="43" r="3.5" fill="#fef3c7" />
            <circle cx="46" cy="43" r="1.5" fill="#1c1917" />
            <circle cx="56" cy="43" r="1.5" fill="#1c1917" />
            {/* Thorax and Humped Abdomen */}
            <ellipse cx="50" cy="58" rx="10" ry="8" fill="#785028" />
            <path d="M42 63 Q50 85 50 88 Q50 85 58 63 Z" fill="#653f1c" />
            {/* Long Jumping Legs */}
            <path d="M40 60 Q22 45 20 65 L15 85" stroke="#8c6239" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M60 60 Q78 45 80 65 L85 85" stroke="#8c6239" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Front legs */}
            <path d="M42 50 L28 58" stroke="#a88358" strokeWidth="2" strokeLinecap="round" />
            <path d="M58 50 L72 58" stroke="#a88358" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'bug-2': // ผีเสื้อกลางคืนแอตลาส (Atlas Moth)
        return (
          <svg viewBox="0 0 100 100" className={`w-full h-full ${filterStyle}`} fill="none">
            {/* Huge Wings */}
            <path d="M50 48 C35 15 10 18 5 28 C2 36 15 50 38 56 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <path d="M50 48 C65 15 90 18 95 28 C98 36 85 50 62 56 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            {/* Snake head apex on wingtips */}
            <circle cx="10" cy="26" r="3" fill="#fbbf24" />
            <circle cx="90" cy="26" r="3" fill="#fbbf24" />
            {/* Lower wings */}
            <path d="M48 55 C30 60 25 78 42 85 C48 83 49 68 49 58 Z" fill="#d97706" />
            <path d="M52 55 C70 60 75 78 58 85 C52 83 51 68 51 58 Z" fill="#d97706" />
            {/* Translucent triangle windows */}
            <polygon points="32,38 38,44 28,45" fill="#fef3c7" opacity="0.8" />
            <polygon points="68,38 62,44 72,45" fill="#fef3c7" opacity="0.8" />
            {/* Fuzzy Body */}
            <ellipse cx="50" cy="55" rx="5" ry="14" fill="#78350f" />
            <circle cx="50" cy="40" r="4.5" fill="#451a03" />
            {/* Feathery antennae */}
            <path d="M48 38 Q40 30 36 28" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <path d="M52 38 Q60 30 64 28" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'bug-3': // ผีเสื้อถุงทอง (Golden Birdwing)
        return (
          <svg viewBox="0 0 100 100" className={`w-full h-full ${filterStyle}`} fill="none">
            {/* Black forewings with white veins */}
            <path d="M50 45 C35 15 15 15 8 30 C12 48 35 55 48 55 Z" fill="#1c1917" stroke="#44403c" strokeWidth="1.5" />
            <path d="M50 45 C65 15 85 15 92 30 C88 48 65 55 52 55 Z" fill="#1c1917" stroke="#44403c" strokeWidth="1.5" />
            {/* Bright Golden Hindwings */}
            <path d="M47 52 C32 55 28 75 42 86 C48 83 49 65 48 55 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M53 52 C68 55 72 75 58 86 C52 83 51 65 52 55 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Black scallops on golden wings */}
            <circle cx="37" cy="74" r="2.5" fill="#1c1917" />
            <circle cx="63" cy="74" r="2.5" fill="#1c1917" />
            {/* Slender thorax & head */}
            <ellipse cx="50" cy="54" rx="4" ry="12" fill="#292524" />
            <circle cx="50" cy="38" r="4" fill="#1c1917" />
            <path d="M48 36 Q42 22 38 20" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M52 36 Q58 22 62 20" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'bug-4': // หิ่งห้อยอัมพวา (Amphawa Firefly)
        return (
          <svg viewBox="0 0 100 100" className={`w-full h-full ${filterStyle}`} fill="none">
            {/* Bioluminescent Glow Halo */}
            <circle cx="50" cy="75" r="22" fill="#84cc16" opacity="0.35" className="animate-pulse" />
            <circle cx="50" cy="75" r="12" fill="#bef264" opacity="0.6" />
            {/* Pronotum (Orange head shield) */}
            <ellipse cx="50" cy="38" rx="11" ry="8" fill="#f97316" />
            <circle cx="50" cy="30" r="5" fill="#1c1917" />
            {/* Elytra (Brown wing covers) */}
            <path d="M40 44 L40 68 C40 73 49 75 49 75 L49 44 Z" fill="#44403c" />
            <path d="M60 44 L60 68 C60 73 51 75 51 75 L51 44 Z" fill="#44403c" />
            {/* Glowing tail lantern */}
            <ellipse cx="50" cy="76" rx="7" ry="5" fill="#facc15" />
            {/* Cute eyes & legs */}
            <circle cx="47" cy="28" r="2" fill="#ffffff" />
            <circle cx="53" cy="28" r="2" fill="#ffffff" />
            <path d="M40 40 L28 35" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
            <path d="M60 40 L72 35" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'bug-5': // มดแดง (Weaver Ant)
        return (
          <svg viewBox="0 0 100 100" className={`w-full h-full ${filterStyle}`} fill="none">
            {/* Large Mandibles & Head */}
            <circle cx="34" cy="36" r="11" fill="#ea580c" />
            <path d="M26 38 L16 34" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M26 42 L16 46" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="32" r="3" fill="#1c1917" />
            {/* Slender Mesosoma (Thorax) */}
            <ellipse cx="50" cy="46" rx="8" ry="5" fill="#c2410c" />
            {/* Petiole Node */}
            <ellipse cx="61" cy="48" rx="3.5" ry="3" fill="#9a3412" />
            {/* High Pointing Gaster (Abdomen) */}
            <ellipse cx="73" cy="42" rx="12" ry="9" fill="#ea580c" transform="rotate(-15 73 42)" />
            {/* Long Agile Legs */}
            <path d="M46 48 L35 70 L25 76" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M52 48 L55 72 L50 82" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M56 48 L72 68 L82 74" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'bug-6': // แมงดานา (Giant Water Bug)
        return (
          <svg viewBox="0 0 100 100" className={`w-full h-full ${filterStyle}`} fill="none">
            {/* Giant Oval Body */}
            <ellipse cx="50" cy="55" rx="18" ry="26" fill="#365314" stroke="#1a2e05" strokeWidth="2" />
            {/* Crossed wing pattern on back */}
            <path d="M38 45 L62 70" stroke="#4d7c0f" strokeWidth="2" />
            <path d="M62 45 L38 70" stroke="#4d7c0f" strokeWidth="2" />
            {/* Triangular Head with Raptor Eyes */}
            <polygon points="50,22 40,35 60,35" fill="#1a2e05" />
            <ellipse cx="43" cy="30" rx="3" ry="5" fill="#000" />
            <ellipse cx="57" cy="30" rx="3" ry="5" fill="#000" />
            {/* Powerful Raptor Forelegs (Pincers) */}
            <path d="M42 32 Q25 24 20 38 Q25 44 36 38" fill="#4d7c0f" stroke="#1a2e05" strokeWidth="2" />
            <path d="M58 32 Q75 24 80 38 Q75 44 64 38" fill="#4d7c0f" stroke="#1a2e05" strokeWidth="2" />
            {/* Swimming Oar Hindlegs */}
            <path d="M34 65 L14 78" stroke="#1a2e05" strokeWidth="3" strokeLinecap="round" />
            <path d="M66 65 L86 78" stroke="#1a2e05" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'bug-7': // ตั๊กแตนกล้วยไม้ (Orchid Mantis)
        return (
          <svg viewBox="0 0 100 100" className={`w-full h-full ${filterStyle}`} fill="none">
            {/* Petal-like walking legs */}
            <ellipse cx="32" cy="65" rx="10" ry="16" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" transform="rotate(-25 32 65)" />
            <ellipse cx="68" cy="65" rx="10" ry="16" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" transform="rotate(25 68 65)" />
            {/* Soft pink thorax */}
            <ellipse cx="50" cy="52" rx="7" ry="14" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
            {/* Praying raptor arms tucked */}
            <path d="M46 44 L32 36 L40 50" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M54 44 L68 36 L60 50" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Triangular Head & Green/Dark Horn */}
            <polygon points="50,22 42,34 58,34" fill="#fdf2f8" stroke="#db2777" strokeWidth="1.5" />
            <circle cx="43" cy="29" r="2.5" fill="#047857" />
            <circle cx="57" cy="29" r="2.5" fill="#047857" />
            {/* Brown spot camouflage mimicry */}
            <circle cx="50" cy="54" r="2" fill="#a16207" />
          </svg>
        );

      case 'bug-8': // ด้วงกว่างชน (Asian Rhinoceros Beetle)
      default:
        return (
          <svg viewBox="0 0 100 100" className={`w-full h-full ${filterStyle}`} fill="none">
            {/* Shiny Brown Elytra */}
            <ellipse cx="50" cy="62" rx="18" ry="20" fill="#451a03" stroke="#270e02" strokeWidth="1.5" />
            {/* Center Elytral Split */}
            <line x1="50" y1="44" x2="50" y2="82" stroke="#78350f" strokeWidth="1.5" />
            {/* Thorax and Chest Horn */}
            <ellipse cx="50" cy="42" rx="13" ry="9" fill="#270e02" />
            <path d="M50 38 Q50 20 44 14" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            {/* Magnificent Head Horn (Bifurcated tip) */}
            <path d="M50 34 Q50 14 56 6" stroke="#270e02" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M56 6 L53 3 M56 6 L59 3" stroke="#270e02" strokeWidth="2.5" strokeLinecap="round" />
            {/* Cute Beetle Eyes */}
            <circle cx="44" cy="35" r="2" fill="#fbbf24" />
            <circle cx="56" cy="35" r="2" fill="#fbbf24" />
            {/* Spiky Grasping Legs */}
            <path d="M37 45 L20 40 L16 52" stroke="#270e02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M63 45 L80 40 L84 52" stroke="#270e02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M36 65 L22 72 L18 84" stroke="#270e02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M64 65 L78 72 L82 84" stroke="#270e02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {renderGraphic()}
      {!discovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center shadow-lg border-2 border-stone-900 animate-bounce">
            ?
          </span>
        </div>
      )}
    </div>
  );
};
