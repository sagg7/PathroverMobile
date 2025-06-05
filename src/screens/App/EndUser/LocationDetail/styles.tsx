import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  bottomSheet: {
    margin: 0,
    justifyContent: 'flex-end',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    zIndex: 11,
  },
  main: {
    backgroundColor: PFColors.Standard.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scale(4),
  },
  ratingView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: scale(8),
  },
  detailsView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleView: {
    padding: scale(3),
    borderRadius: 3,
    backgroundColor: PFColors.Gray.borderGray,
    marginHorizontal: scale(8),
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    justifyContent: 'center',
    width: '80%',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: scale(6),
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButtonStyle: isDark => ({
    backgroundColor: isDark
      ? PFColors.Blue.Dark
      : `${PFColors.Blue.SoftBlue}30`,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
    borderRadius: 36,
    marginRight: scale(6),
    marginVertical: scale(4),
    flexDirection: 'row',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  }),
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(6),
  },
  imageStyle: {
    height: 118,
    width: 152,
    borderRadius: 14.75,
    backgroundColor: PFColors.Gray.LightMist,
    marginRight: scale(6),
    marginVertical: scale(4),
  },
  locationText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Bold,
    fontSize: PFFontSize.FONT_SIZE_16,
  },
  ratingText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_12,
    marginRight: scale(6),
    marginTop: scale(2),
  },
  ratingCountText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_12,
    marginHorizontal: scale(8),
    marginTop: scale(2),
  },
  detailText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    marginLeft: scale(5),
  },
  actionButton: {
    marginLeft: scale(6),
  },
  iconButtonText: isDark => ({
    color: !isDark ? PFColors.Blue.Dark : PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    marginLeft: scale(4),
  }),

  contentView: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginHorizontal: WP('2'),
    // marginVertical: 5,
    // backgroundColor: 'pink',
  },
  trailNameStyle: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    width: WP('90'),
    paddingLeft: 10,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  barStyle: {
    width: WP('90'),
    height: 1,
    backgroundColor: PFColors.Gray.FrostedGray,
    marginVertical: 10,
  },
  container: {
    backgroundColor: PFColors.Standard.SoftWhite,
    paddingHorizontal: WP('3'),
    paddingVertical: WP('2'),
    borderRadius: 40,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    margin: WP('.5'),
    marginLeft: 10,
  },
  text: {
    fontSize: PFFontSize.FONT_SIZE_10,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    textTransform: 'capitalize',
  },
  routeInfoText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
  },
  timeText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
  },
  routeInfoView: {
    flexDirection: 'row',
    paddingVertical: 12,
    width: WP('92'),
    alignSelf: 'center',
  },
  shareIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEFF3',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  buttonText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    marginLeft: 8,
  },
  actionBtnView: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  actionBtnViewSecond: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-between',
    width: WP('65'),
  },

  listContainer: {
    paddingHorizontal: 10,
  },
  bubble: {
    backgroundColor: '#C8E0FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontSize: PFFontSize.FONT_SIZE_12,
    color: '#13488A',
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  categoryText: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingVertical: 10,
    paddingLeft: WP('3'),
    paddingTop: 0,
  },
});

export default styles;
