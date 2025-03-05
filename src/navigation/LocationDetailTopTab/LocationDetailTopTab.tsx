import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import LocationDetailTabBar from '../../components/complex/LocationDetailTabBar';
import Overview from '../../screens/App/EndUser/LocationDetail/Overview';
import Photos from '../../screens/App/EndUser/LocationDetail/Photos';
import Reviews from '../../screens/App/EndUser/LocationDetail/Reviews';

const Tab = createMaterialTopTabNavigator();

const LocationDetailTab = () => {
  return (
    <Tab.Navigator tabBar={props => <LocationDetailTabBar {...props} />}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Overview',
        }}
        name="Overview"
        component={Overview}
      />
      <Tab.Screen
        options={{tabBarLabel: 'Photos'}}
        name="Photos"
        component={Photos}
      />
      <Tab.Screen
        options={{tabBarLabel: 'Reviews'}}
        name="Reviews"
        component={Reviews}
      />
    </Tab.Navigator>
  );
};

export default LocationDetailTab;
