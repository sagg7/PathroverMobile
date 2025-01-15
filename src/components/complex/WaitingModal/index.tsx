import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';

interface WaitingModalProps {
  isModalVisible: boolean;
}

const WaitingModal: React.FC<WaitingModalProps> = ({isModalVisible}) => {
  return (
    <View style={styles.container}>
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.headingStyle}>Wait For Payment </Text>
          <Text style={styles.descTextStyle}>
            Please wait for the manager to release the payment.
          </Text>
        </View>
      </Modal>
    </View>
  );
};

export {WaitingModal};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modal: {
    justifyContent: 'center',
    margin: 0,
  } as ViewStyle,
  modalContent: {
    backgroundColor: 'white',
    padding: WP('7'),
    borderRadius: WP('5'),
    margin: 15,
    alignItems: 'center',
  } as ViewStyle,
  headingStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_18,
    fontFamily: PFFonts.Foundation.Bold,
  },
  descTextStyle: {
    lineHeight: 22,
    marginTop: WP('5'),
    textAlign: 'center',
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
  },
});
