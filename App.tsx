import React from 'react';
import AppNavigation from './src/navigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import MapboxGL from '@rnmapbox/maps';

const App = () => {
  MapboxGL.setAccessToken('pk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNseXowMmk5bDJoejEyaXB5Nm43ZzN4OTMifQ.uiO6BX51I9umZzjAK2Ox6g');
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
};

export default App;
