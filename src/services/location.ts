import * as Location from 'expo-location';

export type Coordinates = { lat: number; lng: number };

export async function getCurrentCoordinates(): Promise<
  { ok: true; coords: Coordinates } | { ok: false; reason: 'denied' | 'unavailable' }
> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== Location.PermissionStatus.GRANTED) return { ok: false, reason: 'denied' };
  try {
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { ok: true, coords: { lat: position.coords.latitude, lng: position.coords.longitude } };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}
