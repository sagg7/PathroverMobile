import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';

interface PinLocationAddressProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressShare?: () => void;
  selectedPin: any;
  onPressRouteToWell: () => void;
  onPresAddEntrance?: () => void;
  selectedWell: any;
  onPressPin?: () => void;
}

const PinLocationAddress = ({
  modalVisible,
  setModalVisible,
  onPressShare,
  selectedPin,
  onPresAddEntrance,
  onPressRouteToWell,
  selectedWell,
  onPressPin,
}: PinLocationAddressProps) => {
  const DetailView = ({title, value}: any) => (
    <View style={styles.detailTextView}>
      <Text style={styles.detailTitle}>{title}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>{selectedWell?.well_name}</Text>
        <TouchableOpacity onPress={setModalVisible}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      {/* <View style={styles.actionIcon}>
        <TouchableOpacity onPress={onPressShare} style={{right: 10}}>
          {svgIcon.ShareWellPath}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressPin}>
          {svgIcon.PinLocation}
        </TouchableOpacity>
      </View> */}

      <View style={styles.blueBox}>
        <View style={styles.detailSection}>
          <DetailView title="API" value={selectedWell?.api || 'N/A'} />
        </View>

        <View style={styles.horizontalLine} />
        <View style={styles.detailTextView}>
          <Text style={styles.detailTitle}>Status:</Text>
          <View style={styles.statusView}>
            <Text style={styles.statusValueText}>
              {selectedWell?.status || 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.horizontalLine} />

        {selectedWell?.lat > 0 && (
          <>
            <View style={styles.detailSection}>
              <DetailView title="Latitude" value={selectedWell?.lat || 'N/A'} />
            </View>
            <DetailView title="Longitude" value={selectedWell?.log || 'N/A'} />
            <View style={styles.horizontalLine} />

            <View style={styles.detailSection}>
              <DetailView
                title="Country"
                value={selectedWell?.country || 'N/A'}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.btnContainer}>
        <AppButton
          title="Add Entrance"
          isSmall="45%"
          handleClick={onPresAddEntrance}
          textStyle={styles.entranceBtntextStyle}
          buttonStyle={styles.entranceBtn}
        />
        <AppButton
          title="Route to Well"
          isSmall="45%"
          handleClick={onPressRouteToWell}
          textStyle={styles.btnTextStyle}
        />
      </View>
    </Modal>
  );
};

export {PinLocationAddress};

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

  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    width: WP('80'),
    paddingVertical: 10,
    textTransform: 'capitalize',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: WP('3'),
    width: WP('88'),
    alignSelf: 'center',
  },

  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: 5,
  },

  btnTextStyle: {
    fontSize: PFFontSize.FONT_SIZE_12,
  },
  entranceBtn: {
    fontSize: PFFontSize.FONT_SIZE_12,
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  entranceBtntextStyle: {
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Blue.Dark,
    fontFamily: PFFonts.Foundation.Regular,
  },
  addressView: {
    flexDirection: 'row',
    marginHorizontal: WP('4'),
    justifyContent: 'space-between',
    marginTop: 15,
  },

  blueBox: {
    backgroundColor: PFColors.Blue.SoftGlacier,
    marginHorizontal: WP('6'),
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  detailTitle: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  detailValue: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    paddingLeft: 5,
  },
  detailTextView: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'center',
  },
  detailSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  horizontalLine: {
    height: 2,
    backgroundColor: PFColors.Gray.CloudGray,
    marginVertical: 8,
  },
  statusValueText: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    paddingLeft: 5,
  },
  statusView: {
    backgroundColor: '#B0FFB6',
    padding: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    right: WP('6'),
    marginBottom: 20,
  },
});
