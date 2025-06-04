import React from 'react';
import {ScrollView, View} from 'react-native';
import styles from './styles';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';

const Overview = () => {
  const {selectedCustomTrail} = useSelector(
    (state: any) => state?.endUser?.trailRoute,
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.textStyle}>{selectedCustomTrail?.description}</Text>
      </ScrollView>
    </View>
  );
};

export default Overview;
