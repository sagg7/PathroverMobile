import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  onPressPin?: () => void;
  onPressShare?: () => void;
  actionBtn: any;
  distanceInfo?: any;
  routeName: string;
  onpressCancel: () => void;
  show: any;
  selectedData: any;
  routeLength?: any;
}

export const ActionButtons = ({
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
            tintColor: selected ? PFColors.Standard.White : PFColors.Blue.Dark,
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

const RouteToWellSheet = ({
  setModalVisible,
  onPressDirection,
  onPressShare,
  onPressStart,
  onPressPin,
  actionBtn,
  distanceInfo,
  routeName,
  onpressCancel,
  selectedData,
  show = true,
  routeLength = 3,
}: RouteToWellSheetProps) => {
  const isEmpty = routeLength > 2 ? false : true;
  return (
    <View style={[styles.modalContainer, styles.innerContainer]}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>{routeName ? routeName : ''}</Text>
        <TouchableOpacity onPress={onpressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      {!isEmpty ? (
        <View>
          <View style={styles.routeInfoView}>
            <Text>
              {svgIcon.MapWindow}
              <View style={{width: 5}} />

              <Text style={styles.routeInfoText}>
                {distanceInfo?.distance
                  ? distanceInfo?.distance
                  : 'calculating'}
              </Text>
            </Text>
            <View style={{marginLeft: 40}} />
            <Text>
              {svgIcon.BlueClock}
              <View style={{width: 5}} />
              <Text style={styles.timeText}>
                {distanceInfo?.distance
                  ? distanceInfo?.duration
                  : 'calculating'}
              </Text>
            </Text>
            {show && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPressShare}
                style={styles.shareIcon}
                disabled={!onPressShare}>
                {svgIcon.ShareWellPath}
              </TouchableOpacity>
            )}
          </View>
          {show && (
            <View style={styles.actionBtnView}>
              <ActionButtons
                icon={appIcons.Directions}
                title={'Directions'}
                selected={actionBtn.direction}
                onPressActionBtn={onPressDirection}
                disabled={true}
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
          )}
          {!show && (
            <View style={styles.actionBtnViewSecond}>
              <ActionButtons
                icon={appIcons.Directions}
                title={'Directions'}
                selected={actionBtn.direction}
                onPressActionBtn={onPressDirection}
                disabled={true}
              />
              <ActionButtons
                icon={appIcons.paperPlane}
                title="Start"
                selected={false}
                onPressActionBtn={onPressStart}
              />
            </View>
          )}
          {selectedData?.notes && (
            <View style={{maxHeight: 110}}>
              <ScrollView>
                <Text
                  style={[
                    styles.noteText,
                    {fontFamily: PFFonts.Foundation.SemiBold},
                  ]}>
                  Note
                </Text>
                <Text style={styles.noteText}>{selectedData?.notes}</Text>
              </ScrollView>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.noFound}>No Route details found</Text>
      )}
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
  timeText: {
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
  actionBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  actionBtnViewSecond: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-between',
    width: WP('65'),
  },
  noteText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
  },
  noFound: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
