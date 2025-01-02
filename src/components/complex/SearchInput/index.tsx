import {Image, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {appIcons, PFColors, scale, WP} from '../../../shared/exporter';

const SearchInput = () => {
  return (
    <View style={styles.searchInputView}>
      <View style={styles.sarchInputInnerView}>
        <Image
          source={appIcons.searchIconBlack}
          style={styles.searchIconStyles}
        />
        <TextInput
          style={styles.inputtyles}
          placeholder="Search"
          editable={false}
        />
      </View>
    </View>
  );
};

export {SearchInput};

const styles = StyleSheet.create({
  sarchInputInnerView: {
    backgroundColor: PFColors.Standard.White,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
  },
  searchInputView: {
    height: 100,
    position: 'absolute',
    zIndex: 1,
    width: WP('100'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  inputtyles: {
    backgroundColor: PFColors.Standard.White,
    height: scale(50),
    width: WP('80'),
    borderRadius: 30,
  },
  searchIconStyles: {
    height: WP('5'),
    width: WP('5'),
    marginHorizontal: WP('3'),
  },
});
