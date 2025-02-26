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
import RenderMessageImage from '../../../../../components/complex/ChatComponents/RenderMessageImage';
import CreateGroupModal from '../../../../../components/complex/CreateGroupModal';
import {useActionCable} from '../../../../../hooks/socket/useActionCable';
import {useChannel} from '../../../../../hooks/socket/useChannel';
import {
  useCreateChatMessageMutation,
  useGetChatMessageMutation,
  useReadChatMessageMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {REQ_LIST_SOCKET_URL} from '../../../../../shared/exporter';
import styles from './styles';

interface HeaderProps {
  title: string;
  onPressBack: () => void;
  onPressPhone?: () => void;
  onPressVideo?: () => void;
}

const Header = ({
  onPressBack,
  title,
  onPressPhone,
  onPressVideo,
}: HeaderProps) => {
  return (
    <View style={styles.groupHeader}>
      <TouchableOpacity onPress={onPressBack} hitSlop={20}>
        {svgIcon.BackArrow}
      </TouchableOpacity>
      <View style={styles.headerTextView}>
        <Image
          source={
            title?.user?.avatar
              ? {uri: title?.user?.avatar}
              : appIcons.userPlaceholder
          }
          style={styles.imageStyle}
        />
        <Text style={styles.groupNameText}>
          {title && typeof title === 'object' && title.user
            ? [title.user.first_name, title.user.last_name]
                .filter(Boolean)
                .join(' ')
            : title?.name || ''}
        </Text>
      </View>

      <View style={styles.iconView}>
        <TouchableOpacity onPress={onPressPhone}>
          {svgIcon.BlackPhone}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressVideo}>
          {svgIcon.VideoIcon}
        </TouchableOpacity>
      </View>
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
  const [getChatMessage, {data: chat}] = useGetChatMessageMutation();

  useEffect(() => {
    try {
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
    } catch (err) {
      //
    }

    return () => {
      unsubscribe();
    };
  }, [params]);

  useEffect(() => {
    if (chat?.length > 0) {
      const rearrange = chat.map(i => ({
        ...i,
        _id: i?.id,
        createdAt: i?.created_at,
        user: {...i.user, _id: i.user.id},
      }));
      setMessages(rearrange);
    }
  }, [chat]);

  useEffect(() => {
    (async () => {
      if (isFocused) {
        await getChatMessage(params?.item?.id);
      }
      readChat();
    })();
  }, [isFocused]);

  const onSend = async (message: string) => {
    try {
      const {item} = params;
      const form = new FormData();
      if (message[0]?.attachment) {
        form.append('message[message_attachment]', {
          uri:
            Platform.OS === 'ios'
              ? message[0]?.attachment?.sourceURL?.replace('file://', '') ||
                message[0]?.attachment?.uri?.replace('file://', '') ||
                message[0]?.attachment?.path
              : message[0]?.attachment?.sourceURL?.uri ||
                message[0]?.attachment?.uri ||
                message[0]?.attachment?.path,
          type: message[0]?.attachment?.mime || message[0]?.attachment?.type,
          name:
            message[0]?.attachment?.filename ||
            message[0]?.attachment?.fileName ||
            message[0]?.attachment?.name ||
            '',
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
    } catch (error) {
      //
    }
  };

  const readChat = async () => {
    try {
      await readChatMessage(params?.item?.id);
    } catch (error) {
      //
    }
  };

  return (
    <MainWrapper>
      <Header
        onPressBack={() => navigation.navigate('Chat')}
        title={params?.item || 'Group Chat'}
        onPressPhone={() => {
          console.log(params?.item?.user);
          navigation.navigate('VoiceCalling', {
            user: params?.item?.user,
            channel: Platform.OS === 'android' ? 'call_501222' : '',
          });
        }}
        onPressVideo={() => {
          navigation.navigate('VideoCalling', {user: params?.item?.user, channel: Platform.OS === 'android' ? 'testChannel' : '',});
        }}
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
          scrollToBottom
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
