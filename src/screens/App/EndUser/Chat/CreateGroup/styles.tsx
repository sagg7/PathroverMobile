import {StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
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
  },
  headerTextView: {
    width: '90%',
  },
  groupNameText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  memberText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
    marginLeft: 16,
    marginTop: 12,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 22,
    marginTop: 32,
  },
  textInputStyle: {
    width: '70%',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: PFColors.Blue.Dark,
    textAlignVertical: 'center',
    paddingVertical: 6,
  },
  buttonStyle: isOpen => ({
    width: '92%',
    position: 'absolute',
    bottom: isOpen ? 350 : 50,
    alignSelf: 'center',
  }),
  imageStyle: {
    width: 56,
    height: 56,
    borderRadius: 56,
    backgroundColor: PFColors.Gray.LightMist,
  },
});

export default styles;
