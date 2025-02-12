import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import {appIcons} from '../../../../../assets/icons';
import {svgIcon} from '../../../../../assets/svg';
import {
  ChatBubble,
  MainWrapper,
  RenderDay,
  RenderInputToolbar,
  RenderMessageText,
  RenderTime,
} from '../../../../../components';
import CreateGroupModal from '../../../../../components/complex/CreateGroupModal';
import {
  useCreateChatMessageMutation,
  useCreateGroupMessageMutation,
  useGetChatMessageMutation,
  useGetGroupChatMessagesMutation,
  useReadChatMessageMutation,
} from '../../../../../redux/chat/chatApiSlice';
import styles from './styles';
import RenderMessageImage from '../../../../../components/complex/ChatComponents/RenderMessageImage';
import {useActionCable} from '../../../../../hooks/socket/useActionCable';
import {useChannel} from '../../../../../hooks/socket/useChannel';
import {REQ_LIST_SOCKET_URL} from '../../../../../shared/exporter';

interface HeaderProps {
  isGroup: boolean;
  title: string;
  onPressBack: () => void;
  onPressMenu?: () => void;
  onPressPhone?: () => void;
  onPressVideo?: () => void;
}

const Header = ({
  isGroup,
  onPressBack,
  onPressMenu,
  title,
  onPressPhone,
  onPressVideo,
}: HeaderProps) => {
  return (
    <View style={styles.groupHeader}>
      <TouchableOpacity onPress={onPressBack}>
        {svgIcon.BackArrow}
      </TouchableOpacity>
      <View style={styles.headerTextView(isGroup)}>
        {!isGroup && (
          <Image
            source={
              title?.user?.avatar
                ? {uri: title?.user?.avatar}
                : appIcons.userPlaceholder
            }
            style={styles.imageStyle}
          />
        )}
        <Text style={styles.groupNameText}>
          {title && typeof title === 'object' && title.user
            ? [title.user.first_name, title.user.last_name]
                .filter(Boolean)
                .join(' ')
            : title?.name || ''}
        </Text>
      </View>
      {isGroup && (
        <TouchableOpacity onPress={onPressMenu}>
          <Image source={appIcons.menuIcon} style={styles.iconStyle} />
        </TouchableOpacity>
      )}
      {!isGroup && (
        <View style={styles.iconView}>
          <TouchableOpacity onPress={onPressPhone}>
            {svgIcon.BlackPhone}
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressVideo}>
            {svgIcon.VideoIcon}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const ChatDetail = () => {
  const {params} = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const {loginUser, accessToken} = useSelector(state => state.auth);
  const token = accessToken?.replace('Bearer ', '');
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, token);
  const {subscribe, unsubscribe} = useChannel(actionCable);

  const [readChatMessage] = useReadChatMessageMutation();
  const [createChatMessage] = useCreateChatMessageMutation();
  const [createGroupMessage] = useCreateGroupMessageMutation();
  const [getChatMessage, {data: chat}] = useGetChatMessageMutation();
  const [getGroupChatMessages, {data}] = useGetGroupChatMessagesMutation();
  const [readGroupChatMessage] = useReadChatMessageMutation();

  useEffect(() => {
    try {
      if (params?.isGroup) {
        subscribe(
          {
            channel: 'GroupChatChannel',
            channel_key: `group_chat_${params?.item?.id}_channel`,
            group_id: params?.item?.id,
          },
          {
            received: res => {
              getGroupChatMessages(params?.item?.id);
              readChat();
            },
            connected: () => {},
          },
        );
      } else {
        subscribe(
          {
            channel: 'PrivateChatChannel',
            channel_key: `private_chat_${params?.item?.id}_channel`,
            chat_id: params?.item?.id,
          },
          {
            received: res => {
              getChatMessage(params?.item?.id);
              readChat();
            },
            connected: () => {},
          },
        );
      }
    } catch (err) {
      //
    }

    return () => {
      unsubscribe();
    };
  }, [params]);

  useEffect(() => {
    if (data?.length > 0 && params?.isGroup) {
      const rearrange = data.map(i => ({
        ...i,
        _id: i?.id,
        user: {...i.user, _id: i.user.id},
      }));
      setMessages(rearrange);
    }
    if (chat?.length > 0 && !params?.isGroup) {
      const rearrange = chat.map(i => ({
        ...i,
        _id: i?.id,
        user: {...i.user, _id: i.user.id},
      }));
      setMessages(rearrange);
    }
  }, [data, chat]);

  useEffect(() => {
    (async () => {
      if (isFocused && params?.isGroup) {
        await getGroupChatMessages(params?.item?.id);
      } else {
        await getChatMessage(params?.item?.id);
      }
      readChat();
    })();
  }, [isFocused]);

  const onSend = async (message: string) => {
    try {
      const {item, isGroup} = params;
      const form = new FormData();

      if (isGroup) {
        if (message[0]?.image) {
          form.append('message[message_attachment]', {
            uri:
              Platform.OS === 'ios'
                ? message[0]?.image?.sourceURL?.replace('file://', '')
                : message[0]?.image?.sourceURL?.uri,
            type: message[0]?.image?.mime,
            name: message[0]?.image?.filename,
          });
        }
        form.append('message[content]', message[0]?.text);
        form.append('message[user_id]', loginUser?.id);
        form.append('message[message_type]', 'group');
        form.append('message[read]', false);
        form.append('message[group_id]', item?.id);

        const res = await createGroupMessage({data: form, id: item?.id});
        if (res) {
          await getGroupChatMessages(item?.id);
        }
      } else {
        if (message[0]?.image) {
          form.append('message[message_attachment]', {
            uri:
              Platform.OS === 'ios'
                ? message[0]?.image?.sourceURL?.replace('file://', '')
                : message[0]?.image?.sourceURL?.uri,
            type: message[0]?.image?.mime,
            name: message[0]?.image?.filename,
          });
        }

        form.append('message[content]', message[0]?.text);
        form.append('message[user_id]', loginUser?.id);
        form.append('message[message_type]', 'private');
        form.append('message[read]', false);

        const res = await createChatMessage({data: form, id: item?.id});
        if (res) {
          await getChatMessage(item?.id);
        }
      }
    } catch (error) {
      //
    }
  };

  const readChat = async () => {
    try {
      if (!params?.isGroup) {
        await readChatMessage(params?.item?.id);
      } else {
        await readGroupChatMessage(params?.item?.id);
      }
    } catch (error) {
      //
    }
  };

  return (
    <MainWrapper>
      <Header
        isGroup={params?.isGroup}
        onPressBack={() => navigation.navigate('Chat')}
        onPressMenu={() => setShow(true)}
        title={params?.item || 'Group Chat'}
      />
      <View style={styles.container}>
        <GiftedChat
          user={{
            _id: loginUser?.id,
          }}
          keyExtractor={item => `${item._id}-${item.created_at}`}
          messages={messages}
          renderAvatar={null}
          showUserAvatar={false}
          isKeyboardInternallyHandled
          keyboardShouldPersistTaps="never"
          renderDay={RenderDay}
          renderBubble={props => <ChatBubble props={props} />}
          renderMessageText={RenderMessageText}
          renderTime={RenderTime}
          renderMessageImage={RenderMessageImage}
          renderInputToolbar={props =>
            RenderInputToolbar(props, () => {}, true)
          }
          listViewProps={{
            showsVerticalScrollIndicator: false,
            onEndReachedThreshold: 0.3,
          }}
          onSend={messages => onSend(messages)}
        />
      </View>

      {show && (
        <CreateGroupModal
          isVisible={show}
          tagText={'Group Info'}
          onPressClose={() => setShow(false)}
          onPress={() => {
            setShow(false);
            navigation.navigate('GroupInfo', {item: params?.item});
          }}
        />
      )}
    </MainWrapper>
  );
};

export default ChatDetail;
