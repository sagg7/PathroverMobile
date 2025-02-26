import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import notifee, {AndroidImportance} from '@notifee/react-native';

// Request notification permissions (required for Android 13+)
const requestNotificationPermission = async () => {
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
};

// Verify notification permissions
const verifyNotificationPermission = authStatus =>
  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  authStatus === messaging.AuthorizationStatus.PROVISIONAL;

// Get FCM token
export const getFCMToken = async () => {
  try {
    await messaging().setAutoInitEnabled(true);
    const registered = await messaging().registerDeviceForRemoteMessages();
    console.log('=============registered=======================');
    console.log(registered);
    console.log('====================================');
    let token;

    if (Platform.OS === 'android') {
      token = await messaging().getToken();
    } else {
      const authStatus = await messaging().hasPermission();
      if (verifyNotificationPermission(authStatus)) {
        token = await messaging().getToken();
      } else {
        const status = await messaging().requestPermission();
        if (verifyNotificationPermission(status)) {
          token = await getFCMToken(); // Retry to get the token
        }
      }

      console.log('==============token======================');
      console.log(token);
      console.log('====================================');
      return token;
    }
  } catch (error) {
    console.log('================error====================');
    console.log(error);
    console.log('====================================');
  }
};

// Display notification
const onDisplayNotification = async message => {
  try {
    const channelId = await notifee.createChannel({
      id: 'PathRover',
      name: 'PathRover',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      id: message?.messageId,
      title: message?.notification?.title,
      body: message?.notification?.body,
      data: message?.data,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        largeIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
        importance: AndroidImportance.HIGH,
      },
    });
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};

// Notification listeners
export const NotificationListener = listener => {
  // Listener for when the app is in the background
  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log('App opened from background:', remoteMessage);
    listener(remoteMessage, 1);
  });

  // Listener for when the app is in the foreground
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);
    onDisplayNotification(remoteMessage);
  });

  // Listener for when the app is in a quit state
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage);
    onDisplayNotification(remoteMessage);
  });

  // Listener for when the app is opened from a quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from quit state:', remoteMessage);
        listener(remoteMessage, 1);
      }
    })
    .catch(err => {
      console.error('Error getting initial notification:', err);
    });
};

// Initialize notification permissions
requestNotificationPermission();
/**
 * Handle the click of a notification and navigate to the appropriate screen.
 */
export const onNotifyPress = (notify, navigation) => {
  const {data} = notify;
  const {type} = data || {};

  switch (type) {
    case 'call':
      navigation.navigate('CallScreen', {
        callerId: data.callerId,
        channelName: data.channelName,
      });
      break;
    case 'alerts':
      navigation.navigate('AlertsScreen');
      break;
    case 'issue':
      navigation.navigate('IssueScreen');
      break;
    default:
      console.warn('Unhandled notification type:', type);
      break;
  }
};

// ---------------------------------------------------------------------------
// /**
//  * Request notification permissions based on the platform.
//  * Android requires POST_NOTIFICATIONS permission (API 33+), and iOS uses Firebase's requestPermission.
//  */
// export async function requestPermission() {
//   try {
//     if (Platform.OS === 'android') {
//       if (Platform.Version >= 33) {
//         const result = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//         );
//         return result === PermissionsAndroid.RESULTS.GRANTED;
//       }
//       return true; // No need for explicit permission request below API 33
//     }

//     const authStatus = await messaging().requestPermission();
//     return (
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL
//     );
//   } catch (error) {
//     console.error('Error requesting notification permissions', error);
//     return false;
//   }
// }

// /**
//  * Get FCM token after ensuring the notification permissions are granted.
//  */
// export async function getFCMToken() {
//   try {
//     const hasPermission = await requestPermission();
//     if (!hasPermission) {
//       return {fcmToken: ''};
//     }

//     const token = await messaging().getToken();
//     return {fcmToken: token};
//   } catch (error) {
//     console.error('Error getting FCM token', error);
//     return {fcmToken: ''};
//   }
// }

// /**
//  * Create a notification channel (for Android only) if it doesn't already exist.
//  */
// export const createNotifyChannel = () => {
//   if (Platform.OS === 'android') {
//     PushNotification.createChannel(
//       {
//         channelId: 'PathRover', // Required for Android
//         channelName: 'PathRover Notifications', // Required for Android
//         channelDescription: 'Channel for PathRover notifications',
//         importance: Importance.HIGH,
//         soundName: 'default', // Default notification sound
//         vibrate: true,
//       },
//       (created: any) => {
//         console.log(`Notification channel creation status: ${created}`);
//       },
//     );
//   }
// };

// /**
//  * Notification listener to handle foreground, background, and quit state notifications.
//  */
// export const notificationListener = (navigation: any) => {
//   const onNotificationOpenedAppUnsubscribe =
//     messaging().onNotificationOpenedApp(async remoteMessage => {
//       console.log('Notification opened from background:', remoteMessage);
//       if (remoteMessage) {
//         onClickNotification(remoteMessage, navigation);
//       }
//     });

//   const onMessageUnsubscribe = messaging().onMessage(async remoteMessage => {
//     console.log('Notification received in foreground:', remoteMessage);
//     LocalNotification(remoteMessage, navigation);
//   });

//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         onClickNotification(remoteMessage, navigation);
//       }
//     })
//     .catch(error => {
//       console.error('Error getting initial notification:', error);
//     });

//   return () => {
//     onNotificationOpenedAppUnsubscribe();
//     onMessageUnsubscribe();
//   };
// };

// /**
//  * Show a local notification when the app is in the foreground.
//  */
// export const LocalNotification = (notify: any, navigation: any) => {
//   const {data, notification} = notify;
//   const {type} = data;

//   if (type === 'call') {
//     // Handle call notification with accept/reject buttons
//     PushNotification.localNotification({
//       channelId: 'PathRover',
//       title: notification?.title ?? 'Incoming Call',
//       message: notification?.body ?? 'You have an incoming call',
//       smallIcon: 'ic_notification',
//       largeIcon: 'ic_launcher',
//       vibrate: true,
//       vibration: 300,
//       playSound: true,
//       soundName: 'default',
//       invokeApp: true,
//       actions: ['Accept', 'Reject'], // Add accept/reject buttons
//     });
//   } else {
//     // Handle simple notifications
//     PushNotification.localNotification({
//       channelId: 'PathRover',
//       title: notification?.title ?? 'Notification',
//       message: notification?.body ?? 'You have a new notification',
//       smallIcon: 'ic_notification',
//       largeIcon: 'ic_launcher',
//       vibrate: true,
//       vibration: 300,
//       playSound: true,
//       soundName: 'default',
//       invokeApp: true,
//     });
//   }

//   // Configure push notification for iOS or Android
//   PushNotification.configure({
//     onRegister: (token: any) => {
//       console.log('Notification token:', token);
//     },
//     onNotification: (notification: any) => {
//       console.log('Notification received:', notification);
//       if (notification.userInteraction) {
//         onClickNotification(notify, navigation);
//       }
//       notification.finish(PushNotificationIOS.FetchResult.NoData);
//     },
//     popInitialNotification: true,
//     requestPermissions: Platform.OS === 'ios',
//     permissions: {
//       alert: true,
//       badge: true,
//       sound: true,
//     },
//   });
// };

// /**
//  * Handle the click of a notification and navigate to the appropriate screen.
//  */
// const onClickNotification = (notify: any, navigation: any) => {
//   const {data, notification} = notify;
//   const {type} = data;

//   switch (type) {
//     case 'call':
//       // Handle call notification actions
//       if (notify.action === 'Accept') {
//         console.log('Call accepted');
//         // Navigate to the call screen and join the Agora channel
//         navigation.navigate('CallScreen', {
//           callerId: data.callerId,
//           channelName: data.channelName,
//         });
//       } else if (notify.action === 'Reject') {
//         console.log('Call rejected');
//         // Handle call rejection logic
//       }
//       break;
//     case 'alerts':
//       // Handle alerts notification
//       navigation.navigate('AlertsScreen');
//       break;
//     case 'issue':
//       // Handle issue notification
//       navigation.navigate('IssueScreen');
//       break;
//     default:
//       console.warn('Unhandled notification type:', type);
//       break;
//   }
// };

//-------------------------------------------------------------------------------
// import {PermissionsAndroid, Platform} from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import PushNotification, {Importance} from 'react-native-push-notification';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';

// /**
//  * Request notification permissions based on the platform.
//  * Android requires POST_NOTIFICATIONS permission (API 33+), and iOS uses Firebase's requestPermission.
//  */
// export async function requestPermission() {
//   try {
//     if (Platform.OS === 'android') {
//       if (Platform.Version >= 33) {
//         const result = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//         );
//         return result === PermissionsAndroid.RESULTS.GRANTED;
//       }
//       return true; // No need for explicit permission request below API 33
//     }

//     const authStatus = await messaging().requestPermission();
//     return (
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL
//     );
//   } catch (error) {
//     console.error('Error requesting notification permissions', error);
//     return false;
//   }
// }

// /**
//  * Get FCM token after ensuring the notification permissions are granted.
//  */
// export async function getFCMToken() {
//   try {
//     const hasPermission = await requestPermission();
//     if (!hasPermission) {
//       return {fcmToken: ''};
//     }

//     const token = await messaging().getToken();
//     return {fcmToken: token};
//   } catch (error) {
//     console.error('Error getting FCM token', error);
//     return {fcmToken: ''};
//   }
// }

// /**
//  * Create a notification channel (for Android only) if it doesn't already exist.
//  */
// export const createNotifyChannel = () => {
//   if (Platform.OS === 'android') {
//     PushNotification.createChannel(
//       {
//         channelId: 'PathRover', // Required for Android
//         channelName: 'PathRover Notifications', // Required for Android
//         channelDescription: 'Channel for PathRover notifications',
//         importance: Importance.HIGH,
//         soundName: 'default', // Default notification sound
//         vibrate: true,
//       },
//       (created: any) => {
//         console.log(`Notification channel creation status: ${created}`);
//       },
//     );
//   }
// };

// /**
//  * Listener to handle different notification states (foreground, background, quit state).
//  * Cleans up listeners on unmount.
//  */
// export const notificationListener = (navigation: any) => {
//   const onNotificationOpenedAppUnsubscribe =
//     messaging().onNotificationOpenedApp(async remoteMessage => {
//       console.log('Notification opened from background:', remoteMessage);
//       if (remoteMessage) {
//         onClickNotification(remoteMessage, navigation);
//       }
//     });

//   const onMessageUnsubscribe = messaging().onMessage(async remoteMessage => {
//     console.log('Notification received in foreground:', remoteMessage);
//     LocalNotification(remoteMessage, navigation);
//   });

//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         onClickNotification(remoteMessage, navigation);
//       }
//     })
//     .catch(error => {
//       console.error('Error getting initial notification:', error);
//     });

//   return () => {
//     onNotificationOpenedAppUnsubscribe();
//     onMessageUnsubscribe();
//   };
// };

// /**
//  * Show a local notification when the app is in the foreground.
//  */
// export const LocalNotification = (notify: any, navigation: any) => {
//   PushNotification.localNotification({
//     channelId: 'PathRover',
//     title: notify?.notification?.title ?? 'Notification',
//     message: notify?.notification?.body ?? 'You have a new notification',
//     smallIcon: 'ic_notification',
//     largeIcon: 'ic_launcher',
//     vibrate: true,
//     vibration: 300,
//     playSound: true,
//     soundName: 'default',
//     invokeApp: true,
//   });

//   // Configure push notification for iOS or Android
//   PushNotification.configure({
//     onRegister: (token: any) => {
//       console.log('Notification token:', token);
//     },
//     onNotification: (notification: any) => {
//       console.log('Notification received:', notification);
//       if (notification.userInteraction) {
//         onClickNotification(notify, navigation);
//       }
//       notification.finish(PushNotificationIOS.FetchResult.NoData);
//     },
//     popInitialNotification: true,
//     requestPermissions: Platform.OS === 'ios',
//     permissions: {
//       alert: true,
//       badge: true,
//       sound: true,
//     },
//   });
// };

// /**
//  * Handle the click of a notification and navigate to the appropriate screen.
//  */
// const onClickNotification = (notify: any, navigation: any) => {
//   const {data, notification} = notify;
//   const {type} = data;

//   switch (type) {
//     case 'alerts':
//       break;
//     case 'issue':
//       break;
//     default:
//       console.warn('Unhandled notification type:', type);
//       break;
//   }
// };
