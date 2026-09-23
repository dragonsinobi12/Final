import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { SEED_SPOTS } from '../data/seed';
import { getCurrentCoordinates, type Coordinates } from '../services/location';

export default function NativeMap() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [message, setMessage] = useState('กำลังขอตำแหน่งปัจจุบัน...');
  useEffect(() => {
    void getCurrentCoordinates().then((result) => {
      if (result.ok) {
        setCoords(result.coords);
        setMessage('ตำแหน่งปัจจุบันพร้อมใช้งาน');
      } else setMessage('ไม่อนุญาตตำแหน่ง แสดงแผนที่พื้นที่แทน');
    });
  }, []);
  const center = coords ?? { lat: 13.7563, lng: 100.5018 };
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ latitude: center.lat, longitude: center.lng, latitudeDelta: 8, longitudeDelta: 8 }} showsUserLocation={Boolean(coords)}>
        {SEED_SPOTS.map((spot) => (
          <React.Fragment key={spot.id}>
            <Marker coordinate={{ latitude: spot.latitude, longitude: spot.longitude }} title={spot.nameTh} description={`${spot.bugIds.length} ชนิดที่รอค้นพบ`} />
            <Circle center={{ latitude: spot.latitude, longitude: spot.longitude }} radius={spot.radiusM} strokeColor="#319b72" fillColor="#319b7233" />
          </React.Fragment>
        ))}
      </MapView>
      <Text style={styles.status}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: '#eaf8f2', flex: 1 },
  map: { flex: 1 },
  status: { backgroundColor: '#ffffffdd', bottom: 20, color: '#173d32', left: 20, padding: 10, position: 'absolute', right: 20, textAlign: 'center' },
});
