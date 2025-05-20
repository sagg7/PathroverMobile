import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { PFColors } from '../../../shared/exporter';
import { Text } from 'react-native';

const AppLoader: React.FC<{}> = ({title}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={PFColors.Blue.Dark} />
      {title && (<Text style={styles.titleStyle}>{title}</Text>)}
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
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  titleStyle: {
    fontSize: 16,
    color: PFColors.Standard.Black,
    marginTop: 10,
  }
});

export { AppLoader };
