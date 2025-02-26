import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import {appIcons, PFColors} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import {useNavigation} from '@react-navigation/native';

interface HeaderViewProp {
  switchOn?: any;
  onPressFilter?: () => void;
  onPressWeather: () => void;
  onPressSearch: () => void;
  userPicture: any;
}

const HeaderView = ({
  onPressFilter,
  onPressWeather,
  onPressSearch,
  userPicture,
}: HeaderViewProp) => {
  const navigation: any = useNavigation();
  return (
    <View style={styles.headerView}>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Image
          source={
            typeof userPicture === 'string'
              ? {uri: userPicture}
              : appIcons.userPlaceholder
          }
          style={styles.userIcon}
        />
      </TouchableOpacity>
      <View style={styles.toggleView}>
        {/*TODO uncomment width from  toggleView class */}
        {/* <TouchableOpacity onPress={onPressSearch}>
          {svgIcon.SearchView}
        </TouchableOpacity> */}

        {/* <TouchableOpacity onPress={onPressFilter}>
          {svgIcon.FilterOrange}
        </TouchableOpacity> */}
        <TouchableOpacity onPress={onPressWeather}>
          {svgIcon.WeatherIcon}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderView;
