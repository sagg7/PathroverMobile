import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

/**
 * Request notification permissions based on the platform.
 * Android requires POST_NOTIFICATIONS permission (API 33+), and iOS uses Firebase's requestPermission.
 */
export async function requestPermission() {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // No need for explicit permission request below API 33
    }

    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Error requesting notification permissions', error);
    return false;
  }
}

/**
 * Get FCM token after ensuring the notification permissions are granted.
 */
export async function getFCMToken() {
  try {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      return {fcmToken: ''};
    }

    const token = await messaging().getToken();
    return {fcmToken: token};
  } catch (error) {
    console.error('Error getting FCM token', error);
    return {fcmToken: ''};
  }
}

/**
 * Create a notification channel (for Android only) if it doesn't already exist.
 */
export const createNotifyChannel = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'PlayLync', // Required for Android
        channelName: 'PlayLync Notifications', // Required for Android
        channelDescription: 'Channel for PlayLync notifications',
        importance: Importance.HIGH,
        soundName: 'default', // Default notification sound
        vibrate: true,
      },
      (created: any) => {
        console.log(`Notification channel creation status: ${created}`);
      },
    );
  }
};

/**
 * Listener to handle different notification states (foreground, background, quit state).
 * Cleans up listeners on unmount.
 */
export const notificationListener = (navigation: any) => {
  const onNotificationOpenedAppUnsubscribe =
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('Notification opened from background:', remoteMessage);
      if (remoteMessage) {
        onClickNotification(remoteMessage, navigation);
      }
    });

  const onMessageUnsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Notification received in foreground:', remoteMessage);
    LocalNotification(remoteMessage, navigation);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        onClickNotification(remoteMessage, navigation);
      }
    })
    .catch(error => {
      console.error('Error getting initial notification:', error);
    });

  return () => {
    onNotificationOpenedAppUnsubscribe();
    onMessageUnsubscribe();
  };
};

/**
 * Show a local notification when the app is in the foreground.
 */
export const LocalNotification = (notify: any, navigation: any) => {
  PushNotification.localNotification({
    channelId: 'PlayLync',
    title: notify?.notification?.title ?? 'Notification',
    message: notify?.notification?.body ?? 'You have a new notification',
    smallIcon: 'ic_notification',
    largeIcon: 'ic_launcher',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    invokeApp: true,
  });

  // Configure push notification for iOS or Android
  PushNotification.configure({
    onRegister: (token: any) => {
      console.log('Notification token:', token);
    },
    onNotification: (notification: any) => {
      console.log('Notification received:', notification);
      if (notification.userInteraction) {
        onClickNotification(notify, navigation);
      }
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  });
};

/**
 * Handle the click of a notification and navigate to the appropriate screen.
 */
const onClickNotification = (notify: any, navigation: any) => {
  const {data, notification} = notify;
  const {type} = data;

  switch (type) {
    case 'alerts':
      break;
    case 'issue':
      break;
    default:
      console.warn('Unhandled notification type:', type);
      break;
  }
};
