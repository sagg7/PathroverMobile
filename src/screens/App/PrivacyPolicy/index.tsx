import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppHeader, MainWrapper} from '../../../components';
import {appImages} from '../../../assets/images';
import {scale, scrWidth} from '../../../shared/theme/responsive';
import RenderHTML from 'react-native-render-html';
import {PFColors} from '../../../shared/exporter';
import {usePrivacyMutation} from '../../../redux/common/commonDomainApiSlice';
import {useNavigation} from '@react-navigation/native';

const PrivacyPolicy = () => {
  const [source, setSource] = useState(null);
  const navigation = useNavigation();
  const [privacy, {data, isLoading}] = usePrivacyMutation();

  useEffect(() => {
    getPrivacy();
  }, [navigation]);

  useEffect(() => {
    if (data?.response) {
      setSource({html: data?.response});
    }
  }, [data]);

  const getPrivacy = async () => {
    try {
      await privacy();
    } catch (error) {
      setSource('');
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Privacy Policy" />
      <ScrollView>
        <Image source={appImages.privacyBanner} style={styles.bannerImage} />
        <View style={styles.bodyContainer}>
          {source && (
            <RenderHTML
              contentWidth={scrWidth}
              source={source}
              baseStyle={styles.htmlBaseStyle}
            />
          )}
        </View>
      </ScrollView>
    </MainWrapper>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  bannerImage: {
    height: scale(201),
    width: scale(375),
    resizeMode: 'contain',
    borderBottomRightRadius: scale(24),
    borderBottomLeftRadius: scale(24),
  },
  bodyContainer: {
    flex: 1,
    padding: scale(16),
  },
  htmlBaseStyle: {
    color: PFColors.Standard.Black,
  },
});
