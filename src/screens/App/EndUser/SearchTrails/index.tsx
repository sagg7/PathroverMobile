import React, {useCallback, useRef, useState} from 'react';
import {View, TouchableOpacity, Text, TextInput, FlatList} from 'react-native';
import {MainWrapper} from '../../../../components';
import {
  AppHeader,
  AppInput,
  PFColors,
  Routes,
  fetchSuggestions,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import styles from './styles';

const SearchTrails = ({navigation}: any) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchedData, setSearchedData] = useState<any[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [simpleSearch, setSimpleSearch] = useState<string>('');
  const [autoCompleteSearch, setAutoCompleteSearch] = useState<string>('');

  const handleChangeText = useCallback((text: string) => {
    setAutoCompleteSearch(text);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      console.log('Searched Text => ', text);

      // setSearchedData([]);
    }, 2000);
  }, []);

  const renderSearchItems = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SearchTrailResult');
      }}
      style={styles.itemContainer}>
      <View style={styles.innerContainer}>
        {svgIcon.RecentIcon}
        <View style={styles.textContainer}>
          <Text style={styles.nameStyle}>IBM</Text>
          <Text style={styles.distanceStyle}>
            8502 Preston Rd. Inglewood, Maine 98380
          </Text>
        </View>
      </View>
      <View style={styles.dividerStyle} />
    </TouchableOpacity>
  );

  const handleChangeTextLoc = (text: any) => {
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

  const handlePlaceSelect = (place: any) => {
    const [longitude, latitude] = place.center || place;
    setSimpleSearch(place?.place_name);
    setSuggestions([]);

    navigation.navigate('Hiking', {longitude, latitude});
  };

  return (
    <MainWrapper style={styles.container}>
      <View style={styles.subContainer}>
        {/* <View style={styles.searchContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
            {svgIcon.BackArrow}
          </TouchableOpacity>
          <AppInput
            inputContainerStyle={styles.inputStyle}
            placeholder={`Search`}
            value={autoCompleteSearch}
            onChangeText={handleChangeText}
          />
        </View>
        <Text style={styles.recentText}>Recent</Text>
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={renderSearchItems}
          keyExtractor={index => index.toString()}
          showsVerticalScrollIndicator={false}
        /> */}
        <View style={styles.searchBox}>
          {svgIcon.Search}
          <TextInput
            placeholder="Search"
            placeholderTextColor={PFColors.Gray.DarkGray}
            value={simpleSearch}
            onChangeText={handleChangeTextLoc}
            style={styles.input}
          />
        </View>
        {suggestions?.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={styles.suggestionContainer}
            renderItem={({item}: any) => (
              <TouchableOpacity onPress={() => handlePlaceSelect(item)}>
                <Text style={{padding: 10, color: PFColors.Standard.Black}}>
                  {item.place_name}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </MainWrapper>
  );
};

export default SearchTrails;
