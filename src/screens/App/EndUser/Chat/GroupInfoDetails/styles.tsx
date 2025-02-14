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
    width: '80%',
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
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: PFColors.Gray.LightMist,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 74,
    width: 74,
    borderRadius: 10,
    padding: 12,
    backgroundColor: PFColors.Gray.LightMist,
    borderWidth: 1,
    borderColor: PFColors.Gray.borderGray,
    marginHorizontal: 6,
    marginTop: 22,
  },
  topView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  buttonText: {
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  redText: {
    color: PFColors.Orange.Dark,
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.Medium,
    width: '92%',
  },
  footerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PFColors.Standard.White,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  imageStyle: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  textView: {
    flexDirection: 'row',
    width: '86%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
    width: '70%',
  },
  adminText: {
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.Medium,
  },
  headerText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    marginTop: 12,
  },
  subHeaderText: {
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Medium,
  },
});

export default styles;
