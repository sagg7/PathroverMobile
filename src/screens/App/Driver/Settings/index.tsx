import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import React, {useRef, useState} from 'react';
import styles from './styles';
import {appIcons} from '../../../../assets/icons';
import {svgIcon} from '../../../../assets/svg';
import {AppLoader, MainWrapper, SwitchRoleSheet} from '../../../../components';
import {
  APP_ROLE,
  DriverProfileMenu,
  UNEXPECTED_ERROR,
  USER_PROFILE,
  showAlert,
} from '../../../../shared/utils/constant';
import {useSwitchRoleMutation} from '../../../../redux/auth/authApiSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Routes} from '../../../../shared/exporter';
import {setAccessToken, setLoginUser} from '../../../../redux/auth/authSlice';
import {RatingStars} from '../../../../components';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {setUserRole} from '../../../../redux/auth/appRoleSlice';
import ConsentSheet from '../../../../components/complex/ConsentSheet';
import {useDeleteUserAccountMutation} from '../../../../redux/manager/managerApiSlice';
import {
  setManagerRoute,
  setManagerRouteEmpty,
} from '../../../../redux/manager/managerSlice';

const Settings = ({navigation}: any) => {
  const consentSheetRef = useRef<any>(null);
  const [showSwitchRoleSheet, setshowSwitchRoleSheet] = useState(false);
  const [sheetToOpen, setSheetToOpen] = useState<string | null>(null);
  const [profiles, setProfiles] = useState(USER_PROFILE);
  const [switchProfile, {isLoading}] = useSwitchRoleMutation();
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const dispatch = useDispatch();
  const userRole = useSelector(state => state?.appRole.userRole);
  const [deleteUserAccount, {isLoading: isLoadingDeleteAccounnt}] =
    useDeleteUserAccountMutation();

  const handleCard = (v: any) => {
    const arr = profiles?.map(i => {
      if (v.id === i.id) {
        return {
          ...i,
          isSelected: true,
        };
      } else {
        return {
          ...i,
          isSelected: false,
        };
      }
    });
    setProfiles(arr);
    if (userRole !== v.role) {
      dispatch(setUserRole(v.role));
    }
    setTimeout(() => {
      switch (v.role) {
        case APP_ROLE.DRIVER:
          loginUser?.is_driver
            ? navigation.replace('AppStack')
            : navigation.navigate(Routes.DriverProfile);
          break;
        case APP_ROLE.MANAGER:
          loginUser?.is_manager
            ? navigation.replace('AppStack')
            : navigation.navigate(Routes.DriverProfile);
        default:
          break;
      }
    }, 5);

    setshowSwitchRoleSheet(false);
  };

  const handleLogout = async () => {
    dispatch(setAccessToken(null));
    dispatch(setLoginUser(null));
    dispatch(setUserRole(APP_ROLE.END_USER));
    dispatch(setManagerRouteEmpty({}));

    await GoogleSignin.signOut();
  };

  const settingOption = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.listConatainer}
        onPress={() => handleNavigation(item.id)}
        key={item.id}>
        <View style={styles.innerContainer}>
          <View style={styles.iconContainer}>
            <Image source={item?.icon} style={styles.setingOptionIcon} />
          </View>
          <Text style={styles.listOptionText}>{item?.title}</Text>
        </View>
        {svgIcon.RightChevron}
      </TouchableOpacity>
    );
  };

  const handleNavigation = (itemId: number) => {
    let screenName = '';
    switch (itemId) {
      case 0:
        screenName = '';
        break;
      case 1:
        screenName = Routes.ManageProfile;
        break;
      case 2:
        screenName = Routes.Notification;
        break;
      case 3:
        Linking.openURL('https://staging.pathfinder-app.com/faq_list');
        break;
      case 4:
        screenName = Routes.SupportScreen;
        break;
      case 5:
        screenName = Routes.SafetyMenu;
        break;
      case 6:
        screenName = Routes.TermsAndConditions;
        break;
      case 7:
        screenName = Routes.PrivacyPolicy;
        break;
      case 8:
        {
          consentSheetRef?.current.open(), setSheetToOpen('logout');
        }
        break;
      case 9:
        {
          consentSheetRef?.current.open(), setSheetToOpen('delete');
        }
        break;
      case 10:
        setshowSwitchRoleSheet(true);
        break;
    }
    if (screenName) {
      navigation.navigate(screenName);
    }
  };

  const handelCancel = () => {
    consentSheetRef?.current.close();
  };
  const handleSuccess = async () => {
    if (sheetToOpen === 'logout') {
      consentSheetRef?.current.close();
      handleLogout();
    } else {
    }
    let res = await deleteUserAccount(undefined);
    consentSheetRef?.current.close();
    handleLogout();
  };

  return (
    <MainWrapper>
      <View style={styles.userProfileContainer}>
        <Image source={appIcons.userPlaceholder} style={styles.userPicture} />
        <View style={styles.userProfileInner}>
          <Text style={styles.profileTextStyles}>My Profile</Text>
          <RatingStars rating={4} />
        </View>
      </View>
      <FlatList
        data={DriverProfileMenu}
        renderItem={settingOption}
        keyExtractor={(index, item) => item?.toString()}
        contentContainerStyle={styles.contentContainerStyle}
      />
      {/* <SettingOption onPressCard={() => setshowSwitchRoleSheet(true)} /> */}

      <SwitchRoleSheet
        modalVisible={showSwitchRoleSheet}
        data={profiles}
        onPressCard={handleCard}
        setModalVisible={() => setshowSwitchRoleSheet(false)}
      />
      <ConsentSheet
        ref={consentSheetRef}
        message={
          sheetToOpen === 'logout'
            ? 'Do you want to Logout?'
            : 'Do you want to delete your account?'
        }
        cancelBtnText="Cancel"
        successBtnText={sheetToOpen === 'logout' ? 'Logout' : 'Delete'}
        onPressCancel={handelCancel}
        onPressSuccess={handleSuccess}
      />
      {isLoading || (isLoadingDeleteAccounnt && <AppLoader />)}
    </MainWrapper>
  );
};

export default Settings;
