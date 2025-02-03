import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  fetchSuggestions,
  isIOS,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface SelectionBoxProps {
  isSelected: boolean;
  onPress: () => void;
  title: string;
}
const CreateRouteSearch = ({route, navigation}: any) => {
  const {
    searchValues,
    searchValuesByAddress,
    setSearchValuesByAddress,
    setSearchValues,
    startingPointName,
    endingPointName,
    setStartingPointName,
    setEndingPointName,
  } = route?.params;
  const [isAddressSelected, setIsAddressSelected] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef<any>(null);

  const [searchCoordinatesByAddress, setSearchCoordinatesByAddress] =
    useState<any>({
      start: searchValuesByAddress?.start ? searchValuesByAddress?.start : '',
      end: searchValuesByAddress?.end ? searchValuesByAddress?.end : '',
    });

  const [searchStartCoords, setSearchStartCoords] = useState<[any, any]>([
    '',
    '',
  ]);
  const [searchEndCoords, setSearchEndCoords] = useState<[any, any]>(['', '']);

  const [startingPoint, setStartingPoint] = useState('');
  const [endingPoint, setEndingPoint] = useState('');
  const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    if (route) setStartingPoint(startingPointName);
    setEndingPoint(endingPointName);
    setSearchEndCoords(searchValues?.end);
    setSearchStartCoords(searchValues?.start);
  }, [route]);

  const SelectionBox = ({isSelected, onPress, title}: SelectionBoxProps) => (
    <TouchableOpacity onPress={onPress} disabled={isSelected}>
      <View style={getOptionBoxStyle(isSelected)}>
        <Text style={getOptionTextStyle(isSelected)}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

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
    if (searchCoordinatesByAddress && isAddressSelected) {
      setSearchValuesByAddress(searchCoordinatesByAddress);
      setSearchValues({
        start: '',
        end: '',
      });
    } else if (searchStartCoords && searchEndCoords && !isAddressSelected) {
      setSearchValues({
        start: searchStartCoords,
        end: searchEndCoords,
      });
      setStartingPointName('');
      setEndingPoint('');
      setSearchValuesByAddress({
        start: '',
        end: '',
      });
    }
    navigation.goBack();
  };

  const handleInputChange = async (value: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartingPoint(value);
      setActiveInput('start');
    } else {
      setEndingPoint(value);
      setActiveInput('end');
    }
    debounceTimeout.current = setTimeout(async () => {
      const fetchData = await fetchSuggestions(value);
      setSuggestions(fetchData?.features);
    }, 1500);
  };

  const handleSelect = (item: any, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartingPoint(item.place_name);
      setStartingPointName(item.place_name);

      setSearchCoordinatesByAddress({
        ...searchCoordinatesByAddress,
        start: item?.geometry?.coordinates,
      });
    } else {
      setEndingPoint(item.place_name);
      setEndingPointName(item.place_name);

      setSearchCoordinatesByAddress({
        ...searchCoordinatesByAddress,
        end: item?.geometry?.coordinates,
      });
    }
    setActiveInput(null);
    setSuggestions([]);
  };

  const onChangeText = (value: string, type: 'start' | 'end', index: 0 | 1) => {
    const isValidNumber = (): boolean => {
      const regex = /^-?\d*\.?\d*$/;
      return regex.test(value);
    };

    if (isValidNumber()) {
      const numericValue = value;

      if (type === 'start') {
        setSearchStartCoords((prevState: any) => {
          const updatedCoords = [...prevState];
          updatedCoords[index] = numericValue;
          return updatedCoords;
        });
      } else if (type === 'end') {
        console.log('type', type, index);
        console.log('value', value);

        setSearchEndCoords((prevState: any) => {
          const updatedCoords = [...prevState];
          updatedCoords[index] = numericValue;
          return updatedCoords;
        });
      }
    }
  };
  console.log('SEArch end latlng', searchEndCoords);

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
      <KeyboardAwareScrollView>
        {isAddressSelected ? (
          <>
            <AppInput
              inputContainerStyle={styles.input}
              placeholder="Starting Point"
              value={startingPoint}
              onChangeText={text => handleInputChange(text, 'start')}
              onFocus={() => setActiveInput('start')}
            />
            {activeInput === 'start' && (
              <View
                style={[
                  styles.suggestionWrapper,
                  {top: isIOS() ? WP('65') : 190},
                ]}>
                <FlatList
                  data={suggestions}
                  keyExtractor={(item: any) => item.id}
                  contentContainerStyle={styles.suggestionContainer}
                  renderItem={({item}: any) => (
                    <TouchableOpacity
                      onPress={() => handleSelect(item, 'start')}>
                      <Text
                        style={{padding: 10, color: PFColors.Standard.Black}}>
                        {item.place_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            <AppInput
              inputContainerStyle={styles.input}
              placeholder="Ending Point"
              value={endingPoint}
              onChangeText={text => handleInputChange(text, 'end')}
              onFocus={() => setActiveInput('end')}
            />
            {activeInput === 'end' && (
              <View
                style={[
                  styles.suggestionWrapper,
                  {top: isIOS() ? WP('80') : 260},
                ]}>
                <FlatList
                  data={suggestions}
                  keyExtractor={(item: any) => item.id}
                  contentContainerStyle={styles.suggestionContainer}
                  renderItem={({item}: any) => (
                    <TouchableOpacity onPress={() => handleSelect(item, 'end')}>
                      <Text
                        style={{padding: 10, color: PFColors.Standard.Black}}>
                        {item.place_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.titleView}>
              <Text style={[styles.titleText, {paddingTop: 5}]}>
                Starting Point
              </Text>
              {/* <Text style={[styles.viewOnMap]}>Select on Map</Text> */}
            </View>
            <AppInput
              maxLength={10}
              placeholder="Longitude"
              inputContainerStyle={styles.inputContainerStyle}
              value={(searchStartCoords[0] ?? '').toString()}
              onChangeText={text => onChangeText(text, 'start', 0)}
            />
            <AppInput
              maxLength={10}
              placeholder="Latitude"
              inputContainerStyle={styles.inputContainerStyle}
              value={(searchStartCoords[1] ?? '').toString()}
              onChangeText={text => onChangeText(text, 'start', 1)}
            />

            <Text style={[styles.titleText, {paddingTop: 10}]}>
              Ending Point
            </Text>
            <AppInput
              maxLength={10}
              placeholder="Longitude"
              inputContainerStyle={styles.inputContainerStyle}
              value={(searchEndCoords[0] ?? '').toString()}
              onChangeText={text => onChangeText(text, 'end', 0)}
            />

            <AppInput
              maxLength={10}
              placeholder="Latitude"
              inputContainerStyle={styles.inputContainerStyle}
              value={(searchEndCoords[1] ?? '').toString()}
              onChangeText={text => onChangeText(text, 'end', 1)}
            />
          </>
        )}
        <AppButton
          title="Search"
          buttonStyle={styles.btnStyles}
          handleClick={() => handleSearchBtn()}
          // disabled={
          //   searchCoordinatesByAddress?.end === '' ||
          //   searchCoordinatesByAddress?.start === ''
          // }
        />
      </KeyboardAwareScrollView>
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
export default CreateRouteSearch;
