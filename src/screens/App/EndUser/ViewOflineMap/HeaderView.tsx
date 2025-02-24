import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import {appIcons, PFColors} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';

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
  return (
    <View style={styles.headerView}>
      <Image
        source={
          typeof userPicture === 'string'
            ? {uri: userPicture}
            : appIcons.userPlaceholder
        }
        style={styles.userIcon}
      />
      <View style={styles.toggleView}>
        <TouchableOpacity onPress={onPressSearch}>
          {svgIcon.SearchView}
        </TouchableOpacity>

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
