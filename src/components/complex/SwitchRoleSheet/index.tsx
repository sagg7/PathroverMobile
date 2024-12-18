import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {AppButton} from '../AppButton';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import {useSelector} from 'react-redux';

interface SwitchRoleSheetProps {
  modalVisible: boolean;
  setModalVisible: () => void;
  onPressCard: (v: any) => void;
  data?: any;
}
const SwitchRoleSheet = ({
  modalVisible,
  setModalVisible,
  onPressCard,
  data,
}: SwitchRoleSheetProps) => {
  const userRole = useSelector(state => state?.appRole.userRole);

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      {data?.map(i => {
        return (
          <TouchableOpacity
            disabled={userRole === i.role}
            onPress={() => onPressCard(i)}>
            <View style={styles.container(userRole === i.role)}>
              <View style={styles.innerContainer}>
                <Image
                  source={appIcons.userPlaceholder}
                  style={styles.userprofiles}
                />
                <Text style={styles.roleName}>{i.title}</Text>
              </View>
              {userRole === i.role && (
                <Image source={appIcons.greenCheck} style={styles.greenCheck} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </Modal>
  );
};

export {SwitchRoleSheet};

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
  buttonsRow: {
    paddingHorizontal: WP('5'),
    marginVertical: 10,
  },
  container: (selected: boolean) => ({
    backgroundColor: selected
      ? PFColors.Blue.SoftGlacier
      : PFColors.Gray.WhisperGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WP('94'),
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  }),
  userprofiles: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  roleName: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('3'),
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenCheck: {
    height: WP('5'),
    width: WP('5'),
    right: 10,
  },
});
