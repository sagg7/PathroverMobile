import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {AppButton} from '../AppButton';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

interface NoChatProps {
  title: string;
  subTitle?: string;
  buttonTitle?: string;
  onPress?: () => void;
}

const NoChat = ({title, subTitle, buttonTitle, onPress}: NoChatProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>{title}</Text>
      {subTitle && <Text style={styles.subTitleStyle}>{subTitle}</Text>}
      {buttonTitle && (
        <AppButton
          title={buttonTitle}
          handleClick={onPress}
          textStyle={styles.buttonText}
          buttonStyle={styles.buttonStyle}
        />
      )}
    </View>
  );
};

export {NoChat};

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: '38%',
    height: 44,
  },
  titleStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_20,
    fontFamily: PFFonts.Foundation.SemiBold,
    textAlign: 'center',
  },
  subTitleStyle: {
    color: PFColors.Gray.LightGray,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
    textAlign: 'center',
    marginVertical: 18,
  },
  buttonText: {
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Regular,
  },
});
