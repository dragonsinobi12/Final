import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SEED_SPOTS } from '../src/data/seed';

export default function FavoritesRoute() {
  const router = useRouter();
  const favorites = SEED_SPOTS.filter((spot) => spot.id === 'spot-2');
  return (
    <FlatList
      data={favorites}
      keyExtractor={(spot) => spot.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<Text style={styles.title}>พื้นที่โปรด</Text>}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push(`/spot/${item.id}` as never)} style={styles.card}>
          <Text style={styles.province}>{item.province}</Text>
          <Text style={styles.name}>{item.nameTh}</Text>
          <Text style={styles.meta}>{item.bugIds.length} ชนิดที่รอค้นพบ</Text>
        </Pressable>
      )}
      ListEmptyComponent={<Text style={styles.empty}>ยังไม่มีพื้นที่โปรด</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: '#eaf8f2', flexGrow: 1, gap: 12, padding: 20 },
  title: { color: '#173d32', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  card: { backgroundColor: '#fff', borderColor: '#d7eee4', borderRadius: 18, borderWidth: 1, padding: 16 },
  province: { color: '#319b72', fontSize: 11, fontWeight: '800' },
  name: { color: '#173d32', fontSize: 17, fontWeight: '800', marginTop: 6 },
  meta: { color: '#78938a', marginTop: 8 },
  empty: { color: '#78938a', paddingTop: 20 },
});
