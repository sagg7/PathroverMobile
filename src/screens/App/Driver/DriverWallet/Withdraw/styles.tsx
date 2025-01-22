import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  contentView: {
    marginHorizontal: scale(16),
    flex: 1,
  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsRow: {
    marginVertical: 15,
    position: 'absolute',
    bottom: 0,
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
  },
});
export default styles;
