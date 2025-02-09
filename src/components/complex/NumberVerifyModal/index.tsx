import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {AppButton} from '../AppButton';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

interface NumberVerifyModalProps {
  number: string;
  isVisible?: boolean;
  setIsVisible: () => void;
  onPressContinue: () => void;
  onPressEdit: () => void;
}

const NumberVerifyModal = ({
  number,
  isVisible,
  setIsVisible,
  onPressContinue,
  onPressEdit,
}: NumberVerifyModalProps) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.textStyle}>
          We will be verifying the phone number:
        </Text>

        <Text style={styles.textStyle}>{number || ''}</Text>
        <Text style={styles.textStyle}>
          {'Is this OK, or would you like to\nedit the number?'}
        </Text>

        <View style={styles.buttonView}>
          <AppButton
            title={'Edit'}
            buttonStyle={styles.editButtonStyle}
            textStyle={styles.editTextStyle}
            handleClick={onPressEdit}
          />
          <AppButton
            title={'Ok'}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            handleClick={onPressContinue}
          />
        </View>
      </View>
    </Modal>
  );
};

export default NumberVerifyModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: PFColors.Standard.White,
    flexDirection: 'column',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButtonStyle: {
    width: '43%',
    height: 42,
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  buttonStyle: {
    width: '43%',
    height: 42,
  },
  editTextStyle: {
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.Medium,
  },
  buttonTextStyle: {
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.Medium,
  },
  textStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Medium,
    marginBottom: 22,
  },
});
