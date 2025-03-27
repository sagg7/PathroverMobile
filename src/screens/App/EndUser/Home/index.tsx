import React, {useState} from 'react';
import {Text, View, Image, FlatList, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {AskMe, MainWrapper} from '../../../../components';
import {Routes, appIcons, AppLoader} from '../../../../shared/exporter';
import styles from './styles';
import {useGetNewsBlogsQuery} from '../../../../redux/endUser/endUserApiSlice';

const Home = ({navigation}: any) => {
  const [search, setSearch] = useState('');

  const {data: allNewsBlogs, isLoading} = useGetNewsBlogsQuery(null);

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate(Routes.NewsBlogDetail, {item})}
      style={styles.itemContainer}>
      <Image source={{uri: item?.image_url}} style={styles.imageStyle} />
      <View style={styles.contentContainer}>
        <Text style={styles.titleTextStyle}>{item?.title}</Text>
        <Text numberOfLines={3} style={styles.descTextStyle}>
          {item?.content_in_text}
        </Text>
        <Text style={styles.timeTextStyle}>
          {moment(item?.created_at).format('MM-DD-YYYY')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <MainWrapper>
      <View style={styles.headerContainer}>
        <Text style={styles.homeTextStyle}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            resizeMode="contain"
            style={styles.settingIcon}
            source={appIcons.settingIcon}
          />
        </TouchableOpacity>
      </View>

      <AskMe
        value={search}
        placeholder={'Ask me anything...'}
        onChangeText={txt => setSearch(txt)}
        onPress={() => {
          navigation.navigate('AiChat', {search});
          setSearch('');
        }}
      />
      <Text style={styles.headingTextStyle}>Latest News and Blogs</Text>
      {allNewsBlogs?.length >> 0 ? (
        <FlatList
          data={allNewsBlogs}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(index: any) => index.toString()}
        />
      ) : (
        <View style={styles.noRecordContainer}>
          <Text style={styles.noRecordTextStyle}>
            {!isLoading && 'No Records Found'}
          </Text>
        </View>
      )}
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default Home;
