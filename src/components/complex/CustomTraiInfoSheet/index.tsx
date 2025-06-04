import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import LocationDetailTab from '../../../navigation/LocationDetailTopTab/LocationDetailTopTab';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

interface CustomTraiInfoSheetProps {
  trailInfo: any;
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressShare: (trailInfo: any) => void;
  onPressNavigation?: () => void;
  onPressPin: (trailInfo: any) => void;
}

interface BubbleViewProps {
  children: React.ReactNode;
  show?: boolean;
  isRed: boolean;
  elevation?: string;
}

interface ActionButtonsProps {
  icon: any;
  title: string;
  selected: boolean;
  onPressActionBtn?: () => void;
  disabled?: boolean;
}

const CustomTraiInfoSheet = ({
  trailInfo,
  modalVisible,
  setModalVisible,
  onPressShare,
  onPressNavigation,
  onPressPin,
}: CustomTraiInfoSheetProps) => {
  const BubbleView = ({
    children,
    show = false,
    isRed,
    elevation,
  }: BubbleViewProps) => (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
      {show && (
        <View style={innerBuble(isRed)}>
          <Text style={statusColor(isRed)}>{elevation}</Text>
        </View>
      )}
    </View>
  );

  const ActionButtons = ({
    icon,
    title,
    selected,
    onPressActionBtn,
    disabled,
  }: ActionButtonsProps) => (
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

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.contentView}>
        <View>
          <Text style={styles.trailNameStyle}>Name:</Text>
          <View style={styles.barStyle} />

          <View style={{flexDirection: 'row'}}>
            <BubbleView show isRed={true} elevation={'Hard'}>
              Difficulty Level
            </BubbleView>
            <BubbleView show isRed={false} elevation={'200'}>
              Elevation gain
            </BubbleView>
          </View>

          <View style={{flexDirection: 'row'}}>
            <BubbleView isRed={true}>Surface type: Gravel</BubbleView>
            <BubbleView isRed={false}>29° | Hum 54%</BubbleView>
          </View>

          <View style={styles.barStyle} />
          <View style={styles.routeInfoView}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {svgIcon.MapWindow}
              <View style={{width: 5}} />
              <Text style={styles.routeInfoText}>33.44</Text>
            </View>

            <View style={{marginLeft: 40}} />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {svgIcon.BlueClock}
              <View style={{width: 5}} />
              <Text style={styles.timeText}>34.44</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressShare(trailInfo)}
              style={styles.shareIcon}
              disabled={!onPressShare}>
              {svgIcon.ShareWellPath}
            </TouchableOpacity>
          </View>

          <View style={styles.actionBtnView}>
            <ActionButtons
              icon={appIcons.paperPlane}
              title="Explore"
              selected={false}
              // onPressActionBtn={onPressNavigation}
            />
            <ActionButtons
              icon={appIcons.pinIcon}
              title="Pin"
              selected={false}
              onPressActionBtn={() => onPressPin(trailInfo)}
            />
          </View>
          {/* <LocationDetailTab /> */}
        </View>

        <TouchableOpacity onPress={setModalVisible} style={{right: 30}}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export {CustomTraiInfoSheet};

const innerBuble = (isRed: boolean): ViewStyle => ({
  backgroundColor: isRed ? '#F2DBDB' : '#fff',
  padding: 10,
  borderRadius: 20,
  marginLeft: 10,
  paddingHorizontal: 15,
  paddingVertical: 10,
});

const statusColor = (isRed: boolean): TextStyle => ({
  fontSize: PFFontSize.FONT_SIZE_12,
  color: isRed ? PFColors.Red.RadiantRed : PFColors.Standard.Black,
  fontFamily: PFFonts.Foundation.Medium,
});

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
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('2'),
    marginVertical: 5,
  },
  trailNameStyle: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    width: WP('80'),
    paddingVertical: 5,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  barStyle: {
    width: WP('90'),
    height: 1,
    backgroundColor: PFColors.Gray.FrostedGray,
    marginVertical: 10,
  },
  container: {
    backgroundColor: PFColors.Standard.SoftWhite,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 40,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    margin: WP('.5'),
  },
  text: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
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
    width: WP('92'),
    alignSelf: 'center',
  },
  shareIcon: {
    position: 'absolute',
    right: 2,
    top: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEFF3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  buttonText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    marginLeft: 8,
  },
  actionBtnView: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  actionBtnViewSecond: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-between',
    width: WP('65'),
  },
});
