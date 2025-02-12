import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  colorsArr,
  routeLineArr,
  scale,
} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';

interface RouteCustomizationSheetProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressCancel: () => void;
  onPressSave?: any;
  setRouteLineHeight: any;
  setColor: any;
}

const RouteCustomizationSheet = ({
  modalVisible,
  setModalVisible,
  onPressCancel,
  setColor,
  setRouteLineHeight,
  onPressSave,
}: RouteCustomizationSheetProps) => {
  const [colors, setColors] = useState(colorsArr);
  const [routeLine, setRouteLine] = useState(routeLineArr);

  const handleColor = val => {
    const temp = colors?.map(item => {
      if (val.id === item.id) {
        return {
          ...item,
          isSelected: true,
        };
      } else {
        return {
          ...item,
          isSelected: false,
        };
      }
    });
    setColors(temp);
  };

  const handleRouteLine = (item: any) => {
    const temp = routeLine?.map(val => {
      if (item.id === val.id) {
        return {
          ...val,
          isSelected: true,
        };
      } else {
        return {
          ...val,
          isSelected: false,
        };
      }
    });
    setRouteLine(temp);
  };
  const handleSave = () => {
    const selectedHeight = routeLine.find(i => i.isSelected)?.height;
    const selectedColor = colors.find(i => i.isSelected)?.color;
    if (selectedColor) {
    }
    setColor(selectedColor);
    if (selectedHeight) setRouteLineHeight(selectedHeight);

    onPressSave();
  };

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>Customize Route</Text>
        <TouchableOpacity onPress={onPressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <Text style={styles.actionText}>Line Color</Text>

      <View style={styles.lineColorView}>
        {colors?.map((item, index) => {
          return (
            <>
              {item?.isSelected ? (
                <TouchableOpacity key={index} onPress={() => handleColor(item)}>
                  <View style={styles.outerCircle}>
                    <View
                      style={[
                        styles.colorCirle,
                        {
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity key={index} onPress={() => handleColor(item)}>
                  <View
                    style={[
                      styles.colorCirle,
                      {
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </TouchableOpacity>
              )}
            </>
          );
        })}
      </View>
      <Text style={styles.actionText}>Weight</Text>

      <View style={styles.rectangleView}>
        {routeLine?.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleRouteLine(item)}>
            <View
              style={[
                styles.rectangleStyles,
                {borderWidth: item.isSelected ? 1 : 0},
              ]}>
              <View style={[styles.routeLineStyles, {height: item?.height}]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.btnContainer}>
        <AppButton
          title="Cancel"
          isSmall="40%"
          handleClick={onPressCancel}
          buttonStyle={styles.cancelBtn}
          textStyle={{color: PFColors.Blue.Dark}}
        />

        <AppButton
          title="Save"
          isSmall="40%"
          handleClick={() => handleSave()}
        />
      </View>
    </Modal>
  );
};

export {RouteCustomizationSheet};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
  },

  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('3'),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: WP('3'),
  },

  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: 5,
  },
  lineColorView: {
    padding: 10,
    borderWidth: 1,
    marginHorizontal: WP('6'),
    borderRadius: 5,
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'space-evenly',
    borderColor: PFColors.Gray.AshGray,
  },
  colorCirle: {
    height: scale(32),
    width: scale(32),
    borderRadius: 40 / 2,
  },
  outerCircle: {
    padding: 2,
    backgroundColor: PFColors.Standard.White,
    borderRadius: 40 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  rectangleStyles: {
    backgroundColor: PFColors.Gray.LightMist,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  rectangleView: {
    padding: 10,
    borderWidth: 1,
    marginHorizontal: WP('6'),
    borderRadius: 5,
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'space-evenly',
    borderColor: PFColors.Gray.AshGray,
  },
  routeLineStyles: {
    width: scale(74),
    backgroundColor: '#000',
  },
  actionText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('6'),
    paddingVertical: 5,
  },
  cancelBtn: {
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
});
