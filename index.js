/**
 * @format
 */

import {AppRegistry, Settings, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Define the background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background:', remoteMessage);

  // Display a notification using notifee
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: {
      channelId: 'PathRover',
      smallIcon: 'ic_launcher',
      vibrationPattern: [300, 200],
    },
  });
});

// Handle background events (e.g., notification actions)
notifee.onBackgroundEvent(async ({type, detail}) => {
  const {pressAction, notification} = detail;

  if (type === 'press' && pressAction?.id === 'accept') {
    console.log('User pressed "Accept" in background');
    // Handle "Accept" action (e.g., navigate to CallScreen)
  } else if (type === 'press' && pressAction?.id === 'decline') {
    console.log('User pressed "Decline" in background');
    // Handle "Decline" action (e.g., end the call)
  }
});

Settings.set({fontScaling: false});

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => App);
