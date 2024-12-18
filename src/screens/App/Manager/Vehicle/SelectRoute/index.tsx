import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {svgIcon} from '../../../../../assets/svg';
import {scale} from '../../../../../shared/theme/responsive';
import {PFColors, PFFonts} from '../../../../../shared/exporter';
import {FromAndToCard} from '../../../../../components';

const SelectRoute = ({
  selectedRouteDetails,
  title,
  onPressCard,
  onPressClear,
  style,
}: any) => {
  return (
    <View>
      <Pressable style={[styles.mainContainer, style]} onPress={onPressCard}>
        <View style={styles.container}>
          <Text style={styles.titleStyle}>Select {title}</Text>
          {selectedRouteDetails && (
            <Pressable onPress={onPressClear}>
              <Text style={styles.clearTextStyle}>Clear</Text>
            </Pressable>
          )}
          {svgIcon.LeftArrow}
        </View>
        {selectedRouteDetails && (
          <>
            <Text style={styles.routeTitleText}>Wapdatown</Text>
            <FromAndToCard />
          </>
        )}
      </Pressable>
    </View>
  );
};

export default SelectRoute;
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
    fontFamily: PFFonts.Foundation.Medium,
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
  routeTitleText:{
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(12),
    marginBottom:scale(9),
    marginTop: scale(16),
  }
});
