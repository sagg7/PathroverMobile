import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { PFColors } from '../../../shared/exporter';

const AppLoader: React.FC<{}> = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={PFColors.Blue.Dark} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export { AppLoader };
