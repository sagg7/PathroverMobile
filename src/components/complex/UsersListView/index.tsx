import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {appIcons} from '../../../assets/icons';
import {svgIcon} from '../../../assets/svg';

interface UsersListViewProps {
  usersList: Array<object>;
  onPress: (user: object) => void;
}

const UsersListView = ({usersList, onPress}: UsersListViewProps) => {
  const renderTopItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.topIconStyle}
        onPress={() => onPress(item)}>
        <Image
          source={
            item?.profile_image
              ? {uri: item?.profile_image}
              : appIcons.userPlaceholder
          }
          style={styles.imageStyle}
        />

        <View style={styles.removeIconView}>{svgIcon.RemoveIcon}</View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        horizontal
        data={usersList}
        renderItem={renderTopItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topScrollStyle}
        keyExtractor={(item, index) => item + index.toString()}
      />
    </View>
  );
};

export default UsersListView;

const styles = StyleSheet.create({
  removeIconView: {
    position: 'absolute',
    right: -1,
    bottom: -2,
  },
  topIconStyle: {
    paddingHorizontal: 6,
  },
  topScrollStyle: {
    paddingTop: 8,
    marginHorizontal: 6,
    paddingBottom: 18,
  },
  imageStyle: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
});
