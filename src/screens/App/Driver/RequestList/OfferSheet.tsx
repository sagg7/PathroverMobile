import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import React from 'react';
import {AppButton, AppInput, FromAndToCard} from '../../../../components';
import styles from './styles';
import {appIcons} from '../../../../shared/exporter';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';

interface OfferSheetProp {
  onPressCancel: () => void;
  handleSendOfferBtn: () => void;
}
interface BubleViewProp {
  icon?: any;
  iconStyle?: any;
  title: string;
}

const OfferSheet = ({onPressCancel, handleSendOfferBtn}: OfferSheetProp) => {
  const BubleView = ({icon, iconStyle, title}: BubleViewProp) => {
    return (
      <TouchableOpacity disabled>
        <View style={styles.bubleViewContainer}>
          <View style={styles.expandingView}>
            {icon && (
              <Image
                source={icon}
                style={[styles.bubleIcon, iconStyle]}
                resizeMode="contain"
              />
            )}
            <Text style={styles.text}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.sheetContainer}>
      <KeyboardAwareScrollView>
        <View style={styles.sheetHeader}>
          <BubleView icon={appIcons.curvedarrow} title={'3 Mins'} />
          <BubleView
            title={'1.7 Km Away'}
            icon={appIcons.clock}
            iconStyle={styles.bubleIconClockStyles}
          />
          <TouchableOpacity
            onPress={onPressCancel}
            style={styles.crossIconStyles}>
            {/* {svgIcon.CrossCirlce} */}
            <Image source={appIcons.crossIcon} style={styles.crossIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalBar} />
        <FromAndToCard />
        <View style={styles.horizontalBar} />
        <Text style={styles.totalRideHeading}>Offer Your total ride</Text>
        <View style={styles.offerFaresContainer}>
          <BubleView title={'$ 370'} />
          <BubleView title={'$ 450'} />
          <BubleView title={'$ 120'} />
          <BubleView title={'$ 420'} />
        </View>
        {/* <AppInput
          placeholder="Your Offer Price"
          keyboardType={'numeric'}
          maxLength={4}
        /> */}
        <View style={[styles.inputContainerView]}>
          <TextInput
            keyboardType="decimal-pad"
            placeholder="Your Offer Price"
            style={[styles.inputContainerStyle(true)]}
            maxLength={4}
          />
        </View>
        <AppButton
          title="Send my Offer"
          buttonStyle={styles.offerBtnStyle}
          handleClick={handleSendOfferBtn}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default OfferSheet;
