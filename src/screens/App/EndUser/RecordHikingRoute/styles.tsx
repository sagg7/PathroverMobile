import {StyleSheet} from 'react-native';
import {
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
    bottom: isIOS() ? WP('25') : WP('20'),
    left: 10,
  },

  videoCam: {
    position: 'absolute',
    bottom: isIOS() ? WP('18') : WP('15'),
    right: 10,
  },
  recordBtn: {
    position: 'absolute',
    bottom: 20,
    width: WP('90'),
    alignSelf: 'center',
  },
});
export default styles;
