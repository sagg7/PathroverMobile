import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppButton,
  AppHeader,
  FilterLocationSheet,
  MainWrapper,
} from '../../../../components';
import styles from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import {appIcons, HP, WP} from '../../../../shared/exporter';
import {DatePicker} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {svgIcon} from '../../../../assets/svg';
import useLocation from '../../../../hooks/getLocation';
interface ClickableViewProps {
  title: string;
  onPress?: () => void;
  icon?: any;
}

const FilterScreen = ({route}: any) => {
  const [show, setShow] = useState(false);
  const refScrollable = useRef<any>();
  const [date, setDate] = useState('');
  const navigation = useNavigation();
  const {location} = useLocation();
  const [myLocation, setMyLocation] = useState<any>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    if (route?.params) setDate(route?.params?.date || '');
    setSelectedLocation(route?.params?.location || null);
  }, [route]);

  useEffect(() => {
    if (location) setMyLocation([location?.longitude, location?.latitude]);
  }, [location]);

  const ClickableView = ({title, icon, onPress}: ClickableViewProps) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.containerView}>
          <View style={styles.row}>
            {icon}
            <Text style={styles.textStyles}> {title}</Text>
          </View>
          <Image
            source={appIcons.chevron}
            style={styles.chevronStyles}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const onConfirm = dates => {
    const dateTimeString = dates;
    setDate(dateTimeString?.toISOString().split('T')[0]);
    setShow(false);
  };
  const onChange = dates => {};

  const handleSaveBtn = () => {
    if (route?.params?.onSelectDate) {
      route?.params?.onSelectDate({
        date: date,
        location: selectedLocation,
      });
    }
    navigation.goBack();
  };

  const clearFilter = () => {
    if (route?.params?.onSelectDate) {
      route?.params?.onSelectDate({
        date: '',
        location: null,
      });
    }
    navigation.goBack();
  };

  const onPressLocationDone = () => {
    setSelectedLocation(myLocation);
    setTimeout(() => {
      refScrollable.current.close();
    }, 1000);
  };

  return (
    <MainWrapper>
      <AppHeader title="Filter" />
      <View style={styles.height} />

      <ClickableView
        title={date ? date : 'Date'}
        icon={svgIcon.Calendar}
        onPress={() => setShow(true)}
      />
      <View style={styles.height} />
      <ClickableView
        title={'Location'}
        icon={svgIcon.BlueMarker}
        // onPress={() => setShowLocationSheet(true)
        onPress={() => refScrollable.current.open()}
      />

      <RBSheet
        ref={refScrollable}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            height: HP('60'),
            borderTopLeftRadius: WP('3'),
            borderTopRightRadius: WP('3'),
          },
        }}>
        <FilterLocationSheet
          modalVisible={refScrollable}
          onPressCancel={() => refScrollable?.current.close()}
          currentLocation={selectedLocation ? selectedLocation : myLocation}
          setLocation={setMyLocation}
          onPressDone={() => onPressLocationDone()}
          setModalVisible={() => refScrollable?.current.close()}
        />
      </RBSheet>

      <DatePicker
        show={show}
        onCancel={() => setShow(false)}
        onConfirm={onConfirm}
        onChange={onChange}
      />

      {route?.params?.date ? (
        <AppButton
          title="Clear Filter"
          buttonStyle={styles.buttonStyle}
          handleClick={() => clearFilter()}
        />
      ) : (
        <AppButton
          title="Done"
          buttonStyle={styles.buttonStyle}
          handleClick={() => handleSaveBtn()}
        />
      )}
      <View style={styles.height} />
    </MainWrapper>
  );
};

export default FilterScreen;
