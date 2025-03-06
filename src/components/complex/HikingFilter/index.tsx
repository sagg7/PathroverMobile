import React, {useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import GeneralModal from '../GeneralModal';
import {
  BIKE_TYPE,
  DIFFICULTIES,
  DIRECTIONS,
  HIKING_FILTERS_CHECKLIST,
  LOCAL_POPULARITY,
  NEW_TRAILS,
  TRAIL_TYPE,
  TRAILS_COMPLETION,
  TRAILS_ON_WHISHLIST,
  TTFs,
  UNSANCTIONED,
} from '../../../shared/utils/constant';
import AppCheckbox from '../AppCheckbox';
import {AppButton, HP, PFColors, WP} from '../../../shared/exporter';
import AppDropdown from '../AppDropdown';
import AppRangeSlider from '../AppRangeSlider';

function HikingFilter({
  showFilterSheet,
  setShowFilterSheet,
}: {
  showFilterSheet: boolean;
  setShowFilterSheet: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [checkedItems, setCheckedItems] = useState<{[key: number]: boolean}>(
    {},
  );

  const toggleCheckbox = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <GeneralModal
      visible={showFilterSheet}
      title={'Filter'}
      swipeDirection={undefined}
      swipeThreshold={0}
      propagateSwipe={true}
      onClose={() => setShowFilterSheet(false)}>
      <View style={{maxHeight: HP('75')}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <FlatList
            scrollEnabled={false}
            data={HIKING_FILTERS_CHECKLIST}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <AppCheckbox
                checked={!!checkedItems[item.id]}
                onChange={() => toggleCheckbox(item.id)}
                label={item.label}
                containerStyle={styles.checkbox}
              />
            )}
          />
          <View style={styles.divider} />
          <View style={styles.rowView}>
            <AppDropdown
              data={DIRECTIONS}
              label="Direction"
              style={styles.dropdown}
            />
            <AppDropdown
              data={DIFFICULTIES}
              label="Difficulty"
              style={styles.dropdown}
            />
          </View>
          <View style={styles.rowView}>
            <AppDropdown data={TTFs} label="TTFs" style={styles.dropdown} />
            <AppDropdown
              data={LOCAL_POPULARITY}
              label="Local popularity"
              style={styles.dropdown}
            />
          </View>
          <View style={styles.rowView}>
            <AppDropdown
              data={BIKE_TYPE}
              label="Bike type"
              style={styles.dropdown}
            />
            <AppDropdown
              data={TRAILS_COMPLETION}
              label="Trails I’ve completed"
              style={styles.dropdown}
            />
          </View>
          <View style={styles.rowView}>
            <AppDropdown
              data={TRAIL_TYPE}
              label="Trail type"
              style={styles.dropdown}
            />
            <AppDropdown
              data={TRAILS_ON_WHISHLIST}
              label="Trails on wishlist"
              style={styles.dropdown}
            />
          </View>
          <View style={styles.rowView}>
            <AppDropdown
              data={NEW_TRAILS}
              label="New trails"
              style={styles.dropdown}
            />
            <AppDropdown
              data={UNSANCTIONED}
              label="Unsanctioned"
              style={styles.dropdown}
            />
          </View>
          <View style={styles.divider} />
          <View pointerEvents="box-none">
            <AppRangeSlider
              min={0}
              max={30}
              onValueChange={(min, max) =>
                console.log(`Selected range: ${min} km - ${max} km`)
              }
            />
          </View>
          <View style={[styles.rowView, {marginTop: WP('4')}]}>
            <AppButton
              title="Cancel"
              handleClick={() => setShowFilterSheet(false)}
              buttonStyle={{
                width: '49%',
                backgroundColor: PFColors.Yellow.Light,
              }}
            />
            <AppButton
              title="Apply"
              handleClick={() => console.log('Filters Applied', checkedItems)}
              buttonStyle={{width: '49%'}}
            />
          </View>
        </ScrollView>
      </View>
    </GeneralModal>
  );
}

export default HikingFilter;

const styles = StyleSheet.create({
  checkbox: {
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: PFColors.Gray.borderGray,
    marginBottom: 15,
    marginTop: 10,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {width: '48%'},
});
