import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import styles from './styles';
import {svgIcon} from '../../../../../assets/svg';
import {useIsFocused} from '@react-navigation/native';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import {useGetUserCallQuery} from '../../../../../redux/chat/chatApiSlice';
import {Routes} from '../../../../../shared/exporter';

const CallList = ({navigation}: any) => {
  const isFocused = useIsFocused();
  const {data, refetch} = useGetUserCallQuery();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  const formatCallingTime = callingTime => {
    if (!callingTime) {
      return '';
    }

    const date = new Date(callingTime);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      date.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString();

    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    let dateLabel;
    if (isToday) {
      dateLabel = 'Today';
    } else if (isYesterday) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = `${diffInDays} days ago`;
    }

    return `${dateLabel}, ${date.toLocaleTimeString()}`;
  };

  // Filter call logs based on searchQuery
  const filteredCallLogs = data?.user_info?.filter(item => {
    const fullName =
      `${item?.user_info?.first_name} ${item?.user_info?.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.userCallLog}>
        <View style={styles.userDetailsContainer}>
          {item?.user_info?.avatar ? (
            <Image
              source={item?.user_info?.avatar}
              style={styles.callerImage}
            />
          ) : (
            <View style={styles.noImageCaller}>
              <Text style={styles.noImageTextStyle}>
                {item?.user_info?.first_name?.charAt(0) ?? ''}
              </Text>
            </View>
          )}

          <View>
            <Text style={styles.callerName}>
              {`${item?.user_info?.first_name ?? 'User'} ${
                item?.user_info?.last_name ?? ''
              }`}
            </Text>
            <View style={styles.callerTimer}>
              <Text style={styles.callerTextStyle}>
                {formatCallingTime(item?.calling_time)}
              </Text>
              {item?.out_going_in_coming === 'outgoing'
                ? svgIcon.OutgoingCall
                : svgIcon.IncomingCall}
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (item?.call_type === 'audio_call') {
              navigation.navigate('VoiceCalling', {
                user: item?.user_info,
                // channel: Platform.OS === 'android' ? 'call_501222' : '',
              });
            }
            if (item?.call_type === 'video_call') {
              navigation.navigate('VideoCalling', {
                user: item?.user_info,
                // channel: Platform.OS === 'android' ? 'call_501222' : '',
              });
            }
          }}>
          {item?.call_type === 'audio_call'
            ? svgIcon.BlackPhone
            : svgIcon.VideoIcon}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <ChatSearch
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />

      <View style={styles.callContainer}>
        <FlatList
          renderItem={renderItem}
          data={data?.call_logs}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No Call Logs Found</Text>
          )}
        />
      </View>
    </View>
  );
};

export default CallList;
