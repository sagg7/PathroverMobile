import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

interface SharedSheetProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressShare?: () => void;
  onPressOther?: () => void;
  onPressCross?: () => void;
}

const SharedSheet = ({
  modalVisible,
  setModalVisible,
  onPressShare,
  onPressOther,
  onPressCross,
}: SharedSheetProps) => {
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.titleView}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <Text style={styles.titleText}>Share Options</Text>
          <TouchableOpacity onPress={onPressCross}>
            {svgIcon.CancelIcon}
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            marginVertical: 25,
          }}>
          <TouchableOpacity onPress={onPressShare}>
            <View style={styles.shareBox}>
              <Text style={styles.shareText}>Share with app user</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressOther}>
            <View style={styles.shareBox}>
              <Text style={styles.shareText}>Share with other</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SharedSheet;

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    // paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
  },
  titleView: {
    padding: 10,
    paddingVertical: 10,
  },
  titleText: {
    fontFamily: PFFonts.Foundation.Bold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Blue.Dark,
  },
  shareBox: {
    width: WP('70'),
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 5,
    alignSelf: 'center',
    paddingVertical: 7,
  },
  shareText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Blue.Dark,
  },
});
