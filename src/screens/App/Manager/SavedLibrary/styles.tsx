import {StyleSheet} from 'react-native';
import {scale} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  contentView: {
    marginLeft: scale(16),
    flex: 1,
  },
  flatlistContainerStyle: {
    paddingHorizontal: scale(16),
    marginTop: scale(16),
  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
