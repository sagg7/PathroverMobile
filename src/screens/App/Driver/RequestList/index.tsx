import { View, Text, Image, TouchableOpacity, Keyboard, BackHandler, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ItemInfoCard, MainWrapper, OfferRequestCard, SendOfferModal } from '../../../../components';
import styles from './styles';
import { HP, PFColors, Routes, WP, appIcons, useKeyboardListener } from '../../../../shared/exporter';
import SwitchToggle from "react-native-switch-toggle";
import RBSheet from 'react-native-raw-bottom-sheet';
import OfferSheet from './OfferSheet';
useKeyboardListener


const RequestList = ({ navigation }) => {
    const [on, seton] = useState(false)
    const isKeyboardOpen = useKeyboardListener()
    const keyboardDidShowListener = useRef(null);
    const keyboardDidHideListener = useRef(null);


    useEffect(() => {
        const handleBackButtonPress = () => {
            if (Keyboard.isVisible()) {
                Keyboard.dismiss();
                return true;
            }
            return false;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

        keyboardDidShowListener.current = Keyboard.addListener('keyboardDidShow', () => {

        });

        keyboardDidHideListener.current = Keyboard.addListener('keyboardDidHide', () => {
            sheetRef.current.close()
        });

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
            keyboardDidShowListener.current.remove();
            keyboardDidHideListener.current.remove();
        };
    }, []);




    const sheetRef = useRef()
    return (
        <MainWrapper>
            <View style={styles.container}>
                <TouchableOpacity style={styles.bellContainer} onPress={() => navigation.navigate('MapScreen')}>
                    <Image source={appIcons.bellIcon} style={styles.bellIcon} />
                </TouchableOpacity>

                <View style={styles.centerSwitchWrapper}>
                    <SwitchToggle
                        switchOn={on}
                        onPress={() => seton(!on)}
                        circleColorOff={PFColors.Gray.AshGray}
                        circleColorOn={PFColors.Green.LeafGreen}
                        backgroundColorOn={PFColors.Green.MintLight}
                        backgroundColorOff={PFColors.Gray.FrostedGray}
                        circleStyle={styles.circleStyle}
                        containerStyle={styles.toggleContainer}
                    />
                    <Text style={styles.headerText}>{on ? "Available" : "Unavailable"} </Text>
                </View>
            </View>

            <RBSheet
                ref={sheetRef}
                customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                }}
                customStyles={{
                    container: {
                        height: HP('60'),
                        borderTopLeftRadius: WP('5'),
                        borderTopRightRadius: WP('5'),
                    },
                }}>
                <OfferSheet onPressCancel={() => sheetRef.current.close()} />
            </RBSheet>

            {on ?
                <OfferRequestCard onPressAccept={() => sheetRef.current.open()}
                /> :
                <>
                    <View style={styles.onOffContainer}>
                        <Text style={styles.turnOnOfText}>{"Please Turn on Your\nAvailable Status"}</Text>

                    </View>
                </>
            }

            <SendOfferModal isModalVisible={false} />

        </MainWrapper>
    );
};

export default RequestList;
