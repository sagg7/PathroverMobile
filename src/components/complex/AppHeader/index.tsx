import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  WP,
  PFColors,
  PFFontSize,
  PFFonts,
  isIOS,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import {useNavigation} from '@react-navigation/native';

interface AppHeaderProps {
  title?: string;
  leftIcon?: boolean;
  rightIcon?: boolean;
  clickBackIcon?: () => void;
  clickRightIcon?: () => void;
  desc?: string;
  subtitle?: string;
  isLeftAddIcon?: boolean;
  isWallet?: boolean;
}
const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  clickBackIcon,
  clickRightIcon,
  leftIcon = true,
  rightIcon = false,
  isWallet = false,
  subtitle,
  desc,
}) => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.container}>
        {leftIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={20}
            onPress={() =>
              clickBackIcon ? clickBackIcon() : navigation.goBack()
            }>
            {leftIcon ? svgIcon.BackArrow : <View style={styles.emptyView} />}
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyView} />
        )}
        <Text style={styles.textStyle}>{title}</Text>

        {rightIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={20}
            onPress={() => {
              clickRightIcon();
            }}>
            {isWallet ? svgIcon.BankAccount : svgIcon.Add}
            {/* {svgIcon.NotifyIcon} */}
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyView} />
        )}
      </View>
      {subtitle && (
        <>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.desc}>{desc}</Text>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: WP('4'),
    height: WP('12'),
    backgroundColor: PFColors.Standard.White,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    alignItems: 'center',
    shadowColor: PFColors.Standard.Black,
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  textStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  logoStyle: {
    width: WP('25'),
    height: WP('6'),
  },
  emptyView: {
    width: WP('6'),
    height: WP('6'),
  },
  subtitle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingHorizontal: WP('4'),
    paddingVertical: WP('2'),
    paddingTop: WP('4'),
  },
  desc: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    paddingHorizontal: WP('4'),
  },
});

export {AppHeader};
