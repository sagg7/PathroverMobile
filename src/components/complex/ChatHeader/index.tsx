import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {appIcons} from '../../../assets/icons';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

interface ChatHeaderProps {
  isInitial?: boolean;
  isMenu?: boolean;
  showIcon?: boolean;
  onPress: () => void;
}

const ChatHeader = ({
  onPress,
  isMenu = false,
  showIcon = true,
  isInitial = true,
}: ChatHeaderProps) => {
  return (
    <View style={styles.headerContainer(showIcon)}>
      <Text style={styles.homeText}>Chat</Text>
      {showIcon && (
        <TouchableOpacity onPress={onPress} hitSlop={20}>
          {isInitial ? (
            <View style={styles.textView}>
              <Text style={styles.textStyle}>All Users</Text>
            </View>
          ) : (
            <Image
              source={isMenu ? appIcons.menuIcons : appIcons.settingIcon}
              style={isMenu ? styles.menuIcon : styles.settingIcon}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  headerContainer: (isIcon: boolean) => ({
    backgroundColor: PFColors.Standard.White,
    flexDirection: 'row',
    justifyContent: isIcon ? 'space-between' : 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: PFColors.Standard.Black,
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    width: '100%',
  }),
  settingIcon: {
    height: 32,
    width: 32,
  },
  menuIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  homeText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
  },
  textStyle: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Blue.Dark,
  },
  textView: {
    backgroundColor: PFColors.Blue.lightBlue,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
});
