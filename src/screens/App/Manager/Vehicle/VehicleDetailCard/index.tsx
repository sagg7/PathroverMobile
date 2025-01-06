import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {svgIcon} from '../../../../../assets/svg';
import {scale} from '../../../../../shared/theme/responsive';
import {PFColors, PFFonts} from '../../../../../shared/exporter';

const VehicleDetailCard = ({
  selectedVehicleDetails,
  onPressCard,
  onPressClear,
  style,
}: any) => {
  const selectedModel =
    selectedVehicleDetails?.model?.length > 0 &&
    selectedVehicleDetails?.model?.find((item: any) => item?.isModelSelected)
      ?.title;

  return (
    <Pressable style={[styles.mainContainer, style]} onPress={onPressCard}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>Vehicle Details</Text>
        {selectedVehicleDetails && (
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}
            onPress={onPressClear}>
            <Text style={styles.clearTextStyle}>Clear</Text>
          </TouchableOpacity>
        )}
        {svgIcon.LeftArrow}
      </View>
      {selectedVehicleDetails && (
        <>
          <Text style={styles.subTitleStyle}>Weight</Text>
          <Text style={styles.weightStyle}>{selectedVehicleDetails.title}</Text>
        </>
      )}
      {selectedModel && (
        <>
          <Text style={styles.subTitleStyle}>Model</Text>
          <Text style={styles.weightStyle}>{selectedModel}</Text>
        </>
      )}
    </Pressable>
  );
};

export default VehicleDetailCard;

const styles = StyleSheet.create({
  mainContainer: {
    padding: scale(16),
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: scale(12),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
    flex: 1,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(14),
  },
  clearTextStyle: {
    color: PFColors.Orange.Dark,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(14),
    textDecorationLine: 'underline',
  },
  subTitleStyle: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(12),
    marginBottom: scale(6),
    marginTop: scale(13),
  },
  weightStyle: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: scale(14),
  },
});
