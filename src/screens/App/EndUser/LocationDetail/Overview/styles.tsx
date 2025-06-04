import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  WP,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: WP('3'),
    // paddingBottom: 40,
  },
  textStyle: {
    color: '#000',
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    paddingBottom: 60,
  },
});

export default styles;
