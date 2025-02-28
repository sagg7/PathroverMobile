import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import {appIcons} from '../../../../../assets/icons';
import {svgIcon} from '../../../../../assets/svg';
import {
  MainWrapper,
  RenderDay,
  RenderInputToolbar,
  RenderMessageText,
  RenderTime,
} from '../../../../../components';
import {GroupChatBubble} from '../../../../../components/complex/ChatComponents/GroupChatBubble';
import RenderMessageImage from '../../../../../components/complex/ChatComponents/RenderMessageImage';
import CreateGroupModal from '../../../../../components/complex/CreateGroupModal';
import {useActionCable} from '../../../../../hooks/socket/useActionCable';
import {useChannel} from '../../../../../hooks/socket/useChannel';
import {
  useCreateGroupMessageMutation,
  useGetGroupChatMessagesMutation,
  useReadGroupChatMessageMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {REQ_LIST_SOCKET_URL} from '../../../../../shared/exporter';
import styles from './styles';
import AudioMessage from '../../../../../components/complex/ChatComponents/AudioMessage';

interface HeaderProps {
  title: string;
  onPressBack: () => void;
  onPressMenu?: () => void;
}

const Header = ({onPressBack, onPressMenu, title}: HeaderProps) => {
  return (
    <View style={styles.groupHeader}>
      <TouchableOpacity onPress={onPressBack} hitSlop={20}>
        {svgIcon.BackArrow}
      </TouchableOpacity>
      <View style={styles.headerTextView}>
        <Text style={styles.groupNameText}>
          {title && typeof title === 'object' && title.user
            ? [title.user.first_name, title.user.last_name]
                .filter(Boolean)
                .join(' ')
            : title?.name || ''}
        </Text>
      </View>
      <TouchableOpacity onPress={onPressMenu}>
        <Image source={appIcons.menuIcons} style={styles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
};
const GroupChatDetail = () => {
  const {params} = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const {loginUser, accessToken} = useSelector(state => state.auth);
  const token = accessToken?.replace('Bearer ', '');
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, token);
  const {subscribe, unsubscribe} = useChannel(actionCable);

  const [createGroupMessage] = useCreateGroupMessageMutation();
  const [getGroupChatMessages, {data}] = useGetGroupChatMessagesMutation();
  const [readGroupChatMessage] = useReadGroupChatMessageMutation();

  useEffect(() => {
    try {
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
    } catch (err) {
      //
    }

    return () => {
      unsubscribe();
    };
  }, [params]);

  useEffect(() => {
    if (data?.length > 0) {
      const rearrange = data.map(i => ({
        ...i,
        _id: i?.id,
        createdAt: i?.created_at,
        user: {...i?.user, _id: i?.user?.id},
      }));
      setMessages(rearrange);
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      if (isFocused) {
        await getGroupChatMessages(params?.item?.id);
      }
      readChat();
    })();
  }, [isFocused]);

  const onSend = async (message: string) => {
    try {
      console.log('=======message=============================');
      console.log(message);
      console.log('====================================');
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
      form.append('message[message_type]', 'group');
      form.append('message[read]', false);
      form.append('message[group_id]', item?.id);

      const res = await createGroupMessage({data: form, id: item?.id});
      if (res) {
        await getGroupChatMessages(item?.id);
      }
    } catch (error) {
      //
    }
  };

  const readChat = async () => {
    try {
      await readGroupChatMessage(params?.item?.id);
    } catch (error) {
      //
    }
  };

  return (
    <MainWrapper>
      <Header
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
          scrollToBottom
          isKeyboardInternallyHandled
          keyboardShouldPersistTaps="never"
          renderDay={props => <RenderDay {...props} />}
          renderBubble={props => <GroupChatBubble props={props} />}
          renderMessageText={RenderMessageText}
          renderTime={RenderTime}
          renderMessageImage={RenderMessageImage}
          renderMessageAudio={props => <AudioMessage {...props} />}
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

export default GroupChatDetail;
