import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  AccessibilityState,
} from 'react-native';

import styles from './styles';
import ChatHeader from '../ChatHeader';
import CreateGroupModal from '../CreateGroupModal';

export default function ChatTopTabBar({state, descriptors, navigation}) {
  const [show, setShow] = useState(false);

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
