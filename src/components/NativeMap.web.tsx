import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SEED_SPOTS } from '../data/seed';

export default function NativeMap() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>แผนที่พื้นที่สำรวจ</Text>
      <Text style={styles.meta}>เว็บใช้แผนที่เดโม ส่วน Expo Go ใช้ MapView และตำแหน่งจริง</Text>
      <View style={styles.map}>
        <Text style={styles.decor}>🌿 🐞 🌳 🦋</Text>
        {SEED_SPOTS.map((spot, index) => <View key={spot.id} style={[styles.pin, { left: `${12 + (index * 15) % 74}%`, top: `${22 + (index * 12) % 60}%` }]}><Text style={styles.pinText}>?</Text></View>)}
        <Text style={styles.label}>{SEED_SPOTS.length} จุดสำรวจ · แตะภารกิจจากหน้า Home</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: '#eaf8f2', flexGrow: 1, padding: 20 },
  title: { color: '#173d32', fontSize: 26, fontWeight: '800' },
  meta: { color: '#78938a', marginTop: 6 },
  map: { backgroundColor: '#bdebd5', borderColor: '#8bd4b3', borderRadius: 24, height: 520, marginTop: 20, overflow: 'hidden', position: 'relative' },
  decor: { fontSize: 28, left: 18, position: 'absolute', top: 20 },
  pin: { alignItems: 'center', backgroundColor: '#a865d8', borderColor: '#fff', borderRadius: 18, borderWidth: 3, height: 36, justifyContent: 'center', position: 'absolute', width: 36 },
  pinText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  label: { backgroundColor: '#ffffffdd', borderRadius: 10, bottom: 16, color: '#397963', fontWeight: '800', left: 16, padding: 10, position: 'absolute' },
});
