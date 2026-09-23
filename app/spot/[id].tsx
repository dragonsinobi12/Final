import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SEED_SPOTS } from '../../src/data/seed';
import { scheduleSpotReminder } from '../../src/services/notifications';

export default function SpotDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const spot = SEED_SPOTS.find((item) => item.id === id);

  if (!spot) return <Text style={styles.empty}>ไม่พบพื้นที่สำรวจ</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>{spot.province}</Text>
      <Text style={styles.title}>{spot.nameTh}</Text>
      <Text style={styles.description}>{spot.description}</Text>
      <Text style={styles.label}>แมลงที่รอค้นพบ</Text>
      <Text style={styles.value}>{spot.bugIds.length} ชนิด</Text>
      <Text style={styles.label}>ช่วงเวลาที่เหมาะ</Text>
      <Text style={styles.value}>{spot.bestTime ?? 'ตรวจสอบตามฤดูกาล'}</Text>
      <Pressable style={styles.primary} onPress={() => router.push(`/catch/${spot.id}` as never)}>
        <Text style={styles.primaryText}>เริ่มลงทะเบียนการสำรวจ</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => void scheduleSpotReminder(spot, 10)}>
        <Text style={styles.secondaryText}>ตั้งเตือนใน 10 วินาที</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eaf8f2', flexGrow: 1, padding: 24 },
  eyebrow: { color: '#319b72', fontWeight: '800' },
  title: { color: '#173d32', fontSize: 28, fontWeight: '800', marginTop: 10 },
  description: { color: '#58756b', fontSize: 15, lineHeight: 24, marginTop: 18 },
  label: { color: '#319b72', fontSize: 12, fontWeight: '800', marginTop: 24 },
  value: { color: '#173d32', fontSize: 15, marginTop: 6 },
  primary: { backgroundColor: '#f26b82', borderRadius: 14, marginTop: 32, padding: 15 },
  primaryText: { color: '#fff', fontWeight: '800', textAlign: 'center' },
  secondary: { backgroundColor: '#fff4d5', borderRadius: 14, marginTop: 10, padding: 15 },
  secondaryText: { color: '#9a6811', fontWeight: '800', textAlign: 'center' },
  empty: { padding: 24 },
});
