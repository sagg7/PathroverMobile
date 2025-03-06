import React, { useCallback, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { MainWrapper } from '../../../../components';
import { AppHeader, AppInput } from '../../../../shared/exporter';
import { svgIcon } from '../../../../assets/svg';
import styles from './styles';

const SearchTrails = ({ navigation }: any) => {
    const [searchedData, setSearchedData] = useState<any[]>([]);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [autoCompleteSearch, setAutoCompleteSearch] = useState<string>('');

    const handleChangeText = useCallback((text: string) => {
        setAutoCompleteSearch(text);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            console.log('Searched Text => ', text);

            // setSearchedData([]);
        }, 2000);
    }, []);

    const renderSearchItems = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => { navigation.navigate('SearchTrailResult') }} style={styles.itemContainer}>
            <View style={styles.innerContainer}>
                {svgIcon.RecentIcon}
                <View style={styles.textContainer}>
                    <Text style={styles.nameStyle}>IBM</Text>
                    <Text style={styles.distanceStyle}>
                        8502 Preston Rd. Inglewood, Maine 98380
                    </Text>
                </View>
            </View>
            <View style={styles.dividerStyle} />
        </TouchableOpacity>
    );

    return (
        <MainWrapper style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
                        {svgIcon.BackArrow}
                    </TouchableOpacity>
                    <AppInput
                        inputContainerStyle={styles.inputStyle}
                        placeholder={`Search`}
                        value={autoCompleteSearch}
                        onChangeText={handleChangeText}
                    />
                </View>
                <Text style={styles.recentText}>Recent</Text>
                <FlatList
                    data={[1, 2, 3, 4, 5]}
                    renderItem={renderSearchItems}
                    keyExtractor={index => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </MainWrapper>
    );
};

export default SearchTrails;