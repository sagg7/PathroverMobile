import React, {useRef, useImperativeHandle, forwardRef, useState} from 'react';
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
import {ItemInfoCard} from '../ItemInfoCard';

interface OptionSelectorSheetProps {
  data: any;
  onPressModel?: (v: any) => void;
  onPressWeight?: (v: any) => void;
  isCompany?: boolean;
  ref: any;
}

const OptionSelectorSheet: React.FC<OptionSelectorSheetProps> = forwardRef(
  ({data, onPressWeight, onPressModel, isCompany = false}, ref) => {
    const refScrollable = useRef(null);
    const modelArr = data?.find(item => item.isWeightSelected)?.model;
    const itemInfo = modelArr?.find(item => item.isModelSelected);
    const trailerObj = data?.find(item => item.isWeightSelected);

    useImperativeHandle(ref, () => ({
      open: () => {
        refScrollable.current.open();
      },
      close: () => {
        refScrollable.current.close();
      },
    }));

    const nestedRenderItem = ({item, index}: object | any) => (
      <RadioSelector item={item} onPressCard={() => onPressModel(item)} />
    );

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
            height: isIOS() ? HP('95') : HP('100'),
            borderTopLeftRadius: WP('3'),
            borderTopRightRadius: WP('3'),
          },
        }}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.sheetHeader}>
              <Text style={styles.selectOptionText}>
                {isCompany ? 'Type of Company' : 'Select Option'}
              </Text>
              <TouchableOpacity
                onPress={() => refScrollable.current.close()}
                style={{right: 10}}>
                {svgIcon.CrossCirlce}
              </TouchableOpacity>
            </View>
            {trailerObj?.standardLengths?.length > 0 ? (
              <Text style={styles.previousTextStyle}>Choose Type</Text>
            ) : (
              <Text style={styles.previousTextStyle}>
                {isCompany ? 'Choose Company Type' : 'Choose Weight'}
              </Text>
            )}
            <FlatList
              data={data}
              extraData={data}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item?.toString()}
            />
            {trailerObj?.standardLengths?.length && (
              <ItemInfoCard item={trailerObj} isRed={false} />
            )}
            <View style={{height: 10}} />

            {modelArr && (
              <>
                <Text style={styles.previousTextStyle}>Choose Model</Text>
                <FlatList
                  data={modelArr}
                  extraData={data}
                  renderItem={nestedRenderItem}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item?.id.toString()}
                />
                {modelArr && itemInfo && (
                  <ItemInfoCard item={itemInfo} isRed={false} />
                )}
              </>
            )}
          </View>
        </ScrollView>
      </RBSheet>
    );
  },
);

export {OptionSelectorSheet};

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
});
