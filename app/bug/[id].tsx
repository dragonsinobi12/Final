import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import { SEED_BUGS } from '../../src/data/seed';
import { BUG_MEDIA } from '../../src/data/bugMedia';

export default function BugDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bug = SEED_BUGS.find((item) => item.id === id);
  const media = bug ? BUG_MEDIA[bug.id] : undefined;
  if (!bug) return <Text style={styles.empty}>ไม่พบข้อมูลแมลง</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {media ? <Image source={{ uri: media.imageUrl }} style={styles.image} /> : <Text style={styles.emoji}>{bug.emoji}</Text>}
      <Text style={styles.title}>{bug.nameTh}</Text>
      <Text style={styles.scientific}>{bug.nameEn} · {bug.scientificName}</Text>
      <Text style={styles.label}>ถิ่นอาศัย</Text>
      <Text style={styles.body}>{bug.habitatText}</Text>
      <Text style={styles.label}>เกร็ดความรู้</Text>
      {bug.facts.map((fact) => <Text key={fact} style={styles.fact}>• {fact}</Text>)}
      {bug.conservation ? <Text style={styles.note}>สถานะอนุรักษ์: {bug.conservation}</Text> : null}
      {media ? <Text style={styles.credit}>{media.credit}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eaf8f2', flexGrow: 1, padding: 24 },
  image: { alignSelf: 'center', borderRadius: 20, height: 240, width: 240 },
  emoji: { fontSize: 100, padding: 40, textAlign: 'center' },
  title: { color: '#173d32', fontSize: 28, fontWeight: '800', marginTop: 22 },
  scientific: { color: '#319b72', fontStyle: 'italic', marginTop: 6 },
  label: { color: '#319b72', fontSize: 12, fontWeight: '800', marginTop: 24 },
  body: { color: '#58756b', fontSize: 15, lineHeight: 23, marginTop: 7 },
  fact: { color: '#58756b', fontSize: 14, lineHeight: 22, marginTop: 8 },
  note: { backgroundColor: '#fff4d5', borderRadius: 12, color: '#9a6811', marginTop: 20, padding: 12 },
  credit: { color: '#9aaba3', fontSize: 10, marginTop: 22 },
  empty: { padding: 24 },
});
