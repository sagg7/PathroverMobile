import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../shared/exporter';
import Modal from 'react-native-modal';
import {svgIcon} from '../../../assets/svg';
import {AppLoader} from '../AppLoader';

interface WeatherSheetProp {
  coords: any;
  modalVisible: boolean;
  setModalVisible: () => void;
  weather: any;
}

const WeatherSheet = ({
  coords,
  modalVisible,
  setModalVisible,
  weather,
}: WeatherSheetProp) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const dailyForecast = weather.list;
  const currentWeather = dailyForecast[selectedDay];
  const convertKmToMiles = kmString => {
    const km = parseFloat(kmString); // Convert string to number
    if (isNaN(km)) return 'Invalid input'; // Handle invalid input
    const miles = km * 0.621371;
    return miles.toFixed(2); // Return result rounded to 2 decimal places
  };
  const windSpeed = convertKmToMiles(currentWeather.speed);
  console.log('coords', coords);

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      {dailyForecast?.length > 0 ? (
        <ScrollView>
          <View style={styles.headerView}>
            <View>
              {coords?.length > 0 && (
                <Text style={styles.coords}>
                  {coords[0]}, {coords[1]}
                </Text>
              )}
              <Text style={styles.city}>
                {weather.city.name}, {weather.city.country}
              </Text>
            </View>
            <TouchableOpacity onPress={setModalVisible}>
              {svgIcon.CancelIcon}
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
            }}
            style={styles.weatherIcon}
          />
          {/* ======================== */}
          <View style={styles.weatherCard}>
            <Text style={styles.date}>
              {new Date(currentWeather.dt * 1000).toDateString() ===
              new Date().toDateString()
                ? `Today, ${new Date(
                    currentWeather.dt * 1000,
                  ).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                  })}`
                : new Date(currentWeather.dt * 1000).toLocaleDateString(
                    'en-US',
                    {
                      day: '2-digit',
                      month: 'long',
                    },
                  )}
            </Text>

            <Text style={styles.temp}>
              {Math.round(currentWeather.temp?.day)}° F
            </Text>
            <Text style={styles.condition}>
              {currentWeather.weather[0].description}
            </Text>
            <View style={{alignSelf: 'center'}}>
              <View style={styles.humiityView}>
                {svgIcon.Wind}
                <Text style={styles.humidityTextTitle}>Wind</Text>
                <Text style={styles.miniBar}>|</Text>
                <Text style={styles.humidityText}>
                  {/* {currentWeather.speed} km/h */}
                  {windSpeed} miles/h
                </Text>
              </View>
              <View style={styles.humiityView}>
                {svgIcon.Humiity}

                <Text style={styles.humidityTextTitle}>Hum</Text>
                <Text style={styles.miniBar}>|</Text>

                <Text style={styles.humidityText}>
                  {currentWeather.humidity}%
                </Text>
              </View>
            </View>
          </View>
          {/* ======================== */}

          <Text style={styles.weekText}>This Week</Text>
          <FlatList
            data={dailyForecast}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.forecastItem,
                  selectedDay === index && styles.selectedForecast,
                ]}
                onPress={() => setSelectedDay(index)}>
                <Text style={styles.day}>
                  {new Date(item.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </Text>

                <View style={{height: 25}} />
                <View style={styles.weekBar}>
                  <Text
                    style={[
                      styles.feelsLike,
                      {
                        color:
                          selectedDay === index
                            ? PFColors.Standard.White
                            : PFColors.Standard.Black,
                      },
                    ]}>
                    {Math.round(item.temp.min)}° F
                  </Text>
                  <Image
                    source={{
                      uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
                    }}
                    style={styles.smallIcon}
                  />
                  <Text
                    style={[
                      styles.feelsLike,
                      {
                        color:
                          selectedDay === index
                            ? PFColors.Standard.White
                            : PFColors.Standard.Black,
                      },
                    ]}>
                    {Math.round(item.temp.max)}° F
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      ) : (
        <AppLoader />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  coords: {
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    marginBottom: 5,
  },
  city: {
    fontSize: PFFontSize.FONT_SIZE_20,
    fontFamily: PFFonts.Foundation.SemiBold,
    marginBottom: 10,
    color: PFColors.Standard.Black,
  },
  weatherIcon: {
    width: WP('30'),
    height: WP('25'),
    alignSelf: 'center',
  },
  weatherCard: {
    padding: 20,
    backgroundColor: PFColors.Blue.Dark,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
    padding: 15,
  },
  date: {color: PFColors.Yellow.Light, fontSize: PFFontSize.FONT_SIZE_18},
  temp: {
    fontSize: scale(40),
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  condition: {
    fontSize: 20,
    color: PFColors.Yellow.Light,
    textTransform: 'capitalize',
    paddingVertical: 25,
  },
  forecastItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 5,
    alignItems: 'center',
  },
  selectedForecast: {
    backgroundColor: '#D35400',
    color: PFColors.Standard.White,
  },
  day: {
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  smallIcon: {width: 40, height: 40},
  feelsLike: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  humidityText: {
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    width: WP('35'),
    paddingVertical: 5,
    paddingLeft: 20,
  },
  humiityView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: 4,
    marginLeft: 20,
  },
  miniBar: {
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingVertical: 5,
  },
  weekText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingVertical: 10,
    paddingLeft: 5,
  },
  humidityTextTitle: {
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    width: WP('20'),
    paddingLeft: 10,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekBar: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export {WeatherSheet};
