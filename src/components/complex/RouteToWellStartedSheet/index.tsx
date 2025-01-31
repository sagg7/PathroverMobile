import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

interface RouteToWellStartedSheetProps {
  setModalVisible?: () => void;
  selectedPin: any;
  entranceName: string;
  routeInfo: any;
  routeName: string;
}

const RouteToWellStartedSheet = ({
  setModalVisible,
  routeInfo,
  routeName,
}: RouteToWellStartedSheetProps) => {
  return (
    <View style={[styles.modalContainer, styles.innerContainer]}>
      <View style={styles.titleView}>
        <TouchableOpacity onPress={setModalVisible}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>{routeName ? routeName : ''}</Text>
      <View style={styles.routeInfoView}>
        <Text>
          {svgIcon.MapWindow}
          <View style={{width: 5}} />

          <Text style={styles.routeInfoText}>
            {routeInfo?.distance ? routeInfo?.distance : 'calculating'}
          </Text>
        </Text>
        <View style={{marginLeft: 40}} />
        <Text>
          {svgIcon.BlueClock}
          <View style={{width: 5}} />
          <Text style={styles.routeInfoText}>
            {routeInfo?.duration ? routeInfo?.duration : 'calculating'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export {RouteToWellStartedSheet};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
  },
  innerContainer: {
    paddingHorizontal: WP('6s'),
  },
  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    alignSelf: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: WP('3'),
    width: WP('92'),
    alignSelf: 'center',
  },

  titleView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
  },
  routeInfoText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
  },
  routeInfoView: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignSelf: 'center',
  },
  shareIcon: {
    position: 'absolute',
    right: 2,
    top: 5,
  },
});
