import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  contentView: {
    marginLeft: scale(16),
    flex: 1,
  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    marginTop: scale(10),
  },
  flatlistContainerStyle: {
    paddingBottom: scale(30),
    flexGrow: 1,
  },
  mainContainer: {
    backgroundColor: PFColors.Standard.White,
    flex: 1,
  },
});
export default styles;
