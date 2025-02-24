import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFonts, PFFontSize, WP} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

interface GeneralModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const GeneralModal = (props: GeneralModalProps) => {
  const {visible, title, onClose, children} = props;
  return (
    <Modal
      isVisible={visible}
      useNativeDriver
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={'down'}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.heading}>{title}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
            {svgIcon.CancelIcon}
          </TouchableOpacity>
        </View>
        <View style={styles.container}>{children}</View>
      </View>
    </Modal>
  );
};

export default GeneralModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    padding: 20,
    backgroundColor: PFColors.Standard.White,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  container: {
    paddingVertical: WP('2.5'),
  },
});
