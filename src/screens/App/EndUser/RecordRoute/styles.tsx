import {StyleSheet} from 'react-native';
import {
  isIOS,
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PFColors.Standard.White,
  },
  map: {
    flex: 1,
  },
  inputStyles: {
    position: 'absolute',
    zIndex: 1111,
    top: isIOS() ? WP('12') : 1,
  },
  maplayerStyles: {
    position: 'absolute',
    bottom: isIOS() ? WP('20') : WP('15'),
    left: 10,
  },
  bllueView: {
    backgroundColor: PFColors.Blue.Dark,
    // padding: 15,
    position: 'absolute',
    bottom: 40,
    right: 20,
    borderRadius: 50,
    flexDirection: 'row',
    width: WP('37'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  timeText: {
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
});
export default styles;
