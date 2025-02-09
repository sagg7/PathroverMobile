import {StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PFColors.Standard.White,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: PFColors.Orange.Light,
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 48,
  },
  nameText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
    marginBottom: 4,
  },
  textView: {
    flexDirection: 'column',
    width: '84%',
  },
});

export default styles;
