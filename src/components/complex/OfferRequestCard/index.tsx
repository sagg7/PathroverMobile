import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
  appImages,
} from '../../../shared/exporter';
import {FromAndToCard} from '../FromAndToCard';
import {PickAndDropTimeCard} from '../PickAndDropTimeCard';
import {AppButton} from '../AppButton';
import {getTimeAndDistance} from '../../../shared/utils/helpers';
import useLocation from '../../../hooks/getLocation';

interface OfferRequestCardProps {
  onPressDecline?: () => void;
  onPressAccept: (item: any) => void;
  item?: any;
  index: number;
  location?: any;
}

const OfferRequestCard = ({
  onPressAccept,
  onPressDecline,
  item,
  index,
  location,
}: OfferRequestCardProps) => {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (item) getResults();
  }, [item, location]);

  const getResults = async () => {
    const pickupLocation = [
      Number(item?.pickup_longitude),
      Number(item?.pickup_latitude),
    ];
    const locResults = await getTimeAndDistance(location, pickupLocation);

    setResult(locResults);
  };

  return (
    <View style={styles.mainContainer} key={index}>
      <View style={styles.blueHeader}>
        <Text style={styles.blueHeaderText}>Per Mile $1220.00</Text>
        <Text style={styles.blueHeaderText}>|</Text>
        <Text style={styles.blueHeaderText}>Expected Earning $371.00 </Text>
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.requestByContainer}>
          <View style={styles.row}>
            <Image
              source={
                item?.manager_profile_image
                  ? {uri: item?.manager_profile_image}
                  : appImages.userPlaceholder
              }
              style={styles.userProfile}
            />
            <Text style={styles.username}>{item?.user_name}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={appIcons.semitruck}
              style={styles.truckIcon}
              resizeMode="contain"
            />
            <Text style={styles.truckName}>{item?.vehicle_type}</Text>
          </View>
        </View>
        <View style={styles.horizontalBar} />
        <FromAndToCard
          dropOff={item?.dropoff_location_name}
          pickup={item?.pickup_location_name}
        />
        <View style={styles.horizontalBar} />
        <PickAndDropTimeCard
          type={'pickup'}
          value={`${result?.distance || ''}, ${result?.duration || ''}`}
        />
        <PickAndDropTimeCard type={'delivery'} value={item?.estimated_time} />
        <View style={styles.horizontalBar} />

        <View style={styles.cardFooter}>
          <Image
            source={appIcons.message}
            style={styles.clockIcon}
            resizeMode="contain"
          />
          <Text style={styles.descriptionText}>{item?.cargo_description}</Text>
        </View>
        <View style={styles.butonContainer}>
          <AppButton
            title="Decline"
            textStyle={styles.declinetext}
            buttonStyle={[styles.btnStyles, styles.declineBtn]}
            handleClick={onPressDecline}
          />
          <AppButton
            title="Accept"
            buttonStyle={styles.btnStyles}
            handleClick={() => onPressAccept(item)}
          />
        </View>
      </View>
    </View>
  );
};

export {OfferRequestCard};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 20,
    margin: WP('5'),
  },
  blueHeader: {
    backgroundColor: PFColors.Blue.Dark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  blueHeaderText: {
    fontFamily: PFFonts.Foundation.Bold,
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_12,
  },
  innerContainer: {
    padding: 10,
  },
  requestByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userProfile: {
    height: WP('10'),
    width: WP('10'),
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 30,
  },
  username: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_12,
    paddingLeft: WP('3'),
    width: WP('50'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckIcon: {
    height: WP('4'),
    width: WP('4'),
  },
  truckName: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_12,
    paddingLeft: WP('2'),
  },
  horizontalBar: {
    backgroundColor: PFColors.Gray.FadedGray,
    height: 1,
    marginVertical: 15,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  clockIcon: {
    height: 16,
    width: 16,
    marginTop: 6,
  },
  descriptionText: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_10,
    lineHeight: 20,
    paddingLeft: 10,
    width: WP('80'),
  },
  butonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: WP('3'),
  },
  btnStyles: {
    width: WP('41'),
  },
  declineBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  declinetext: {
    color: PFColors.Blue.Dark,
  },
});
