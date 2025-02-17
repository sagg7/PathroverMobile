import {StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PFColors.Standard.White,
    shadowColor: PFColors.Standard.Black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  headerTextView: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupNameText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  iconStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  imageStyle: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: PFColors.Gray.LightMist,
    marginRight: 6,
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '15%',
  },
});

export default styles;
