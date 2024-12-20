import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  appIcons,
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  showAlert,
  verticalScale,
  WP,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import {AppInput, AppButton} from './../../../components';

interface SelectionBoxProps {
  isSelected: boolean;
  onPress: () => void;
  title: string;
}

interface LocationBoxProps {
  title: string;
  showArrow?: boolean;
  onPress?: () => void;
}
const locationInitial = {
  pickupLatitude: '',
  pickupLongitude: '',
  dropoffLatitude: '',
  dropoffLongitude: '',
};
const SearchAddressSelector = () => {
  const [isAddressSelected, setIsAddressSelected] = useState(true);
  const [isDropOffSelected, setIsDropOffSelected] = useState(false);
  const [isFieldsVisible, setIsFieldsVisible] = useState(false);
  const [showSelectedLocationBox, setShowSelectedLocationBox] =
    useState<boolean>(false);
  const [locations, setLocations] = useState<any>(locationInitial);

  const handleLocationPress = (isDropOff: boolean) => {
    setIsDropOffSelected(isDropOff);
    setIsFieldsVisible(true);
  };
  const LOCATIONS = {
    DROP_OFF: 'Drop-off Location',
    PICK_UP: 'Pickup Location',
  };

  const SelectionBox = ({isSelected, onPress, title}: SelectionBoxProps) => (
    <TouchableOpacity onPress={onPress} disabled={isSelected}>
      <View style={getOptionBoxStyle(isSelected)}>
        <Text style={getOptionTextStyle(isSelected)}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  const LocationBox = ({
    title,
    showArrow = false,
    onPress,
  }: LocationBoxProps) => (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <View style={styles.locationBox}>
        <Text style={styles.locationBoxText}>{title}</Text>
        {showArrow && svgIcon.LeftArrow}
      </View>
    </TouchableOpacity>
  );
  const handleSaveNextBtn = () => {
    const {dropoffLatitude, dropoffLongitude, pickupLongitude, pickupLatitude} =
      locations;
    if (!isDropOffSelected) {
      if (pickupLatitude && pickupLongitude) {
        setIsDropOffSelected(true);
      } else {
        showAlert('Alert', 'Please fill pickup data to continue');
      }
    } else {
      if (dropoffLatitude && dropoffLongitude) {
        setShowSelectedLocationBox(true);
        setIsDropOffSelected(false);
      } else {
        showAlert('Alert', 'Please fill drop-off data to continue');
      }
    }
  };

  const renderFields = (title: string) =>
    !showSelectedLocationBox && (
      <>
        <LocationBox title={title} />
        <AppInput
          maxLength={10}
          placeholder="Latitude"
          inputContainerStyle={styles.inputContainerStyle}
          value={
            title === LOCATIONS.DROP_OFF
              ? locations.dropoffLatitude
              : locations.pickupLatitude
          }
          onChangeText={(value: any) => {
            if (isNaN(value)) {
              showAlert('Invalid Input', 'Please enter a valid number');
              return;
            }

            setLocations((prev: any) => ({
              ...prev,
              [title === LOCATIONS.DROP_OFF
                ? 'dropoffLatitude'
                : 'pickupLatitude']: Number(value),
            }));
          }}
        />
        <AppInput
          maxLength={10}
          placeholder="Longitude"
          inputContainerStyle={styles.inputContainerStyle}
          value={
            title === LOCATIONS.DROP_OFF
              ? locations.dropoffLongitude
              : locations.pickupLongitude
          }
          onChangeText={(value: any) => {
            if (isNaN(value)) {
              showAlert('Invalid Input', 'Please enter a valid number');
              return;
            }
            setLocations((prev: any) => ({
              ...prev,
              [title === LOCATIONS.DROP_OFF
                ? 'dropoffLongitude'
                : 'pickupLongitude']: Number(value),
            }));
          }}
        />

        <View style={styles.btnContainer}>
          <AppButton
            title={isDropOffSelected ? 'Save' : 'Next'}
            handleClick={() => handleSaveNextBtn()}
          />
        </View>
      </>
    );

  const SelectedLocationBox = ({show, lat, lng}: any) => {
    return (
      <View style={styles.selectedLocationBox}>
        <View style={styles.innerContainer}>
          <Text style={styles.pickupText}>
            {show ? 'Pickup' : 'Drop off'} Location
          </Text>
          {show && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setLocations(locationInitial);
                setIsDropOffSelected(false);
                setShowSelectedLocationBox(false);
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.clearTextStyle}>Clear</Text>
                {svgIcon.LeftArrow}
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.latlngText}>
          Latitude: {lat}°, Longitude: {lng}°
        </Text>
      </View>
    );
  };

  return (
    <View>
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
        <View style={styles.locationBoxContainer}>
          <View style={styles.locationBoxSideContainer}>
            <View style={styles.blueDotStyles} />
            <View style={styles.verticalDashLine} />
            <Image source={appIcons.redMarker} style={styles.redMarkerStyles} />
          </View>
          <View>
            <LocationBox title="Your Pickup Location" />
            <LocationBox title="Your Drop off Location" />
          </View>
        </View>
      ) : (
        <View>
          {!isFieldsVisible ? (
            <>
              <LocationBox
                title="Your Pickup Location"
                showArrow
                onPress={() => handleLocationPress(false)}
              />
              <LocationBox
                title="Your Drop off Location"
                showArrow
                onPress={() => handleLocationPress(true)}
              />
            </>
          ) : isDropOffSelected ? (
            renderFields(LOCATIONS.DROP_OFF)
          ) : (
            renderFields(LOCATIONS.PICK_UP)
          )}
        </View>
      )}
      {showSelectedLocationBox && (
        <>
          <View style={styles.selectedLocationBox}>
            <SelectedLocationBox
              show
              lat={locations.pickupLatitude}
              lng={locations.pickupLongitude}
            />
            <SelectedLocationBox
              lat={locations.dropoffLatitude}
              lng={locations.dropoffLongitude}
            />
          </View>
          <View style={styles.btnContainer}>
            <AppButton title={'Apply'} handleClick={() => {}} />
          </View>
        </>
      )}
    </View>
  );
};

export default SearchAddressSelector;

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

const styles = StyleSheet.create({
  selectorMainView: {
    backgroundColor: PFColors.Gray.LightMist,
    height: scale(48),
    width: WP('82'),
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  locationBox: {
    borderWidth: 1,
    width: WP('82'),
    padding: WP('5'),
    alignSelf: 'center',
    borderColor: PFColors.Gray.borderGray,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationBoxText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
  },
  locationBoxSideContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  locationBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redMarkerStyles: {
    height: scale(16),
    width: scale(16),
  },
  verticalDashLine: {
    borderWidth: 1,
    width: 1,
    height: scale(55),
    borderStyle: 'dashed',
    borderColor: PFColors.Gray.borderGray,
  },
  blueDotStyles: {
    backgroundColor: PFColors.Blue.Dark,
    height: scale(11),
    width: scale(11),
    borderRadius: 20,
    borderWidth: 3,
    borderColor: PFColors.Gray.borderGray,
    marginBottom: 4,
  },
  inputContainerStyle: {
    width: WP('82'),
  },
  btnContainer: {
    alignSelf: 'center',
    width: WP('82'),
    marginVertical: verticalScale(12),
  },
  selectedLocationBox: {
    backgroundColor: PFColors.Gray.WhisperGray,
    width: WP('82'),
    alignSelf: 'center',
    borderRadius: 10,
    padding: 5,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickupText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingVertical: scale(5),
  },
  latlngText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Gray.DarkGray,
  },
  clearTextStyle: {
    color: PFColors.Orange.Dark,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(14),
    textDecorationLine: 'underline',
  },
  orangeArrowStyles: {
    height: scale(12),
    width: scale(12),
    // transform: [{rotate: '270deg'}],
  },
});
