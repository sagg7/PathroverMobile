import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

interface CreateGroupModalProps {
  isVisible: boolean;
  setVisible?: () => void;
  onPress?: () => void;
  onPressClose?: () => void;
  tagText: string;
}

const CreateGroupModal = ({
  onPress,
  isVisible,
  setVisible,
  onPressClose,
  tagText,
}: CreateGroupModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      style={styles.modalStyle}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}>
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Create Group</Text>
          <TouchableOpacity onPress={onPressClose}>
            {svgIcon.ModalClose}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.tagView} onPress={onPress}>
          <Text style={styles.tagText}>{tagText}</Text>
          {svgIcon.RightChevron}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CreateGroupModal;

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: PFColors.Standard.White,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 30,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagView: {
    flexDirection: 'row',
    backgroundColor: PFColors.Gray.CloudGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  headerText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
  },
  tagText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
});
