import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import { appIcons } from '../../../../assets/icons';
import { svgIcon } from '../../../../assets/svg';
import { AppLoader, MainWrapper, SwitchRoleSheet } from '../../../../components';
import { UNEXPECTED_ERROR, USER_PROFILE, showAlert } from '../../../../shared/utils/constant';
import { useSwitchRoleMutation } from '../../../../redux/auth/authApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Routes } from '../../../../shared/exporter';
import { setLoginUser } from '../../../../redux/auth/authSlice';

const Settings = ({ navigation }) => {
    const [showSwitchRoleSheet, setshowSwitchRoleSheet] = useState(false);
    const [profiles, setProfiles] = useState(USER_PROFILE);
    const [switchProfile, { isLoading }] = useSwitchRoleMutation();
    const loginUser = useSelector(state => state?.auth?.loginUser);
    const dispatch = useDispatch()

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
            setshowSwitchRoleSheet(false)

        }
    };

    const switchRoleApi = async (role: string) => {

        const resp = await switchProfile(role);
        if (resp?.data) {
            if (resp?.data?.user?.is_driver) {
                navigation.navigate('AppStack');
            }
            dispatch(setLoginUser(resp?.data?.user))

        } else {
            showAlert("Error", UNEXPECTED_ERROR)
        }
        setshowSwitchRoleSheet(false)
    };

    const SettingOption = ({ onPressCard }) => {
        return (
            <TouchableOpacity onPress={onPressCard}>
                <View style={styles.listConatainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={appIcons.switchAccount}
                            style={styles.setingOptionIcon}
                        />
                        <Text style={styles.listOptionText}>Swich Account</Text>
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
