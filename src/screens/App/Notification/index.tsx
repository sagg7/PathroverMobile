import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppHeader, MainWrapper} from '../../../components';
import {svgIcon} from '../../../assets/svg';
import {appImages, PFColors, PFFonts} from '../../../shared/exporter';
import {scale} from '../../../shared/theme/responsive';

const Notification = () => {
  return (
    <MainWrapper>
      <AppHeader title="Notifications" />
      <FlatList
        contentContainerStyle={styles.flatlistContainerStyle}
        data={[1]}
        renderItem={({item}) => (
          <View style={styles.container}>
            {svgIcon.ClockBlack}
            <View style={styles.contentView}>
              <Text style={styles.contentText}>
                Lorem ipsum dolor sit amet consectetur. At lectus diam a sit
                aliquet.
              </Text>
              <Text style={styles.timeText}>25m</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noDataView}>
            <Image
              source={appImages.noNotification}
              style={styles.emptyImage}
            />
          </View>
        )}
      />
    </MainWrapper>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: PFColors?.Gray.WhisperGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    borderRadius: scale(12),
  },
  contentView: {
    marginLeft: scale(16),
    flex: 1,
  },
  flatlistContainerStyle: {
    paddingHorizontal: scale(16),
    marginTop: scale(16),
    flex:1
  },
  contentText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(12),
    color: PFColors.Standard.Black,
    marginBottom: scale(4),
  },
  timeText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(10),
    color: PFColors.Gray.DarkGray,
  },
  emptyImage: {
    height: scale(100),
    width: scale(300),
    resizeMode:'contain'
  },
  noDataView:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  }
});
