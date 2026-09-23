import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { Session, Spot } from '../types';

const KEYS = {
  spots: 'bugquest:spots:v1',
  favorites: 'bugquest:favorites:v1',
  session: 'bugquest:session:v1',
  pending: 'bugquest:pending:v1',
};

export const nativeStorage = {
  async getSpots(): Promise<Spot[] | null> {
    const raw = await AsyncStorage.getItem(KEYS.spots);
    return raw ? (JSON.parse(raw) as Spot[]) : null;
  },
  async setSpots(spots: Spot[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.spots, JSON.stringify(spots));
  },
  async getFavorites(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(KEYS.favorites);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
  async setFavorites(ids: string[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(ids));
  },
  async getSession(): Promise<Session | null> {
    const raw = await SecureStore.getItemAsync(KEYS.session);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (session.expiresAt <= Date.now()) {
      await SecureStore.deleteItemAsync(KEYS.session);
      return null;
    }
    return session;
  },
  async setSession(session: Session): Promise<void> {
    await SecureStore.setItemAsync(KEYS.session, JSON.stringify(session));
  },
  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.session);
  },
  async getPending<T>(): Promise<T[]> {
    const raw = await AsyncStorage.getItem(KEYS.pending);
    return raw ? (JSON.parse(raw) as T[]) : [];
  },
  async setPending<T>(items: T[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.pending, JSON.stringify(items));
  },
};
