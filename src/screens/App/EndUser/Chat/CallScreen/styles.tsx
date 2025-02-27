import {StyleSheet} from 'react-native';
import {
  HP,
  WP,
  PFFonts,
  PFColors,
  PFFontSize,
  scale,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  callerBackGround: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: PFColors.Standard.Disable,
  },

  singleCallerImage: {
    width: WP('25'),
    height: WP('30'),
    position: 'absolute',
    top: '8%',
    right: '10%',
    borderRadius: WP('4'),
  },
  userConatiner: {
    position: 'absolute',
    top: '8%',
    left: WP('5'),
  },

  callerNameTextStyle: {
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_26,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  callTime: {
    marginTop: WP('2'),
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  callerAction: {
    width: '100%',
    height: HP('18'),
    position: 'absolute',
    backgroundColor: `${PFColors.Standard.Black}90`,
    bottom: 0,
    left: 0,
    borderTopLeftRadius: WP('4'),
    borderTopRightRadius: WP('4'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconBackGround: isActive => ({
    width: WP('18'),
    height: WP('18'),
    borderRadius: WP('10'),
    backgroundColor: isActive
      ? PFColors.Blue.Dark
      : `${PFColors.Standard.White}30`,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  iconBackGroundRed: {
    width: WP('18'),
    height: WP('18'),
    borderRadius: WP('10'),
    backgroundColor: PFColors.Red.RadiantRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDetails: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iiconTextStyle: {
    marginTop: WP('2'),
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  endButton: {
    // backgroundColor: PFColors.Red.RadiantRed,
  },
  callButtonView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: scale(16),
    marginBottom: scale(12),
  },
  iconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: PFColors.Standard.White,
  },
  callIconStyle: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  backIconStyle: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
});
export default styles;
