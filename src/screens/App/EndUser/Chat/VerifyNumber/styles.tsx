import {StyleSheet} from 'react-native';
import {
  HP,
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  desc: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    paddingVertical: WP('5'),
    lineHeight: 25,
  },
  resendText: {
    color: PFColors.Standard.GrayBlack,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
  },
  timerText: {
    color: PFColors.Standard.TimerBlack,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  otpInput: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: (cel: boolean) => ({
    height: WP('12'),
    width: WP('12'),
    alignItems: 'center',
    marginTop: HP('5'),
    justifyContent: 'center',
    backgroundColor: cel ? PFColors.Blue.Dark : PFColors.Standard.Disable,
    borderRadius: 12,
  }),
  txtStyle: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_28,
    color: PFColors.Standard.White,
    textAlign: 'center',
  },
  otpView: {
    width: WP('60'),
    alignSelf: 'center',
  },
  focusCell: {
    borderWidth: 1,
  },
  btnContainer: (isOpen: boolean) => ({
    marginBottom: isOpen ? 300 : 40,
  }),
  divider: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 12,
    flex: 1,
  },
  timerView: {
    alignSelf: 'center',
    marginTop: 22,
    flexDirection: 'row',
  },
});
export default styles;
