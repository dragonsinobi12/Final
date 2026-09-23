import NetInfo from '@react-native-community/netinfo';
import type { RegistrationInput } from '../types';
import { api } from './api';
import { nativeStorage } from './nativeStorage';

export async function enqueueRegistration(input: RegistrationInput): Promise<void> {
  const queue = await nativeStorage.getPending<RegistrationInput>();
  await nativeStorage.setPending([...queue, input]);
}

export async function syncPendingRegistrations(token: string): Promise<number> {
  const network = await NetInfo.fetch();
  if (!network.isConnected) return 0;
  const queue = await nativeStorage.getPending<RegistrationInput>();
  const remaining: RegistrationInput[] = [];
  let synced = 0;
  for (const input of queue) {
    try {
      await api.registerCatch(input, token);
      synced += 1;
    } catch {
      remaining.push(input);
    }
  }
  await nativeStorage.setPending(remaining);
  return synced;
}

export function subscribeToReconnect(token: string, onSynced: (count: number) => void): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) void syncPendingRegistrations(token).then(onSynced);
  });
  return unsubscribe;
}
