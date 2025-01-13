import React, {useRef, useImperativeHandle, forwardRef} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  WP,
  PFColors,
  PFFonts,
  PFFontSize,
  HP,
  isIOS,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import {RadioSelector} from '../RadioSelectorCard';
import {AppButton} from '../AppButton';

interface RideCancelReasonSheetProps {
  data: any;
  onPressModel?: (v: any) => void;
  onPressWeight?: any;
  isCompany?: boolean;
  ref: any;
  handleCancelSheetDone: () => void;
  disabled: boolean;
}

const RideCancelReasonSheet: React.FC<RideCancelReasonSheetProps> = forwardRef(
  ({data, onPressWeight, handleCancelSheetDone, disabled}, ref) => {
    const refScrollable = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        refScrollable.current.open();
      },
      close: () => {
        refScrollable.current.close();
      },
    }));

    const renderItem = ({item, index}: {item: any; index: number}) => (
      <RadioSelector item={item} onPressCard={() => onPressWeight(item)} />
    );

    return (
      <RBSheet
        ref={refScrollable}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            height: isIOS() ? HP('85') : HP('100'),
            borderTopLeftRadius: WP('3'),
            borderTopRightRadius: WP('3'),
          },
        }}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.sheetHeader}>
              <Text style={styles.selectOptionText}>
                {'Cancel Ride Comments'}
              </Text>
              <TouchableOpacity
                onPress={() => refScrollable.current.close()}
                style={{right: 10}}>
                {svgIcon.CrossCirlce}
              </TouchableOpacity>
            </View>

            <Text style={styles.previousTextStyle}>{'Choose Comment'}</Text>
            <FlatList
              data={data}
              extraData={data}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item?.toString()}
            />
            <AppButton
              handleClick={handleCancelSheetDone}
              title="Done"
              buttonStyle={styles.doneBtnStyle}
              disabled={disabled}
            />
          </View>
        </ScrollView>
      </RBSheet>
    );
  },
);

export {RideCancelReasonSheet};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: WP('4'),
  },
  previousTextStyle: {
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingBottom: 5,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  eveningRow: {
    marginTop: WP('1'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectOptionText: {
    marginBottom: WP('5'),
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  doneBtnStyle: {
    marginVertical: WP('10'),
  },
});
