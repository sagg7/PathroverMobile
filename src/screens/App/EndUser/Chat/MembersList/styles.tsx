import {StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: PFColors.Standard.White,
    shadowColor: PFColors.Standard.Black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    paddingBottom: 6,
  },
  topHeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTextView: {
    width: '80%',
  },
  groupNameText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  subText: {
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Medium,
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
    backgroundColor: PFColors.Gray.LightMist,
  },
  textView: {
    flexDirection: 'column',
    width: '84%',
  },
  nameText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
    marginBottom: 4,
  },
  moveForwardButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
  },
  flatListStyle: {
    marginTop: 10,
    paddingBottom: 30,
  },
 
  iconView: {
    position: 'absolute',
    right: -8,
    bottom: -2,
  },
});

export default styles;
