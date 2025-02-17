import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';

interface WeatherSheetProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressCancel: () => void;
  onPressSave?: () => void;
  onPressCard: (v: any) => void;
  data?: any[];
}

const WeatherSheet = ({
  modalVisible,
  setModalVisible,
  onPressCard,
  data = [],
  onPressCancel,
}: WeatherSheetProps) => {
  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity onPress={() => onPressCard(item)} style={styles.item}>
      <View style={styles.container}></View>
    </TouchableOpacity>
  );

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={styles.coordinatesText}>31.23432, 74.49388</Text>
          <Text style={styles.placeName}>Lahore, Pakistan</Text>
        </View>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={onPressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <View style={styles.blueCard}>
        <Text style={styles.todayText}>Today, 12 September</Text>
        <Text style={styles.temperatureText}>23*</Text>
        <Text style={[styles.todayText, {paddingTop: 20}]}>Cloudy</Text>
      </View>
      {/* <FlatList
        ListHeaderComponent={<Text style={styles.headerText}>Select Map</Text>}
        data={data}
        renderItem={renderItem}
        keyExtractor={index => index.toString()}
        numColumns={3}
      /> */}
    </Modal>
  );
};

export {WeatherSheet};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
    padding: 15,
  },
  coordinatesText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_10,
    color: PFColors.Standard.Black,
  },
  placeName: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
  },
  blueCard: {
    backgroundColor: PFColors.Blue.Dark,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  todayText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: '#EBC70A',
    fontSize: PFFontSize.FONT_SIZE_16,
  },
  temperatureText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.White,
    fontSize: 60,
  },
});
