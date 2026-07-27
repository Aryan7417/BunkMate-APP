import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleClassNotification(
  subject: string,
  room: string,
  date: Date
) {
await Notifications.scheduleNotificationAsync({
  content: {
    title: "📚 BunkMate",
    body: `${subject}\n🏫 ${room}\n⏰ It's time for your class!`,
    sound: "default",
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date,
  },
});
}

export async function cancelAllClassNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}