import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import ChatListItem from '../../../../../components/complex/ChatListItem';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import EmptyChatView from '../../../../../components/complex/EmptyChatView';
import styles from './styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  useDeleteChatMutation,
  useGetChatsMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {AppLoader} from '../../../../../components';

const ChatList = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState('');
  const [deleteChat] = useDeleteChatMutation();
  const [getChats, {isLoading, data}] = useGetChatsMutation();

  useEffect(() => {
    (async () => {
      if (isFocused) {
        await getChats();
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    if (data?.chats?.length > 0) {
      setChats(data?.chats);
    } else {
      setChats([]);
    }
  }, [data]);

  const onPressDelete = async item => {
    try {
      const res = await deleteChat(item.id);
      if (res?.data) {
        await getChats();
      }
    } catch (error) {
      //
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <ChatListItem
        item={item}
        onPress={() => {
          navigation.navigate('ChatDetail', {item, isGroup: false});
        }}
        onPressDelete={() => onPressDelete(item)}
      />
    );
  };

  const listEmptyComponent = () => {
    return <EmptyChatView buttonText={'Initiate Chat'} onPress={() => {}} />;
  };

  const listHeaderComponent = () => {
    return (
      <ChatSearch
        placeholder="Search"
        value={search}
        onChangeText={text => {
          setSearch(text);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <AppLoader />
      ) : (
        <FlatList
          data={chats}
          renderItem={renderItem}
          ListEmptyComponent={listEmptyComponent}
          ListHeaderComponent={listHeaderComponent}
          keyExtractor={(item, index) => item + index.toString()}
        />
      )}
    </View>
  );
};

export default ChatList;
