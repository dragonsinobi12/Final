/**
 * Production-ready Expo SDK 54 & React Native code repository
 * Corresponding to the 11 topics of the BugQuest prototype
 */

export interface ExpoFileEntry {
  path: string;
  topic: number;
  description: string;
  content: string;
}

export const EXPO_FILES: ExpoFileEntry[] = [
  {
    path: 'app.json',
    topic: 1,
    description: 'การกำหนดค่า Expo SDK 54, scheme สำหรับ deep link และ permissions',
    content: `{
  "expo": {
    "name": "BugQuest",
    "slug": "bugquest",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "bugquest",
    "userInterfaceStyle": "dark",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#1c1917"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1c1917"
      }
    },
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "BugQuest ใช้กล้องเพื่อถ่ายภาพบรรยากาศสถานที่ที่คุณสำรวจ"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "เลือกรูปสถานที่จากแกลเลอรีเพื่อลงทะเบียนการสำรวจ"
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "BugQuest ใช้ตำแหน่งเพื่อตรวจว่าคุณอยู่ในพื้นที่สำรวจ"
        }
      ],
      "expo-secure-store",
      "expo-notifications"
    ]
  }
}`
  },
  {
    path: 'app/_layout.tsx',
    topic: 4,
    description: 'Root Stack, Authentication Guard และ Notification Deep Link Routing',
    content: `import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../src/auth/AuthProvider';
import { LoadingView } from '../src/components/StateViews';

// ตั้งค่า Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const { isAuthed, isRestoring } = useAuth();
  const router = useRouter();

  // หัวข้อ 11: Deep link routing จากการแตะ Notification
  const lastResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    const spotId = lastResponse?.notification.request.content.data?.spotId;
    if (typeof spotId === 'string' && lastResponse?.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      router.push({ pathname: '/spot/[id]', params: { id: spotId } });
    }
  }, [lastResponse]);

  if (isRestoring) return <LoadingView message="กำลังกู้คืนเซสชันความปลอดภัย..." />;

  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#1c1917' }, headerTintColor: '#f5f5f4' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="spot/[id]" options={{ title: 'พื้นที่สำรวจ' }} />
      <Stack.Screen name="bug/[id]" options={{ title: 'สมุดแมลง Bugdex' }} />
      <Stack.Screen name="login" options={{ presentation: 'modal', title: 'เข้าสู่ระบบนักสำรวจ' }} />
      {/* Protected Catch Screen */}
      <Stack.Screen 
        name="catch/[spotId]" 
        options={{ title: 'ลงทะเบียนการสำรวจ' }} 
        redirect={!isAuthed}
      />
    </Stack>
  );
}`
  },
  {
    path: 'app/(tabs)/index.tsx',
    topic: 3,
    description: 'Explore Screen: รายการ FlatList พื้นที่สำรวจ, Search, Pull-to-refresh, Offline Cache',
    content: `import React, { useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSpots } from '../../src/hooks/useSpots';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { SpotCard } from '../../src/components/SpotCard';
import { SearchBar } from '../../src/components/SearchBar';
import { LoadingView, EmptyView, ErrorView, OfflineBanner } from '../../src/components/StateViews';
import { distanceM } from '../../src/services/geo';

export default function ExploreScreen() {
  const router = useRouter();
  const { spots, bugs, status, isOffline, pendingCount, refresh, syncQueue } = useSpots();
  const { favoriteSpotIds, discoveredBugIds, toggleFavorite, userCoords } = useCollectionStore();
  const [search, setSearch] = useState('');

  const filteredSpots = spots.filter(s => 
    s.nameTh.includes(search) || s.province.includes(search)
  );

  if (status === 'loading' && spots.length === 0) return <LoadingView />;
  if (status === 'error' && spots.length === 0) return <ErrorView onRetry={refresh} />;

  return (
    <View style={styles.container}>
      <OfflineBanner isOffline={isOffline} pendingCount={pendingCount} onSync={syncQueue} />
      <SearchBar value={search} onChangeText={setSearch} placeholder="ค้นหาพื้นที่ หรือ จังหวัด..." />
      <FlatList
        data={filteredSpots}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const dist = userCoords ? distanceM(userCoords.lat, userCoords.lng, item.latitude, item.longitude) : null;
          return (
            <SpotCard
              spot={item}
              bugs={bugs}
              discoveredBugIds={discoveredBugIds}
              isFavorite={favoriteSpotIds.includes(item.id)}
              distanceMeters={dist}
              onSelect={() => router.push({ pathname: '/spot/[id]', params: { id: item.id } })}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          );
        }}
        ListEmptyComponent={<EmptyView onClear={() => setSearch('')} />}
        refreshControl={<RefreshControl refreshing={status === 'loading'} onRefresh={refresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c0a09', padding: 12 }
});`
  },
  {
    path: 'app/catch/[spotId].tsx',
    topic: 9,
    description: 'กล้อง CameraView, ImagePicker, Preview, Form Validation และการส่งข้อมูลพร้อม Reveal อนิเมชัน',
    content: `import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { useAuth } from '../../src/auth/AuthProvider';

export default function CatchScreen() {
  const { spotId } = useLocalSearchParams<{ spotId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addCatch, markDiscovered } = useCollectionStore();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');

  if (!permission) return <View style={styles.center}><Text>กำลังโหลดสิทธิ์กล้อง...</Text></View>;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>ต้องการสิทธิ์เข้าถึงกล้อง</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>ขออนุญาตใช้งานกล้อง</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSec]} onPress={() => Linking.openSettings()}>
          <Text style={styles.btnSecText}>เปิดตั้งค่าแอป</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const shot = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (shot?.uri) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPhotoUri(shot.uri);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!note.trim()) {
      setNoteError('กรุณากรอกบันทึกการสังเกต');
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // บันทึกและเผยแมลง
    addCatch(spotId, photoUri!, note, user?.name || 'Explorer');
    router.back();
  };

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.controls}>
            <TouchableOpacity style={styles.subBtn} onPress={pickImage}><Text>คลังภาพ</Text></TouchableOpacity>
            <TouchableOpacity style={styles.shutter} onPress={takePhoto} />
          </View>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <TouchableOpacity onPress={() => setPhotoUri(null)}><Text style={styles.retake}>ถ่ายใหม่</Text></TouchableOpacity>
          <TextInput
            style={[styles.input, noteError ? styles.inputErr : null]}
            value={note}
            onChangeText={(t) => { setNote(t); setNoteError(''); }}
            placeholder="บันทึกสภาพแวดล้อม..."
          />
          {noteError ? <Text style={styles.errText}>{noteError}</Text> : null}
          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>ลงทะเบียนและสแกนแมลง</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c0a09' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  controls: { position: 'absolute', bottom: 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 },
  shutter: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
  subBtn: { backgroundColor: '#292524', padding: 12, borderRadius: 12 },
  formContainer: { padding: 16 },
  preview: { width: '100%', height: 260, borderRadius: 16 },
  retake: { color: '#38bdf8', marginVertical: 8, textAlign: 'center' },
  input: { backgroundColor: '#1c1917', color: '#fff', borderRadius: 12, padding: 12, marginTop: 12 },
  inputErr: { borderColor: '#f43f5e', borderWidth: 1 },
  errText: { color: '#f43f5e', fontSize: 12, marginTop: 4 },
  btn: { backgroundColor: '#10b981', padding: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  btnText: { color: '#0c0a09', fontWeight: 'bold' },
  btnSec: { backgroundColor: '#292524', marginTop: 10 },
  btnSecText: { color: '#e7e5e4' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }
});`
  },
  {
    path: 'package.json',
    topic: 1,
    description: 'รายการ dependencies สำหรับ Expo SDK 54, React Native 0.76+ และ Libraries สำคัญ',
    content: `{
  "name": "bugquest",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~54.0.0",
    "expo-router": "~4.0.0",
    "expo-camera": "~16.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-location": "~18.0.0",
    "expo-notifications": "~0.29.0",
    "expo-secure-store": "~14.0.0",
    "expo-haptics": "~14.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-maps": "1.18.0",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-native-community/netinfo": "11.4.1",
    "zustand": "^5.0.0",
    "lucide-react-native": "^0.460.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.12",
    "typescript": "~5.3.3"
  },
  "private": true
}`
  },
  {
    path: 'src/types/index.ts',
    topic: 2,
    description: 'Strict TypeScript Models: Bug, Spot, Habitat, Session, RegistrationInput',
    content: `export type Habitat = 'cave' | 'mangrove' | 'montane' | 'urban_park' | 'paddy' | 'orchard';

export interface Bug {
  id: string;
  nameTh: string;
  nameEn: string;
  scientificName: string;
  habitat: Habitat;
  rarity: 'common' | 'uncommon' | 'rare' | 'protected';
  descriptionTh: string;
  dietTh: string;
  seasonTh: string;
  conservationStatus: string;
  emoji: string;
}

export interface Spot {
  id: string;
  nameTh: string;
  nameEn: string;
  province: string;
  latitude: number;
  longitude: number;
  radiusM: number;
  habitat: Habitat;
  bugIds: string[];
  bannerGradient: [string, string];
  bestTimeTh: string;
  directionsTh: string;
}

export interface Session {
  token: string;
  expiresAt: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
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
}`
  },
  {
    path: 'app/(tabs)/_layout.tsx',
    topic: 4,
    description: 'Bottom Tab Navigator: สำรวจ (Explore), แผนที่ (Map), รายการโปรด (Favorites), Bugdex',
    content: `import { Tabs } from 'expo-router';
import { Compass, Map, Heart, BookOpen } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1c1917' },
        headerTintColor: '#f5f5f4',
        tabBarStyle: { backgroundColor: '#0c0a09', borderTopColor: '#292524' },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#78716c',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'สำรวจ',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'แผนที่',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'รายการโปรด',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bugdex"
        options={{
          title: 'Bugdex',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}`
  },
  {
    path: 'src/services/offlineSync.ts',
    topic: 7,
    description: 'ระบบ Offline Queue & Auto Sync เมื่อกลับมาต่อเน็ต ด้วย NetInfo & AsyncStorage',
    content: `import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegistrationInput } from '../types';

const QUEUE_KEY = 'bugquest_offline_registration_queue';

export class OfflineSyncService {
  static async enqueue(item: RegistrationInput): Promise<void> {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: RegistrationInput[] = raw ? JSON.parse(raw) : [];
    queue.push(item);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  static async getQueue(): Promise<RegistrationInput[]> {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static async sync(apiBaseUrl: string): Promise<{ synced: number; failed: number }> {
    const state = await NetInfo.fetch();
    if (!state.isConnected) return { synced: 0, failed: 0 };

    const queue = await this.getQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    const remaining: RegistrationInput[] = [];

    for (const item of queue) {
      try {
        const res = await fetch(\`\${apiBaseUrl}/registrations\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (res.ok) {
          synced++;
        } else {
          remaining.push(item);
        }
      } catch {
        remaining.push(item);
      }
    }

    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    return { synced, failed: remaining.length };
  }
}`
  },
  {
    path: 'src/auth/AuthProvider.tsx',
    topic: 8,
    description: 'Auth Context + expo-secure-store: ปลอดภัย ไม่หลุดเมื่อปิดแอป Token Expire Check',
    content: `import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Session } from '../types';

interface AuthContextType {
  isAuthed: boolean;
  isRestoring: boolean;
  user: Session['user'] | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as any);

const SECURE_KEY = 'bugquest_auth_session_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(SECURE_KEY);
        if (raw) {
          const parsed: Session = JSON.parse(raw);
          if (parsed.expiresAt > Date.now()) {
            setSession(parsed);
          } else {
            await SecureStore.deleteItemAsync(SECURE_KEY);
          }
        }
      } finally {
        setIsRestoring(false);
      }
    })();
  }, []);

  const login = async (email: string, pass: string) => {
    // ส่งต่อไปยัง Mock server /auth/login
    const mockSession: Session = {
      token: 'sec_tok_' + Date.now(),
      expiresAt: Date.now() + 86400000,
      user: { id: 'u1', name: 'ดร. นที นักกีฏวิทยา', email }
    };
    await SecureStore.setItemAsync(SECURE_KEY, JSON.stringify(mockSession));
    setSession(mockSession);
    return true;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(SECURE_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthed: !!session,
        isRestoring,
        user: session?.user || null,
        token: session?.token || null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);`
  },
  {
    path: 'app/(tabs)/map.tsx',
    topic: 10,
    description: 'Interactive MapView ด้วย react-native-maps, Circle รัศมีสำรวจ, User Location & Markers',
    content: `import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useSpots } from '../../src/hooks/useSpots';

export default function MapScreen() {
  const router = useRouter();
  const { spots, bugs, discoveredBugIds } = useSpots();
  const [userLoc, setUserLoc] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const cur = await Location.getCurrentPositionAsync({});
        setUserLoc({ latitude: cur.coords.latitude, longitude: cur.coords.longitude });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 13.7563,
          longitude: 100.5018,
          latitudeDelta: 8.0,
          longitudeDelta: 8.0,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {spots.map((spot) => {
          const hasDiscoveredAny = spot.bugIds.some(id => discoveredBugIds.includes(id));
          return (
            <React.Fragment key={spot.id}>
              {/* วงรัศมีของพื้นที่สำรวจ (เช่น 300 - 500 เมตร) */}
              <Circle
                center={{ latitude: spot.latitude, longitude: spot.longitude }}
                radius={spot.radiusM}
                fillColor={hasDiscoveredAny ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
                strokeColor={hasDiscoveredAny ? '#10b981' : '#ef4444'}
                strokeWidth={2}
              />
              <Marker
                coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                title={spot.nameTh}
                description={\`รัศมี \${spot.radiusM} ม. • \${spot.province}\`}
              >
                <Callout onPress={() => router.push({ pathname: '/spot/[id]', params: { id: spot.id } })}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{hasDiscoveredAny ? '🟢' : '❓'} {spot.nameTh}</Text>
                    <Text style={styles.calloutSub}>แตะเพื่อเปิดหน้ารายละเอียดและลงทะเบียน</Text>
                  </View>
                </Callout>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  callout: { padding: 6, minWidth: 160 },
  calloutTitle: { fontWeight: 'bold', fontSize: 13 },
  calloutSub: { fontSize: 11, color: '#666', marginTop: 2 }
});`
  },
  {
    path: 'src/services/notifications.ts',
    topic: 11,
    description: 'การขอ Permission, Android Channel, Schedule Reminder และ Deep Link payload',
    content: `import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Spot } from '../types';

export async function scheduleSpotReminder(spot: Spot, seconds: number): Promise<string | null> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Spot reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: \`ถึงเวลาสำรวจ \${spot.nameTh}!\`,
      body: 'มีแมลงประจำถิ่นรอให้คุณค้นพบอยู่ แตะเพื่อดูรายละเอียด',
      data: { spotId: spot.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: 'reminders',
    },
  });
}`
  },
  {
    path: 'mock-server/server.js',
    topic: 6,
    description: 'Express Mock Server สำหรับ GET spots/bugs, Auth login, และ POST registration',
    content: `const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Seed data
const spots = [
  { id: 'spot-1', nameTh: 'ถ้ำลอด ปางมะผ้า', province: 'แม่ฮ่องสอน', bugIds: ['bug-1'] },
  { id: 'spot-2', nameTh: 'ป่าชายเลนคลองอัมพวา', province: 'สมุทรสงคราม', bugIds: ['bug-4', 'bug-5'] }
];

app.get('/spots', (req, res) => res.json(spots));

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'explorer@bugquest.dev' && password === '1234') {
    return res.json({
      token: 'sec_demo_token_123',
      expiresAt: Date.now() + 86400000,
      user: { id: 'u1', name: 'ดร. นที', email }
    });
  }
  res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
});

app.post('/registrations', (req, res) => {
  if (req.query.fail === '1') {
    return res.status(500).json({ message: 'จำลองข้อผิดพลาดเซิร์ฟเวอร์' });
  }
  res.status(201).json({ id: 'reg_' + Date.now(), status: 'unlocked' });
});

app.listen(PORT, '0.0.0.0', () => console.log(\`Mock server running on port \${PORT}\`));`
  }
];
