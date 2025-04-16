import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';

interface StartPointModalProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressSave?: any;
  title?: string;
}

const StartPointModal = ({
  modalVisible,
  setModalVisible,
  onPressSave,
  title,
}: StartPointModalProps) => {
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.titleView}>
          <Text style={styles.headerText}>Route Alert</Text>
        </View>
        <Text style={styles.actionText}>
          {title
            ? title
            : ' You are now at start point, Please follow the route to reach your destination.'}
        </Text>

        <View style={styles.btnContainer}>
          <AppButton title="Okay" isSmall="40%" handleClick={onPressSave} />
        </View>
      </View>
    </Modal>
  );
};

export {StartPointModal};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center', // Centers the modal vertically
    alignItems: 'center', // Centers the modal horizontally
    margin: 0, // Removes default margin
  },

  modalContent: {
    backgroundColor: PFColors.Standard.White,
    paddingVertical: WP('5'),
    width: WP('90'), // Adjust the width as needed
    borderRadius: WP('3'), // Optional: rounds the corners
  },

  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('3'),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: WP('3'),
  },

  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: 5,
  },

  actionText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingHorizontal: WP('6'),
    paddingVertical: 5,
    width: '100%',
  },
  cancelBtn: {
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
});
