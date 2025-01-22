import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppHeader, MainWrapper} from '../../../components';
import {svgIcon} from '../../../assets/svg';
import {appImages, PFColors, PFFonts} from '../../../shared/exporter';
import {scale} from '../../../shared/theme/responsive';
import {useSelector} from 'react-redux';
import {useUserNotificationMutation} from '../../../redux/common/commonApiSlice';
import {useIsFocused} from '@react-navigation/native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Notification = () => {
  const isFocused = useIsFocused();
  const [list, setList] = useState<any[]>([]);

  const userRole = useSelector(state => state?.appRole.userRole);
  const [userNotification, {isLoading}] = useUserNotificationMutation();

  useEffect(() => {
    getNotifications();
  }, [isFocused]);

  const getNotifications = async () => {
    try {
      const res = await userNotification(userRole);

      const {notifications} = res?.data;

      if (notifications?.length > 0) {
        setList([...notifications].reverse());
      } else {
        setList([]);
      }
    } catch (error) {
      setList([]);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.container}>
        {svgIcon.ClockBlack}
        <View style={styles.contentView}>
          {item?.title && (
            <Text style={styles.contentText}>{item?.title || ''}</Text>
          )}
          {item?.body && (
            <Text style={styles.subContentText}>{item?.body || ''}</Text>
          )}
          <Text style={styles.timeText}>
            {dayjs(item?.created_at).fromNow()}
          </Text>
        </View>
      </View>
    );
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.noDataView}>
        <Image source={appImages.noNotification} style={styles.emptyImage} />
      </View>
    );
  };

  return (
    <MainWrapper>
      <AppHeader title="Notifications" />
      <FlatList
        data={list}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={styles.flatlistContainerStyle}
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
    marginVertical: scale(6),
  },
  contentView: {
    marginLeft: scale(16),
    flex: 1,
  },
  flatlistContainerStyle: {
    paddingHorizontal: scale(16),
    marginTop: scale(16),
    paddingBottom: scale(30),
    flexGrow: 1,
  },
  contentText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(14),
    color: PFColors.Standard.Black,
    marginBottom: scale(4),
  },
  subContentText: {
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
    resizeMode: 'contain',
  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
