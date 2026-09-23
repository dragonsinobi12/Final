import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const spotId = response.notification.request.content.data?.spotId;
      if (typeof spotId === 'string') router.push(`/spot/${spotId}` as never);
    });
    return () => subscription.remove();
  }, [router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="spot/[id]" options={{ headerShown: true, title: 'พื้นที่สำรวจ' }} />
      <Stack.Screen name="bug/[id]" options={{ headerShown: true, title: 'Bugdex' }} />
      <Stack.Screen name="favorites" options={{ headerShown: true, title: 'พื้นที่โปรด' }} />
      <Stack.Screen name="profile" options={{ headerShown: true, title: 'โปรไฟล์' }} />
      <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: true, title: 'เข้าสู่ระบบ' }} />
      <Stack.Screen name="catch/[spotId]" options={{ presentation: 'modal', headerShown: true, title: 'ลงทะเบียนการสำรวจ' }} />
    </Stack>
  );
}
