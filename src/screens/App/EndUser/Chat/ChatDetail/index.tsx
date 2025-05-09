import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, Platform, Text, TouchableOpacity, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useSelector } from 'react-redux';
import { appIcons } from '../../../../../assets/icons';
import { svgIcon } from '../../../../../assets/svg';
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
import { useActionCable } from '../../../../../hooks/socket/useActionCable';
import { useChannel } from '../../../../../hooks/socket/useChannel';
import {
  useCreateChatMessageMutation,
  useGetChatMessageMutation,
  useReadChatMessageMutation,
} from '../../../../../redux/chat/chatApiSlice';
import { REQ_LIST_SOCKET_URL } from '../../../../../shared/exporter';
import { MESSAGE_CONTAINS_LOCATION } from '../../../../../shared/utils/constant';
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
              ? { uri: title?.user?.avatar }
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
        <TouchableOpacity
          onPress={onPressPhone}
          hitSlop={{ top: 10, bottom: 10 }}>
          {svgIcon.BlackPhone}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressVideo}
          hitSlop={{ top: 10, bottom: 10 }}>
          {svgIcon.VideoIcon}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const ChatDetail = () => {
  const { params } = useRoute<any>();
  const { shareTrail } = params;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { loginUser, accessToken } = useSelector(state => state.auth);
  const token = accessToken?.replace('Bearer ', '');
  const { actionCable } = useActionCable(REQ_LIST_SOCKET_URL, token);
  const { subscribe, unsubscribe } = useChannel(actionCable);

  const [readChatMessage] = useReadChatMessageMutation();
  const [createChatMessage, { isLoading }] = useCreateChatMessageMutation();
  const [getChatMessage, { data: chat }] = useGetChatMessageMutation();

  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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
          connected: () => {
            // setIsConnected(true);
          },
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
        user: { ...i.user, _id: i.user.id },
      }));
      setMessages(rearrange);
    }
  }, [chat]);

  useEffect(() => {
    (async () => {
      Keyboard.dismiss();
      if (isFocused) {
        await getChatMessage(params?.item?.id);
      }
      readChat();
    })();
  }, [isFocused]);

  useEffect(() => {
    // console.log('WORKING', isConnected + shareTrail);
    if (shareTrail) {
      onSend([
        { text: JSON.stringify({ [MESSAGE_CONTAINS_LOCATION]: shareTrail }) },
      ]);
    }
  }, [shareTrail]);

  const onSend = async (message: string) => {
    try {
      const { item } = params;

      let uriFile = '';
      let uriName = '';
      let uriType = '';

      const form = new FormData();
      if (message[0]?.attachment) {
        uriFile = Platform.OS === 'ios'
          ? message[0]?.attachment?.sourceURL?.replace('file://', '') ||
          message[0]?.attachment?.uri?.replace('file://', '') ||
          message[0]?.attachment?.path
          : message[0]?.attachment?.sourceURL?.uri ||
          message[0]?.attachment?.uri ||
          message[0]?.attachment?.path;
        uriName = message[0]?.attachment?.filename ||
          message[0]?.attachment?.fileName ||
          message[0]?.attachment?.name ||
          '';
        uriType = message[0]?.attachment?.mime || message[0]?.attachment?.type;

        form.append('message[message_attachment]', {
          uri: uriFile,
          type: uriType,
          name: uriName,
        });
      }

      const randomNumber = Math.floor(Math.random() * (10000 - 1000 + 1)) + 10000;

      setMessages(prevMessages =>
        GiftedChat.append(prevMessages, [
          {
            _id: randomNumber,
            createdAt: new Date(),
            text: message?.[0]?.text,
            user: {
              _id: loginUser?.id,
              name: loginUser?.first_name,
            },
            ...(message[0]?.attachment && {
              message_attachment: {
                url: uriFile,
                file_name: uriName,
                type: uriType,
                content_type: uriType,
              },
            }),
          },
        ])
      );

      form.append('message[content]', message?.[0]?.text);
      form.append('message[user_id]', loginUser?.id);
      form.append('message[message_type]', 'private');
      form.append('message[read]', false);      

      const res = await createChatMessage({ data: form, id: item?.id });
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
        onPressBack={() => {
          Keyboard.dismiss();
          navigation.navigate('Chat')
        }}
        title={params?.item || 'Group Chat'}
        onPressPhone={() => {
          console.log(params?.item?.user);
          // navigation.navigate('VoiceCalling');
          navigation.navigate('VoiceCalling', {
            user: params?.item?.user,
            // channel: Platform.OS === 'android' ? 'call_501222' : '',
          });
        }}
        onPressVideo={() => {
          navigation.navigate('VideoCalling', {
            user: params?.item?.user,
            // channel: Platform.OS === 'android' ? 'testChannel' : '',
          });
        }}
      />
      <View style={styles.container}>
        <GiftedChat
          user={{
            _id: loginUser?.id,
          }}
          keyExtractor={item => `${item?._id}-${item?.created_at}`}
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
            RenderInputToolbar(props, () => { }, true, isRecording, setIsRecording, onSend)
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
            navigation.navigate('GroupInfo', { item: params?.item });
          }}
        />
      )}
    </MainWrapper>
  );
};

export default ChatDetail;
