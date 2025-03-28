import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {PFColors} from '../../../shared/exporter';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

interface AdsProps {
  item: string;
}

function Ads({item}: AdsProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.main}>
      {loading ? (
        <ActivityIndicator size={'small'} color={PFColors.Blue.Dark} />
      ) : (
        <BannerAd
          unitId={TestIds.BANNER}
          // unitId={__DEV__ ? TestIds.BANNER : item}
          size={BannerAdSize.LARGE_BANNER}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '91.5%',
    borderRadius: 5,
    marginHorizontal: 16,
    height: 110,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PFColors.Gray.LightMist,
  },
});

export {Ads};
