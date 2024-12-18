import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {appIcons} from '../../../../assets/icons';
import {svgIcon} from '../../../../assets/svg';
import {AppLoader, MainWrapper, SwitchRoleSheet} from '../../../../components';
import {
  APP_ROLE,
  UNEXPECTED_ERROR,
  USER_PROFILE,
  showAlert,
} from '../../../../shared/utils/constant';
import {useSwitchRoleMutation} from '../../../../redux/auth/authApiSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Routes} from '../../../../shared/exporter';
import {setLoginUser} from '../../../../redux/auth/authSlice';
import {setUserRole} from '../../../../redux/auth/appRoleSlice';

const Settings = ({navigation}) => {
  const [showSwitchRoleSheet, setshowSwitchRoleSheet] = useState(false);
  const [profiles, setProfiles] = useState(USER_PROFILE);
  const [switchProfile, {isLoading}] = useSwitchRoleMutation();
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const dispatch = useDispatch();
  const userRole = useSelector(state => state?.appRole.userRole);

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
    switch (v.role) {
      case APP_ROLE.DRIVER:
        loginUser?.is_driver
          ? navigation.navigate('AppStack')
          : navigation.navigate(Routes.DriverProfile);
        break;
      case APP_ROLE.MANAGER:
        loginUser?.is_manager
          ? navigation.navigate('AppStack')
          : navigation.navigate(Routes.DriverProfile);
      default:
        break;
    }
    setshowSwitchRoleSheet(false);
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

  const SettingOption = ({onPressCard}) => {
    return (
      <TouchableOpacity onPress={onPressCard}>
        <View style={styles.listConatainer}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={appIcons.switchAccount}
              style={styles.setingOptionIcon}
            />
            <Text style={styles.listOptionText}>Switch Account</Text>
          </View>
          {svgIcon.RightChevron}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper>
      <SettingOption onPressCard={() => setshowSwitchRoleSheet(true)} />

      <SwitchRoleSheet
        modalVisible={showSwitchRoleSheet}
        data={profiles}
        onPressCard={handleCard}
      />
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default Settings;
