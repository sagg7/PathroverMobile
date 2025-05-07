import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppHeader, MainWrapper} from '../../../components';
import {appImages} from '../../../assets/images';
import {scale, scrWidth} from '../../../shared/theme/responsive';
import RenderHTML from 'react-native-render-html';
import {AppLoader, PFColors} from '../../../shared/exporter';
import {useNavigation} from '@react-navigation/native';
import {useTermsMutation} from '../../../redux/common/commonDomainApiSlice';

const TermsAndConditions = () => {
  const [source, setSource] = useState(null);
  const navigation = useNavigation();
  const [terms, {data, isLoading}] = useTermsMutation();

  useEffect(() => {
    getTerms();
  }, [navigation]);

  useEffect(() => {
    if (data?.response) {
      setSource({html: data?.response});
    }
  }, [data]);

  const getTerms = async () => {
    try {
      await terms();
    } catch (error) {
      setSource('');
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Terms & Conditions" />
      <ScrollView>
        <Image source={appImages.termsBanner} style={styles.bannerImage} />
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
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default TermsAndConditions;

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
