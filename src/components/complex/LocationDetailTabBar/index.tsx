import React from 'react';
import {
  AccessibilityState,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

export default function LocationDetailTabBar({ state, descriptors, navigation }) {

  return (
    <>
      <View style={styles.mainContainer}>
        {state?.routes?.map((route, index) => {
          const { options } = descriptors[route.key];
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
                  isFocused ? ({ selected: true } as AccessibilityState) : {}
                }
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabBtn}>
                <Text style={styles.titleStyle(isFocused)}>{label}</Text>
              </TouchableOpacity>
              {isFocused && <View style={styles.lineStyle(isFocused)} />}
            </SafeAreaView>
          );
        })}

      </View>
      <View style={styles.bottomLineStyle} />
    </>
  );
}
