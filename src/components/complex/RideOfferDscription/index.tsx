import { StyleSheet, Text, View, TouchableOpacity, TextStyle, Image } from 'react-native';
import React from 'react';
import { HP, PFColors, PFFontSize, PFFonts, WP, appIcons } from '../../../shared/exporter';


interface RideOfferDscription {
  items: any;
  btnStyles?: any
}

const RideOfferDscription = ({
  items,
  btnStyles
}: RideOfferDscription) => {

  return (
    <View >
      <View style={styles.cardFooter}>
        <Image source={appIcons.message} style={styles.clockIcon} resizeMode='contain' />
        <Text style={styles.descriptionText}>
          Finish by loading the smaller items like the coffee table, armchair, bookshelf, dresser, nightstand, and desk, taking care to arrange them efficiently to maximize space.
        </Text>
      </View>

    </View>
  );
};


const styles = StyleSheet.create({
  cardFooter: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  clockIcon: {
    height: 16,
    width: 16,
    marginTop: 6
  },
  descriptionText: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_10,
    lineHeight: 20,
    paddingLeft: 10,
    width: WP('80')
  },
});
export { RideOfferDscription };
