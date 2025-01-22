import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFontSize, PFFonts, scale} from '../../../shared/exporter';

interface CardItemProps {
  cardDetail: object;
  onPress?: () => void;
  onPressDelete?: () => void;
}
const CardItem = ({cardDetail, onPress, onPressDelete}: CardItemProps) => {
  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return svgIcon.VisaCard;
      case 'mastercard':
        return svgIcon.MasterCard;
      case 'unionpay':
        return svgIcon.UnionPay;
      case 'discover':
        return svgIcon.DiscoverCard;
      case 'amex':
        return svgIcon.AmexCard;
      default:
        return svgIcon.CreditCard;
    }
  };
  return (
    <TouchableOpacity
      style={styles.main(cardDetail?.is_default)}
      onPress={onPress}>
      <View style={styles.iconView}>{getCardIcon(cardDetail?.card_type)}</View>
      <View style={styles.cardDetailView}>
        <View>
          <Text style={styles.cardText}>{cardDetail?.card_type} Card</Text>
          <Text style={styles.cardText}>**** {cardDetail?.card_number}</Text>
        </View>
        {cardDetail?.is_default && (
          <View style={styles.defaultView}>
            <Text style={styles.defaultText}>Primary</Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={onPressDelete}>
        {svgIcon.DeleteIcon}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: selected => ({
    flexDirection: 'row',
    backgroundColor: selected
      ? PFColors.Gray.CloudGray
      : PFColors.Standard.White,
    borderWidth: 1,
    borderColor: '#00000010',
    marginVertical: scale(6),
    padding: scale(10),
    marginHorizontal: scale(16),
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  iconView: {
    width: '12%',
  },
  cardDetailView: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
    textTransform: 'capitalize',
  },
  defaultText: {
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  defaultView: {
    backgroundColor: PFColors.Standard.Default,
    borderRadius: 20,
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
  },
});

export {CardItem};
