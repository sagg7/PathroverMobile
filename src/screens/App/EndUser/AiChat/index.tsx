import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useState} from 'react';
import {View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppHeader,
  ChatBubble,
  MainWrapper,
  RenderDay,
  RenderInputToolbar,
  RenderMessageText,
  RenderTime,
} from '../../../../components';
import RenderMessageImage from '../../../../components/complex/ChatComponents/RenderMessageImage';
import {addBotMessage, addUserMessage} from '../../../../redux/chat/chatSlice';
import {OPEN_AI_KEY, OPEN_AI_URL} from '../../../../shared/utils/constant';
import styles from './styles';

const AiChat = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {messages} = useSelector(state => state.chat);
  const [inputValue, setInputValue] = useState();

  const onSend = async (message: string) => {
    try {
      dispatch(addUserMessage(message));
      const data = JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message?.[0]?.text,
          },
          message?.[0]?.image && {
            role: 'user',
            content: message?.[0]?.image?.sourceURL,
          },
        ],
        model: 'gpt-4',
        store: true,
      });

      const config = {
        method: 'post',
        url: OPEN_AI_URL + 'chat/completions',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPEN_AI_KEY}`,
        },
        data,
      };

      const response = await axios.request(config);
      dispatch(addBotMessage(response.data.choices[0].message.content));
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Error: Could not get a response from AI.';
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Meta AI" clickBackIcon={() => navigation.pop()} />
      <View style={styles.container}>
        <GiftedChat
          user={{
            _id: 1,
          }}
          messages={messages}
          text={inputValue}
          onInputTextChanged={txt => setInputValue(txt)}
          renderAvatar={null}
          showUserAvatar={false}
          isKeyboardInternallyHandled
          keyboardShouldPersistTaps="never"
          renderDay={RenderDay}
          renderBubble={props => <ChatBubble props={props} />}
          renderMessageText={RenderMessageText}
          renderTime={RenderTime}
          renderMessageImage={RenderMessageImage}
          renderInputToolbar={props => RenderInputToolbar(props, () => {})}
          listViewProps={{
            showsVerticalScrollIndicator: false,
            onEndReachedThreshold: 0.3,
          }}
          onSend={messages => onSend(messages)}
        />
      </View>
    </MainWrapper>
  );
};

export default AiChat;
