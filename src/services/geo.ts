/**
 * Haversine formula calculation in meters & formatters
 */

export function calculateDistanceM(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceMeters: number | null): string {
  if (distanceMeters === null || isNaN(distanceMeters)) return 'กำลังระบุพิกัด...';
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} ม.`;
  }
  const km = (distanceMeters / 1000).toFixed(1);
  return `${km} กม.`;
}

/**
 * Checks whether user is inside the spot radius
 */
export function isWithinRadius(
  userLat: number,
  userLng: number,
  spotLat: number,
  spotLng: number,
  radiusM: number
): boolean {
  const dist = calculateDistanceM(userLat, userLng, spotLat, spotLng);
  return dist <= radiusM;
}

/**
 * Generates dynamic Demo Spots around user's current GPS location
 * so that live presentations can demo catching without flying to Mae Hong Son or Chiang Mai!
 */
export function createDemoSpotsNearLocation(userLat: number, userLng: number) {
  return [
    {
      id: 'demo-spot-1',
      nameTh: '[DEMO] ดงไม้ใกล้ตัวคุณ (50 ม.)',
      nameEn: 'Local Demo Grove (50m)',
      province: 'พิกัดจำลอง',
      habitat: 'urban_park' as const,
      latitude: userLat + 0.00045, // ~50 meters North
      longitude: userLng + 0.0003,
      radiusM: 120,
      description: 'จุดสำรวจจำลองรอบตำแหน่งของคุณ สำหรับทดสอบการถ่ายภาพบรรยากาศและการลงทะเบียนจับแมลงในงานเดโม',
      bestTime: 'พร้อมสำรวจได้ทันที (Demo Mode)',
      bugIds: ['bug-8', 'bug-5'],
      coverGradient: 'from-amber-950 via-stone-900 to-stone-950'
    },
    {
      id: 'demo-spot-2',
      nameTh: '[DEMO] ซอกกำแพงมอส (150 ม.)',
      nameEn: 'Local Moss Crevice (150m)',
      province: 'พิกัดจำลอง',
      habitat: 'cave' as const,
      latitude: userLat - 0.0011,
      longitude: userLng + 0.0007,
      radiusM: 150,
      description: 'จุดจำลองถ้ำหินปูนและความชื้นมืดมิด ทดสอบการจับสิ่งมีชีวิตเฉพาะถิ่นอย่างจิ้งหรีดถ้ำ',
      bestTime: 'พร้อมสำรวจได้ทันที (Demo Mode)',
      bugIds: ['bug-1'],
      coverGradient: 'from-stone-900 via-stone-950 to-black'
    },
    {
      id: 'demo-spot-3',
      nameTh: '[DEMO] สวนดอกไม้เรือนกระจก (280 ม.)',
      nameEn: 'Local Greenhouse Haven (280m)',
      province: 'พิกัดจำลอง',
      habitat: 'rainforest' as const,
      latitude: userLat + 0.002,
      longitude: userLng - 0.0015,
      radiusM: 200,
      description: 'จุดจำลองป่าดงดิบสำหรับค้นหาผีเสื้อยักษ์แอตลาสและตั๊กแตนกล้วยไม้',
      bestTime: 'พร้อมสำรวจได้ทันที (Demo Mode)',
      bugIds: ['bug-2', 'bug-7'],
      coverGradient: 'from-emerald-950 via-teal-950 to-stone-950'
    }
  ];
}
