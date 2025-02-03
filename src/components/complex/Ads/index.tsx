import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  NativeAd,
  NativeAdEventType,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {PFColors, PFFonts, PFFontSize, scale} from '../../../shared/exporter';

interface AdsProps {
  item: string;
  isTop?: boolean;
}

function Ads({item, isTop = false}: AdsProps) {
  const [ads, setAds] = useState({});

  useEffect(() => {
    NativeAd.createForAdRequest(__DEV__ ? TestIds.NATIVE : item)
      .then(res => {
        setAds(res);
        // console.log('res ads', res);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!ads) {
      return;
    }
    // const listener = ads.addAdEventListener(NativeAdEventType.CLICKED, () => {
    //   console.log('Native ad clicked');
    // });
    // return () => {
    //   listener.remove();
    //   // or
    //   ads.destroy();
    // };
  }, [ads]);

  const handleAdPress = () => {
    if (ads?.clickUrl) {
      Linking.openURL(ads?.clickUrl).catch((err: any) =>
        console.error('Failed to open ad URL', err),
      );
    } else {
    }
  };

  return (
    <View style={styles.main(isTop)}>
      <NativeAdView nativeAd={ads}>
        <NativeAsset assetType={NativeAssetType.ICON}>
          <Image
            source={{uri: ads?.icon?.url}}
            style={styles.imageStyle(isTop)}
          />
        </NativeAsset>

        <NativeAsset assetType={NativeAssetType.ADVERTISER}>
          <Text style={styles.adText}>Ad</Text>
        </NativeAsset>
        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text style={styles.headline(isTop)}>{ads?.headline}</Text>
        </NativeAsset>
      </NativeAdView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: (isTop: any) => ({
    width: isTop ? 327 : 150,
    marginHorizontal: scale(6),
    marginVertical: scale(4),
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
