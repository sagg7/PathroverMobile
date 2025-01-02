import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppLoader,
  MainWrapper,
} from '../../../../../components';
import {PFColors, PFFonts} from '../../../../../shared/exporter';
import {scale} from '../../../../../shared/theme/responsive';
import CustomizeRouteCard from './CustomizeRouteCard';
import {svgIcon} from '../../../../../assets/svg';
import {useGetAllRoutesQuery} from '../../../../../redux/manager/managerApiSlice';

const CustomizeRoute = ({navigation, route}: any) => {
  const {selectedRouteDetails, setSelectedRouteDetails} = route?.params;
  const [selectedRoute, setSelectRoute] = useState(
    selectedRouteDetails ? selectedRouteDetails : null,
  );
  const {data: allRoutes, isLoading} = useGetAllRoutesQuery(undefined);

  const onPressCard = (item: any) => () => {
    setSelectRoute(item);
  };
  const onPressNext = () => {
    setSelectedRouteDetails(selectedRoute);
    navigation.goBack();
  };
  console.log(allRoutes);

  return (
    <MainWrapper>
      <AppHeader title="Customize Save Routes" />
      <View style={styles.bodyContainer}>
        <Text style={styles.mainHeading}>Choose Route</Text>
        {!!allRoutes?.user_routes?.length ? (
          <FlatList
            contentContainerStyle={styles.flatListContainerStyle}
            showsVerticalScrollIndicator={false}
            data={allRoutes?.user_routes}
            renderItem={({item}) => (
              <CustomizeRouteCard
                item={item}
                icon={
                  selectedRoute === item
                    ? svgIcon.RouteBlue
                    : svgIcon.RouteBlack
                }
                style={selectedRoute === item ? styles.cardStyle : null}
                onPressCard={onPressCard(item)}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        ) : isLoading ? (
          <View style={styles.noDataView}>
            <AppLoader />
          </View>
        ) : (
          <View style={styles.noDataView}>
            <Text> No Data </Text>
          </View>
        )}
        <AppButton
          disabled={!selectedRoute}
          buttonStyle={!selectedRoute ? styles.disableButtonStyle : null}
          title="Next"
          handleClick={onPressNext}
        />
      </View>
    </MainWrapper>
  );
};

export default CustomizeRoute;

const styles = StyleSheet.create({
  bodyContainer: {
    padding: scale(16),
    flex: 1,
  },
  flatListContainerStyle: {
    paddingBottom: scale(20),
  },
  mainHeading: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: scale(14),
    color: PFColors.Standard.Black,
    marginBottom: scale(16),
  },
  cardStyle: {
    backgroundColor: PFColors.Blue.SelectedBlue,
  },
  disableButtonStyle: {
    backgroundColor: PFColors.Blue.DisableBlue,
  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
