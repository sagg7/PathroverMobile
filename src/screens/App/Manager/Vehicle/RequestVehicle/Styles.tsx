import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  WP,
} from '../../../../../shared/exporter';
import {scale} from '../../../../../shared/theme/responsive';

export const styles = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(24),
  },
  commonHeading: {
    fontSize: scale(14),
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
  },
  vehiclesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(16),
  },
  vehicleView: {
    borderColor: PFColors.Gray.borderGray,
    borderWidth: 1,
    height: scale(64),
    width: scale(107),
    borderRadius: scale(8),
    padding: scale(8),
  },
  vehicleName: {
    fontSize: scale(12),
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    marginTop: scale(8),
  },
  cardStyle: {
    marginBottom: scale(24),
  },
  routeCardStyle: {
    marginTop: scale(16),
  },
  radioBtnContainer: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:scale(24)

  },
  radioBtn: {
     flexDirection:'row',
     alignItems:'center'
  },
  radioBtnInactive:{
     flexDirection:'row',
     alignItems:'center',
     marginLeft:scale(27),
  },
  radioBtnText: {
    fontSize: scale(14),
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    marginLeft:scale(12)
  },
  cargoCardStyle:{
    marginTop:scale(12)
  }
});
