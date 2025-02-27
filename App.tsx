import React, {useEffect} from 'react';
import AppNavigation from './src/navigation';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import MapboxGL from '@rnmapbox/maps';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {firebase} from '@react-native-firebase/app';
import { withIAPContext } from 'react-native-iap';

const App = () => {
  MapboxGL.setAccessToken(
    'pk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNseXowMmk5bDJoejEyaXB5Nm43ZzN4OTMifQ.uiO6BX51I9umZzjAK2Ox6g',
  );

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp();
    }
    GoogleSignin.configure({
      webClientId:
        '259356526485-g0llcedebdppjctams5kt994ghmd9tlu.apps.googleusercontent.com',
      iosClientId:
        '259356526485-7j0t7i4eakbqd9mb4nj5mjpj01j1r4kr.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
};

export default withIAPContext(App);
