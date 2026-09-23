import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SEED_BUGS, SEED_SPOTS } from '../src/data/seed';
import { BUG_MEDIA } from '../src/data/bugMedia';
import type { Spot } from '../src/types';

type MainTab = 'home' | 'camera' | 'collection';
type HomeSection = 'map' | 'missions' | 'shop' | 'guide';

type Tier = 'easy' | 'medium' | 'hard' | 'legendary';

const TIER_META: Record<Tier, { label: string; color: string; soft: string; icon: string; exp: number; coins: number }> = {
  easy: { label: 'EASY', color: '#36b37e', soft: '#e1f8ed', icon: '🌱', exp: 80, coins: 20 },
  medium: { label: 'MEDIUM', color: '#e6a629', soft: '#fff4d5', icon: '🌼', exp: 140, coins: 35 },
  hard: { label: 'HARD', color: '#eb6f67', soft: '#ffe4e1', icon: '🔥', exp: 220, coins: 55 },
  legendary: { label: 'LEGENDARY', color: '#a865d8', soft: '#f1e4ff', icon: '✨', exp: 350, coins: 90 },
};

function getSpotTier(spot: Spot): Tier {
  const rareCount = spot.bugIds.filter((bugId) => {
    const bug = SEED_BUGS.find((item) => item.id === bugId);
    return bug?.rarity === 'rare' || bug?.rarity === 'legendary';
  }).length;
  if (rareCount > 0 && spot.bugIds.length >= 2) return 'legendary';
  if (rareCount > 0 || spot.radiusM >= 600) return 'hard';
  if (spot.bugIds.length >= 2 || spot.radiusM >= 500) return 'medium';
  return 'easy';
}

export default function NativeBugQuest() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [homeSection, setHomeSection] = useState<HomeSection>('missions');
  const [favoriteSpotIds, setFavoriteSpotIds] = useState<string[]>(['spot-2']);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [discoveredBugIds, setDiscoveredBugIds] = useState<string[]>(['bug-4']);
  const [exp, setExp] = useState(420);
  const [bugCoins, setBugCoins] = useState(180);
  const [cameraCaptured, setCameraCaptured] = useState(false);
  const columns = width >= 600 ? 2 : 1;

  const visibleSpots = useMemo(
    () =>
      homeSection === 'missions'
        ? SEED_SPOTS
        : SEED_SPOTS.filter((spot) => favoriteSpotIds.includes(spot.id)),
    [homeSection, favoriteSpotIds],
  );

  const toggleFavorite = (spotId: string) => {
    setFavoriteSpotIds((currentIds) =>
      currentIds.includes(spotId)
        ? currentIds.filter((id) => id !== spotId)
        : [...currentIds, spotId],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <View style={styles.brandLine}>
              <Text style={styles.brandBug}>🦋</Text>
              <Text style={styles.eyebrow}>BUGQUEST · SDK 54</Text>
            </View>
            <Text style={styles.title}>ออกไปเจอเพื่อนตัวจิ๋ว</Text>
            <Text style={styles.subtitle}>สำรวจพื้นที่จริง แล้วสะสมแมลงน่ารักให้ครบทุกถิ่นอาศัย</Text>
          </View>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>DEMO ✦</Text>
          </View>
        </View>

        <ProfileHeader exp={exp} bugCoins={bugCoins} discoveredCount={discoveredBugIds.length} />

        {activeTab === 'collection' ? (
          <FlatList
            data={SEED_BUGS}
            keyExtractor={(bug) => bug.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Bugdex ของฉัน</Text>
                <Text style={styles.sectionMeta}>
                  ค้นพบแล้ว {discoveredBugIds.length}/{SEED_BUGS.length} ชนิด · แตะการ์ดเพื่อเรียนรู้
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <BugdexCard bug={item} discovered={discoveredBugIds.includes(item.id)} />
            )}
          />
        ) : activeTab === 'camera' ? (
          <CameraPanel captured={cameraCaptured} onCapture={() => setCameraCaptured(true)} />
        ) : selectedSpot ? (
          <SpotDetail
            spot={selectedSpot}
            isFavorite={favoriteSpotIds.includes(selectedSpot.id)}
            onBack={() => setSelectedSpot(null)}
            onToggleFavorite={() => toggleFavorite(selectedSpot.id)}
            onExplore={() => {
              setDiscoveredBugIds((currentIds) => Array.from(new Set([...currentIds, ...selectedSpot.bugIds])));
              setSelectedSpot(null);
              const tier = getSpotTier(selectedSpot);
              setExp((currentExp) => currentExp + TIER_META[tier].exp);
              setBugCoins((currentCoins) => currentCoins + TIER_META[tier].coins);
              setActiveTab('collection');
            }}
          />
        ) : homeSection === 'guide' ? (
          <GuidePanel />
        ) : homeSection === 'shop' ? (
          <ShopPanel bugCoins={bugCoins} onPurchase={(price) => setBugCoins((currentCoins) => currentCoins - price)} />
        ) : homeSection === 'map' ? (
          <MapPanel spots={SEED_SPOTS} />
        ) : (
          <FlatList
            key={`spots-${columns}`}
            data={visibleSpots}
            numColumns={columns}
            keyExtractor={(spot) => spot.id}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>
                  ภารกิจสำรวจ
                </Text>
                <Text style={styles.sectionMeta}>
                  เลือกภารกิจตาม Tier ความยากและของสะสมที่รออยู่
                </Text>
              </View>
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>ยังไม่มีพื้นที่โปรด แตะหัวใจเพื่อบันทึกไว้</Text>
            }
            renderItem={({ item }) => (
              <SpotCard
                spot={item}
                tier={getSpotTier(item)}
                isFavorite={favoriteSpotIds.includes(item.id)}
                onPress={() => setSelectedSpot(item)}
                onToggleFavorite={() => toggleFavorite(item.id)}
              />
            )}
          />
        )}

        {activeTab === 'home' ? (
          <View style={styles.homeSubnav}>
            <SubnavButton label="แผนที่" icon="🗺️" active={homeSection === 'map'} onPress={() => setHomeSection('map')} />
            <SubnavButton label="ภารกิจ" icon="🎯" active={homeSection === 'missions'} onPress={() => setHomeSection('missions')} />
            <SubnavButton label="ร้านค้า" icon="🛍️" active={homeSection === 'shop'} onPress={() => setHomeSection('shop')} />
            <SubnavButton label="คู่มือ" icon="📖" active={homeSection === 'guide'} onPress={() => setHomeSection('guide')} />
          </View>
        ) : null}

        <View style={styles.tabBar}>
          <TabButton
            label="⌂  Home"
            active={activeTab === 'home'}
            onPress={() => {
              setSelectedSpot(null);
              setActiveTab('home');
            }}
          />
          <TabButton
            label="◎  Camera"
            active={activeTab === 'camera'}
            onPress={() => {
              setSelectedSpot(null);
              setActiveTab('camera');
            }}
          />
          <TabButton
            label="◉  Collection"
            active={activeTab === 'collection'}
            onPress={() => {
              setSelectedSpot(null);
              setActiveTab('collection');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ProfileHeader({ exp, bugCoins, discoveredCount }: { exp: number; bugCoins: number; discoveredCount: number }) {
  const level = Math.floor(exp / 250) + 1;
  const levelProgress = (exp % 250) / 250;

  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarFrame}>
        <Text style={styles.avatarEmoji}>🧢</Text>
      </View>
      <View style={styles.profileCopy}>
        <Text style={styles.profileName}>นักสำรวจนที</Text>
        <Text style={styles.profileMeta}>Level {level} · Bug Explorer</Text>
        <View style={styles.expTrack}>
          <View style={[styles.expFill, { width: `${Math.max(8, levelProgress * 100)}%` }]} />
        </View>
        <Text style={styles.expLabel}>{exp % 250}/250 EXP · ค้นพบ {discoveredCount}/8 ชนิด</Text>
      </View>
      <View style={styles.coinPill}>
        <Text style={styles.coinValue}>🪙 {bugCoins}</Text>
        <Text style={styles.coinLabel}>BUG COIN</Text>
      </View>
    </View>
  );
}

function SubnavButton({ label, icon, active, onPress }: { label: string; icon: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.subnavButton, active && styles.subnavButtonActive]}>
      <Text style={styles.subnavIcon}>{icon}</Text>
      <Text style={active ? styles.subnavLabelActive : styles.subnavLabel}>{label}</Text>
    </Pressable>
  );
}

function CameraPanel({ captured, onCapture }: { captured: boolean; onCapture: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.panelContent}>
      <Text style={styles.sectionTitle}>Camera Catch</Text>
      <Text style={styles.sectionMeta}>ถ่ายภาพบรรยากาศสถานที่เพื่อยืนยันภารกิจ ไม่ต้องถ่ายตัวแมลง</Text>
      <View style={styles.cameraView}>
        <Text style={styles.cameraBug}>{captured ? '📸' : '🪲'}</Text>
        <Text style={styles.cameraHint}>{captured ? 'ภาพพร้อมส่งลงทะเบียนแล้ว!' : 'เล็งไปที่พื้นที่สำรวจ'}</Text>
        <View style={styles.cameraCorners} />
      </View>
      <Pressable accessibilityRole="button" onPress={onCapture} style={styles.captureButton}>
        <Text style={styles.captureButtonText}>{captured ? 'ถ่ายใหม่' : 'ถ่ายภาพสถานที่'}</Text>
      </Pressable>
      <Text style={styles.cameraNote}>ใน Expo Go สามารถเลือกภาพจากแกลเลอรีได้เมื่อกล้องของอุปกรณ์ไม่พร้อม</Text>
    </ScrollView>
  );
}

function MapPanel({ spots }: { spots: Spot[] }) {
  return (
    <ScrollView contentContainerStyle={styles.panelContent}>
      <Text style={styles.sectionTitle}>แผนที่พื้นที่สำรวจ</Text>
      <Text style={styles.sectionMeta}>แตะหมุดเพื่อดูภารกิจและจำนวนแมลงที่รอค้นพบ</Text>
      <View style={styles.mapPreview}>
        <Text style={styles.mapDecor}>🌿  🐞  🌳  🦋</Text>
        {spots.slice(0, 5).map((spot, index) => {
          const tierMeta = TIER_META[getSpotTier(spot)];
          return (
            <View key={spot.id} style={[styles.mapPin, { left: `${18 + (index * 17) % 68}%`, top: `${25 + (index * 11) % 55}%`, backgroundColor: tierMeta.color }]}>
              <Text style={styles.mapPinText}>?</Text>
            </View>
          );
        })}
        <Text style={styles.mapLabel}>แผนที่เดโม · จุดสำรวจ 6 แห่ง</Text>
      </View>
    </ScrollView>
  );
}

function ShopPanel({ bugCoins, onPurchase }: { bugCoins: number; onPurchase: (price: number) => void }) {
  const items = [
    { id: 'mint-frame', name: 'กรอบใบไม้สดใส', icon: '🌿', price: 80, color: '#dff5e9' },
    { id: 'sun-frame', name: 'กรอบพระอาทิตย์จิ๋ว', icon: '🌞', price: 120, color: '#fff4d5' },
    { id: 'pink-frame', name: 'กรอบสวนดอกไม้', icon: '🌸', price: 180, color: '#ffe4ef' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.panelContent}>
      <View style={styles.shopHeading}>
        <View>
          <Text style={styles.sectionTitle}>ร้านค้า Bug Coin</Text>
          <Text style={styles.sectionMeta}>แลกของตกแต่งโปรไฟล์จากรางวัลภารกิจ</Text>
        </View>
        <Text style={styles.shopBalance}>🪙 {bugCoins}</Text>
      </View>
      {items.map((item) => {
        const canBuy = bugCoins >= item.price;
        return (
          <View key={item.id} style={styles.shopItem}>
            <View style={[styles.shopItemIcon, { backgroundColor: item.color }]}>
              <Text style={styles.shopEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.shopItemCopy}>
              <Text style={styles.shopItemName}>{item.name}</Text>
              <Text style={styles.shopItemDescription}>ใช้ตกแต่งกรอบโปรไฟล์นักสำรวจ</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={!canBuy}
              onPress={() => onPurchase(item.price)}
              style={[styles.buyButton, !canBuy && styles.buyButtonDisabled]}
            >
              <Text style={styles.buyButtonText}>🪙 {item.price}</Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

function GuidePanel() {
  const steps = [
    ['1', 'เลือกภารกิจ', 'ดู Tier สีและแมลงที่รอค้นพบ'],
    ['2', 'ไปยังพื้นที่', 'อ่านข้อมูลระบบนิเวศและช่วงเวลาที่เหมาะ'],
    ['3', 'ถ่ายภาพสถานที่', 'ใช้ Camera Catch ยืนยันการสำรวจ'],
    ['4', 'ปลดล็อก Bugdex', 'รับ EXP และ BUG COIN เมื่อทำสำเร็จ'],
    ['5', 'เรียนรู้และสะสม', 'อ่านชื่อวิทยาศาสตร์และ fact ของแมลง'],
  ];
  return (
    <ScrollView contentContainerStyle={styles.panelContent}>
      <Text style={styles.sectionTitle}>คู่มือผู้สำรวจ</Text>
      <Text style={styles.sectionMeta}>เริ่มเล่นได้ใน 5 ขั้นตอน</Text>
      {steps.map(([number, title, description]) => (
        <View key={number} style={styles.guideRow}>
          <View style={styles.guideNumber}><Text style={styles.guideNumberText}>{number}</Text></View>
          <View style={styles.guideCopy}><Text style={styles.guideTitle}>{title}</Text><Text style={styles.guideDescription}>{description}</Text></View>
        </View>
      ))}
    </ScrollView>
  );
}

function SpotCard({
  spot,
  tier,
  isFavorite,
  onPress,
  onToggleFavorite,
}: {
  spot: Spot;
  tier: Tier;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}) {
  const bugCount = spot.bugIds.length;
  const tierMeta = TIER_META[tier];

  return (
    <View style={[styles.card, { borderColor: tierMeta.color, backgroundColor: tierMeta.soft }]}>
      <View style={[styles.tierRibbon, { backgroundColor: tierMeta.color }]}>
        <Text style={styles.tierRibbonText}>{tierMeta.icon} {tierMeta.label}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.cardBody}>
        <Text style={styles.cardEyebrow}>{spot.province}</Text>
        <Text style={styles.cardTitle}>{spot.nameTh}</Text>
        <Text numberOfLines={3} style={styles.cardDescription}>
          {spot.description}
        </Text>
        <Text style={[styles.cardFooter, { color: tierMeta.color }]}>{bugCount} ชนิดที่รอค้นพบ · +{tierMeta.exp} EXP</Text>
      </Pressable>
      <Pressable
        accessibilityLabel={isFavorite ? 'ลบพื้นที่โปรด' : 'เพิ่มพื้นที่โปรด'}
        accessibilityRole="button"
        onPress={onToggleFavorite}
        style={styles.favoriteButton}
      >
        <Text style={isFavorite ? styles.favoriteActive : styles.favoriteText}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </Pressable>
    </View>
  );
}

function SpotDetail({
  spot,
  isFavorite,
  onBack,
  onToggleFavorite,
  onExplore,
}: {
  spot: Spot;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onExplore: () => void;
}) {
  return (
    <View style={styles.detailPanel}>
      <Pressable accessibilityRole="button" onPress={onBack}>
        <Text style={styles.backLink}>‹ กลับไปพื้นที่สำรวจ</Text>
      </Pressable>
      <View style={styles.detailHeading}>
        <View style={styles.detailHeadingCopy}>
          <Text style={styles.cardEyebrow}>{spot.province}</Text>
          <Text style={styles.detailTitle}>{spot.nameTh}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onToggleFavorite} style={styles.detailFavorite}>
          <Text style={isFavorite ? styles.favoriteActive : styles.favoriteText}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.detailDescription}>{spot.description}</Text>
      <Pressable accessibilityRole="button" onPress={onExplore} style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>🪲 เริ่มสำรวจและปลดล็อกแมลง</Text>
      </Pressable>
      <Text style={styles.detailLabel}>ช่วงเวลาที่เหมาะสำรวจ</Text>
      <Text style={styles.detailValue}>{spot.bestTime ?? 'ตรวจสอบตามฤดูกาล'}</Text>
      <Text style={styles.detailLabel}>พิกัด</Text>
      <Text style={styles.detailValue}>
        {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
      </Text>
      <View style={styles.bugPreview}>
        <Text style={styles.detailLabel}>แมลงประจำพื้นที่</Text>
        {spot.bugIds.map((bugId) => {
          const bug = SEED_BUGS.find((item) => item.id === bugId);
          return bug ? (
            <Text key={bug.id} style={styles.bugRow}>
              ?  {bug.nameTh} · {bug.nameEn}
            </Text>
          ) : null;
        })}
      </View>
    </View>
  );
}

function BugdexCard({
  bug,
  discovered,
}: {
  bug: (typeof SEED_BUGS)[number];
  discovered: boolean;
}) {
  const media = BUG_MEDIA[bug.id];

  const tier = bug.rarity === 'legendary' ? 'legendary' : bug.rarity === 'rare' ? 'hard' : bug.rarity === 'uncommon' ? 'medium' : 'easy';
  const tierMeta = TIER_META[tier];

  return (
    <View style={[styles.bugdexCard, { backgroundColor: tierMeta.soft, borderColor: tierMeta.color }]}>
      <View style={[styles.bugdexTier, { backgroundColor: tierMeta.color }]}>
        <Text style={styles.tierRibbonText}>{tierMeta.icon} {tierMeta.label}</Text>
      </View>
      <View style={styles.bugImageFrame}>
        {discovered && media ? (
          <Image accessibilityLabel={`ภาพอ้างอิง ${bug.nameTh}`} source={{ uri: media.imageUrl }} style={styles.bugImage} />
        ) : (
          <Text style={styles.bugEmoji}>{discovered ? bug.emoji : '?'}</Text>
        )}
      </View>
      <View style={styles.bugTextBlock}>
        <View style={styles.bugTitleRow}>
          <Text style={styles.bugName}>{discovered ? bug.nameTh : 'สิ่งมีชีวิตปริศนา'}</Text>
          <Text style={[styles.rarity, { color: tierMeta.color }]}>{bug.rarity.toUpperCase()}</Text>
        </View>
        <Text style={styles.bugScientific}>{discovered ? bug.scientificName : 'ค้นพบจากพื้นที่สำรวจ'}</Text>
        <Text numberOfLines={2} style={styles.bugFact}>
          {discovered ? bug.facts[0] : 'สำรวจพื้นที่ที่เกี่ยวข้องเพื่อเปิดเผยชื่อและเกร็ดความรู้'}
        </Text>
        {discovered && media ? <Text style={styles.credit}>{media.credit}</Text> : null}
      </View>
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={styles.tabButton}>
      <Text style={active ? styles.tabLabelActive : styles.tabLabel}>{label}</Text>
    </Pressable>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eaf8f2' },
  container: { alignSelf: 'center', flex: 1, maxWidth: 1180, width: '100%', backgroundColor: '#eaf8f2' },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
  },
  brandLine: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  brandBug: { fontSize: 18 },
  eyebrow: { color: '#319b72', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#173d32', fontSize: 28, fontWeight: '800', marginTop: 7 },
  subtitle: { color: '#648078', fontSize: 12, lineHeight: 18, marginTop: 5, maxWidth: 440 },
  modeBadge: { backgroundColor: '#fff4c7', borderColor: '#f1c95b', borderRadius: 12, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  modeBadgeText: { color: '#9a6811', fontSize: 10, fontWeight: '800' },
  profileHeader: { alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d7eee4', borderRadius: 20, borderWidth: 1, flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, padding: 12 },
  avatarFrame: { alignItems: 'center', backgroundColor: '#dff5e9', borderColor: '#8bd4b3', borderRadius: 18, borderWidth: 2, height: 58, justifyContent: 'center', width: 58 },
  avatarEmoji: { fontSize: 31 },
  profileCopy: { flex: 1, paddingHorizontal: 12 },
  profileName: { color: '#173d32', fontSize: 15, fontWeight: '800' },
  profileMeta: { color: '#78938a', fontSize: 10, marginTop: 2 },
  expTrack: { backgroundColor: '#e7f0eb', borderRadius: 5, height: 7, marginTop: 7, overflow: 'hidden' },
  expFill: { backgroundColor: '#f2bd48', borderRadius: 5, height: 7 },
  expLabel: { color: '#9a6811', fontSize: 9, fontWeight: '700', marginTop: 4 },
  coinPill: { alignItems: 'center', backgroundColor: '#fff4d5', borderColor: '#f1d27a', borderRadius: 12, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 7 },
  coinValue: { color: '#9a6811', fontSize: 11, fontWeight: '800' },
  coinLabel: { color: '#b48933', fontSize: 7, fontWeight: '800', marginTop: 2 },
  homeSubnav: { backgroundColor: '#f6fcf9', borderColor: '#d7eee4', borderRadius: 16, borderWidth: 1, bottom: 72, elevation: 12, flexDirection: 'row', left: 16, padding: 4, position: 'absolute', right: 16, zIndex: 20 },
  subnavButton: { alignItems: 'center', borderRadius: 12, flex: 1, paddingVertical: 7 },
  subnavButtonActive: { backgroundColor: '#dff5e9' },
  subnavIcon: { fontSize: 15 },
  subnavLabel: { color: '#78938a', fontSize: 10, fontWeight: '700', marginTop: 2 },
  subnavLabelActive: { color: '#21875f', fontSize: 10, fontWeight: '800', marginTop: 2 },
  panelContent: { gap: 12, padding: 16, paddingBottom: 110 },
  cameraView: { alignItems: 'center', backgroundColor: '#153d35', borderRadius: 24, height: 280, justifyContent: 'center', marginTop: 12, overflow: 'hidden' },
  cameraBug: { fontSize: 70 },
  cameraHint: { color: '#d9f8e9', fontSize: 13, fontWeight: '700', marginTop: 12 },
  cameraCorners: { borderColor: '#f4d35e', borderRadius: 18, borderWidth: 2, height: 170, position: 'absolute', width: 220 },
  captureButton: { alignItems: 'center', backgroundColor: '#f26b82', borderRadius: 16, paddingVertical: 14 },
  captureButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  cameraNote: { color: '#78938a', fontSize: 11, lineHeight: 17, textAlign: 'center' },
  mapPreview: { backgroundColor: '#bdebd5', borderColor: '#8bd4b3', borderRadius: 24, height: 320, marginTop: 12, overflow: 'hidden', position: 'relative' },
  mapDecor: { fontSize: 24, left: 18, position: 'absolute', top: 20 },
  mapPin: { alignItems: 'center', borderColor: '#ffffff', borderRadius: 18, borderWidth: 3, height: 36, justifyContent: 'center', position: 'absolute', width: 36 },
  mapPinText: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  mapLabel: { backgroundColor: '#ffffffdd', borderRadius: 10, bottom: 14, color: '#397963', fontSize: 11, fontWeight: '800', left: 14, paddingHorizontal: 10, paddingVertical: 6, position: 'absolute' },
  shopHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  shopBalance: { backgroundColor: '#fff4d5', borderColor: '#f1d27a', borderRadius: 12, borderWidth: 1, color: '#9a6811', fontSize: 12, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 7 },
  shopItem: { alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d7eee4', borderRadius: 18, borderWidth: 1, flexDirection: 'row', padding: 12 },
  shopItemIcon: { alignItems: 'center', borderRadius: 14, height: 54, justifyContent: 'center', width: 54 },
  shopEmoji: { fontSize: 28 },
  shopItemCopy: { flex: 1, paddingHorizontal: 12 },
  shopItemName: { color: '#173d32', fontSize: 13, fontWeight: '800' },
  shopItemDescription: { color: '#78938a', fontSize: 10, marginTop: 4 },
  buyButton: { backgroundColor: '#f26b82', borderRadius: 11, paddingHorizontal: 9, paddingVertical: 9 },
  buyButtonDisabled: { backgroundColor: '#cbd9d2' },
  buyButtonText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  guideRow: { alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d7eee4', borderRadius: 16, borderWidth: 1, flexDirection: 'row', padding: 12 },
  guideNumber: { alignItems: 'center', backgroundColor: '#f2bd48', borderRadius: 14, height: 34, justifyContent: 'center', width: 34 },
  guideNumberText: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  guideCopy: { flex: 1, paddingLeft: 12 },
  guideTitle: { color: '#173d32', fontSize: 13, fontWeight: '800' },
  guideDescription: { color: '#78938a', fontSize: 11, marginTop: 3 },
  listContent: { gap: 12, padding: 16, paddingBottom: 98 },
  listHeader: { marginBottom: 2 },
  columnWrapper: { gap: 12 },
  sectionTitle: { color: '#173d32', fontSize: 19, fontWeight: '800' },
  sectionMeta: { color: '#78938a', fontSize: 12, marginTop: 4 },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#d7eee4',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    marginBottom: 0,
    minHeight: 196,
    overflow: 'hidden',
    position: 'relative',
  },
  cardBody: { flex: 1, padding: 16, paddingRight: 48 },
  tierRibbon: { borderBottomLeftRadius: 10, borderTopRightRadius: 18, paddingHorizontal: 9, paddingVertical: 5, position: 'absolute', right: 0, top: 0 },
  tierRibbonText: { color: '#ffffff', fontSize: 9, fontWeight: '900' },
  cardEyebrow: { color: '#319b72', fontSize: 11, fontWeight: '700' },
  cardTitle: { color: '#173d32', fontSize: 17, fontWeight: '800', marginTop: 7 },
  cardDescription: { color: '#6b8179', fontSize: 12, lineHeight: 19, marginTop: 9 },
  cardFooter: { color: '#d28b22', fontSize: 11, fontWeight: '800', marginTop: 12 },
  favoriteButton: { padding: 14, position: 'absolute', right: 0, top: 0 },
  favoriteText: { color: '#b4c8bf', fontSize: 25 },
  favoriteActive: { color: '#f26b82', fontSize: 25 },
  emptyText: { color: '#78938a', fontSize: 13, padding: 24, textAlign: 'center' },
  tabBar: {
    backgroundColor: '#ffffff',
    borderColor: '#d7eee4',
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    right: 0,
  },
  tabButton: { alignItems: 'center', flex: 1, paddingVertical: 8 },
  tabLabel: { color: '#91a79e', fontSize: 12, fontWeight: '600' },
  tabLabelActive: { color: '#319b72', fontSize: 12, fontWeight: '800' },
  detailPanel: { flex: 1, padding: 20 },
  backLink: { color: '#319b72', fontSize: 13, fontWeight: '700', marginBottom: 24 },
  detailHeading: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  detailHeadingCopy: { flex: 1 },
  detailTitle: { color: '#173d32', fontSize: 25, fontWeight: '800', marginTop: 8 },
  detailFavorite: { padding: 4 },
  detailDescription: { color: '#58756b', fontSize: 14, lineHeight: 23, marginTop: 22 },
  exploreButton: { backgroundColor: '#f26b82', borderRadius: 16, marginTop: 20, paddingHorizontal: 16, paddingVertical: 14 },
  exploreButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  detailLabel: { color: '#319b72', fontSize: 11, fontWeight: '800', marginTop: 24, textTransform: 'uppercase' },
  detailValue: { color: '#173d32', fontSize: 14, marginTop: 6 },
  bugPreview: { borderColor: '#d7eee4', borderTopWidth: 1, marginTop: 26, paddingTop: 2 },
  bugRow: { color: '#173d32', fontSize: 14, marginTop: 12 },
  bugdexCard: { backgroundColor: '#ffffff', borderColor: '#d7eee4', borderRadius: 20, borderWidth: 2, flexDirection: 'row', marginBottom: 12, minHeight: 132, overflow: 'hidden', padding: 12, position: 'relative' },
  bugdexTier: { borderBottomLeftRadius: 10, borderTopRightRadius: 18, paddingHorizontal: 8, paddingVertical: 4, position: 'absolute', right: 0, top: 0 },
  bugImageFrame: { alignItems: 'center', backgroundColor: '#fff8df', borderRadius: 15, height: 106, justifyContent: 'center', overflow: 'hidden', width: 106 },
  bugImage: { height: 106, width: 106 },
  bugEmoji: { fontSize: 42 },
  bugTextBlock: { flex: 1, paddingLeft: 14, paddingTop: 3 },
  bugTitleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  bugName: { color: '#173d32', flex: 1, fontSize: 16, fontWeight: '800' },
  rarity: { color: '#d28b22', fontSize: 9, fontWeight: '800' },
  bugScientific: { color: '#319b72', fontSize: 11, fontStyle: 'italic', marginTop: 5 },
  bugFact: { color: '#6b8179', fontSize: 11, lineHeight: 17, marginTop: 8 },
  credit: { color: '#9aaba3', fontSize: 8, marginTop: 7 },
  profilePanel: { padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 28 },
  stat: { backgroundColor: '#ffffff', borderColor: '#d7eee4', borderRadius: 16, borderWidth: 1, flex: 1, padding: 14 },
  statValue: { color: '#319b72', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#78938a', fontSize: 11, marginTop: 5 },
});
