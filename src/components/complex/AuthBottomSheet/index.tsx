import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import {svgIcon} from '../../../assets/svg';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  isIOS,
} from '../../../shared/exporter';
import {AppButton} from '../AppButton';

interface AuthBottomSheetProps {
  isModalVisible: boolean;
  handleClickEmail: () => void;
  handleClickPhone: () => void;
  onPressClose: () => void;
  emailTitle: string;
  phoneTitle: string;
  headerTitle: string;
  onPressGoogle: () => void;
  onPressApple: () => void;
}

const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  isModalVisible,
  handleClickEmail,
  handleClickPhone,
  emailTitle,
  phoneTitle,
  headerTitle,
  onPressClose,
  onPressGoogle,
  onPressApple,
}) => {
  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        style={styles.modal}
        swipeDirection="down"
        onBackdropPress={onPressClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalText}>{headerTitle}</Text>
            <TouchableOpacity onPress={onPressClose}>
              {svgIcon.ModalClose}
            </TouchableOpacity>
          </View>
          <AppButton
            title={emailTitle}
            icon={svgIcon.Email}
            handleClick={handleClickEmail}
          />
          <AppButton
            title={phoneTitle}
            icon={svgIcon.Phone}
            buttonStyle={styles.phoneBtnStyles}
            handleClick={handleClickPhone}
          />
          <Text style={styles.continueTxt}>Or continue with</Text>
          <View style={styles.socialLoginContainer}>
            <TouchableOpacity>{svgIcon.Facebook}</TouchableOpacity>
            <TouchableOpacity onPress={onPressGoogle}>
              {svgIcon.Google}
            </TouchableOpacity>
            {isIOS() && (
              <TouchableOpacity onPress={onPressApple}>
                {svgIcon.Apple}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export {AuthBottomSheet};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  } as ViewStyle,
  modalContent: {
    backgroundColor: 'white',
    padding: WP('5'),
    borderTopLeftRadius: WP('5'),
    borderTopRightRadius: WP('5'),
  } as ViewStyle,
  modalText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    marginBottom: 10,
    fontSize: PFFontSize.FONT_SIZE_20,
    color: PFColors.Standard.Black,
  } as TextStyle,
  phoneBtnStyles: {
    backgroundColor: PFColors.Orange.Dark,
    marginVertical: WP('3'),
  } as ViewStyle,
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: WP('5'),
  } as ViewStyle,
  continueTxt: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    textAlign: 'center',
    paddingTop: WP('4'),
  } as TextStyle,
  socialLoginContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
    width: WP('40'),
    marginVertical: WP('5'),
  } as ViewStyle,
});
