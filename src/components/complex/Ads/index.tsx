import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {PFColors, PFFonts, PFFontSize, scale} from '../../../shared/exporter';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

interface AdsProps {
  item: string;
  isTop?: boolean;
}

function Ads({item, isTop = false}: AdsProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.main(isTop)}>
      {loading ? (
        <ActivityIndicator size={'small'} color={PFColors.Blue.Dark} />
      ) : (
        <BannerAd
          unitId={__DEV__ ? TestIds.BANNER : item}
          size={BannerAdSize.MEDIUM_RECTANGLE}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: (isTop: any) => ({
    width: 300,
    marginHorizontal: scale(6),
    marginVertical: scale(4),
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PFColors.Gray.LightMist,
  }),
  adText: {
    fontSize: PFFontSize.FONT_SIZE_8,
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Standard.Black,
  },
  headline: (isTop: any) => ({
    fontSize: isTop ? PFFontSize.FONT_SIZE_20 : PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
  }),
  imageStyle: (isTop: any) => ({
    borderRadius: isTop ? 16 : 12,
    height: isTop ? 200 : 150,
    width: isTop ? 327 : 150,
    resizeMode: 'cover',
  }),
});

export {Ads};

// const listener = ads.addAdEventListener(NativeAdEventType.CLICKED, () => {
//   console.log('Native ad clicked');
// });
// return () => {
//   listener.remove();
//   // or
//   ads.destroy();
// };
/* <BannerAd unitId={ads} size={BannerAdSize.LARGE_BANNER} /> */
/* <NativeAdView nativeAd={ads}>
        {ads?.icon?.url && (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image
              source={{uri: ads?.icon?.url}}
              style={styles.imageStyle(isTop)}
            />
          </NativeAsset>
        )}

        <NativeAsset assetType={NativeAssetType.ADVERTISER}>
          <Text style={styles.adText}>{ads?.advertiser || 'Ad'}</Text>
        </NativeAsset>
        {ads?.callToAction && (
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <Text style={styles.adText}>{ads?.callToAction || ''}</Text>
          </NativeAsset>
        )}
        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text style={styles.headline(isTop)}>{ads?.headline}</Text>
        </NativeAsset>
      </NativeAdView> */
