import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppLoader} from '../../../../../components';
import ChatListItem from '../../../../../components/complex/ChatListItem';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import EmptyChatView from '../../../../../components/complex/EmptyChatView';
import {useActionCable} from '../../../../../hooks/socket/useActionCable';
import {useChannel} from '../../../../../hooks/socket/useChannel';
import {
  useDeleteChatMutation,
  useGetChatsMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {setChatCount} from '../../../../../redux/chat/chatSlice';
import {REQ_LIST_SOCKET_URL} from '../../../../../shared/exporter';
import styles from './styles';

const ChatList = () => {
  const {params} = useRoute();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchedChats, setSearchedChats] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [deleteChat] = useDeleteChatMutation();
  const [getChats, {isLoading, data}] = useGetChatsMutation();

  const {loginUser, accessToken} = useSelector((state: any) => state.auth);
  const token = accessToken?.replace('Bearer ', '');
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, token);
  const {subscribe, unsubscribe} = useChannel(actionCable);

  useEffect(() => {
    try {
      subscribe(
        {
          channel: 'ChatCountsChannel',
          channel_key: `chat_counts_${loginUser?.id}`,
        },
        {
          received: res => {
            dispatch(setChatCount(res));
            getChats({});
          },
          connected: () => {},
        },
      );
    } catch (err) {
      //
    }
    return () => {
      unsubscribe();
    };
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      if (isFocused) {
        if (isInitialLoading) {
          setLoader(true);
        }
        await getChats({});
        setIsInitialLoading(false);

        setTimeout(() => {
          setLoader(false);
        }, 300);
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    if (data) {
      setChats(data?.chats ?? []);
    }
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search?.trim().length > 0 && chats?.length > 0) {
        const searchText = search.toLowerCase();

        const filteredChats = chats.filter(
          (chat: any) =>
            `${chat?.user?.first_name} ${chat?.user?.last_name}`
              ?.toLowerCase()
              .includes(searchText) ||
            chat?.last_message?.content?.toLowerCase().includes(searchText),
        );

        setSearchedChats(filteredChats);
      } else {
        setSearchedChats([]);
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [search]);

  const onPressDelete = async (item: any) => {
    try {
      const res = await deleteChat(item.id);
      if (res) {
        await getChats({});
      }
    } catch (error) {
      //
    }
  };

  const renderItem = ({item, index}: any) => {
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
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>No chats found</Text>
      </View>
    );
  };

  if (isInitialLoading && loader) {
    return <AppLoader />;
  }

  return (
    <View style={styles.container}>
      {chats?.length === 0 && !loader ? (
        <EmptyChatView
          buttonText={'Initiate Chat'}
          onPress={() => {
            navigation.navigate('ChatUsers');
          }}
        />
      ) : (
        <>
          <ChatSearch
            placeholder="Search"
            value={search}
            onChangeText={text => {
              setSearch(text);
            }}
          />
          <FlatList
            data={search?.length > 0 ? searchedChats : chats}
            renderItem={renderItem}
            ListEmptyComponent={!loader && listEmptyComponent}
            keyExtractor={(_, index) => index.toString()}
          />
        </>
      )}
    </View>
  );
};

export default ChatList;
