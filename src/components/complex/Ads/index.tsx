import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeAd, NativeAdChoicesPlacement, NativeAdEventType, NativeAdView, NativeAsset, NativeAssetType, NativeMediaAspectRatio, NativeMediaView, TestIds } from 'react-native-google-mobile-ads';
import { PFColors, PFFonts, PFFontSize } from '../../../shared/exporter';

interface AdsProps {
  item: string;
}

function Ads({ item }: AdsProps) {
  const [loading, setLoading] = useState(false);
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    NativeAd.createForAdRequest(TestIds.NATIVE, {
      aspectRatio: NativeMediaAspectRatio.LANDSCAPE,
      adChoicesPlacement: NativeAdChoicesPlacement.TOP_LEFT,
    })
      .then(setNativeAd)
      .catch(console.error);
  }, []);
  

  useEffect(() => {
    if (!nativeAd) return;
    const listener = nativeAd.addAdEventListener(NativeAdEventType.CLICKED, () => {
      // console.log('Native ad clicked');
    });
    return () => {
      listener.remove();
      nativeAd.destroy();
    };
  }, [nativeAd]);

  if (!nativeAd) {
    return null;
  }


  return (
    <>
      {loading ? (
        <ActivityIndicator size={'small'} color={PFColors.Blue.Dark} />
      ) : (
        <NativeAdView nativeAd={nativeAd} style={styles.main}>
          <NativeMediaView style={styles.imageStyle} />
          <View style={styles.textContainer}>
            {nativeAd.advertiser && <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text style={styles.titleTextStyle}>{nativeAd.advertiser}</Text>
            </NativeAsset>}
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <Text style={styles.titleTextStyle}>{nativeAd.headline}</Text>
            </NativeAsset>
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Text style={styles.titleTextStyle}>{nativeAd.body}</Text>
            </NativeAsset>
          </View>
        </NativeAdView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: PFColors.Gray.LightMist,
  },
  titleTextStyle: {
    lineHeight: 18,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.LightBlack,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  imageStyle: {
    aspectRatio: 1,
    width: 124,
    height: 110,
    borderRadius: 5,
    backgroundColor: PFColors.Gray.AshGray,
    marginRight: 10,
  },
  descTextStyle: {
    lineHeight: 18,
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Regular,
  },
  textContainer: {
    flexDirection: 'column',
    width: '60%',
  }
});

export { Ads };
