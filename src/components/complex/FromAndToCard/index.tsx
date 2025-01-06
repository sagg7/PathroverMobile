import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
  isIOS,
} from '../../../shared/exporter';

interface FromAndToCardProps {
  item?: any;
  pickup: string;
  dropOff: string;
}

const FromAndToCard = ({item, pickup, dropOff}: FromAndToCardProps) => {
  return (
    <View style={[styles.fromAndToCard]}>
      <View style={styles.markerContainer}>
        <View style={styles.markerAndLineContainer}>
          <Image
            source={appIcons.locationMarker}
            style={styles.locationMarker('red')}
            resizeMode="contain"
          />
          <View style={styles.dottedLine} />
          <Image
            source={appIcons.locationMarker}
            style={styles.locationMarker('green')}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.locationNameContainer}>
        <Text style={styles.locationTitle}>Pickup Location</Text>
        <Text style={styles.locationName} numberOfLines={2}>
          {pickup || 'Test Name'}
        </Text>
        <View style={styles.locationContainerDivider} />
        <Text style={styles.locationTitle}>Drop off Location</Text>
        <Text style={styles.locationName} numberOfLines={2}>
          {/* Street 5, Block RLahore, Punjab 54000{' '} */}
          {dropOff || 'Test name'}{' '}
        </Text>
      </View>
    </View>
  );
};

export {FromAndToCard};

const styles: any = StyleSheet.create({
  fromAndToCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationTitle: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_12,
  },
  locationName: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_10,
    width: WP('80'),
    lineHeight: 21,
  },
  locationNameContainer: {
    flex: 1,
    paddingLeft: WP('2'),
  },
  locationContainerDivider: {
    height: isIOS() ? WP('6') : WP('3'),
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: WP('1'),
  },
  markerAndLineContainer: {
    alignItems: 'center',
    flex: isIOS() ? 0.9 : 0.8,
  },
  locationMarker: (color: string) => ({
    tintColor:
      color === 'green' ? PFColors.Green.LeafGreen : PFColors.Standard.Red,
    height: WP('5'),
    width: WP('5'),
  }),
  dottedLine: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: PFColors.Gray.DarkGray,
    marginVertical: WP('1'),
  },
});
