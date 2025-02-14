import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppHeader, AppLoader, MainWrapper} from '../../../../../components';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import {appIcons} from '../../../../../assets/icons';
import styles from './styles';
import {
  useCreateChatMutation,
  useGetAllUsersMutation,
} from '../../../../../redux/chat/chatApiSlice';

const ChatUsers = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [getAllUsers, {isLoading, data}] = useGetAllUsersMutation();
  const [createChat] = useCreateChatMutation();

  useEffect(() => {
    (async () => {
      if (isFocused) {
        await getAllUsers();
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    setUsers(data?.users);
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search?.length > 0 && users?.length > 0) {
        const searchText = search.toLowerCase();
        setUsers(
          users?.filter(
            user =>
              user?.first_name?.toLowerCase()?.includes(searchText) ||
              user?.last_name?.toLowerCase()?.includes(searchText),
          ),
        );
      } else {
        setUsers(data?.users);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const initiateChat = async item => {
    try {
      const obj = {
        chat: {
          chat_type: 0,
          chat_members_attributes: [{user_id: item?.id}],
        },
      };
      const res = await createChat(obj);
      if (res?.data) {
        navigation.navigate('ChatDetail', {
          item: res?.data,
          isGroup: false,
        });
      }
    } catch (error) {
     //
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => initiateChat(item)}>
        <Image
          source={item?.avatar ? {uri: item?.avatar} : appIcons.userPlaceholder}
          style={styles.imageStyle}
        />
        <View style={styles.textView}>
          <Text style={styles.nameText}>
            {item?.first_name || 'User'} {item?.last_name || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper>
      <AppHeader title="All Users" clickBackIcon={() => navigation.pop()} />
      <ChatSearch
        value={search}
        placeholder="Search"
        onChangeText={text => setSearch(text)}
      />
      {isLoading ? (
        <AppLoader />
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item, index) => item + index.toString()}
        />
      )}
    </MainWrapper>
  );
};

export default ChatUsers;
