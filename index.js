/**
 * @format
 */

import {AppRegistry, Settings, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

Settings.set({fontScaling: false});

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => App);
