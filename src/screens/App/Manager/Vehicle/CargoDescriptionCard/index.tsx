import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {svgIcon} from '../../../../../assets/svg';
import {scale} from '../../../../../shared/theme/responsive';
import {PFColors, PFFonts} from '../../../../../shared/exporter';

const CargoDescriptionCard = ({
  CargoDescriptionDetails,
  onPressCard,
  onPressClear,
  style,
}: any) => {
  return (
    <Pressable style={[styles.mainContainer, style]} onPress={onPressCard}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>Cargo Description</Text>
        {!CargoDescriptionDetails && (
          <Pressable onPress={onPressClear}>
            <Text style={styles.clearTextStyle}>Clear</Text>
          </Pressable>
        )}
        {svgIcon.LeftArrow}
      </View>
      {!CargoDescriptionDetails && (
        <Text style={styles.subTitleStyle}>
          It involves various packaging types, specific handling requirements,
          and regulatory documentation to ensure safe and compliant transit.
        </Text>
      )}
    </Pressable>
  );
};

export default CargoDescriptionCard;

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
    marginTop: scale(18),
  },
  weightStyle: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: scale(14),
  },
});
