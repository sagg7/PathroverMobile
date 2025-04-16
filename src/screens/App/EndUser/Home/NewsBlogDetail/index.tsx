import React from 'react';
import {Text, View, Image, ScrollView} from 'react-native';
import moment from 'moment';
import RenderHTML from 'react-native-render-html';
import {MainWrapper} from '../../../../../components';
import {AppHeader, appIcons, scrWidth} from '../../../../../shared/exporter';
import styles from './styles';

const NewsBlogDetail = ({route}: any) => {
  const item = route.params?.item;

  return (
    <MainWrapper>
      <AppHeader title="Detail" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={item?.image_url ? {uri: item?.image_url} : appIcons.appLogo}
          style={styles.imageStyle}
          resizeMode={item?.image_url ? 'cover' : 'contain'}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.titleTextStyle}>{item?.title}</Text>
          <Text style={styles.timeTextStyle}>
            {moment(item?.created_at).format('MM-DD-YYYY')}
          </Text>
          {item?.content && (
            <RenderHTML
              contentWidth={scrWidth}
              source={{html: item?.content}}
              baseStyle={styles.htmlBaseStyle}
            />
          )}
        </View>
      </ScrollView>
    </MainWrapper>
  );
};

export default NewsBlogDetail;
