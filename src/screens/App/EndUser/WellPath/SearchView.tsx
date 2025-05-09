import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import styles from './styles';
import {appIcons} from '../../../../assets/icons';

interface SearchViewProp {
  onPressSearch: () => void;
  onPressFilter: any;
  onPressMenu: any;
}

const SearchView = ({
  onPressSearch,
  onPressFilter,
  onPressMenu,
}: SearchViewProp) => {
  return (
    <View style={styles.searchView}>
      <TouchableOpacity onPress={onPressSearch}>
        <Image
          resizeMode="contain"
          source={appIcons.searchBar}
          style={styles.searchbar}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressFilter}>
        <Image
          resizeMode="contain"
          source={appIcons.filterFill}
          style={styles.filterIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressMenu}>
        <Image
          resizeMode="contain"
          source={appIcons.menuIcon}
          style={styles.filterIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchView;
