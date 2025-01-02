import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {PFColors, PFFonts, PFFontSize, WP} from '../../../shared/exporter';
import {AppInput} from '../../primitive/AppInput';
import {FromAndToCard} from '../FromAndToCard';
import {AppButton} from '../AppButton';

interface CreateRouteSheetProps {
  modalVisible: boolean;
  onPressCross: () => void;
  handleSave: (v: any) => void;
  start: any;
  end: any;
  title?: string;
}
const CreateRouteSheet = ({
  modalVisible,
  start,
  end,
  handleSave,
  onPressCross,
  title,
}: CreateRouteSheetProps) => {
  const [routeName, setRouteName] = useState<any>(title ? title : '');
  useEffect(() => {
    setRouteName(title ? title : '');
  }, [title]);

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={onPressCross}
      style={styles.modalContainer}>
      <View>
        <Text style={styles.titleStyles}>{title ? 'Edit ' : ''}Route Name</Text>
        <AppInput
          placeholder="Name"
          maxLength={30}
          value={routeName}
          onChangeText={v => setRouteName(v)}
        />
        <View style={styles.height} />

        <FromAndToCard pickup={start?.name} dropOff={end?.name} />
        <View style={styles.height} />

        <AppButton
          title={title ? 'Update' : 'Save'}
          handleClick={() => handleSave(routeName)}
        />
      </View>
    </Modal>
  );
};

export {CreateRouteSheet};

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
  height: {
    height: 20,
  },
  titleStyles: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
  },
});
