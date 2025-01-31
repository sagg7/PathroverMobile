import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  appIcons,
  fetchSuggestions,
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../../shared/exporter';
import styles from './styles';
import {
  AppButton,
  AppHeader,
  AppInput,
  MainWrapper,
} from '../../../../components';
import {svgIcon} from '../../../../assets/svg';
import {useDispatch, useSelector} from 'react-redux';
import {setRecentDestSearch} from '../../../../redux/manager/managerSlice';

interface SelectionBoxProps {
  isSelected: boolean;
  onPress: () => void;
  title: string;
}
const SearchWellPath = ({route, navigation}: any) => {
  const {
    searchLocation,
    setSearchLocation,
    searchLocationName,
    setSearchLocationNames,
  } = route?.params;
  const [isAddressSelected, setIsAddressSelected] = useState(true);
  const [simpleSearch, setSimpleSearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef<any>(null);
  const {managerRoute, recentDestSearch} = useSelector(
    (state: any) => state.manager,
  );
  const [recentSearches, setRecentSearches] = useState(recentDestSearch);
  const dispatch = useDispatch();
  const [searchValues, setSearchValues] = useState({
    latitude: '',
    longitude: '',
  });
  useEffect(() => {
    if (searchLocation) {
      setSearchValues({
        latitude: searchLocation[1]?.toString() || '',
        longitude: searchLocation[0]?.toString() || '',
      });
    }
  }, [searchLocation]);

  useEffect(() => {
    if (searchLocationName) setSimpleSearch(searchLocationName);
  }, [searchLocationName]);

  const SelectionBox = ({isSelected, onPress, title}: SelectionBoxProps) => (
    <TouchableOpacity onPress={onPress} disabled={isSelected}>
      <View style={getOptionBoxStyle(isSelected)}>
        <Text style={getOptionTextStyle(isSelected)}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleChangeText = (text: any) => {
    setSimpleSearch(text);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const fetchData = await fetchSuggestions(text);
      if (fetchData?.message === 'Empty query text') {
        setSuggestions([]);
      } else {
        setSuggestions(fetchData?.features);
      }
    }, 1500);
  };
  const handleSelect = (place: any) => {
    setSearchLocationNames(place?.place_name);
    const [longitude, latitude] = place.center || place;
    setSearchLocation([longitude, latitude]);
    navigation.goBack();

    const data = {
      latitude: latitude,
      longitude: longitude,
      coords: [longitude, latitude],
      placeName: place.place_name,
    };
    dispatch(setRecentDestSearch(data));
  };
  const isValidLatLng = () => {
    const lat = parseFloat(searchValues.latitude);
    const lng = parseFloat(searchValues?.longitude);
    return (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };
  const handleSearchBtn = () => {
    if (isValidLatLng()) {
      setSearchLocation([
        Number(searchValues.longitude),
        Number(searchValues.latitude),
      ]);
      navigation.goBack();
    }
  };
  const onSelectFromList = (place: any) => {
    setSearchLocationNames(place?.place_name);
    const [longitude, latitude] = place.coords || place;

    setSearchLocation([longitude, latitude]);
    navigation.goBack();
  };
  const renderSearchHistoryList = ({item}: any) => {
    return (
      <TouchableOpacity onPress={() => onSelectFromList(item)}>
        <View style={styles.addressCard}>
          <Image source={appIcons.MapFilled} style={styles.mapIcon} />

          <View style={styles.infoView}>
            <Text style={styles.addressName}>{item?.placeName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <MainWrapper>
      <AppHeader title="Search" />
      <View style={styles.selectorMainView}>
        <SelectionBox
          onPress={() => setIsAddressSelected(true)}
          isSelected={isAddressSelected}
          title="Address"
        />
        <SelectionBox
          onPress={() => setIsAddressSelected(false)}
          isSelected={!isAddressSelected}
          title="Latitude-Longitude"
        />
      </View>
      {isAddressSelected ? (
        <>
          <View style={styles.searchBox}>
            {svgIcon.Search}
            <TextInput
              placeholder="Search"
              placeholderTextColor={PFColors.Gray.DarkGray}
              value={simpleSearch}
              onChangeText={handleChangeText}
              style={styles.input}
            />
          </View>
          {suggestions?.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={styles.suggestionContainer}
              renderItem={({item}: any) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Text style={{padding: 10, color: PFColors.Standard.Black}}>
                    {item.place_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      ) : (
        <>
          <AppInput
            maxLength={10}
            placeholder="Longitude"
            inputContainerStyle={styles.inputContainerStyle}
            value={searchValues.longitude}
            onChangeText={(value: string) => {
              const isValidNumber = (): boolean => {
                const regex = /^-?\d*\.?\d*$/;
                return regex.test(value);
              };
              if (isValidNumber()) {
                setSearchValues({
                  ...searchValues,
                  longitude: value,
                });
              }
            }}
          />
          <AppInput
            maxLength={10}
            placeholder="Latitude"
            inputContainerStyle={styles.inputContainerStyle}
            value={searchValues.latitude}
            onChangeText={(value: string) => {
              const isValidNumber = (): boolean => {
                const regex = /^-?\d*\.?\d*$/;
                return regex.test(value);
              };
              if (isValidNumber()) {
                setSearchValues({
                  ...searchValues,
                  latitude: value,
                });
              }
            }}
          />
          <AppButton
            title="Search"
            buttonStyle={styles.btnStyles}
            handleClick={() => handleSearchBtn()}
            disabled={
              searchValues.latitude?.length < 4 ||
              searchValues.longitude?.length < 4
            }
          />
        </>
      )}
      {suggestions?.length < 1 && (
        <FlatList data={recentSearches} renderItem={renderSearchHistoryList} />
      )}
    </MainWrapper>
  );
};

const getOptionBoxStyle = (isSelected: boolean) => ({
  backgroundColor: isSelected ? PFColors.Blue.Dark : PFColors.Gray.LightMist,
  justifyContent: 'center',
  alignItems: 'center',
  height: scale(42),
  width: WP('37'),
  borderRadius: 10,
  top: 2.5,
});

const getOptionTextStyle = (isSelected: boolean) => ({
  fontFamily: PFFonts.Foundation.SemiBold,
  fontSize: PFFontSize.FONT_SIZE_12,
  color: isSelected ? PFColors.Standard.White : PFColors.Blue.Dark,
});
export default SearchWellPath;
