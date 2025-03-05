import React from 'react';
import {
    FlatList,
    Image,
    TouchableOpacity,
    View
} from 'react-native';
import styles from './styles';
import { Text } from 'react-native';
import { appImages } from '../../../../../assets/images';

const Photos = () => {
    const renderItem = () => {
        return (
            <Image
                source={appImages.sittingView}
                style={styles.imageStyle}
            />
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.headerStyle}>
                <Text style={styles.headerText}>All</Text>
                <TouchableOpacity style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Add a photo</Text>
                </TouchableOpacity>
            </View>
            <View>
                <FlatList
                    data={[1, 2, 3, 4, 5, 6]}
                    numColumns={2}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item + index.toString()
                    }
                    renderItem={renderItem}
                    columnWrapperStyle={styles.columnWrapperStyle}
                    style={styles.contentContainerStyle}
                />
            </View>
        </View>
    );
};

export default Photos;
