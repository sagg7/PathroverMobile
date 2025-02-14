import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: scale(180),
  },
  emptyText: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
  },
});

export default styles;
