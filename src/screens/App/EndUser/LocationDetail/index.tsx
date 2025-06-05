import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {svgIcon} from '../../../../assets/svg';
import LocationDetailTab from '../../../../navigation/LocationDetailTopTab/LocationDetailTopTab';
import styles from './styles';
import {
  appIcons,
  PFColors,
  PFFonts,
  PFFontSize,
  useKeyboardListener,
  WEATHER_API_KEY,
  WP,
} from '../../../../shared/exporter';

interface LocationDetailModalProps {
  onPressCross: () => void;
  onPressShare: (trailInfo: any) => void;
  onPressNavigation?: (info: any) => void;
  onPressPin: (trailInfo: any) => void;
  trailInfo: any;
  sheetRef: any;
}
interface BubbleViewProps {
  children: React.ReactNode;
  show?: boolean;
  isRed?: boolean;
  elevation?: string;
}
interface ActionButtonsProps {
  icon: any;
  title: string;
  selected: boolean;
  onPressActionBtn?: () => void;
  disabled?: boolean;
}

const LocationDetail = ({
  onPressCross,
  onPressShare,
  onPressNavigation,
  onPressPin,
  trailInfo,
}: LocationDetailModalProps) => {
  const coords = trailInfo?.coordinates[0];

  const [weaather, setWeather] = useState<any>(null);

  const isKeyboardVisible = useKeyboardListener();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords?.lat}&lon=${coords?.lng}&appid=${WEATHER_API_KEY}&units=imperial`,
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch weather data: ${errorText}`);
        }
        const data = await response.json();
        const tempFahrenheit = data?.main.temp;
        const humidity = data?.main.humidity;
        const iconCode = data?.weather[0].icon;

        setWeather({
          temp: tempFahrenheit,
          hum: humidity,
          icon: iconCode,
        });
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
      }
    };

    fetchWeatherData();
  }, []);

  const BubbleView = ({
    children,
    show = false,
    isRed,
    elevation,
  }: BubbleViewProps) => (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
      {show && (
        <View style={innerBuble(isRed)}>
          <Text style={statusColor(isRed)}>{elevation}</Text>
        </View>
      )}
    </View>
  );

  const ActionButtons = ({
    icon,
    title,
    selected,
    onPressActionBtn,
    disabled,
  }: ActionButtonsProps) => (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPressActionBtn}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: selected ? PFColors.Blue.Dark : '#ECEFF3',
          borderColor: selected ? '#ECEFF3' : PFColors.Blue.Dark,
        },
      ]}>
      <Image
        source={icon}
        style={[
          styles.actionIcon,
          {
            tintColor: selected ? PFColors.Standard.White : PFColors.Blue.Dark,
          },
        ]}
      />
      <Text
        style={[
          styles.buttonText,
          {
            color: selected ? PFColors.Standard.White : PFColors.Blue.Dark,
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => (
    <View style={styles.bubble}>
      <Text style={styles.bubbleText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.main}>
      <View style={styles.contentView}>
        <View style={{flexDirection: 'row', paddingVertical: 10}}>
          <Text style={styles.trailNameStyle}>{trailInfo?.name}</Text>
          <TouchableOpacity onPress={onPressCross} style={{right: 0}}>
            {svgIcon.CancelIcon}
          </TouchableOpacity>
        </View>

        <View style={styles.barStyle} />

        <View style={{flexDirection: 'row'}}>
          <BubbleView show isRed={true} elevation={trailInfo?.difficulty_level}>
            Difficulty Level
          </BubbleView>
          <BubbleView show isRed={false} elevation={trailInfo?.elevation_gain}>
            Elevation gain
          </BubbleView>
        </View>

        <View style={{flexDirection: 'row'}}>
          <BubbleView isRed={true}>
            Surface type: {trailInfo?.surface_type}
          </BubbleView>
          <BubbleView isRed={false}>
            {weaather?.temp}° | Hum {weaather?.hum}%
          </BubbleView>
        </View>
        <BubbleView elevation={trailInfo?.difficulty_level}>
          Accessibly by:{trailInfo?.accessible_by}
        </BubbleView>

        <View style={styles.barStyle} />

        {!isKeyboardVisible && (
          <>
            <Text style={styles.categoryText}>Categories </Text>
            <FlatList
              data={trailInfo?.categories}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />

            <View style={styles.routeInfoView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {svgIcon.MapWindow}
                <View style={{width: 5}} />
                <Text style={styles.routeInfoText}>
                  {trailInfo?.estimated_distance} mi
                </Text>
              </View>

              <View style={{marginLeft: 40}} />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {svgIcon.BlueClock}
                <View style={{width: 5}} />
                <Text style={styles.timeText}>
                  {trailInfo?.estimated_time} h
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPressShare(trailInfo)}
                style={styles.shareIcon}
                disabled={!onPressShare}>
                {svgIcon.ShareWellPath}
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.actionBtnView}>
          <ActionButtons
            icon={appIcons.paperPlane}
            title="Explore"
            selected={false}
            onPressActionBtn={() => onPressNavigation(trailInfo)}
          />
          <ActionButtons
            icon={appIcons.pinIcon}
            title="Pin"
            selected={false}
            onPressActionBtn={() => onPressPin(trailInfo)}
          />
        </View>
      </View>

      <View style={{flex: 1}}>
        <LocationDetailTab />
      </View>
    </View>
  );
};
const innerBuble = (isRed: boolean): ViewStyle => ({
  backgroundColor: isRed ? '#F2DBDB' : '#fff',
  padding: 10,
  borderRadius: 20,
  marginLeft: 10,
  paddingHorizontal: WP('3'),
  paddingVertical: WP('2'),
});

const statusColor = (isRed: boolean): TextStyle => ({
  fontSize: PFFontSize.FONT_SIZE_10,
  color: isRed ? PFColors.Red.RadiantRed : PFColors.Standard.Black,
  fontFamily: PFFonts.Foundation.Medium,
  textTransform: 'capitalize',
});
export default LocationDetail;
