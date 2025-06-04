import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './styles';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import FitImage from 'react-native-fit-image';
import {PFColors} from '../../../../../shared/exporter';

const Photos = () => {
  const {selectedCustomTrail} = useSelector(
    (state: any) => state?.endUser?.trailRoute,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePress = image => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <Image source={{uri: item}} style={styles.imageStyle} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={<Text style={styles.noFound}>No Images Found</Text>}
        data={selectedCustomTrail?.images}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item + index.toString()}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapperStyle}
        style={styles.contentContainerStyle}
      />
      <Modal
        isVisible={modalVisible}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        useNativeDriver={true}
        style={styles.modalContainer}>
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
          style={styles.imageStyle}>
          <FitImage
            indicatorColor={PFColors.Standard.White}
            indicatorSize={'small'}
            source={{uri: selectedImage}}
            style={styles.fullImageStyle}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Photos;
