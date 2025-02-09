import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import ChatListItem from '../../../../../components/complex/ChatListItem';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import EmptyChatView from '../../../../../components/complex/EmptyChatView';
import styles from './styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  useDeleteGroupMutation,
  useGetGroupChatsMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {AppLoader} from '../../../../../components';

const ChatGroup = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [getGroupChats, {isLoading, data}] = useGetGroupChatsMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  useEffect(() => {
    (async () => {
      if (isFocused) {
        await getGroupChats();
      }
    })();
  }, [isFocused]);

  const onPressDelete = async item => {
    try {
      const res = await deleteGroup(item.id);
      if (res?.data) {
        await getGroupChats();
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
          navigation.navigate('ChatDetail', {item, isGroup: true});
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
          data={data}
          renderItem={renderItem}
          ListEmptyComponent={listEmptyComponent}
          ListHeaderComponent={listHeaderComponent}
          keyExtractor={(item, index) => item + index.toString()}
        />
      )}
    </View>
  );
};

export default ChatGroup;
