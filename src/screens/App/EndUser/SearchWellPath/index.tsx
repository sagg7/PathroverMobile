import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  appIcons,
  fetchSuggestions,
  PFColors,
  PFFonts,
  PFFontSize,
  Routes,
  scale,
  UNEXPECTED_ERROR,
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
import {useWellSearchMutation} from '../../../../redux/endUser/endUserApiSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface SelectionBoxProps {
  isSelected: boolean;
  onPress: () => void;
  title: string;
}

const SearchWellPath = ({route, navigation}: any) => {
  const {
    searchedWells,
    setSearchedWells,
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
  const [searchType, setSearchType] = useState<'wells' | 'places'>('wells');
  const [recentSearches, setRecentSearches] = useState(recentDestSearch);
  const [wellSearch, {isLoading: isSearchingWell}] = useWellSearchMutation();
  const {is_subscribed} = useSelector(state => state?.auth?.loginUser);

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
    if (is_subscribed) {
      setSearchType('wells');
    } else {
      setSearchType('places');
    }
  }, [is_subscribed]);

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

    if (searchType == 'wells') return;

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

  const handleSearchWell = async () => {
    try {
      const requestData: Record<string, any> = {
        page: '1',
        is_search_by_name: isAddressSelected,
      };

      if (isAddressSelected) {
        requestData.query = simpleSearch;
      } else {
        requestData.latitude = Number(searchValues.latitude);
        requestData.longitude = Number(searchValues.longitude);
      }

      const response = await wellSearch(requestData).unwrap();
      if (response?.wells?.length > 0) {
        setSearchedWells(response?.wells);
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No wells found');
      }
    } catch (error) {
      Alert.alert('Error', error?.data?.error || UNEXPECTED_ERROR);
    }
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
    setSearchLocationNames(place?.placeName);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 30,
            flex: 1,
          }}>
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
                      <Text
                        style={{
                          padding: 10,
                          color: PFColors.Standard.Black,
                        }}>
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
            </>
          )}
          {suggestions?.length < 1 && (
            <View style={{...styles.rowView, padding: WP('5')}}>
              {is_subscribed && (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSearchType('wells')}
                    style={styles.rowView}>
                    {searchType == 'wells'
                      ? svgIcon.RadioActive
                      : svgIcon.RadioInactive}
                    <Text style={styles.searchLabel}>{'Search by wells'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSearchType('places')}
                    style={styles.rowView}>
                    {searchType == 'places'
                      ? svgIcon.RadioActive
                      : svgIcon.RadioInactive}
                    <Text style={styles.searchLabel}>{'Search by places'}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          {suggestions?.length < 1 && searchType != 'wells' && (
            <>
              <Text style={styles.recentTitle}>{'Recently Searches'}</Text>
              <FlatList
                data={recentSearches}
                renderItem={renderSearchHistoryList}
              />
            </>
          )}
          {!isAddressSelected && (
            <AppButton
              title="Search"
              buttonStyle={styles.btnStyles}
              handleClick={
                searchType == 'wells' ? handleSearchWell : handleSearchBtn
              }
              isLoading={isSearchingWell}
              disabled={
                searchValues.latitude?.length < 4 ||
                searchValues.longitude?.length < 4 ||
                isSearchingWell
              }
            />
          )}
          {isAddressSelected && searchType == 'wells' && (
            <AppButton
              title="Search"
              isLoading={isSearchingWell}
              buttonStyle={styles.btnStyles}
              handleClick={handleSearchWell}
              disabled={!simpleSearch || isSearchingWell}
            />
          )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
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
