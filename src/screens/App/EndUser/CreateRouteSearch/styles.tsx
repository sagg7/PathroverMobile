import {StyleSheet} from 'react-native';
import {PFColors, scale, WP} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PFColors.Standard.White,
  },
  map: {
    flex: 1,
  },
  inputStyles: {
    zIndex: 1,
  },
  doneBtn: {
    bottom: 30,
    width: WP('90'),
    alignSelf: 'center',
    position: 'absolute',
  },
});
export default styles;
