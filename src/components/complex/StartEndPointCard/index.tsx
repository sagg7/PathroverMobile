import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {appIcons} from '../../../assets/icons';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

interface StartEndPointCardProp {
  onPressSearch: () => void;
  onPressFilter: any;
  onPressMenu: any;
}

const StartEndPointCard = ({}: StartEndPointCardProp) => {
  return (
    <View style={styles.mainView}>
      <Image
        source={appIcons.fromAnTo}
        style={styles.fromAndTo}
        resizeMode="contain"
      />

      <View>
        <View style={styles.innerContainer}>
          <Text style={styles.textStyles}>Starting Point</Text>
          {svgIcon.MenuDot}
        </View>
        <View style={styles.horizontalStyles} />
        <View style={styles.innerContainer}>
          <Text style={styles.textStyles}>Ending Point</Text>
          {svgIcon.ArrowRepeat}
        </View>
      </View>
    </View>
  );
};

export {StartEndPointCard};
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: PFColors.Standard.White,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: WP('90'),
    alignSelf: 'center',
    position: 'absolute',
    top: scale(60),
    zIndex: 1,
  },
  innerContainer: {
    backgroundColor: PFColors.Standard.White,
    width: WP('75'),
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 5,
  },
  horizontalStyles: {
    height: 1,
    backgroundColor: PFColors.Gray.borderGray,
    width: WP('75'),
  },
  textStyles: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  fromAndTo: {
    height: scale(60),
    width: scale(30),
  },
});
