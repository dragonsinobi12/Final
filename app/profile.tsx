import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { nativeStorage } from '../src/services/nativeStorage';

export default function ProfileRoute() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>🧢</Text>
      <Text style={styles.title}>นักสำรวจนที</Text>
      <Text style={styles.meta}>Level 2 · Bug Explorer</Text>
      <Text style={styles.body}>Session ถูกจัดเก็บด้วย SecureStore และตรวจวันหมดอายุทุกครั้งที่เปิดแอป</Text>
      <Pressable onPress={() => router.push('/login')} style={styles.button}><Text style={styles.buttonText}>เข้าสู่ระบบใหม่</Text></Pressable>
      <Pressable onPress={() => void nativeStorage.clearSession()} style={styles.secondary}><Text style={styles.secondaryText}>ออกจากระบบ</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: '#eaf8f2', flex: 1, padding: 24 },
  avatar: { backgroundColor: '#dff5e9', borderRadius: 36, fontSize: 48, marginTop: 30, padding: 16 },
  title: { color: '#173d32', fontSize: 26, fontWeight: '800', marginTop: 16 },
  meta: { color: '#319b72', marginTop: 5 },
  body: { color: '#58756b', lineHeight: 22, marginTop: 22, textAlign: 'center' },
  button: { backgroundColor: '#319b72', borderRadius: 14, marginTop: 28, padding: 15, width: '100%' },
  buttonText: { color: '#fff', fontWeight: '800', textAlign: 'center' },
  secondary: { backgroundColor: '#fff4d5', borderRadius: 14, marginTop: 10, padding: 15, width: '100%' },
  secondaryText: { color: '#9a6811', fontWeight: '800', textAlign: 'center' },
});
