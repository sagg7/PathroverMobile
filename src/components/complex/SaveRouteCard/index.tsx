import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
  scale,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import {FromAndToCard} from '../FromAndToCard';

interface SaveRouteCardProps {
  item: any;
  onPressEdit: () => void;
  onPressDel: () => void;
}

const SaveRouteCard = ({item, onPressEdit, onPressDel}: SaveRouteCardProps) => {
  const [isActive, setisActive] = useState<boolean>(false);
  return (
    <>
      {!isActive ? (
        <TouchableOpacity onPress={() => setisActive(!isActive)} style={{}}>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <Image source={appIcons.routeLine} style={styles.routeLine} />
              <Text style={styles.routeName}>{item?.name}</Text>
            </View>
            {svgIcon.DownChaveron}
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setisActive(!isActive)}>
          <View style={styles.activeMainContainer}>
            <View style={styles.activeContainer}>
              <View style={styles.innerContainer}>
                <Image
                  source={appIcons.routeLine}
                  style={[styles.routeLine, {tintColor: PFColors.Blue.Dark}]}
                />
                <Text style={styles.routeName}>{item?.name}</Text>
              </View>
              {svgIcon.DownChaveron}
            </View>
            <View style={styles.activeInnerContainer}>
              <Text style={styles.routeName2}>{item?.name}</Text>
              <View style={styles.rowDirection}>
                <TouchableOpacity
                  onPress={onPressEdit}
                  style={{
                    height: 30,
                    width: 25,
                  }}>
                  {svgIcon.Edit}
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressDel}>
                  {svgIcon.Delete}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.leftMargin}>
              <FromAndToCard
                pickup={item?.pickup_location.name}
                dropOff={item?.dropoff_location?.name}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export {SaveRouteCard};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    backgroundColor: PFColors.Gray.WhisperGray,
    alignItems: 'center',
    marginVertical: 5,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeLine: {
    height: 20,
    width: 20,
    marginLeft: 5,
  },
  routeName: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('4'),
  },
  activeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeMainContainer: {
    borderRadius: 10,
    padding: 5,
    paddingVertical: scale(10),
    backgroundColor: PFColors.Blue.SoftGlacier,
    marginVertical: 5,
  },
  activeInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  rowDirection: {
    flexDirection: 'row',
    width: WP('13'),
    justifyContent: 'space-between',
    right: 5,
  },
  leftMargin: {
    marginLeft: 5,
  },
  routeName2: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
    paddingLeft: WP('4'),
  },
});
