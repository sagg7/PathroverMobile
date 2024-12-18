import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  Text,
} from 'react-native';
import React from 'react';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, isIOS} from '../../../shared/exporter';

type BottomTabProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

type Route = {
  key: string;
  name: string;
};

export const BottomTab: React.FC<BottomTabProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const renderIcon = (index: number, name: string) => {

    switch (index) {
      case 0:
        return name === 'Request Life'
          ? svgIcon.RequestList
          : svgIcon.MyRequest;
      case 1:
        return name === 'Wallet' ? svgIcon.Wallet : svgIcon.CreateRoute;
      case 2:
        return name === 'Order History' ? svgIcon.OrderHistory : svgIcon.RequestHistory;
      default:
        return svgIcon.More;
    }
  };

  const renderItem = ({item, index}: ListRenderItemInfo<Route>) => {
    const {options} = descriptors[item.key];
    const label = options.tabBarLabel || options.title || item.name;
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: item.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate({name: item.name, merge: true});
      }
    };

    return (
      <View style={styles.itemContainer(isFocused)}>
        <TouchableOpacity onPress={onPress} style={styles.tabContent}>
          {renderIcon(index, item.name)}
          <Text style={styles.tabName(isFocused)}>{label}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        numColumns={4}
        data={state?.routes}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: PFColors.Blue.SoftSkyBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PFColors.Standard.Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemContainer: (focused: boolean) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: focused
      ? PFColors.Standard.White
      : PFColors.Blue.SoftSkyBlue,
    borderBottomRightRadius: focused ? 30 : 0,
  }),
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    paddingBottom: isIOS() ? 5 : 0,
    paddingVertical: 2,
  },

  tabName: (isFocused: boolean) => ({
    fontSize: 10,
    color: isFocused ? PFColors.Standard.Black : PFColors.Gray.DarkGray,
    textAlign: 'center',
    paddingTop: 7,
    fontFamily: PFFonts.Foundation.Regular,
  }),
});
