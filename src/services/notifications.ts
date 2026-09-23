import * as Notifications from 'expo-notifications';
import type { Spot } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function scheduleSpotReminder(spot: Spot, seconds: number): Promise<string | null> {
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: `ถึงเวลาสำรวจ ${spot.nameTh}`,
      body: 'มีแมลงประจำถิ่นรอให้คุณค้นพบ',
      data: { spotId: spot.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    },
  });
}

export function onNotificationResponse(callback: (spotId: string) => void): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const spotId = response.notification.request.content.data?.spotId;
    if (typeof spotId === 'string') callback(spotId);
  });
}
