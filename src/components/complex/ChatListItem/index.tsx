import dayjs from 'dayjs';
import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {appIcons} from '../../../assets/icons';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';
import {getFormattedTime, isToday} from '../../../hooks/getFormattedDate';
import {MESSAGE_CONTAINS_LOCATION} from '../../../shared/utils/constant';
import {extractType} from '../../../shared/utils/helpers';

interface ChatListItemProps {
  item: object;
  onPress: () => void;
  onPressDelete: () => void;
}

function RightAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  onPress: () => void,
) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: drag.value + 80}],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <TouchableOpacity onPress={onPress} style={styles.deleteView}>
        {svgIcon.ChatDelete}
      </TouchableOpacity>
    </Reanimated.View>
  );
}

const ChatListItem = ({onPress, onPressDelete, item}: ChatListItemProps) => {
  const ref = React.useRef(null);
  const handleClose = () => {
    ref.current?.close();
    onPressDelete();
  };

  const getTime = (time: string) => {
    if (time) {
      const isToDate = isToday(time);
      if (isToDate) {
        return dayjs(time).format('hh:mm a');
      } else {
        return getFormattedTime(time);
      }
    } else {
      return dayjs().format('hh:mm a');
    }
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        ref={ref}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={(progress, dragX) =>
          RightAction(progress, dragX, handleClose)
        }>
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <Image
            source={
              item?.image_url
                ? {uri: item?.image_url}
                : item?.user?.avatar
                ? {uri: item?.user?.avatar}
                : appIcons.userPlaceholder
            }
            style={styles.imageStyle}
          />
          <View style={styles.textView}>
            {typeof item?.user === 'object' && (
              <Text style={styles.nameText}>
                {[item?.user?.first_name, item?.user?.last_name]
                  ?.filter(Boolean)
                  ?.join(' ') || 'User'}
              </Text>
            )}
            {item?.name && (
              <Text style={styles.nameText}>{item?.name || ''}</Text>
            )}
            {item?.last_message && (
              <Text style={styles.detailText} numberOfLines={1}>
                {typeof item?.last_message === 'object'
                  ? (item?.last_message?.content || '').includes(
                      MESSAGE_CONTAINS_LOCATION,
                    )
                    ? `Shared ${extractType(item)}`
                    : item?.last_message?.content || ''
                  : item?.last_message ??''}
              </Text>
            )}
          </View>
          <View style={styles.rightView(item?.count > 0)}>
            <Text style={styles.timeText}>
              {getTime(
                item?.created_at ||
                  item?.last_message_time ||
                  item?.last_message?.sent_at,
              )}
            </Text>
            {item?.unread_messages > 0 && (
              <View style={styles.countView}>
                <Text style={styles.countText}>{item?.unread_messages}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PFColors.Standard.White,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: PFColors.Orange.Light,
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 48,
    backgroundColor: PFColors.Gray.LightMist,
  },
  deleteView: {
    backgroundColor: PFColors.Orange.Dark,
    height: '100%',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textView: {
    flexDirection: 'column',
    width: '62%',
  },
  rightView: (isCount: boolean) => ({
    width: '20%',
    alignItems: 'flex-end',
    justifyContent: isCount ? 'space-between' : 'center',
    height: '90%',
  }),
  timeText: {
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Medium,
  },
  nameText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
    marginBottom: 4,
  },
  detailText: {
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.Medium,
  },
  countText: {
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Medium,
  },
  countView: {
    backgroundColor: PFColors.Blue.Dark,
    borderRadius: 40,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
});
