import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {svgIcon} from '../../../../../assets/svg';
import {scale} from '../../../../../shared/theme/responsive';
import {PFColors, PFFonts} from '../../../../../shared/exporter';

const RecipientDetailCard = ({
  recipientDetail,
  onPressCard,
  onPressClear,
  style,
}: any) => {
  return (
    <Pressable style={[styles.mainContainer, style]} onPress={onPressCard}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>Recipent Detail</Text>
        {recipientDetail && (
          <Pressable onPress={onPressClear}>
            <Text style={styles.clearTextStyle}>Clear</Text>
          </Pressable>
        )}
        {svgIcon.LeftArrow}
      </View>
      {recipientDetail && (
        <View style={styles.recipentInfoView}>
          <Text style={styles.titleStyle}>Name</Text>
          <Text style={styles.recipentDataText}>{recipientDetail?.name}</Text>
          <Text style={styles.titleStyle}>Phone N0.</Text>
          <Text style={[styles.recipentDataText,{marginBottom:scale(0)}]}>{recipientDetail?.phone}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default RecipientDetailCard;

const styles = StyleSheet.create({
  mainContainer: {
    padding:scale(16),
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
  recipentDataText:{
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(12),
    marginVertical:scale(8)
  },
  recipentInfoView:{
    marginTop : scale(16)
  }
});
