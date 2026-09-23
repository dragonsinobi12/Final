export type Habitat =
  | 'cave'
  | 'mangrove'
  | 'highland_forest'
  | 'rainforest'
  | 'rice_field'
  | 'wetland'
  | 'urban_park';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Bug {
  id: string;
  nameTh: string;
  nameEn: string;
  scientificName: string;
  emoji: string;
  rarity: Rarity;
  habitatText: string;
  facts: string[];
  conservation?: string;
  spotIds: string[];
  color: string;
}

export interface Spot {
  id: string;
  nameTh: string;
  nameEn: string;
  province: string;
  habitat: Habitat;
  latitude: number;
  longitude: number;
  radiusM: number;
  description: string;
  bestTime?: string;
  bugIds: string[];
  coverGradient: string;
}

export interface RegistrationInput {
  spotId: string;
  explorerName: string;
  note: string;
  photoUri: string;
  latitude: number | null;
  longitude: number | null;
  clientId: string;
  createdAt: string;
}

export interface CatchRecord {
  id: string;
  spotId: string;
  bugIds: string[];
  photoUri: string;
  explorerName: string;
  note: string;
  at: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Session {
  token: string;
  expiresAt: number;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export type LoadStatus = 'loading' | 'success' | 'empty' | 'error';

export interface ScheduledReminder {
  id: string;
  spotId: string;
  spotName: string;
  triggerAt: number;
  durationSeconds: number;
}
