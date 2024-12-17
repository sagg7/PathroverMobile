import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {AppHeader, MainWrapper} from '../../../../../components';
import {
  fetchSuggestions,
  PFColors,
  PFFonts,
} from '../../../../../shared/exporter';
import {scale} from '../../../../../shared/theme/responsive';
import {svgIcon} from '../../../../../assets/svg';

const Destination = ({route,navigation}: any) => {
  const {destinationAddress, setDestinationAddress} = route?.params;
  const [simpleSearch, setSimpleSearch] = useState<string>('');
  const [autoCompleteSearch, setautoCompleteSearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef(null);

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
    setDestinationAddress({
      latitude: place?.geometry?.coordinates[0],
      longitude: place?.geometry?.coordinates[1],
      placeName : place.place_name
    });
    const [longitude, latitude] = place.center;
    setautoCompleteSearch(place.place_name);
    setSuggestions([]);
    navigation?.goBack()
    
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
            onChangeText={setSimpleSearch}
            style={styles.input}
          />
        </View>
        <View style={styles.itemStyle}>
          <View style={styles.itemInnerView}>
            <Text style={styles.titleText}>Pickup Location</Text>
            <View style={styles.addressView}>
              {svgIcon.MapPin}
              <TextInput
                placeholder="My current location"
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
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text style={{padding: 10,color:PFColors.Standard.Black}}>{item.place_name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text style={styles.recentText}>Recent</Text>
        <FlatList
          data={[1, 2, 3]}
          renderItem={({item}) => (
            <Pressable style={styles.addressCard}>
              {svgIcon.ClockBlack}
              <View style={styles.infoView}>
                <Text style={styles.addressName}>Viral Square</Text>
                <Text style={styles.addressText}>
                  Street 5, Block R2 Block R 2 Phase 2 Johar Town
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </MainWrapper>
  );
};

export default Destination;

const styles = StyleSheet.create({
  searchBox: {
    backgroundColor: PFColors.Standard.White,
    width: scale(343),
    height: scale(44),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    marginBottom: scale(16),
  },
  input: {
    flex: 1,
    marginLeft: scale(12),
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
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
    height: scale(53),
  },
  infoView: {
    marginLeft: scale(8),
    flex: 1,
  },
  addressName: {
    fontSize: scale(12),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    marginBottom: scale(2),
  },
  addressText: {
    fontSize: scale(10),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
  },
});
