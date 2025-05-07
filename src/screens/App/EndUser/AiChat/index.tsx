import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppHeader,
  AppLoader,
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
import {useUploadImagesMutation} from '../../../../redux/chat/chatApiSlice';

const AiChat = () => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {messages} = useSelector(state => state.chat);
  const [inputValue, setInputValue] = useState();
  const [uploadImages] = useUploadImagesMutation();
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (params?.search) {
      const data = [
        {
          _id: Math.random(),
          createdAt: new Date(),
          text: params?.search,
          user: {_id: 1},
        },
      ];
      onSend(data);
    }
  }, [params]);

  const onSend = async (message: string) => {
    setLoader(true);
    try {
      const form = new FormData();

      form.append('file', {
        uri:
          Platform.OS === 'ios'
            ? message[0]?.attachment?.sourceURL?.replace('file://', '')
            : message[0]?.attachment?.path,
        type: message[0]?.attachment?.mime || message[0]?.attachment?.type,
        name: message[0]?.attachment?.filename ?? '',
      });

      const res = await uploadImages(form);

      dispatch(addUserMessage([{...message?.[0], url: res?.data?.url}]));
      const data = JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message[0]?.attachment
              ? res?.data?.url
              : message?.[0]?.text,
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
      setLoader(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoader(false);
      return 'Error: Could not get a response from AI.';
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Chat gpt" clickBackIcon={() => navigation.pop()} />
      <View style={styles.container}>
        <GiftedChat
          user={{
            _id: 2,
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
          renderInputToolbar={props =>
            RenderInputToolbar(props, () => {}, false)
          }
          listViewProps={{
            showsVerticalScrollIndicator: false,
            onEndReachedThreshold: 0.3,
          }}
          onSend={messages => onSend(messages)}
        />
      </View>
      {loader && <AppLoader />}
    </MainWrapper>
  );
};

export default AiChat;
