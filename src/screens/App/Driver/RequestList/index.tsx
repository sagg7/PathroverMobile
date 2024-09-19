import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MainWrapper, OfferRequestCard, OfferSheetModal, ReviewsListSheet, SendOfferModal } from '../../../../components';
import styles from './styles';
import { PFColors, appIcons } from '../../../../shared/exporter';
import SwitchToggle from "react-native-switch-toggle";

const RequestList = ({ navigation }) => {
    const [on, seton] = useState(false)
    const [showReviewSheet, setShowReviewSheet] = useState(false)
    const [offerSheetshow, setofferSheetshow] = useState(false)

    return (
        <MainWrapper>
            <View style={styles.container}>
                <TouchableOpacity style={styles.bellContainer} onPress={() => setShowReviewSheet(true)}>
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

            <OfferSheetModal modalVisible={offerSheetshow} onPressCancel={() => setofferSheetshow(false)} />


            {on ?
                <OfferRequestCard onPressAccept={() => setofferSheetshow(true)}
                /> :
                <>
                    <View style={styles.onOffContainer}>
                        <Text style={styles.turnOnOfText}>{"Please Turn on Your\nAvailable Status"}</Text>
                    </View>
                </>
            }

            <SendOfferModal isModalVisible={false} />
            <ReviewsListSheet modalVisible={showReviewSheet} onPressCross={() => setShowReviewSheet(false)} onPressDone={() => setShowReviewSheet(false)} />

        </MainWrapper>
    );
};

export default RequestList;
