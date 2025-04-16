import {StyleSheet} from 'react-native';
import {PFFonts, PFColors, PFFontSize} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
    paddingVertical: 6,
    shadowColor: PFColors.Standard.Black,
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    marginVertical: 4,
    backgroundColor: PFColors.Standard.White,
  },
  settingIcon: {
    width: 32,
    height: 32,
  },
  homeTextStyle: {
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.LightBlack,
    fontFamily: PFFonts.Foundation.Medium,
  },
  headingTextStyle: {
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.LightBlack,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  itemContainer: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: PFColors.Gray.LightMist,
  },
  imageStyle: {
    width: 124,
    height: 110,
    borderRadius: 5,
    backgroundColor: PFColors.Gray.AshGray,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  titleTextStyle: {
    lineHeight: 18,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.LightBlack,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  descTextStyle: {
    lineHeight: 18,
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Regular,
  },
  timeTextStyle: {
    lineHeight: 18,
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_8,
    fontFamily: PFFonts.Foundation.Regular,
  },
  noRecordContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRecordTextStyle: {
    bottom: 8,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.LightBlack,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
});

export default styles;
