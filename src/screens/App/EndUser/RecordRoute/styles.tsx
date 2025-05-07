import {StyleSheet} from 'react-native';
import {
  HP,
  isIOS,
  PFColors,
  PFFonts,
  PFFontSize,
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
    padding: 15,
    position: 'absolute',
    bottom: isIOS() ? WP('20') : WP('15'),
    right: 20,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  timeText: {
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    width: WP('20'),
  },
  videoCam: {
    position: 'absolute',
    bottom: isIOS() ? WP('18') : WP('15'),
    right: 10,
  },
  recenterIcon: {
    position: 'absolute',
    top: isIOS() ? HP('78') : HP('70'),
    left: 13,
  },
});
export default styles;
