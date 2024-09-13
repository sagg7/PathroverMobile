import { View, Text, Image, TouchableOpacity, } from 'react-native';
import React, { useRef, useState } from 'react';
import { AppButton, AppInput, FromAndToCard } from '../../../../components';
import styles from './styles';
import { HP, PFColors, WP, appIcons, isIOS } from '../../../../shared/exporter';
import { svgIcon } from '../../../../assets/svg';

const OfferSheet = ({ onPressCancel }) => {

    const BubleView = ({ icon, iconStyle, title }) => {
        return (
            <TouchableOpacity disabled>
                <View style={styles.bubleViewContainer}>
                    <View style={styles.expandingView}>
                        {icon &&
                            <Image source={icon} style={[styles.bubleIcon, iconStyle]} resizeMode='contain' />
                        }
                        <Text style={styles.text}>
                            {title}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
                <BubleView icon={appIcons.curvedarrow} title={"3 Mins"} />
                <BubleView title={"1.7 Km Away"} icon={appIcons.clock} iconStyle={styles.bubleIconClockStyles} />
                <TouchableOpacity
                    onPress={onPressCancel}
                    style={styles.crossIconStyles}
                >
                    {/* {svgIcon.CrossCirlce} */}
                    <Image source={appIcons.crossIcon} style={styles.crossIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.horizontalBar} />
            <FromAndToCard />
            <View style={styles.horizontalBar} />
            <Text style={styles.totalRideHeading}>Offer Your total ride</Text>
            <View style={styles.offerFaresContainer}>
                <BubleView title={"$ 370"} />
                <BubleView title={"$ 450"} />
                <BubleView title={"$ 120"} />
                <BubleView title={"$ 420"} />
            </View>
            <AppInput placeholder='Your Offer Price' value='' />
            <AppButton title='Send my Offer' buttonStyle={styles.offerBtnStyle} />
        </View>
    );
};

export default OfferSheet;
