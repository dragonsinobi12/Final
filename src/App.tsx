import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Map,
  Heart,
  User,
  Search,
  RefreshCw,
  Sparkles,
  Smartphone,
  BookOpen,
  Code2,
  Wifi,
  WifiOff,
  LogOut,
  Sliders,
  CheckCircle2,
  Layers,
  ChevronRight,
  ShieldCheck,
  Camera,
  Volume2,
  VolumeX,
  Award
} from 'lucide-react';

import { SEED_SPOTS, SEED_BUGS, HABITAT_LABELS, RARITY_BADGES } from './data/seed';
import { Spot, Bug, Habitat } from './types';
import { calculateDistanceM, createDemoSpotsNearLocation } from './services/geo';
import { soundService } from './services/sound';
import { useCollectionStore } from './store/useCollectionStore';

// Components
import { SpotCard } from './components/SpotCard';
import { BugCard } from './components/BugCard';
import { SilhouetteBug } from './components/SilhouetteBug';
import { MapComponent } from './components/MapComponent';
import { LoadingView, EmptyView, ErrorView, OfflineBanner } from './components/StateViews';
import { SpotDetailModal } from './components/SpotDetailModal';
import { BugDetailModal } from './components/BugDetailModal';
import { CatchModal } from './components/CatchModal';
import { LoginModal } from './components/LoginModal';
import { RubricModal } from './components/RubricModal';
import { ExpoCodeModal } from './components/ExpoCodeModal';
import { NotificationToast } from './components/NotificationToast';
import { PassportBadgeModal } from './components/PassportBadgeModal';

type ActiveTab = 'explore' | 'map' | 'favorites' | 'profile';

export default function App() {
  const store = useCollectionStore();

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [mobileFrame, setMobileFrame] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHabitat, setSelectedHabitat] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSimulatedError, setHasSimulatedError] = useState<boolean>(false);

  // Geolocation State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoPermission, setGeoPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Modals
  const [activeSpotDetail, setActiveSpotDetail] = useState<Spot | null>(null);
  const [activeBugDetail, setActiveBugDetail] = useState<Bug | null>(null);
  const [activeCatchSpot, setActiveCatchSpot] = useState<Spot | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRubricModal, setShowRubricModal] = useState<boolean>(false);
  const [showExpoCodeModal, setShowExpoCodeModal] = useState<boolean>(false);
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundService.isMuted());

  // Initialize Real GPS / Fallback
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setGeoPermission('granted');
        },
        () => {
          // Default fallback (Bangkok center) for preview without blocking
          setUserCoords({ lat: 13.7563, lng: 100.5018 });
          setGeoPermission('denied');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setUserCoords({ lat: 13.7563, lng: 100.5018 });
    }
  }, []);

  // Compute Active Spots List (Combines Seed Spots + Dynamic Demo Spots if Demo Mode enabled)
  const allSpots: Spot[] = useMemo(() => {
    if (store.demoMode && userCoords) {
      const demoSpots = createDemoSpotsNearLocation(userCoords.lat, userCoords.lng);
      return [...demoSpots, ...SEED_SPOTS];
    }
    return SEED_SPOTS;
  }, [store.demoMode, userCoords]);

  // Filtered Spots for Explore View
  const filteredSpots = useMemo(() => {
    return allSpots.filter((spot) => {
      const matchesSearch =
        spot.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.bugIds.some((bId) => {
          const bug = SEED_BUGS.find((b) => b.id === bId);
          return (
            bug?.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bug?.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

      const matchesHabitat =
        selectedHabitat === 'all' || spot.habitat === selectedHabitat;

      return matchesSearch && matchesHabitat;
    });
  }, [allSpots, searchQuery, selectedHabitat]);

  // Favorite Spots
  const favoriteSpots = useMemo(() => {
    return allSpots.filter((s) => store.favoriteSpotIds.includes(s.id));
  }, [allSpots, store.favoriteSpotIds]);

  // Refresh Trigger
  const handleRefresh = () => {
    soundService.playTap();
    setLoading(true);
    setHasSimulatedError(false);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  // Run Demo Step from Rubric
  const handleRunDemoStep = (stepId: number) => {
    switch (stepId) {
      case 1: // Explore & Offline
        setActiveTab('explore');
        store.setOfflineSimulated(true);
        break;
      case 2: // Favorites
        setActiveTab('favorites');
        break;
      case 3: // Map
        setActiveTab('map');
        store.setDemoMode(true);
        break;
      case 4: // Detail & Login
        const firstSpot = allSpots[0];
        setActiveSpotDetail(firstSpot);
        break;
      case 5: // Catch Flow
        const targetSpot = allSpots[0];
        setActiveCatchSpot(targetSpot);
        break;
      case 6: // Reminder 10s
        const remindSpot = allSpots[0];
        store.scheduleReminder(remindSpot, 5); // 5s fast trigger for demo
        break;
      case 7: // Profile & Bugdex
        setActiveTab('profile');
        break;
      default:
        break;
    }
  };

  // Content for Active Tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <div className="space-y-4 pb-20">
            {/* Search Bar & Habitat Filters */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาพื้นที่, จังหวัด, หรือชื่อแมลง..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-emerald-500 transition shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-2.5 text-stone-500 hover:text-stone-300 text-xs"
                  >
                    ล้าง
                  </button>
                )}
              </div>

              {/* Habitat Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => {
                    soundService.playTap();
                    setSelectedHabitat('all');
                  }}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition ${
                    selectedHabitat === 'all'
                      ? 'bg-emerald-600 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  ทั้งหมด ({allSpots.length})
                </button>
                {Object.entries(HABITAT_LABELS).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => {
                      soundService.playTap();
                      setSelectedHabitat(key);
                    }}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition ${
                      selectedHabitat === key
                        ? 'bg-emerald-600 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    <span>{info.icon}</span>
                    <span>{info.th}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pull-to-refresh / Quick Header Info */}
            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <span>
                พบ {filteredSpots.length} พื้นที่สำรวจ{' '}
                {store.demoMode && <strong className="text-amber-400 font-normal">(รวมจุดเดโมใกล้คุณ)</strong>}
              </span>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>รีเฟรช</span>
              </button>
            </div>

            {/* List / Grid of SpotCards */}
            {loading ? (
              <LoadingView />
            ) : hasSimulatedError ? (
              <ErrorView onRetry={handleRefresh} />
            ) : filteredSpots.length === 0 ? (
              <EmptyView
                title="ไม่พบพื้นที่สำรวจที่ตรงกับคำค้น"
                message="ลองเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อดูทุกพื้นที่"
                onClear={() => {
                  setSearchQuery('');
                  setSelectedHabitat('all');
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredSpots.map((spot) => {
                  const dist = userCoords
                    ? calculateDistanceM(userCoords.lat, userCoords.lng, spot.latitude, spot.longitude)
                    : null;
                  return (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      bugs={SEED_BUGS}
                      discoveredBugIds={store.discoveredBugIds}
                      isFavorite={store.favoriteSpotIds.includes(spot.id)}
                      distanceMeters={dist}
                      onSelect={() => {
                        soundService.playTap();
                        setActiveSpotDetail(spot);
                      }}
                      onToggleFavorite={() => store.toggleFavorite(spot.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'map':
        return (
          <div className="space-y-3 pb-20">
            <MapComponent
              spots={allSpots}
              bugs={SEED_BUGS}
              discoveredBugIds={store.discoveredBugIds}
              userCoords={userCoords}
              selectedSpotId={activeSpotDetail?.id || null}
              onSelectSpot={(spot) => {
                soundService.playTap();
                setActiveSpotDetail(spot);
              }}
              onNavigateToSpot={(spot) => {
                soundService.playTap();
                setActiveSpotDetail(spot);
              }}
              demoMode={store.demoMode}
            />
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-4 pb-20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span>พื้นที่สำรวจที่บันทึกไว้ ({favoriteSpots.length})</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  หัวข้อ 5 & 7: ซิงก์ทันทีและจัดเก็บถาวรในเครื่อง
                </p>
              </div>
            </div>

            {favoriteSpots.length === 0 ? (
              <EmptyView
                title="ยังไม่มีพื้นที่ในรายการโปรด"
                message="กดไอคอนรูปหัวใจในการ์ดพื้นที่สำรวจเพื่อบันทึกพื้นที่ที่คุณสนใจไว้สำรวจในภายหลัง"
                onClear={() => setActiveTab('explore')}
                clearLabel="ไปหน้าสำรวจพื้นที่"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {favoriteSpots.map((spot) => {
                  const dist = userCoords
                    ? calculateDistanceM(userCoords.lat, userCoords.lng, spot.latitude, spot.longitude)
                    : null;
                  return (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      bugs={SEED_BUGS}
                      discoveredBugIds={store.discoveredBugIds}
                      isFavorite={true}
                      distanceMeters={dist}
                      onSelect={() => {
                        soundService.playTap();
                        setActiveSpotDetail(spot);
                      }}
                      onToggleFavorite={() => store.toggleFavorite(spot.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'profile':
        const discoveredCount = store.discoveredBugIds.length;
        const totalBugs = SEED_BUGS.length;
        const progressPercent = Math.round((discoveredCount / totalBugs) * 100);

        return (
          <div className="space-y-6 pb-24">
            {/* Explorer Profile Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-2xl bg-stone-950 flex items-center justify-center text-2xl">
                      🧑‍🌾
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-100">
                      {store.session ? store.session.user.name : 'ยังไม่ได้เข้าสู่ระบบ'}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono">
                      {store.session ? store.session.user.email : 'โหมดบุคคลทั่วไป (Guest)'}
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800/60 text-[10px] text-emerald-300 font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{store.session ? 'Token Valid (SecureStore)' : 'ไม่ได้ล็อกอิน'}</span>
                    </div>
                  </div>
                </div>

                {store.session ? (
                  <button
                    onClick={() => {
                      soundService.playTap();
                      store.logout();
                    }}
                    className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
                    title="ออกจากระบบ"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundService.playTap();
                      setShowLoginModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition"
                  >
                    เข้าสู่ระบบ
                  </button>
                )}
              </div>

              {/* Bugdex Progress Bar */}
              <div className="mt-5 pt-4 border-t border-stone-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>ความคืบหน้าสมุดสะสมแมลง (Bugdex)</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {discoveredCount} / {totalBugs} ชนิด ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-950 overflow-hidden p-0.5 border border-stone-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Passport Badge Button */}
                <button
                  onClick={() => {
                    soundService.playTap();
                    setShowPassportModal(true);
                  }}
                  className="mt-3.5 w-full py-2.5 px-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>เปิดดูพาสปอร์ตนักสำรวจ & เกียรติบัตร (Explorer Passport)</span>
                </button>
              </div>
            </div>

            {/* Bugdex Collection Grid (All 8 Bugs: Silhouette vs Revealed) */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  📖 คอลเลกชันแมลงประจำถิ่น (Bugdex Collection)
                </h4>
                <span className="text-[11px] text-stone-500">แตะการ์ดเพื่อดูข้อมูลชีววิทยา</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SEED_BUGS.map((bug) => {
                  const isDiscovered = store.discoveredBugIds.includes(bug.id);
                  return (
                    <BugCard
                      key={bug.id}
                      bug={bug}
                      discovered={isDiscovered}
                      onSelect={() => {
                        soundService.playTap();
                        setActiveBugDetail(bug);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Recent Expeditions & Catch Log */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  📸 ประวัติการสำรวจพื้นที่ (Expedition Catch Log)
                </h4>
                <span className="text-[11px] text-stone-500">{store.catchLog.length} บันทึก</span>
              </div>

              {store.catchLog.length === 0 ? (
                <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800/80 text-center text-xs text-stone-400">
                  ยังไม่มีประวัติการสำรวจ เริ่มถ่ายภาพบรรยากาศสถานที่จริงเพื่อบันทึก
                </div>
              ) : (
                <div className="space-y-3">
                  {store.catchLog.map((record) => {
                    const spot = allSpots.find((s) => s.id === record.spotId);
                    const caughtBugs = SEED_BUGS.filter((b) => record.bugIds.includes(b.id));
                    return (
                      <div
                        key={record.id}
                        className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start gap-3.5"
                      >
                        {record.photoUri ? (
                          <img
                            src={record.photoUri}
                            alt="Catch evidence"
                            className="w-16 h-16 rounded-xl object-cover border border-stone-700 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-stone-800 flex items-center justify-center text-stone-500 shrink-0">
                            <Camera className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold text-stone-100 truncate">
                              {spot ? spot.nameTh : 'พื้นที่สำรวจ'}
                            </h5>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {new Date(record.at).toLocaleDateString('th-TH')}
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-300 mt-1 line-clamp-1 italic">
                            "{record.note}"
                          </p>

                          <div className="flex items-center gap-1.5 mt-2">
                            {caughtBugs.map((bug) => (
                              <span
                                key={bug.id}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                              >
                                {bug.emoji} {bug.nameTh}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Prototype & Presentation Settings */}
            <div className="p-5 rounded-3xl bg-stone-950/70 border border-stone-800/90 space-y-4">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>การตั้งค่าสำหรับนำเสนอเดโม (Presentation Controls)</span>
              </h4>

              {/* Demo Mode Switch */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div>
                  <p className="text-xs font-bold text-stone-200">
                    โหมดเดโม (Demo Mode)
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    สร้างจุดสำรวจจำลอง 50-300 ม. รอบตำแหน่งคุณ และข้ามการเช็กรัศมีพื้นที่
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundService.playTap();
                    store.setDemoMode(!store.demoMode);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    store.demoMode ? 'bg-amber-500' : 'bg-stone-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      store.demoMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Offline Simulation Switch */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div>
                  <p className="text-xs font-bold text-stone-200">
                    จำลองตัดเน็ต / โหมดออฟไลน์ (Offline Test)
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    ทดสอบ Offline Banner, แคชออฟไลน์ และคิวการส่งข้อมูล (หัวข้อ 7)
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundService.playTap();
                    store.setOfflineSimulated(!store.offlineSimulated);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    store.offlineSimulated ? 'bg-rose-500' : 'bg-stone-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      store.offlineSimulated ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reset Data Button */}
              <div className="pt-2">
                <button
                  onClick={store.resetAllProgress}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-rose-400 text-xs font-medium border border-stone-800 transition"
                >
                  รีเซ็ตข้อมูลการสำรวจทั้งหมดเพื่อเริ่มทดสอบใหม่
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-start selection:bg-emerald-500 selection:text-stone-950">
      {/* Top Universal Navbar (Presenter Tools & Viewport Toggle) */}
      <header className="w-full bg-stone-900/90 border-b border-stone-800/80 sticky top-0 z-[500] backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-stone-950 font-black text-sm shadow-md">
            🦗
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight text-stone-100">
                BugQuest
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                Expo SDK 54 Prototype
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden sm:block">
              แอปเดินทางสะสมแมลงตามสถานที่จริงด้วยภาพบรรยากาศ • ครบ 11 หัวข้อ
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Rubric / 11 Topics Button */}
          <button
            onClick={() => {
              soundService.playTap();
              setShowRubricModal(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="คู่มือตรวจเกณฑ์ 11 หัวข้อ และสคริปต์เดโม 7 นาที"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">เกณฑ์ 11 หัวข้อ</span>
          </button>

          {/* Expo Code Viewer Button */}
          <button
            onClick={() => {
              soundService.playTap();
              setShowExpoCodeModal(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900/80 text-sky-300 border border-sky-700/60 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="ดูโค้ดไฟล์ Expo SDK 54 ทั้งหมด"
          >
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">โค้ด Expo</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const muted = soundService.toggleMute();
              setIsMuted(muted);
              if (!muted) soundService.playTap();
            }}
            className={`p-1.5 rounded-xl border transition ${
              isMuted
                ? 'bg-stone-800 text-stone-500 border-stone-700'
                : 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
            }`}
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์ (Unmute)' : 'ปิดเสียงเอฟเฟกต์ (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Passport / Certificate Button */}
          <button
            onClick={() => {
              soundService.playTap();
              setShowPassportModal(true);
            }}
            className="p-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-700/60 transition"
            title="เปิดดูพาสปอร์ตนักสำรวจและเกียรติบัตร"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Viewport Frame Toggle (Mobile vs Responsive) */}
          <button
            onClick={() => setMobileFrame(!mobileFrame)}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
            title={mobileFrame ? 'สลับเป็นโหมดขยายเต็มหน้าจอ' : 'สลับเป็นกรอบมือถือ'}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="w-full flex-1 flex justify-center p-0 sm:p-4 md:p-6">
        <div
          className={`w-full transition-all duration-300 flex flex-col ${
            mobileFrame
              ? 'max-w-[440px] bg-stone-900 border-0 sm:border sm:border-stone-800 sm:rounded-[36px] shadow-2xl overflow-hidden min-h-[calc(100vh-60px)] sm:min-h-[820px] relative'
              : 'max-w-5xl bg-stone-900/50 border border-stone-800 rounded-3xl p-4 sm:p-6 min-h-[calc(100vh-100px)] relative'
          }`}
        >
          {/* Mobile Speaker & Camera Notch (when in mobile frame mode) */}
          {mobileFrame && (
            <div className="hidden sm:flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-24 h-4 bg-stone-950 rounded-full flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-800" />
                <span className="w-8 h-1 rounded-full bg-stone-800" />
              </div>
            </div>
          )}

          {/* Offline Banner (Topic 7) */}
          <OfflineBanner
            isOffline={store.offlineSimulated}
            pendingCount={store.pendingRegistrations.length}
            onSync={store.syncPendingQueue}
          />

          {/* Dynamic Content Body */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            {renderTabContent()}
          </div>

          {/* Bottom Navigation Tabs (Topic 4: Expo Router Navigation Bar) */}
          <nav
            className={`${
              mobileFrame
                ? 'absolute bottom-0 left-0 right-0'
                : 'sticky bottom-4 mx-auto max-w-md w-full rounded-2xl'
            } bg-stone-950/95 border-t sm:border border-stone-800/90 backdrop-blur-xl px-2 py-2 flex items-center justify-around z-40 shadow-2xl`}
          >
            <button
              onClick={() => {
                soundService.playTap();
                setActiveTab('explore');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeTab === 'explore'
                  ? 'text-emerald-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px]">สำรวจ</span>
            </button>

            <button
              onClick={() => {
                soundService.playTap();
                setActiveTab('map');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeTab === 'map'
                  ? 'text-emerald-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Map className="w-5 h-5" />
              <span className="text-[10px]">แผนที่</span>
            </button>

            <button
              onClick={() => {
                soundService.playTap();
                setActiveTab('favorites');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition relative ${
                activeTab === 'favorites'
                  ? 'text-emerald-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px]">รายการโปรด</span>
              {store.favoriteSpotIds.length > 0 && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={() => {
                soundService.playTap();
                setActiveTab('profile');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'text-emerald-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Bugdex</span>
            </button>
          </nav>
        </div>
      </main>

      {/* MODALS */}

      {/* Spot Detail Modal */}
      {activeSpotDetail && (
        <SpotDetailModal
          spot={activeSpotDetail}
          bugs={SEED_BUGS}
          discoveredBugIds={store.discoveredBugIds}
          distanceMeters={
            userCoords
              ? calculateDistanceM(userCoords.lat, userCoords.lng, activeSpotDetail.latitude, activeSpotDetail.longitude)
              : null
          }
          onClose={() => setActiveSpotDetail(null)}
          onStartCatch={() => {
            setActiveCatchSpot(activeSpotDetail);
            setActiveSpotDetail(null);
          }}
          onSelectBug={(bug) => setActiveBugDetail(bug)}
          onScheduleReminder={(spot, sec) => {
            store.scheduleReminder(spot, sec);
            alert(`ตั้งเตือนสำเร็จ! การแจ้งเตือนจะปรากฏใน ${sec} วินาทีเพื่อสาธิต Deep Link`);
          }}
        />
      )}

      {/* Bug Detail Modal */}
      {activeBugDetail && (
        <BugDetailModal
          bug={activeBugDetail}
          discovered={store.discoveredBugIds.includes(activeBugDetail.id)}
          spots={allSpots}
          onClose={() => setActiveBugDetail(null)}
          onNavigateToSpot={(spot) => {
            setActiveSpotDetail(spot);
            setActiveTab('explore');
          }}
        />
      )}

      {/* Catch Modal (Live Camera, Form, Animation & Unlock) */}
      {activeCatchSpot && (
        <CatchModal
          spot={activeCatchSpot}
          bugs={SEED_BUGS}
          session={store.session}
          userCoords={userCoords}
          isWithinSpotRadius={
            userCoords
              ? calculateDistanceM(
                  userCoords.lat,
                  userCoords.lng,
                  activeCatchSpot.latitude,
                  activeCatchSpot.longitude
                ) <= activeCatchSpot.radiusM
              : false
          }
          demoMode={store.demoMode}
          onClose={() => setActiveCatchSpot(null)}
          onSuccessCatch={(newBugIds, photoUri, note) => {
            store.addCatchRecord(
              activeCatchSpot.id,
              newBugIds,
              photoUri,
              note,
              userCoords
            );
          }}
          onOpenLogin={() => setShowLoginModal(true)}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(newSession) => store.setSession(newSession)}
        />
      )}

      {/* 11 Topics Rubric & Presentation Script Modal */}
      {showRubricModal && (
        <RubricModal
          onClose={() => setShowRubricModal(false)}
          onRunDemoStep={handleRunDemoStep}
        />
      )}

      {/* Expo SDK 54 Code Explorer Modal */}
      {showExpoCodeModal && (
        <ExpoCodeModal onClose={() => setShowExpoCodeModal(false)} />
      )}

      {/* Explorer Passport & Certificate Modal */}
      {showPassportModal && (
        <PassportBadgeModal
          explorerName={store.session?.user.name || 'ดร. นที นักกีฏวิทยา (Guest)'}
          email={store.session?.user.email || 'natee.entomology@demo.th'}
          discoveredBugs={SEED_BUGS.filter((b) => store.discoveredBugIds.includes(b.id))}
          totalBugs={SEED_BUGS.length}
          catchCount={store.catchLog.length}
          onClose={() => setShowPassportModal(false)}
        />
      )}

      {/* Local Notification Toast (Deep Link Trigger) */}
      <NotificationToast
        reminders={store.scheduledReminders}
        onDismiss={store.dismissReminder}
        onOpenSpot={(spotId) => {
          const spot = allSpots.find((s) => s.id === spotId);
          if (spot) {
            setActiveSpotDetail(spot);
          }
        }}
      />
    </div>
  );
}
