import {useIsFocused, useNavigation} from '@react-navigation/native';
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
  useDeleteGroupMutation,
  useGetGroupChatsMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {setChatCount} from '../../../../../redux/chat/chatSlice';
import {REQ_LIST_SOCKET_URL} from '../../../../../shared/exporter';
import styles from './styles';

const ChatGroup = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [searchedChats, setSearchedChats] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [getGroupChats, {isLoading, data}] = useGetGroupChatsMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  const {loginUser, accessToken} = useSelector((state: any) => state.auth);
  const token = accessToken?.replace('Bearer ', '');
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, token);
  const { subscribe, unsubscribe } = useChannel(actionCable);  

  useEffect(() => {
    try {
      subscribe(
        {
          channel: 'ChatCountsChannel',
          channel_key: `chat_counts_${loginUser?.id}`,
        },
        {
          received: res => {
            // console.log('ChatCountsChannel res', res);
            
            dispatch(setChatCount(res));
            getGroupChats({});
          },
          connected: () => {
            // console.log('connected----------ChatCountsChannel-------------->>>');g
            
          },
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
        await getGroupChats({});
        setIsInitialLoading(false);
        setTimeout(() => {
          setLoader(false);
        }, 800);
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    if (data) {
      setChats(prevChats => {
        if (prevChats?.length === 0) return data ?? [];
        const chatMap = new Map(prevChats?.map(chat => [chat?.id, chat]));
        data?.forEach((chat: any) => chatMap?.set(chat?.id, chat));
        return Array.from(chatMap.values());
      });
    } else {
      setChats([]);
    }
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search?.trim().length > 0 && chats?.length > 0) {
        const searchText = search.toLowerCase();

        const filteredChats = chats.filter(
          (chat: any) =>
            chat?.name?.toLowerCase().includes(searchText) ||
            chat?.last_message?.toLowerCase().includes(searchText),
        );

        setSearchedChats(filteredChats);
      } else {
        setSearchedChats([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const onPressDelete = async (item: any) => {
    try {
      const res = await deleteGroup(item.id);
      console.log(res, 'deleteGroup');
      
      if (res?.data) {
        await getGroupChats({});
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
          navigation.navigate('GroupChatDetail', {item, isGroup: true});
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
      {chats?.length === 0 ? (
        <EmptyChatView
          buttonText={'Initiate Chat'}
          onPress={() => {
            navigation.navigate('MemberList');
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
            ListEmptyComponent={listEmptyComponent}
            keyExtractor={(item, index) => item + index.toString()}
          />
        </>
      )}
    </View>
  );
};

export default ChatGroup;
