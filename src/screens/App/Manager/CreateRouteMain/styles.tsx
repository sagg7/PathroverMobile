import {StyleSheet} from 'react-native';
import {isIOS, PFColors, WP} from '../../../../shared/exporter';

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
    zIndex: 11,
    top: isIOS() ? WP('12') : 1,
  },
  maplayerStyles: {
    position: 'absolute',
    top: isIOS() ? WP('35') : WP('25'),
    right: 20,
  },
  undoRedoContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: WP('20'),
    right: 20,
    marginLeft: 5,
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 5,
  },
  createRouteBtn: {
    position: 'absolute',
    bottom: 20,
    width: WP('90'),
    alignSelf: 'center',
  },
});
export default styles;
