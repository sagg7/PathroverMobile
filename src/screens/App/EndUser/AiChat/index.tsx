import React, {useState} from 'react';
import {
  AppHeader,
  ChatBubble,
  MainWrapper,
  RenderDay,
  RenderInputToolbar,
  RenderTime,
  RenderMessageText,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import styles from './styles';
import RenderMessageImage from '../../../../components/complex/ChatComponents/RenderMessageImage';

const AiChat = () => {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState();

  const chat = [
    {
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },
    {
      _id: 2,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },
  ];

  const onSend = (message: string) => {
    console.log('==============message======================');
    console.log(message);
    console.log('====================================');
  };

  return (
    <MainWrapper>
      <AppHeader title="Meta AI" clickBackIcon={() => navigation.pop()} />
      <View style={styles.container}>
        <GiftedChat
          user={{
            _id: 1,
          }}
          messages={chat}
          text={inputValue}
          onInputTextChanged={txt => setInputValue(txt)}
          renderAvatar={null}
          showUserAvatar={false}
          isKeyboardInternallyHandled
          keyboardShouldPersistTaps="never"
          renderDay={RenderDay}
          renderBubble={props => <ChatBubble props={props} />}
          //   renderChatEmpty={listEmptyComponent}
          renderMessageText={RenderMessageText}
          renderTime={RenderTime}
          renderMessageImage={RenderMessageImage}
          renderInputToolbar={props => RenderInputToolbar(props, () => {})}
          listViewProps={{
            showsVerticalScrollIndicator: false,
            onEndReachedThreshold: 0.3,
          }}
          //   messagesContainerStyle={styles.messagesContainerStyle}
          onSend={messages => onSend(messages)}
        />
      </View>
    </MainWrapper>
  );
};

export default AiChat;
