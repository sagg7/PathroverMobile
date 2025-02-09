import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
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
          <Image source={appIcons.userPlaceholder} style={styles.imageStyle} />
        )}
        <Text style={styles.groupNameText}>{title}</Text>
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
  const {loginUser} = useSelector(state => state.auth);

  const [readChatMessage] = useReadChatMessageMutation();
  const [createChatMessage] = useCreateChatMessageMutation();
  const [createGroupMessage] = useCreateGroupMessageMutation();
  const [getChatMessage, {data: chat}] = useGetChatMessageMutation();
  const [getGroupChatMessages, {data}] = useGetGroupChatMessagesMutation();

  useEffect(() => {
    if (data?.length > 0) {
      setMessages(
        data
          .map(i => ({
            ...i,
            _id: i?.user_id,
            user: {...i.user, _id: i.user.id},
          }))
          .reverse(),
      );
    }
    if (chat?.length > 0) {
      setMessages(
        chat
          .map(i => ({
            ...i,
            _id: i?.user_id,
            user: {...i.user, _id: i.user.id},
          }))
          .reverse(),
      );
    }
  }, [data, chat]);

  useEffect(() => {
    (async () => {
      if (isFocused && params?.isGroup) {
        await getGroupChatMessages(params?.item?.id);
      } else {
        await getChatMessage(params?.item?.id);
      }
    })();
    readChat();
  }, [isFocused]);

  const onSend = async (message: string) => {
    const {item, isGroup} = params;
    if (isGroup) {
      const obj = {
        message: {
          content: message[0]?.text,
          user_id: loginUser?.id,
          message_type: 'group',
          read: false,
          group_id: item?.id,
        },
      };

      const res = await createGroupMessage({data: obj, id: item?.id});
      if (res) {
        await getGroupChatMessages(item?.id);
      }
    } else {
      const obj = {
        message: {
          content: message[0]?.text,
          user_id: loginUser?.id,
          message_type: 'private',
        },
      };

      const res = await createChatMessage({data: obj, id: item?.id});
      if (res) {
        await getChatMessage(item?.id);
      }
    }
  };

  const readChat = async () => {
    try {
      if (!params?.isGroup) {
        await readChatMessage(params?.item?.id);
      }
    } catch (error) {
      //
    }
  };

  return (
    <MainWrapper>
      <Header
        isGroup={params?.isGroup}
        onPressBack={() => navigation.pop()}
        onPressMenu={() => setShow(true)}
        title={params?.item?.name || 'Group Chat'}
      />
      <View style={styles.container}>
        <GiftedChat
          user={{
            _id: loginUser?.id,
          }}
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
