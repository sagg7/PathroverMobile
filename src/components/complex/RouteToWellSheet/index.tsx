import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

interface RouteToWellSheetProps {
  setModalVisible?: () => void;
  onPressDirection: () => void;
  onPressStart: () => void;
  onPressPin: () => void;
  actionBtn: any;
  distanceInfo?: any;
  routeName: string;
  onpressCancel: () => void;
}

const RouteToWellSheet = ({
  setModalVisible,
  onPressDirection,
  onPressStart,
  onPressPin,
  actionBtn,
  distanceInfo,
  routeName,
  onpressCancel,
}: RouteToWellSheetProps) => {
  const ActionButtons = ({
    icon,
    title,
    selected,
    onPressActionBtn,
    disabled,
  }: any) => {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPressActionBtn}
        style={[
          styles.buttonContainer,
          {
            backgroundColor: selected ? PFColors.Blue.Dark : '#ECEFF3',
            borderColor: selected ? '#ECEFF3' : PFColors.Blue.Dark,
          },
        ]}>
        <Image
          source={icon}
          style={[
            styles.actionIcon,
            {
              tintColor: selected
                ? PFColors.Standard.White
                : PFColors.Blue.Dark,
            },
          ]}
        />
        <Text
          style={[
            styles.buttonText,
            {
              color: selected ? PFColors.Standard.White : PFColors.Blue.Dark,
            },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[styles.modalContainer, styles.innerContainer]}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>{routeName ? routeName : ''}</Text>
        <TouchableOpacity onPress={onpressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <View style={styles.routeInfoView}>
        <Text>
          {svgIcon.MapWindow}
          <View style={{width: 5}} />

          <Text style={styles.routeInfoText}>
            {distanceInfo?.distance ? distanceInfo?.distance : 'calculating'}
          </Text>
        </Text>
        <View style={{marginLeft: 40}} />
        <Text>
          {svgIcon.BlueClock}
          <View style={{width: 5}} />
          <Text style={styles.routeInfoText}>
            {distanceInfo?.distance ? distanceInfo?.duration : 'calculating'}
          </Text>
        </Text>
        <TouchableOpacity style={styles.shareIcon} disabled>
          {svgIcon.ShareWellPath}
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <ActionButtons
          icon={appIcons.Directions}
          title={'Directions'}
          selected={actionBtn.direction}
          onPressActionBtn={onPressDirection}
        />
        <ActionButtons
          icon={appIcons.paperPlane}
          title="Start"
          selected={false}
          onPressActionBtn={onPressStart}
        />
        <ActionButtons
          icon={appIcons.pinIcon}
          title="Pin"
          selected={false}
          onPressActionBtn={onPressPin}
        />
      </View>
    </View>
  );
};

export {RouteToWellSheet};

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
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
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
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  routeInfoText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
  },
  routeInfoView: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  shareIcon: {
    position: 'absolute',
    right: 2,
    top: 5,
  },
  actionBtnView: {
    backgroundColor: 'pink',
    flexDirection: 'row',
  },
  actionIcon: {
    height: 20,
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEFF3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  buttonText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    marginLeft: 8,
  },
});
