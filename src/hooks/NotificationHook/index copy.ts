import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';


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
    // console.error('Error requesting notification permissions', error);
    return false;
  }
};

requestNotificationPermission();

// Verify notification permissions
const verifyNotificationPermission = authStatus =>
  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  authStatus === messaging.AuthorizationStatus.PROVISIONAL;

// Get FCM token
export const getFCMToken = async () => {
  try {
    await messaging().setAutoInitEnabled(true);
    const registered = await messaging().registerDeviceForRemoteMessages();
    let token;

    if (Platform.OS === 'android') {
      token = await messaging().getToken();
      // console.log('token--------android------>>>>>>>>>>>>>>', token);
      return token;
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

      // console.log('token------------ios-->>>>>>>>>>>>>>', token);
      return token;
    }
  } catch (error) {
    // console.log('==============getFCMToken==error====================', error);
  }
};

// 2. Notification Display Functions
const setupNotificationChannels = async () => {
  // iOS categories (for actions) - updated with more complete configuration
  await notifee.setNotificationCategories([
    {
      id: 'call_actions',
      actions: [
        {
          id: 'accept',
          title: 'Accept',
          foreground: true,
          authenticationRequired: false,
        },
        {
          id: 'reject',
          title: 'Reject',
          foreground: true,
          destructive: true,
          authenticationRequired: false,
        },
      ],
    },
  ]);
};

export const onDisplayNotification = async (message) => {
  try {
    // console.log('message----onDisplayNotification--------------->>>>>>>>>>>>>>', message);
    const channelId = await notifee.createChannel({
      id: 'PathRover',
      name: 'PathRover',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      // vibrationPattern: [0, 1000, 500, 1000],
      vibration: true,
      description: 'Channel for PathRover notifications',
    });

    // Determine notification type from message data
    const notificationType = message?.notification?.title === 'Missed Call' ? 'Missed Call' :  JSON.parse(message?.data?.data)?.call_type;

    // console.log('notificationType----onDisplayNotification--------------->>>>>>>>>>>>>>', notificationType);
    
    // const notificationType = message?.data?.type;

    // Base notification configuration
    const notificationConfig = {
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
          launchActivity: 'default',
        },
        importance: AndroidImportance.HIGH,
        ongoing: message?.notification?.title === 'Missed Call' ? false: true,
        loopSound: message?.notification?.title === 'Missed Call' ? false : true,
        // loopSound: message?.data?.type === 'ringing',
      },
      ios: {
        categoryId: 'call_actions',
        sound: 'default',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
        critical: true,
        criticalVolume: 1.0,
      },
    };

    // Add actions based on notification type
    // console.log('notificationType----onDisplayNotification--------------->>>>>>>>>>>>>>', notificationType);
    
    switch (notificationType) {
      case 'audio_call':
        await setupNotificationChannels();
        notificationConfig.android.actions = [
          {
            title: 'Accept',
            pressAction: {
              id: 'accept',
              launchActivity: 'default',
            },
          },
          {
            title: 'Reject',
            pressAction: {
              id: 'reject',
              launchActivity: 'default',
            },
          },
        ];
        break;
      case 'video_call':
        await setupNotificationChannels();
        notificationConfig.android.actions = [
          {
            title: 'Accept',
            pressAction: {
              id: 'accept',
              launchActivity: 'default',
            },
          },
          {
            title: 'Reject',
            pressAction: {
              id: 'reject',
              launchActivity: 'default',
            },
          },
        ];
        break;
      default:
        // No actions for default notifications
        break;
    }

    await clearAllCallNotifications()
    await notifee.displayNotification(notificationConfig);
    
  } catch (error) {
    // console.error('Error displaying notification:', error);
  }
};

export async function clearAllCallNotifications() {
  try {
    // console.log('[clearAllCallNotifications] Starting...');

    // Get all displayed notifications
    const notifications = await notifee.getDisplayedNotifications();
    // console.log('[clearAllCallNotifications] Raw notifications:', JSON.stringify(notifications, null, 2));

    if (!notifications.length) {
      // console.log('[clearAllCallNotifications] No notifications found');
      return;
    }

    // Filter call notifications
    const callNotifications = notifications.filter(notification => {
      try {
        // Skip if no notification data
        if (!notification?.notification?.data) {
          return false;
        }

        // Data is already an object - no need to parse
        const notificationData = notification.notification.data;
        // console.log('[clearAllCallNotifications] Notification data:', notificationData);

        // Check if this is a call notification (audio or video)
        const isCallNotification =
          notificationData?.call_type === 'audio_call' ||
          notificationData?.call_type === 'video_call' ||
          notification.notification.title === 'Incoming Call'; // Additional safety check

        // console.log(`[clearAllCallNotifications] Notification ${notification.notification.id} is call:`, isCallNotification);
        return isCallNotification;
      } catch (e) {
        // console.error('[clearAllCallNotifications] Error processing notification:', e);
        return false;
      }
    });

    console.log('[clearAllCallNotifications] Call notifications to remove:',
      callNotifications.map(n => n.notification.id));

    if (!callNotifications.length) {
      // console.log('[clearAllCallNotifications] No call notifications found to clear');
      return;
    }

    // Cancel all call notifications at once
    await Promise.all(
      callNotifications.map(notification =>
        notifee.cancelNotification(notification.notification.id)
      ));

    // console.log(`[clearAllCallNotifications] Cleared ${callNotifications.length} call notifications`);
  } catch (error) {
    // console.error('[clearAllCallNotifications] Error:', error);
  }
}


// NotificationService.js
// Display notification without auto-handling
// export const onDisplayNotification = async (message) => {
//   try {
//     console.log('message----onDisplayNotification--------------->>>>>>>>>>>>>>', message);
    
//     await setupNotificationChannels();

//     const channelId = await notifee.createChannel({
//       id: 'PathRover',
//       name: 'PathRover',
//       importance: AndroidImportance.HIGH,
//     });

//     await notifee.displayNotification({
//       id: message?.messageId,
//       title: message?.notification?.title,
//       body: message?.notification?.body,
//       data: message?.data,
//       android: {
//         channelId,
//         smallIcon: 'ic_launcher',
//         largeIcon: 'ic_launcher',
//         pressAction: {
//           id: 'default',
//           launchActivity: 'default',
//         },
//         importance: AndroidImportance.HIGH,
//         actions: [
//           {
//             title: 'Accept',
//             pressAction: {
//               id: 'accept',
//               launchActivity: 'default',
//             },
//           },
//           {
//             title: 'Reject',
//             pressAction: {
//               id: 'reject',
//               launchActivity: 'default',
//             },
//           },
//         ],
//       },
//       ios: {
//         categoryId: 'call_actions',
//         sound: 'default',
//         foregroundPresentationOptions: {
//           badge: true,
//           sound: true,
//           banner: true,
//           list: true,
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error displaying notification:', error);
//   }
// };

// Handle notification actions separately
export const setupActionHandlers = (navigation, updateCallStatus) => {
  // Foreground actions
  notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.PRESS:
        // Notification body pressed
        handleNotificationPress(detail.notification, navigation, updateCallStatus);
        break;
      case EventType.ACTION_PRESS:
        // Action button pressed
        handleNotificationAction(detail.pressAction.id, detail.notification, navigation, updateCallStatus);
        break;
    }
  });

  // Background actions
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) {
      handleNotificationAction(detail.pressAction.id, detail.notification, navigation, updateCallStatus);
    }
  });
};

const handleNotificationPress = (notification, navigation, updateCallStatus) => {
  // const { data } = notification;
  
  const data = JSON.parse(notification?.data?.data) ?? {} 

  console.log('Notification pressed:', data);

  // Only handle if there's no specific action (regular tap)
  // if (!data?.immediateAction) {
  //   onNotifyPress(notification, navigation);
  // }
  switch (data?.type) {
    case 'incoming_call':
      data?.user_call_id && updateCallStatus('not_attended', data?.user_call_id);
      clearAllCallNotifications()
      break;
    default:
      break;
  }
};

const handleNotificationAction = (actionId, notification, navigation, updateCallStatus) => {
  // console.log('Action pressed:', actionId);
  // console.log('Action notification:', notification);
  const data = JSON.parse(notification?.data?.data) ?? {} 

  // console.log('data------------------->>>>>>>>>>>>>>', data);
  

  switch (actionId) {
    case 'accept':
      data?.user_call_id && updateCallStatus('active', data?.user_call_id);
      onNotifyPress(notification, navigation);
      // console.log('in accept-------------------', data?.id);
      break;
    case 'reject':
      data?.user_call_id && updateCallStatus('declined', data?.user_call_id);
      // console.log('in reject-------------------', data?.id)
      break;
    default:
      break;
  }
};

// // Modified NotificationListener
// export const NotificationListener = (navigation) => {
//   // Setup action handlers first
//   setupActionHandlers(navigation);

//   // Firebase message handlers
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log('App opened from background:', remoteMessage);
//     onNotifyPress(remoteMessage, navigation);
//   });

//   messaging().onMessage(async remoteMessage => {
//     console.log('Foreground message received:', remoteMessage);
//     // Only display, don't auto-handle
//     onDisplayNotification(remoteMessage);
//   });

//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Background message received:', remoteMessage);
//     onDisplayNotification(remoteMessage);
//   });

//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log('App opened from quit state:', remoteMessage);
//         onNotifyPress(remoteMessage, navigation);
//       }
//     });
// };

// Keep your existing onNotifyPress
export const onNotifyPress = (notify, navigation) => {
  const { data } = notify;
  const content = JSON.parse(data?.data) || {};
  const { type, user_info, call_type, id, user_call_id } = content || {};
  const { channelName } = user_info || {};

  // console.log('Handling notification onNotifyPress:', user_call_id);
  
  // console.log('Handling notification data:', JSON.parse(data?.data));
  // console.log('Handling notification call_type:', call_type);

  switch (call_type) {
    case 'audio_call':
      navigation.navigate('VoiceCalling', {
        user: user_info,
        channel: channelName,
        id: user_call_id ,
      });

      // console.log('navifatoihih--------audio_call---------------------------');
      
      break;
    case 'video_call':
      navigation.navigate('VideoCalling', {
        user: user_info,
        channel: channelName,
        id: user_call_id,
      });

      // console.log('navifatoihih--------audio_call---------------------------');
      break;
    case 'missed_call':
      clearAllCallNotifications()
      break;
    case 'alerts':
      // navigation.navigate('AlertsScreen');
      break;
    case 'issue':
      // navigation.navigate('IssueScreen');
      break;
    default:
      // console.warn('Unhandled notification type:', type);
      break;
  }
};

// ----------------------------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// // Request notification permissions (required for Android 13+)
// const requestNotificationPermission = async () => {
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
// };

// // Verify notification permissions
// const verifyNotificationPermission = authStatus =>
//   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

// // Get FCM token
// export const getFCMToken = async () => {
//   try {
//     await messaging().setAutoInitEnabled(true);
//     const registered = await messaging().registerDeviceForRemoteMessages();
//     let token;

//     if (Platform.OS === 'android') {
//       token = await messaging().getToken();
//       console.log('token-------------->>>>>>>>>>>>>>', token);
//       return token;
//     } else {
//       const authStatus = await messaging().hasPermission();
//       if (verifyNotificationPermission(authStatus)) {
//         token = await messaging().getToken();
//       } else {
//         const status = await messaging().requestPermission();
//         if (verifyNotificationPermission(status)) {
//           token = await getFCMToken(); // Retry to get the token
//         }
//       }

//       console.log('token-------------->>>>>>>>>>>>>>', token);
//       return token;
//     }
//   } catch (error) {
//     console.log('================error====================');
//     console.log(error);
//     console.log('====================================');
//   }
// };

// // Display notification
// const onDisplayNotification = async message => {
//   try {
//     const channelId = await notifee.createChannel({
//       id: 'PathRover',
//       name: 'PathRover',
//       importance: AndroidImportance.HIGH,
//     });

//     await notifee.displayNotification({
//       id: message?.messageId,
//       title: message?.notification?.title,
//       body: message?.notification?.body,
//       data: message?.data,
//       android: {
//         channelId,
//         smallIcon: 'ic_launcher',
//         largeIcon: 'ic_launcher',
//         // pressAction: {
//         //   id: 'default',
//         // },
//         importance: AndroidImportance.HIGH,
//         actions: [
//           {
//             title: 'Accept',
//             pressAction: {
//               id: 'accept',
//             },
//           },
//           {
//             title: 'Reject',
//             pressAction: {
//               id: 'reject',
//             },
//           },
//         ],
//       },
//     });
//   } catch (error) {
//     console.error('Error displaying notification:', error);
//   }
// };

// // Notification listeners
// export const NotificationListener = listener => {
//   // Listener for when the app is in the background
//   messaging().onNotificationOpenedApp(async remoteMessage => {
//     console.log('App opened from background:', remoteMessage);
//     listener(remoteMessage, 1);
//   });

//   // Listener for when the app is in the foreground
//   messaging().onMessage(async remoteMessage => {
//     console.log('Foreground message received:', remoteMessage);
//     onDisplayNotification(remoteMessage);
//   });

//   // Listener for when the app is in a quit state
//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Background message received:', remoteMessage);
//     onDisplayNotification(remoteMessage);
//   });

//   // Listener for when the app is opened from a quit state
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log('App opened from quit state:', remoteMessage);
//         listener(remoteMessage, 1);
//       }
//     })
//     .catch(err => {
//       console.error('Error getting initial notification:', err);
//     });
// };

// // Initialize notification permissions
// requestNotificationPermission();
// /**
//  * Handle the click of a notification and navigate to the appropriate screen.
//  */
// export const onNotifyPress = (notify, navigation) => {
//   const {data} = notify;
//   const {type} = data || {};

//   console.log('====================================');
//   console.log('notify', notify);
//   console.log('data', data);
//   console.log('type', type);
//   console.log('====================================');

//   switch (type) {
//     case 'call':
//       navigation.navigate('CallScreen', {
//         callerId: data.callerId,
//         channelName: data.channelName,
//       });
//       break;
//     case 'alerts':
//       navigation.navigate('AlertsScreen');
//       break;
//     case 'issue':
//       navigation.navigate('IssueScreen');
//       break;
//     case 'incoming_call':
//       console.log('incoming_call------------------------pressed');
      
//       // navigation.navigate('IssueScreen');
//       break;
//     default:
//       console.warn('Unhandled notification type:', type);
//       break;
//   }
// };

// --------------------------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
