import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, CheckCircle, RefreshCw, X, Sparkles, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Spot, Bug, Session } from '../types';
import { CuteBugArt } from './CuteBugArt';
import { soundService } from '../services/sound';
import { RARITY_BADGES } from '../data/seed';

interface CatchModalProps {
  spot: Spot;
  bugs: Bug[];
  session: Session | null;
  userCoords: { lat: number; lng: number } | null;
  isWithinSpotRadius: boolean;
  demoMode: boolean;
  onClose: () => void;
  onSuccessCatch: (newBugIds: string[], photoUri: string, note: string) => void;
  onOpenLogin: () => void;
}

export const CatchModal: React.FC<CatchModalProps> = ({
  spot,
  bugs,
  session,
  userCoords,
  isWithinSpotRadius,
  demoMode,
  onClose,
  onSuccessCatch,
  onOpenLogin
}) => {
  const [step, setStep] = useState<'camera' | 'preview' | 'form' | 'scanning' | 'revealed'>('camera');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [formErrors, setFormErrors] = useState<{ note?: string }>({});
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [unlockedBugs, setUnlockedBugs] = useState<Bug[]>([]);
  const [revealedIndex, setRevealedIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Spot bugs to catch
  const spotBugs = bugs.filter((b) => spot.bugIds.includes(b.id));

  // Initialize camera
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermission('denied');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      setCameraPermission('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraPermission('denied');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, step]);

  // Take photo from live video feed
  const capturePhoto = () => {
    soundService.playShutter();
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoUri(dataUrl);
        stopCamera();
        setStep('preview');
      }
    }
  };

  // Upload photo from gallery fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUri(reader.result as string);
        stopCamera();
        setStep('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit registration & unlock bugs
  const handleSubmitCatch = () => {
    if (!note.trim()) {
      setFormErrors({ note: 'กรุณาระบุบันทึกสั้น ๆ เกี่ยวกับสภาพแวดล้อมหรือการสำรวจ' });
      return;
    }

    setFormErrors({});
    setStep('scanning');

    // Simulate scanning network request & biological detection
    setTimeout(() => {
      soundService.playCatchCelebration();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti optional
      }

      setUnlockedBugs(spotBugs);
      setRevealedIndex(0);
      setStep('revealed');

      onSuccessCatch(
        spotBugs.map((b) => b.id),
        photoUri || '',
        note
      );
    }, 1800);
  };

  // If not logged in, prompt authentication (Topic 8: Protected catch route)
  if (!session) {
    return (
      <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-100">จำเป็นต้องเข้าสู่ระบบ</h3>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            การลงทะเบียนบันทึกการสำรวจและจับแมลงเข้าสู่ Bugdex จำเป็นต้องมีตัวตนนามนักสำรวจ (Session Token ปลอดภัย)
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-sm transition"
            >
              เข้าสู่ระบบนักสำรวจ
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-medium"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-auto">
        {/* Header */}
        <div className="bg-stone-950/80 px-5 py-3.5 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-stone-100 line-clamp-1">
                สำรวจ: {spot.nameTh}
              </h3>
              <p className="text-[11px] text-stone-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-500" />
                {spot.province} • รัศมี {spot.radiusM} ม.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location Status Badge */}
        <div className="px-5 py-2 bg-stone-950/40 border-b border-stone-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {isWithinSpotRadius || demoMode ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                {demoMode ? 'อยู่ในพื้นที่ (โหมดเดโม)' : 'อยู่ในรัศมีสำรวจแล้ว'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                อยู่นอกรัศมีพื้นที่ (เปิด Demo Mode ได้ที่หน้า Profile)
              </span>
            )}
          </div>
          <span className="text-stone-400 text-[11px]">
            นักสำรวจ: <strong className="text-stone-200">{session.user.name}</strong>
          </span>
        </div>

        {/* STEP 1: Live Camera Capture */}
        {step === 'camera' && (
          <div className="p-5 flex flex-col items-center">
            <div className="text-center mb-3">
              <h4 className="text-sm font-bold text-stone-200">
                ถ่ายภาพบรรยากาศสถานที่จริง
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                ถ่ายภาพป่า ถ้ำ โขดหิน หรือทิวทัศน์รอบตัวคุณเพื่อยืนยันการสำรวจ
              </p>
            </div>

            {/* Video Feed / Fallback */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-inner flex items-center justify-center">
              {cameraPermission === 'granted' ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder crosshairs */}
                  <div className="absolute inset-8 border border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-4 h-4 border-t border-l border-emerald-400 absolute top-2 left-2" />
                    <div className="w-4 h-4 border-t border-r border-emerald-400 absolute top-2 right-2" />
                    <div className="w-4 h-4 border-b border-l border-emerald-400 absolute bottom-2 left-2" />
                    <div className="w-4 h-4 border-b border-r border-emerald-400 absolute bottom-2 right-2" />
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-400 mx-auto mb-3">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-stone-300 font-medium">
                    {cameraPermission === 'denied'
                      ? 'ไม่สามารถเข้าถึงกล้องเว็บแคมได้'
                      : 'กำลังขออนุญาตเข้าถึงกล้อง...'}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1 max-w-xs">
                    คุณสามารถเลือกรูปภาพจากเครื่องเพื่อใช้ในการเดโมได้ทันที
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs inline-flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    เลือกรูปภาพจากเครื่อง
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="w-full mt-4 flex items-center justify-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition flex items-center gap-1.5 text-xs font-medium"
                title="เลือกจากแกลเลอรี"
              >
                <ImageIcon className="w-4 h-4" />
                <span>แกลเลอรี</span>
              </button>

              {cameraPermission === 'granted' && (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white hover:bg-emerald-400 p-1 shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center"
                  title="กดถ่ายภาพ"
                >
                  <div className="w-13 h-13 rounded-full border-2 border-stone-950 bg-stone-100 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-stone-900" />
                  </div>
                </button>
              )}

              {cameraPermission === 'denied' && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition flex items-center gap-1.5 text-xs font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>ลองเปิดกล้องใหม่</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Preview Captured Photo */}
        {step === 'preview' && photoUri && (
          <div className="p-5 flex flex-col items-center">
            <div className="text-center mb-3">
              <h4 className="text-sm font-bold text-stone-200">ตรวจสอบภาพถ่ายบรรยากาศ</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                รูปนี้จะถูกบันทึกเป็นหลักฐานการสำรวจพื้นที่
              </p>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-md">
              <img
                src={photoUri}
                alt="Spot evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-stone-900/80 px-2.5 py-1 rounded-lg text-[10px] text-stone-300 backdrop-blur-md">
                📍 {spot.nameTh}
              </div>
            </div>

            <div className="w-full mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhotoUri(null);
                  setStep('camera');
                  startCamera();
                }}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs transition inline-flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                ถ่ายใหม่
              </button>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition inline-flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                ใช้รูปนี้บันทึก
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Registration Form */}
        {step === 'form' && (
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-stone-950/60 border border-stone-800">
              {photoUri && (
                <img
                  src={photoUri}
                  alt="Thumbnail"
                  className="w-14 h-14 rounded-xl object-cover border border-stone-700"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-stone-200 line-clamp-1">{spot.nameTh}</h4>
                <p className="text-xs text-stone-400">
                  พิกัด: {userCoords ? `${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}` : 'พิกัดจำลอง'}
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  ชื่อนักสำรวจ (Explorer Name)
                </label>
                <input
                  type="text"
                  disabled
                  value={session.user.name}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-400 text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  บันทึกการสังเกตพื้นที่และสภาพแวดล้อม <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    if (formErrors.note) setFormErrors({});
                  }}
                  placeholder="เช่น สภาพอากาศครึ้มฝน ความชื้นสูง พบต้นไม้ใหญ่ริมน้ำและดินร่วน..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border text-stone-200 text-xs focus:outline-none transition resize-none ${
                    formErrors.note
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-stone-800 focus:border-emerald-500'
                  }`}
                />
                {formErrors.note && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.note}</p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('preview')}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs transition"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCatch}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ส่งบันทึกและสแกนค้นพบแมลง</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Scanning Habitat Animation */}
        {step === 'scanning' && (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="relative w-28 h-28 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-3 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center">
                <span className="text-3xl animate-pulse">🔍</span>
              </div>
            </div>
            <h4 className="text-base font-bold text-stone-100">กำลังสแกนวิเคราะห์ระบบนิเวศ...</h4>
            <p className="text-xs text-stone-400 max-w-xs mt-1 leading-relaxed">
              เปรียบเทียบภาพบรรยากาศกับถิ่นอาศัยจริงในฐานข้อมูลชีววิทยาเพื่อค้นพบแมลงประจำถิ่น
            </p>
          </div>
        )}

        {/* STEP 5: Revealed Bug Celebration */}
        {step === 'revealed' && unlockedBugs.length > 0 && (
          <div className="p-6 text-center animate-in zoom-in-95 duration-500">
            {(() => {
              const currentBug = unlockedBugs[revealedIndex] || unlockedBugs[0];
              const rarity = RARITY_BADGES[currentBug.rarity] || RARITY_BADGES.common;
              return (
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ค้นพบแมลงสายพันธุ์ใหม่เข้าสู่ Bugdex!</span>
                  </div>

                  <div className="relative w-36 h-36 mx-auto my-3 rounded-3xl bg-gradient-to-b from-stone-800 to-stone-900 border-2 border-emerald-500/50 shadow-2xl flex items-center justify-center">
                    <CuteBugArt bugId={currentBug.id} className="w-28 h-28" discovered={true} />
                  </div>

                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-1 ${rarity.color} ${rarity.bg} ${rarity.border}`}
                  >
                    {rarity.labelTh}
                  </span>

                  <h3 className="text-xl font-black text-stone-100 mt-1">
                    {currentBug.nameTh}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono italic">
                    {currentBug.scientificName} ({currentBug.nameEn})
                  </p>

                  <div className="mt-4 p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 text-left text-xs text-stone-300 space-y-1.5">
                    <p className="font-semibold text-emerald-400 text-[11px]">
                      📖 ข้อมูลชีววิทยาจริง:
                    </p>
                    {currentBug.facts.map((fact, idx) => (
                      <p key={idx} className="leading-relaxed pl-2 border-l-2 border-emerald-700/50">
                        {fact}
                      </p>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    {unlockedBugs.length > 1 && revealedIndex < unlockedBugs.length - 1 ? (
                      <button
                        onClick={() => setRevealedIndex((prev) => prev + 1)}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition"
                      >
                        ดูแมลงตัวถัดไป ({revealedIndex + 1}/{unlockedBugs.length})
                      </button>
                    ) : (
                      <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition shadow-lg"
                      >
                        บันทึกเข้าสู่ Bugdex เรียบร้อย!
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
