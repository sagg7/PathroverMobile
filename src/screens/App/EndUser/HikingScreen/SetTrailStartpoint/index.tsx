import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {AppHeader, AppInput, MainWrapper} from '../../../../../components';
import {
  fetchSuggestions,
  PFColors,
  PFFonts,
  PFFontSize,
  Routes,
  scale,
  WP,
} from '../../../../../shared/exporter';
import {svgIcon} from '../../../../../assets/svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  setManagerRoute,
  setRecentDestSearch,
} from '../../../../../redux/manager/managerSlice';
import {
  setEndingPoint,
  setStartingPoint,
} from '../../../../../redux/endUser/endUserSlice';

const SetTrailStartpoint = () => {
  const navigation = useNavigation<any>();
  const {params} = useRoute<any>();
  const {isStartPoint} = params;
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();
  const {recentDestSearch} = useSelector((state: any) => state.manager);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [autoCompleteSearch, setAutoCompleteSearch] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState(recentDestSearch);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleChangeText = useCallback((text: string) => {
    setAutoCompleteSearch(text);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const fetchData = await fetchSuggestions(text);
      setSuggestions(fetchData?.features || []);
    }, 2000);
  }, []);

  const handleSelect = (place: any) => {
    const [longitude, latitude] = place.center || place;
    const data = {
      latitude,
      longitude,
      coords: [longitude, latitude],
      placeName: place.place_name,
    };
    setAutoCompleteSearch(place.place_name);
    if (isStartPoint) {
      console.log('place?.center', place?.center);

      dispatch(setStartingPoint(place?.center));
    } else {
      dispatch(setEndingPoint(place?.center));
    }
    dispatch(setManagerRoute({destination: data}));
    dispatch(setRecentDestSearch(data));
    setSuggestions([]);
    navigation.goBack();
  };

  const onSelectFromList = (place: any) => {
    console.log(' onSelectFromList ~ place==>', place);
    setAutoCompleteSearch(place.place_name);
    if (isStartPoint) {
      dispatch(setStartingPoint(place?.coords));
    } else {
      dispatch(setEndingPoint(place?.coords));
    }
    navigation?.goBack();
  };

  const renderSearchHistoryList = ({item}: any) => {
    console.log(' renderSearchHistoryList ~ item==>', item);
    return (
      <Pressable
        style={styles.addressCard}
        onPress={() => onSelectFromList(item)}>
        {svgIcon.ClockBlack}
        <View style={styles.infoView}>
          <Text style={styles.addressName}>{item?.placeName}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <MainWrapper>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
            {svgIcon.BackArrow}
          </TouchableOpacity>
          <AppInput
            inputContainerStyle={{marginTop: 0, width: '95%', borderWidth: 0}}
            placeholder={`${isStartPoint ? 'Starting' : 'Ending'} point`}
            value={autoCompleteSearch}
            onChangeText={handleChangeText}
          />
        </View>
        {!!(suggestions && autoCompleteSearch) ? (
          <FlatList
            data={suggestions}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Text style={styles.suggestionText}>{item.place_name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate(Routes.ChooseOnMap, {isStartPoint});
              }}
              style={styles.optionRow}>
              <View style={styles.optionIcon}>{svgIcon.BlueMarker}</View>
              <Text style={styles.optionText}>Choose on map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Routes.EndUserSavedLibraryType, {
                  isHiking: true,
                  item: {title: 'Choose Trail', type: 'hiking_trail_route'},
                });
              }}
              activeOpacity={0.7}
              style={styles.optionRow}>
              <View style={styles.optionIcon}>{svgIcon.RouteBlue}</View>
              <Text style={styles.optionText}>Choose trail</Text>
            </TouchableOpacity>
            <Text style={styles.recentText}>Recent</Text>
            <FlatList
              data={recentSearches}
              renderItem={renderSearchHistoryList}
            />
          </View>
        )}
      </View>
    </MainWrapper>
  );
};

export default SetTrailStartpoint;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: WP('2.5'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WP('4'),
    paddingVertical: WP('1'),
    borderRadius: 12,
    backgroundColor: PFColors.Gray.WhisperGray,
    marginBottom: 10,
  },
  suggestionText: {
    padding: 10,
    color: PFColors.Standard.Black,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: WP('3.5'),
    borderBottomWidth: 1,
    borderColor: PFColors.Blue.lightBlue,
  },
  optionIcon: {
    padding: WP('2.5'),
    backgroundColor: PFColors.Blue.SelectedBlue,
    borderRadius: 100,
  },
  optionText: {
    flex: 0.95,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
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
});
