import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {svgIcon} from '../../../../../assets/svg';
import {PFColors, PFFonts} from '../../../../../shared/exporter';
import {scale} from '../../../../../shared/theme/responsive';
import {FromAndToCard} from '../../../../../components';

const CustomizeRouteCard = ({onPressCard,style,icon}: any) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);
  return (
    <Pressable style={[styles.cardContainer,style]} onPress={onPressCard}>
      <View style={styles.cardInfoView}>
        <View style={styles.routeNameView}>
          {icon}
          <Text style={styles.routeName}>Bahria Home Route</Text>
        </View>
        <Pressable onPress={() => setIsExpand(!isExpand)}>
          {isExpand ? svgIcon.UpChaveron : svgIcon.DownChaveron}
        </Pressable>
      </View>
      {isExpand && (
        <View>
          <Text style={styles.routeTitleStyle}>Wapda Town</Text>
          <FromAndToCard />
        </View>
      )}
    </Pressable>
  );
};

export default CustomizeRouteCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor:PFColors.Gray.WhisperGray,
    marginBottom: scale(12),
    padding: scale(16),
    borderRadius: scale(12),
  },
  cardInfoView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeNameView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  routeName: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: scale(14),
    color: PFColors.Standard.Black,
    marginLeft: scale(12),
    flex: 1,
  },
  routeTitleStyle: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(12),
    color: PFColors.Standard.Black,
    marginTop: scale(20),
    marginBottom: scale(8),
  },
});
