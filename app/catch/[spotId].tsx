import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { SEED_SPOTS } from '../../src/data/seed';
import { nativeStorage } from '../../src/services/nativeStorage';

export default function CatchRoute() {
  const { spotId } = useLocalSearchParams<{ spotId: string }>();
  const router = useRouter();
  const spot = SEED_SPOTS.find((item) => item.id === spotId);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void nativeStorage.getSession().then((session) => {
      if (!session) router.replace({ pathname: '/login', params: { redirect: `/catch/${spotId}` } });
    });
  }, [router, spotId]);

  if (!spot) return <Text style={styles.empty}>ไม่พบพื้นที่สำรวจ</Text>;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const submit = async () => {
    if (!photoUri) {
      setError('กรุณาถ่ายภาพหรือเลือกรูปบรรยากาศสถานที่ก่อนส่ง');
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/spot/${spot.id}` as never);
  };

  if (cameraOpen) {
    if (!permission?.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>ต้องใช้สิทธิ์กล้อง</Text>
          <Text style={styles.body}>BugQuest ถ่ายเฉพาะภาพบรรยากาศพื้นที่ ไม่ถ่ายตัวแมลง</Text>
          <Button title="อนุญาตกล้อง" onPress={() => void requestPermission()} />
          <Button title="เลือกภาพจากแกลเลอรีแทน" onPress={() => void pickPhoto()} />
        </View>
      );
    }
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" />
        <Pressable onPress={() => { setPhotoUri('camera://latest'); setCameraOpen(false); }} style={styles.shutter}>
          <Text style={styles.shutterText}>ถ่ายภาพ</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>CATCH REGISTRATION</Text>
      <Text style={styles.title}>{spot.nameTh}</Text>
      <Text style={styles.body}>ลงทะเบียนการสำรวจด้วยภาพบรรยากาศสถานที่</Text>
      {photoUri ? <Image source={{ uri: photoUri.startsWith('http') ? photoUri : undefined }} style={styles.preview} /> : null}
      <Pressable onPress={() => setCameraOpen(true)} style={styles.button}><Text style={styles.buttonText}>เปิดกล้อง</Text></Pressable>
      <Pressable onPress={() => void pickPhoto()} style={styles.secondary}><Text style={styles.secondaryText}>เลือกรูปจากแกลเลอรี</Text></Pressable>
      <TextInput multiline onChangeText={setNote} placeholder="บันทึกสิ่งที่สังเกตพบ (ไม่บังคับ)" style={styles.note} value={note} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={() => void submit()} style={styles.button}><Text style={styles.buttonText}>ลงทะเบียนและปลดล็อก</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eaf8f2', flex: 1, padding: 24 },
  cameraContainer: { backgroundColor: '#111', flex: 1 },
  camera: { flex: 1 },
  shutter: { alignSelf: 'center', backgroundColor: '#f26b82', borderRadius: 18, bottom: 36, padding: 16, position: 'absolute' },
  shutterText: { color: '#fff', fontWeight: '800' },
  eyebrow: { color: '#319b72', fontSize: 11, fontWeight: '800', marginTop: 16 },
  title: { color: '#173d32', fontSize: 26, fontWeight: '800', marginTop: 10 },
  body: { color: '#58756b', lineHeight: 22, marginTop: 10 },
  preview: { backgroundColor: '#d7eee4', borderRadius: 16, height: 180, marginTop: 18, width: '100%' },
  button: { backgroundColor: '#f26b82', borderRadius: 14, marginTop: 16, padding: 15 },
  buttonText: { color: '#fff', fontWeight: '800', textAlign: 'center' },
  secondary: { backgroundColor: '#fff4d5', borderRadius: 14, marginTop: 10, padding: 15 },
  secondaryText: { color: '#9a6811', fontWeight: '800', textAlign: 'center' },
  note: { backgroundColor: '#fff', borderColor: '#d7eee4', borderRadius: 14, borderWidth: 1, minHeight: 90, marginTop: 16, padding: 14, textAlignVertical: 'top' },
  error: { color: '#c84f58', marginTop: 10 },
  empty: { padding: 24 },
});
