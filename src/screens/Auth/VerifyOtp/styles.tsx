import { StyleSheet } from 'react-native';
import { HP, PFColors, PFFontSize, PFFonts, WP } from '../../../shared/exporter';

const styles = StyleSheet.create({

  desc: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    paddingHorizontal: WP('4'),
    paddingVertical: WP('5'),
    lineHeight: 25
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
    width: WP("60"),
    alignSelf: 'center',
  },
  focusCell: {
    borderWidth: 1,
  },

});
export default styles;
