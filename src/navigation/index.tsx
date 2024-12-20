import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Routes} from '../shared/exporter';
import DriverProfile from '../screens/App/DriverRegistrationFlow/DriverProfile';
import UploadIdentity from '../screens/App/DriverRegistrationFlow/UploadIdentity';
import UploadLicense from '../screens/App/DriverRegistrationFlow/UploadLicense';
import UploadMedicalDocument from '../screens/App/DriverRegistrationFlow/UploadMedicalDocument';
import VehicleDetail from '../screens/App/DriverRegistrationFlow/VehicleDetail';
import VehicleRegistration from '../screens/App/DriverRegistrationFlow/VehicleRegistration';
import CompanyDetail from '../screens/App/DriverRegistrationFlow/CompanyDetail';
import {AppStack} from './BottomTabs';
import RequestList from '../screens/App/Driver/RequestList';
import MapScreen from '../screens/App/Driver/MapScreen';
import Home from '../screens/App/EndUser/Home';
import Settings from '../screens/App/EndUser/Settings';
import OrderDetails from '../screens/App/Driver/OrderDetails';
import FilterScreen from '../screens/App/Driver/FltterScreen';
import ManageProfile from '../screens/App/Driver/ManageProfile';
import EditProfile from '../screens/App/Driver/EditProfile';
import SupportScreen from '../screens/App/Driver/SupportScreen';
import AuthStack from './stacks/authStack';
import SelectRoute from '../screens/App/Manager/Vehicle/SelectRoute';
import CustomizeRoute from '../screens/App/Manager/Vehicle/CustomizeReoute';
import Locations from '../screens/App/Manager/Vehicle/Locations';
import VehiclesOffer from '../screens/App/Manager/Vehicle/VehcilesOffer';
import Splash from '../screens/Splash';
// import ManagerProfile from '../screens/App/ManagerRegistrationFlow/ManagerProfile';
import ManagerCompanyDetail from '../screens/App/DriverRegistrationFlow/ManagerCompanyDetail';
import TermsAndConditions from '../screens/App/TermsAndConditions';
import PrivacyPolicy from '../screens/App/PrivacyPolicy';
import PickUp from '../screens/App/Manager/Vehicle/Locations/PickUp';
import Destination from '../screens/App/Manager/Vehicle/Locations/Destination';
import Notification from '../screens/App/Notification';
import SafetyMenu from '../screens/App/Driver/SafetyMenu';
import SafetyTips from '../screens/App/Driver/SafetyTips';
import SearchLatLng from '../screens/App/Manager/SearchLatLng';

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Routes.Splash}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name={Routes.Splash} component={Splash} />
        <Stack.Screen name="AppStack" component={AppStack} />
        <Stack.Screen name={Routes.DriverProfile} component={DriverProfile} />
        <Stack.Screen name={Routes.CompanyDetail} component={CompanyDetail} />
        <Stack.Screen name={Routes.VehicleDetail} component={VehicleDetail} />
        <Stack.Screen
          name={Routes.VehicleRegistration}
          component={VehicleRegistration}
        />
        <Stack.Screen name={'Settings'} component={Settings} />
        <Stack.Screen
          name={Routes.UploadMedicalDocument}
          component={UploadMedicalDocument}
        />
        <Stack.Screen name={Routes.UploadLicense} component={UploadLicense} />
        <Stack.Screen name={Routes.UploadIdentity} component={UploadIdentity} />
        <Stack.Screen name={Routes.RequestList} component={RequestList} />
        <Stack.Screen name={'MapScreen'} component={MapScreen} />
        <Stack.Screen name={Routes.OrderDetails} component={OrderDetails} />
        <Stack.Screen name={Routes.FilterScreen} component={FilterScreen} />
        <Stack.Screen name={Routes.ManageProfile} component={ManageProfile} />
        <Stack.Screen name={Routes.EditProfile} component={EditProfile} />
        <Stack.Screen name={Routes.SupportScreen} component={SupportScreen} />
        <Stack.Screen name={Routes.CustomizeRoute} component={CustomizeRoute} />
        <Stack.Screen name={Routes.Locations} component={Locations} />
        <Stack.Screen name={Routes.VehiclesOffer} component={VehiclesOffer} />
        <Stack.Screen
          name={Routes.ManagerCompanyDetail}
          component={ManagerCompanyDetail}
        />
        <Stack.Screen name={Routes.PrivacyPolicy} component={PrivacyPolicy} />
        <Stack.Screen
          name={Routes.TermsAndConditions}
          component={TermsAndConditions}
        />
        <Stack.Screen name={Routes.PickUp} component={PickUp} />
        <Stack.Screen name={Routes.Destination} component={Destination} />
        <Stack.Screen name={Routes.Notification} component={Notification} />
        <Stack.Screen name={Routes.SafetyMenu} component={SafetyMenu} />
        <Stack.Screen name={Routes.SafetyTips} component={SafetyTips} />
        <Stack.Screen name={Routes.SearchLatLng} component={SearchLatLng} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
