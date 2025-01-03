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

<<<<<<< HEAD
const FromAndToCard = ({style}: any) => {
  return (
    <View style={[styles.fromAndToCard, style]}>
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
          Lahore, Tulip Ove Overseas Block, Park view City Lahore
=======
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
>>>>>>> ffe91d8352b33957532c1f7dba45bd40d23a121a
        </Text>
        <View style={styles.locationContainerDivider} />
        <Text style={styles.locationTitle}>Drop off Location</Text>
        <Text style={styles.locationName} numberOfLines={2}>
<<<<<<< HEAD
          Street 5, Block RLahore, Punjab 54000{' '}
=======
          {dropOff || 'Test name'}{' '}
>>>>>>> ffe91d8352b33957532c1f7dba45bd40d23a121a
        </Text>
      </View>
    </View>
  );
};
<<<<<<< HEAD

export {FromAndToCard};

const styles: any = StyleSheet.create({
=======

export {FromAndToCard};

const styles = StyleSheet.create({
>>>>>>> ffe91d8352b33957532c1f7dba45bd40d23a121a
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
<<<<<<< HEAD
  locationMarker: (color: string) => ({
=======
  locationMarker: color => ({
>>>>>>> ffe91d8352b33957532c1f7dba45bd40d23a121a
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
