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
        categoryId: notificationType === 'Missed Call' ? 'missed_call' : 'call_actions',
        // categoryId: 'call_actions',
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
