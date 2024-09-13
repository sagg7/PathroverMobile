import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import {
  WP,
  PFColors,
  PFFonts,
  PFFontSize,
  appIcons,
  isIOS,
} from '../../../shared/exporter';

interface ItemInfoCardProps {
  value?: string;
  isRed: boolean;
  item?: any;
  isInfo?: boolean
}

interface Styles {
  container: ViewStyle;
  alertIcon: ImageStyle;
  innerContainer: ViewStyle;
  listTitle: TextStyle;
  listText: TextStyle;
  lengthText: TextStyle;
  standardLengthContainer: ViewStyle;
}

const ItemInfoCard: React.FC<ItemInfoCardProps> = ({ isRed = true, item, isInfo }) => {

  return (
    <>
      <View style={styles.container(isRed)}>
        <Image
          source={appIcons.alertMiniIcon}
          style={styles.alertIcon(isRed)}
        />
        <View style={styles.innerContainer}>
          {!item?.standardLengths?.length > 0 ? (
            <>
              <Text style={styles.listTitle(isRed)}>
                {item?.title || 'Alert'}
              </Text>
              <Text style={styles.listText(isRed)}>{item?.capacity}</Text>
            </>
          ) : (
            <>
              <Text style={styles.listTitle(isRed)}>Description</Text>
              <Text style={styles.listText(isRed)}>{item?.description}</Text>
              <Text style={styles.listTitle(isRed)}>Weight Capacity</Text>
              <Text style={styles.listText(isRed)}>{item?.weightCapacity}</Text>

              <Text style={styles.listTitle(isRed)}>Standard Lengths</Text>
              <View style={styles.standardLengthContainer}>
                {item?.standardLengths?.map((val, index) => (
                  <Text key={index} style={styles.lengthText}>
                    {val}
                    {index !== item.standardLengths.length - 1 && ', '}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: red => ({
    width: WP('94'),
    borderRadius: WP('3'),
    flexDirection: 'row',
    paddingHorizontal: WP('4'),
    backgroundColor: red
      ? PFColors.Red.LightPinkinshRed
      : PFColors.Blue.SoftGlacier,
    alignSelf: 'center',
    padding: 15,
  }),
  valueStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
    paddingTop: 5,
  },
  listTitle: red => ({
    color: red ? PFColors.Orange.Dark : PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingTop: isIOS() ? 3 : 1,
  }),
  alertIcon: red => ({
    height: WP('5'),
    width: WP('5'),
    tintColor: !red ? PFColors.Blue.Dark : null,
  }),
  listText: red => ({
    color: red ? PFColors.Orange.Dark : PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    lineHeight: 25,
    paddingTop: 5,
    width: WP('78'),
  }),
  innerContainer: {
    marginLeft: WP('2'),
  },
  lengthText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    lineHeight: 25,
    paddingTop: 5,
  },
  standardLengthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: WP('80%'),
  },
});

export { ItemInfoCard };
