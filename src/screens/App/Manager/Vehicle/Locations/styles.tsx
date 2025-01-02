import {StyleSheet} from 'react-native';
import {PFColors, PFFonts, scale} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    top: scale(16),
    backgroundColor: PFColors.Standard.White,
    width: scale(343),
    height: scale(44),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
  },
  input: {
    flex: 1,
    marginLeft: scale(12),
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
  },
  sheetStyle: {
    backgroundColor: PFColors.Standard.White,
    flex: 0.5,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  scrollViewStyle: {
    padding: scale(16),
  },
  itemStyle: {
    backgroundColor: PFColors.Gray.WhisperGray,
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: scale(12),
    marginBottom: scale(16),
  },
  titleText: {
    fontSize: scale(10),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Gray.DarkGray,
    marginBottom: scale(8),
  },
  itemInnerView: {
    flex: 1,
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: scale(12),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    marginLeft: scale(4),
  },
  btnStyle: {
    marginTop: scale(16),
  },
});
export default styles;
