import React, {useEffect, useState} from 'react';
import {
  AccessibilityState,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useSelector} from 'react-redux';
import {useGetChatCountMutation} from '../../../redux/chat/chatApiSlice';
import ChatHeader from '../ChatHeader';
import CreateGroupModal from '../CreateGroupModal';
import styles from './styles';

export default function ChatTopTabBar({state, descriptors, navigation}) {
  const [getChatCount] = useGetChatCountMutation();
  const {chat_count} = useSelector(state => state.chat);

  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      await getChatCount();
    })();
  }, []);

  const onPress = (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate('ChatUsers');
        return;
      case 1:
        setShow(true);
        return;
      case 2:
        return;
      default:
        return;
    }
  };
  return (
    <>
      <ChatHeader
        isMenu={state.index !== 0}
        showIcon={state.index !== 2}
        isInitial={state.index === 0}
        onPress={() => onPress(state.index)}
      />
      <View style={styles.mainContainer}>
        {state?.routes?.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options?.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options?.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const getCount = label => {
            switch (label) {
              case 'Chats':
                return chat_count?.one_to_one;
              case 'Groups':
                return chat_count?.group;
              default:
                return 0;
            }
          };

          return (
            <SafeAreaView key={route.key} style={styles.tabBarView}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={
                  isFocused ? ({selected: true} as AccessibilityState) : {}
                }
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabBtn}>
                <Text style={styles.titleStyle}>{label}</Text>
                {getCount(label) > 0 && (
                  <View style={styles.countViewStyle}>
                    <Text style={styles.countStyle}>{getCount(label)}</Text>
                  </View>
                )}
              </TouchableOpacity>
              {isFocused && <View style={styles.lineStyle} />}
            </SafeAreaView>
          );
        })}
      </View>
      {show && (
        <CreateGroupModal
          isVisible={show}
          onPress={() => {
            setShow(false);
            navigation.navigate('MemberList');
          }}
          tagText={'Add New Group'}
          onPressClose={() => setShow(false)}
        />
      )}
    </>
  );
}
