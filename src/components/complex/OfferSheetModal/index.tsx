import {StyleSheet, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {PFColors, WP} from '../../../shared/exporter';
import OfferSheet from '../../../screens/App/Driver/RequestList/OfferSheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
interface OfferSheetModalProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressSend: () => void;
  onPressCross?: () => void;
  onPressCancel: () => void;
  item: any;
  location: any;
  priceValue: any;
  onChangeText: any;
}
const OfferSheetModal = ({
  modalVisible,
  setModalVisible,
  onPressCancel,
  onPressSend,
  item,
  location,
  priceValue,
  onChangeText,
}: OfferSheetModalProps) => {
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View>
        <OfferSheet
          handleSendOfferBtn={onPressSend}
          onPressCancel={onPressCancel}
          item={item}
          location={location}
          priceValue={priceValue}
          onChangeText={onChangeText}
        />
      </View>
    </Modal>
  );
};

export {OfferSheetModal};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
    paddingHorizontal: WP('4'),
  },
});
