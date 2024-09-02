import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {
  WP,
  Routes,
  PFFontSize,
  PFColors,
  PFFonts,
} from '../../../shared/exporter';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../..';

interface SuccessInfoProps {
  icon?: any;
  title?: string;
  buttonText?: string;
  description?: string;
}
const SuccessInfo: React.FC<SuccessInfoProps> = ({
  icon,
  title,
  buttonText,
  description,
}) => {
  const navigation = useNavigation();

  return (

    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {icon}
        <Text style={styles.titleTextStyle}>{title}</Text>
        <Text style={styles.descTextStyle}>{description}</Text>
      </View>

      <AppButton
        title={buttonText || ''}
        handleClick={() => navigation.replace(Routes.ContinueAs)}
        buttonStyle={styles.bottomButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: WP('5'),
  },
  innerContainer: { justifyContent: "center", alignItems: "center", flex: 1 },
  titleTextStyle: {
    marginTop: WP('8'),
    marginBottom: WP('2'),
    fontSize: PFFontSize.FONT_SIZE_20,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
  },
  descTextStyle: {
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: WP('8'),
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_20,
    fontFamily: PFFonts.Foundation.Medium
  },
  bottomButton: {
    bottom: 40
  }

});

export { SuccessInfo };
