import {View, Text} from 'react-native';
import React from 'react';
import styles from './styles';
import SwitchToggle from 'react-native-switch-toggle';
import {PFColors} from '../../../../shared/exporter';

interface HeaderViewProp {
  switchOn?: any;
  onPressToggle: () => void;
}

const HeaderView = ({onPressToggle, switchOn}: HeaderViewProp) => {
  return (
    <View style={styles.headerView}>
      <Text style={styles.titleStyles}>WellPath</Text>
      <View style={styles.toggleView}>
        <Text style={styles.freeFeatureText}>Free Feature</Text>
        <SwitchToggle
          switchOn={switchOn}
          onPress={onPressToggle}
          circleColorOff={PFColors.Gray.AshGray}
          circleColorOn={PFColors.Blue.Dark}
          backgroundColorOn={PFColors.Blue.SoftGlacier}
          backgroundColorOff={PFColors.Gray.FrostedGray}
          circleStyle={styles.circleStyle}
          containerStyle={styles.toggleContainer}
        />
      </View>
    </View>
  );
};

export default HeaderView;
