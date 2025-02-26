import {StyleSheet} from 'react-native';

import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  callButtonView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconDetails: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackGround: (isActive: boolean) => ({
    width: WP('15'),
    height: WP('15'),
    borderRadius: WP('15'),
    backgroundColor: isActive
      ? PFColors.Blue.Dark
      : `${PFColors.Standard.White}50`,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  iconTextStyle: {
    marginTop: WP('2'),
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  userName: {
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.Bold,
    fontSize: PFFontSize.FONT_SIZE_16,
    position: 'absolute',
    top: 30,
    left: 16,
  },
  counterText: {
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.Bold,
    fontSize: PFFontSize.FONT_SIZE_16,
    position: 'absolute',
    top: 30,
    right: 16,
  },
  iconBackGroundRed: {
    width: WP('15'),
    height: WP('15'),
    borderRadius: WP('15'),
    backgroundColor: PFColors.Red.RadiantRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: PFColors.Standard.White,
  },
  callIconStyle: {
    height: 27,
    width: 27,
    resizeMode: 'contain',
  },
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: PFColors.Standard.GrayBlack,
    position: 'absolute',
    bottom: 0,
    paddingVertical: scale(18),
  },
  cameraView: {
    flex: 1,
    backgroundColor: PFColors.Standard.Black,
  },
  containerView: {
    borderWidth: 2,
    borderColor: PFColors.Gray.LightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
