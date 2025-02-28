import {StyleSheet} from 'react-native';
import {
  isIOS,
  PFColors,
  PFFonts,
  PFFontSize,
  WP,
} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  listConatainer: {
    backgroundColor: PFColors.Gray.WhisperGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WP('92'),
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 5,
  },
  setingOptionIcon: {
    height: WP('5'),
    width: WP('5'),
  },
  listOptionText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('3'),
  },
  iconContainer: {
    borderRadius: 9,
    height: WP('7.5'),
    width: WP('7.5'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingVertical: WP('5'),
    paddingHorizontal: WP('5'),
  },
  btnStyles: {
    position: 'absolute',
    bottom: isIOS() ? WP('20') : WP('8'),
    width: WP('90'),
    alignSelf: 'center',
  },
  downloadView: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: PFColors.Blue.Dark,
    bottom: 30,
    width: '90%',
    alignSelf: 'center',
  },
  titleStyles: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    textAlign: 'center',
  },
});
export default styles;
