import {StyleSheet} from 'react-native';
import {scale} from '../../../../../shared/exporter';

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
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
  },
  btnStyles: {
    top: scale(540),
  },
});
export default styles;
