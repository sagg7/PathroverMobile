import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppHeader, MainWrapper} from '../../../../../components';
import {
  fetchSuggestions,
  PFColors,
  PFFonts,
} from '../../../../../shared/exporter';
import {scale, WP} from '../../../../../shared/theme/responsive';
import {svgIcon} from '../../../../../assets/svg';
import {
  setManagerRoute,
  setRecentDestSearch,
} from '../../../../../redux/manager/managerSlice';
import useLocation from '../../../../../hooks/getLocation';

const Destination = ({route, navigation}: any) => {
  const {destinationAddress, setDestinationAddress} = route?.params;
  const {managerRoute, recentDestSearch} = useSelector(
    (state: any) => state.manager,
  );
  const [simpleSearch, setSimpleSearch] = useState<string>('');
  const [autoCompleteSearch, setautoCompleteSearch] = useState<string>(
    managerRoute?.destination?.placeName || '',
  );
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [recentSearches, setRecentSearches] = useState(recentDestSearch);
  const {location} = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  const handleChangeText = (text: any) => {
    setautoCompleteSearch(text);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const fetchData = await fetchSuggestions(text);

      setSuggestions(fetchData?.features);
    }, 2000);
  };

  const handleSelect = (place: any) => {
    const [longitude, latitude] = place.center || place;
    const data = {
      latitude: latitude,
      longitude: longitude,
      coords: [longitude, latitude],
      placeName: place.place_name,
    };

    setDestinationAddress(data);
    setautoCompleteSearch(place.place_name);
    dispatch(setManagerRoute({destination: data}));
    dispatch(setRecentDestSearch(data));

    setSuggestions([]);
    navigation?.goBack(-2);
  };

  const onSelectFromList = (place: any) => {
    setDestinationAddress(place);
    setautoCompleteSearch(place.place_name);
    navigation?.goBack(-2);
  };
  const renderSearchHistoryList = ({item}: any) => {
    return (
      <Pressable
        style={styles.addressCard}
        onPress={() => onSelectFromList(item)}>
        {svgIcon.ClockBlack}
        <View style={styles.infoView}>
          {/* <Text style={styles.addressName}>{item? }</Text> */}
          <Text style={styles.addressName}>{item?.placeName}</Text>
        </View>
      </Pressable>
    );
  };
  const searchAddress = (text: string) => {
    setSimpleSearch(text);
    if (text?.length < 1) {
      setRecentSearches(recentDestSearch);
    } else {
      const test = text.toLowerCase();
      const latest = recentDestSearch.filter((item: any) =>
        item.placeName?.toLowerCase().includes(test),
      );
      setRecentSearches(latest);
    }
  };
  return (
    <MainWrapper>
      <AppHeader title="Choose  Destination" />
      <View style={styles.bodyConntainer}>
        <View style={styles.searchBox}>
          {svgIcon.Search}
          <TextInput
            placeholder="Search"
            placeholderTextColor={PFColors.Gray.DarkGray}
            value={simpleSearch}
            onChangeText={searchAddress}
            style={styles.input}
          />
        </View>
        <View style={styles.itemStyle}>
          <View style={styles.itemInnerView}>
            <Text style={styles.titleText}>Destination Location</Text>
            <View style={styles.addressView}>
              {svgIcon.MapPin}
              <TextInput
                placeholder="Search Here"
                placeholderTextColor={PFColors.Gray.DarkGray}
                value={autoCompleteSearch}
                onChangeText={handleChangeText}
                style={styles.autoCompleteSearch}
              />
            </View>
          </View>
          {svgIcon.Save}
        </View>
        <View>
          <FlatList
            data={suggestions}
            keyExtractor={(item: any) => item.id}
            renderItem={({item}: any) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text style={{padding: 10, color: PFColors.Standard.Black}}>
                  {item.place_name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text style={styles.recentText}>Recent</Text>
        <FlatList data={recentSearches} renderItem={renderSearchHistoryList} />
      </View>
    </MainWrapper>
  );
};

export default Destination;

const styles = StyleSheet.create({
  searchBox: {
    width: scale(343),
    height: scale(44),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: scale(12),
    marginBottom: scale(16),
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  input: {
    fontSize: scale(14),
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Standard.Black,
    width: scale(300),
  },
  itemStyle: {
    backgroundColor: PFColors.Gray.WhisperGray,
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: scale(12),
    marginBottom: scale(16),
  },
  titleText: {
    fontSize: scale(10),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Gray.DarkGray,
    marginBottom: scale(8),
  },
  itemInnerView: {
    flex: 1,
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoCompleteSearch: {
    flex: 1,
    marginLeft: scale(12),
    fontSize: scale(12),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
  },
  bodyConntainer: {
    paddingVertical: scale(24),
    paddingHorizontal: scale(16),
  },
  recentText: {
    fontSize: scale(14),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    marginBottom: scale(16),
  },
  addressCard: {
    backgroundColor: PFColors.Gray.WhisperGray,
    padding: scale(12),
    borderRadius: scale(12),
    marginBottom: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    // height: scale(55),
  },
  infoView: {
    marginLeft: scale(8),
    width: WP('80'),
  },
  addressName: {
    fontSize: scale(12),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
  },
  addressText: {
    fontSize: scale(10),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
  },
});
