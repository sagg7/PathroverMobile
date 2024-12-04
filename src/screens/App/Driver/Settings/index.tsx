import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {appIcons} from '../../../../assets/icons';
import {svgIcon} from '../../../../assets/svg';
import {AppLoader, MainWrapper, SwitchRoleSheet} from '../../../../components';
import {
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

const Settings = ({navigation}) => {
  const [showSwitchRoleSheet, setshowSwitchRoleSheet] = useState(false);
  const [profiles, setProfiles] = useState(USER_PROFILE);
  const [switchProfile, {isLoading}] = useSwitchRoleMutation();
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const dispatch = useDispatch();

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
    if (loginUser?.is_driver) {
      switchRoleApi(v.role);
    } else {
      navigation.navigate(Routes.DriverProfile);
      setshowSwitchRoleSheet(false);
    }
  };

  const switchRoleApi = async (role: string) => {
    const resp = await switchProfile(role);
    if (resp?.data) {
      if (resp?.data?.user?.is_driver) {
        navigation.navigate('AppStack');
      }
      dispatch(setLoginUser(resp?.data?.user));
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
    setshowSwitchRoleSheet(false);
  };
  const handleLogout = async () => {
    dispatch(setAccessToken(null));
    dispatch(setLoginUser(null));
    await GoogleSignin.signOut();
    navigation.replace('AuthStack');
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
      case 4:
        screenName = Routes.SupportScreen;
        break;
      case 8:
        handleLogout();
        break;
      case 10:
        screenName = '';
        break;
    }
    if (screenName) {
      navigation.navigate(screenName);
    }
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
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default Settings;
