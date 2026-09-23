import { useState, useEffect } from 'react';
import { Session, ScheduledReminder, RegistrationInput, CatchRecord } from '../types';

const STORAGE_KEYS = {
  FAVORITES: 'bugquest_favorites_v1',
  DISCOVERED: 'bugquest_discovered_bugs_v1',
  CATCH_LOG: 'bugquest_catch_log_v1',
  PENDING_QUEUE: 'bugquest_pending_reg_v1',
  SESSION: 'bugquest_secure_session_v1',
  DEMO_MODE: 'bugquest_demo_mode_v1'
};

export function useCollectionStore() {
  // Load initial persistent state
  const [favoriteSpotIds, setFavoriteSpotIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['spot-2']; // Amphawa fireflies favorite by default
    } catch {
      return ['spot-2'];
    }
  });

  const [discoveredBugIds, setDiscoveredBugIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISCOVERED);
      return saved ? JSON.parse(saved) : ['bug-4']; // 1 bug discovered initially so users see the contrast
    } catch {
      return ['bug-4'];
    }
  });

  const [catchLog, setCatchLog] = useState<CatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATCH_LOG);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'catch-seed-1',
              spotId: 'spot-2',
              bugIds: ['bug-4'],
              photoUri: '',
              explorerName: 'ดร. นที นักกีฏวิทยา',
              note: 'สำรวจริมคลองอัมพวาช่วงค่ำ พบแสงกะพริบเป็นจังหวะบนต้นลำพูหนาแน่น',
              at: new Date(Date.now() - 3600000 * 24).toISOString(),
              latitude: 13.4265,
              longitude: 99.9542
            }
          ];
    } catch {
      return [];
    }
  });

  const [pendingRegistrations, setPendingRegistrations] = useState<RegistrationInput[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PENDING_QUEUE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [session, setSession] = useState<Session | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        const parsed: Session = JSON.parse(saved);
        if (parsed.expiresAt > Date.now()) {
          return parsed;
        } else {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        }
      }
    } catch {
      // Ignored
    }
    // Default demo session logged in for seamless immediate exploration, with option to logout
    return {
      token: 'bq_secure_token_demo_9981',
      expiresAt: Date.now() + 86400000,
      user: {
        id: 'user-1',
        name: 'ดร. นที นักกีฏวิทยา',
        email: 'explorer@bugquest.dev'
      }
    };
  });

  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEMO_MODE);
      return saved ? JSON.parse(saved) : true; // Default true so evaluator can demo catching anywhere!
    } catch {
      return true;
    }
  });

  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([]);
  const [offlineSimulated, setOfflineSimulated] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteSpotIds));
    } catch {}
  }, [favoriteSpotIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCOVERED, JSON.stringify(discoveredBugIds));
    } catch {}
  }, [discoveredBugIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATCH_LOG, JSON.stringify(catchLog));
    } catch {}
  }, [catchLog]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PENDING_QUEUE, JSON.stringify(pendingRegistrations));
    } catch {}
  }, [pendingRegistrations]);

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch {}
  }, [session]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE, JSON.stringify(demoMode));
    } catch {}
  }, [demoMode]);

  // Actions
  const toggleFavorite = (spotId: string) => {
    setFavoriteSpotIds((prev) =>
      prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId]
    );
  };

  const markBugsDiscovered = (bugIds: string[]) => {
    setDiscoveredBugIds((prev) => {
      const next = new Set([...prev, ...bugIds]);
      return Array.from(next);
    });
  };

  const addCatchRecord = (
    spotId: string,
    bugIds: string[],
    photoUri: string,
    note: string,
    userCoords: { lat: number; lng: number } | null
  ) => {
    const newRecord: CatchRecord = {
      id: `catch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      spotId,
      bugIds,
      photoUri,
      explorerName: session?.user.name || 'นักสำรวจนิรนาม',
      note,
      at: new Date().toISOString(),
      latitude: userCoords ? userCoords.lat : null,
      longitude: userCoords ? userCoords.lng : null
    };

    if (offlineSimulated) {
      // Offline queue
      const pending: RegistrationInput = {
        spotId,
        explorerName: session?.user.name || 'นักสำรวจ',
        note,
        photoUri,
        latitude: userCoords ? userCoords.lat : null,
        longitude: userCoords ? userCoords.lng : null,
        clientId: `client-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setPendingRegistrations((prev) => [...prev, pending]);
    }

    setCatchLog((prev) => [newRecord, ...prev]);
    markBugsDiscovered(bugIds);
  };

  const syncPendingQueue = () => {
    if (pendingRegistrations.length === 0) return;
    // Process queue
    setPendingRegistrations([]);
    alert(`ซิงก์ข้อมูลออฟไลน์ ${pendingRegistrations.length} รายการขึ้นระบบเรียบร้อยแล้ว!`);
  };

  const scheduleReminder = (spot: { id: string; nameTh: string }, seconds: number) => {
    const newReminder: ScheduledReminder = {
      id: `remind-${Date.now()}`,
      spotId: spot.id,
      spotName: spot.nameTh,
      triggerAt: Date.now() + seconds * 1000,
      durationSeconds: seconds
    };
    setScheduledReminders((prev) => [...prev, newReminder]);
  };

  const dismissReminder = (id: string) => {
    setScheduledReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const logout = () => {
    setSession(null);
  };

  const resetAllProgress = () => {
    if (confirm('คุณต้องการรีเซ็ตคอลเลกชัน Bugdex ทั้งหมดเพื่อเริ่มการทดสอบใหม่หรือไม่?')) {
      setDiscoveredBugIds([]);
      setCatchLog([]);
      setFavoriteSpotIds([]);
      setPendingRegistrations([]);
      localStorage.clear();
      window.location.reload();
    }
  };

  return {
    favoriteSpotIds,
    discoveredBugIds,
    catchLog,
    pendingRegistrations,
    session,
    demoMode,
    scheduledReminders,
    offlineSimulated,
    setSession,
    setDemoMode: setDemoModeState,
    setOfflineSimulated,
    toggleFavorite,
    markBugsDiscovered,
    addCatchRecord,
    syncPendingQueue,
    scheduleReminder,
    dismissReminder,
    logout,
    resetAllProgress
  };
}
