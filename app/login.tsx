import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../src/services/api';
import { nativeStorage } from '../src/services/nativeStorage';

export default function LoginRoute() {
  const router = useRouter();
  const [email, setEmail] = useState('explorer@bugquest.dev');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email.includes('@') || password.length < 4) {
      setError('กรุณากรอกอีเมลและรหัสผ่านอย่างน้อย 4 ตัวอักษร');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const session = await api.login(email, password);
      await nativeStorage.setSession(session);
      router.back();
    } catch {
      setError('เข้าสู่ระบบไม่ได้ ตรวจสอบบัญชีเดโมหรือเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔐</Text>
      <Text style={styles.title}>เข้าสู่ระบบนักสำรวจ</Text>
      <Text style={styles.hint}>บัญชีเดโม: explorer@bugquest.dev / 1234</Text>
      <TextInput autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} style={styles.input} value={email} placeholder="อีเมล" />
      <TextInput onChangeText={setPassword} secureTextEntry style={styles.input} value={password} placeholder="รหัสผ่าน" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable disabled={loading} onPress={() => void login()} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eaf8f2', flex: 1, padding: 24 },
  emoji: { fontSize: 48, marginTop: 30 },
  title: { color: '#173d32', fontSize: 26, fontWeight: '800', marginTop: 12 },
  hint: { color: '#78938a', fontSize: 12, marginTop: 8 },
  input: { backgroundColor: '#fff', borderColor: '#d7eee4', borderRadius: 14, borderWidth: 1, marginTop: 14, padding: 14 },
  error: { color: '#c84f58', fontSize: 12, marginTop: 10 },
  button: { backgroundColor: '#319b72', borderRadius: 14, marginTop: 22, padding: 15 },
  buttonText: { color: '#fff', fontWeight: '800', textAlign: 'center' },
});
