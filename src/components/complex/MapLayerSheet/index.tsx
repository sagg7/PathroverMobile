import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';

interface MapLayerSheetProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressCancel: () => void;
  onPressSave?: () => void;
  onPressCard: (v: any) => void;
  data?: any[];
}

const MapLayerSheet = ({
  modalVisible,
  setModalVisible,
  onPressCard,
  data = [],
  onPressCancel,
  onPressSave,
}: MapLayerSheetProps) => {
  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity onPress={() => onPressCard(item)} style={styles.item}>
      <View style={styles.container}>
        <View
          style={[styles.imageStyle, {borderWidth: item?.isSelected ? 2 : 0}]}>
          {item?.icon}
        </View>
        <Text style={styles.roleName}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.dragablePin}>{svgIcon.DragablePin}</View>
      <FlatList
        ListHeaderComponent={<Text style={styles.headerText}>Select Map</Text>}
        data={data}
        renderItem={renderItem}
        keyExtractor={index => index.toString()}
        numColumns={3}
      />
      <View style={styles.btnContainer}>
        <AppButton
          title="Cancel"
          isSmall="40%"
          buttonStyle={styles.cancelbtnStyles}
          textStyle={styles.cancelTextStyles}
          handleClick={onPressCancel}
        />
        <AppButton title="Save" isSmall="40%" handleClick={onPressSave} />
      </View>
    </Modal>
  );
};

export {MapLayerSheet};

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

  item: {
    flex: 1,
    margin: 5,
  },
  container: {
    alignItems: 'center',
    padding: 10,
    borderRadius: WP('2'),
  },
  userprofiles: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  roleName: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
    marginTop: 5,
  },
  imageStyle: {
    borderRadius: 18,
    borderColor: PFColors.Blue.Dark,
  },
  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('8'),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: WP('3'),
  },
  cancelbtnStyles: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  cancelTextStyles: {
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  dragablePin: {
    alignSelf: 'center',
    marginBottom: 10,
  },
});
