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
import Settings from '../screens/App/EndUser/Settings';
import OrderDetails from '../screens/App/Driver/OrderDetails';
import FilterScreen from '../screens/App/Driver/FltterScreen';
import ManageProfile from '../screens/App/Driver/ManageProfile';
import EditProfile from '../screens/App/Driver/EditProfile';
import SupportScreen from '../screens/App/Driver/SupportScreen';
import CustomizeRoute from '../screens/App/Manager/Vehicle/CustomizeReoute';
import Locations from '../screens/App/Manager/Vehicle/Locations';
import VehiclesOffer from '../screens/App/Manager/Vehicle/VehcilesOffer';
import Splash from '../screens/Splash';
import ManagerCompanyDetail from '../screens/App/DriverRegistrationFlow/ManagerCompanyDetail';
import TermsAndConditions from '../screens/App/TermsAndConditions';
import PrivacyPolicy from '../screens/App/PrivacyPolicy';
import PickUp from '../screens/App/Manager/Vehicle/Locations/PickUp';
import Destination from '../screens/App/Manager/Vehicle/Locations/Destination';
import Notification from '../screens/App/Notification';
import SafetyMenu from '../screens/App/Driver/SafetyMenu';
import SafetyTips from '../screens/App/Driver/SafetyTips';
import SearchLatLng from '../screens/App/Manager/SearchLatLng';
import Faqs from '../screens/App/FAQs';
import SavedLibrary from '../screens/App/Manager/SavedLibrary';
import OrderPickup from '../screens/App/Driver/OrderPickup';
import RideArriving from '../screens/App/Manager/RideArriving';
import DocumentCreationSuccess from '../screens/Auth/DriverDocumentSuccess';
import PaymentMethods from '../screens/App/Manager/PaymentManager';
import AddCard from '../screens/App/Manager/PaymentManager/AddCard';
import PaymentHistory from '../screens/App/Manager/PaymentHistory';
import WithdrawAmount from '../screens/App/Driver/DriverWallet/Withdraw';
import AiChat from '../screens/App/EndUser/AiChat';
import AddNumber from '../screens/App/EndUser/Chat/AddNumber/Index';
import VerifyNumber from '../screens/App/EndUser/Chat/VerifyNumber';
import ChatUsers from '../screens/App/EndUser/Chat/ChatUsers';
import MemberList from '../screens/App/EndUser/Chat/MembersList';
import CreateGroup from '../screens/App/EndUser/Chat/CreateGroup';
import ChatDetail from '../screens/App/EndUser/Chat/ChatDetail';
import GroupInfoDetail from '../screens/App/EndUser/Chat/GroupInfoDetails';
import AuthStack from './stacks/authStack';
import SearchWellPath from '../screens/App/EndUser/SearchWellPath';
import CreateRouteSearch from '../screens/App/EndUser/CreateRouteSearch';
import CreateRouteEndUser from '../screens/App/EndUser/CreateRouteEndUser';
import RouteToWell from '../screens/App/EndUser/RouteToWell';
import EndUserSavedLibrary from '../screens/App/EndUser/EndUserSavedLibrary';
import EndUserSavedLibraryType from '../screens/App/EndUser/EndUserSavedLibraryType';
import ViewSaveRoutes from '../screens/App/EndUser/ViewSaveRoutes';
import RecordRoute from '../screens/App/EndUser/RecordRoute';
import GroupChatDetail from '../screens/App/EndUser/Chat/GroupChatDetail';
import DownloadOfflineMap from '../screens/App/EndUser/DownloadOflineMap';
import Subscription from '../screens/App/EndUser/Subscription';
import SearchTrailLatLng from '../screens/App/EndUser/HikingScreen/SearchTrailLatLng';
import SetTrailStartpoint from '../screens/App/EndUser/HikingScreen/SetTrailStartpoint';
import ChooseOnMap from '../screens/App/EndUser/HikingScreen/ChooseOnMap';

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
        <Stack.Screen name={Routes.Faqs} component={Faqs} />
        <Stack.Screen name={Routes.SavedLibrary} component={SavedLibrary} />
        <Stack.Screen name={Routes.OrderPickup} component={OrderPickup} />
        <Stack.Screen name={Routes.RideArriving} component={RideArriving} />
        <Stack.Screen
          name={Routes.DocumentCreationSuccess}
          component={DocumentCreationSuccess}
        />
        <Stack.Screen name={Routes.PaymentManager} component={PaymentMethods} />
        <Stack.Screen
          name={Routes.PaymentManagerHistory}
          component={PaymentHistory}
        />
        <Stack.Screen name={Routes.AddCard} component={AddCard} />
        <Stack.Screen name={Routes.WithdrawAmount} component={WithdrawAmount} />
        <Stack.Screen name={Routes.AiChat} component={AiChat} />
        <Stack.Screen name={Routes.AddNumber} component={AddNumber} />
        <Stack.Screen name={Routes.VerifyNumber} component={VerifyNumber} />
        <Stack.Screen name={Routes.ChatUsers} component={ChatUsers} />
        <Stack.Screen name={Routes.MemberList} component={MemberList} />
        <Stack.Screen name={Routes.CreateGroup} component={CreateGroup} />
        <Stack.Screen name={Routes.ChatDetail} component={ChatDetail} />
        <Stack.Screen
          name={Routes.GroupChatDetail}
          component={GroupChatDetail}
        />
        <Stack.Screen name={Routes.GroupInfo} component={GroupInfoDetail} />
        <Stack.Screen name={'AuthStack'} component={AuthStack} />
        <Stack.Screen name={Routes.SearchWellPath} component={SearchWellPath} />
        <Stack.Screen
          name={Routes.CreateRouteSearch}
          component={CreateRouteSearch}
        />
        <Stack.Screen
          name={Routes.CreateRouteEndUser}
          component={CreateRouteEndUser}
        />
        <Stack.Screen name={Routes.RouteToWell} component={RouteToWell} />
        <Stack.Screen
          name={Routes.EndUserSavedLibrary}
          component={EndUserSavedLibrary}
        />

        <Stack.Screen
          name={Routes.EndUserSavedLibraryType}
          component={EndUserSavedLibraryType}
        />
        <Stack.Screen name={Routes.RecordRoute} component={RecordRoute} />
        <Stack.Screen name={Routes.ViewSaveRoutes} component={ViewSaveRoutes} />
        <Stack.Screen
          name={'DownloadOfflineMap'}
          component={DownloadOfflineMap}
        />
        <Stack.Screen
          name={Routes.Subscription}
          component={Subscription}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name={Routes.SearchTrailLatLng}
          component={SearchTrailLatLng}
        />
        <Stack.Screen
          name={Routes.SetTrailStartpoint}
          component={SetTrailStartpoint}
        />
        <Stack.Screen
          name={Routes.ChooseOnMap}
          component={ChooseOnMap}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
