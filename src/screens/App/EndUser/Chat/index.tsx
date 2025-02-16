import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {MainWrapper} from '../../../../components';
import ChatTabBar from '../../../../navigation/ChatTopTab/ChatTopTab';
import {useSelector} from 'react-redux';
import EmptyChatView from '../../../../components/complex/EmptyChatView';

const Chat = () => {
  const navigation = useNavigation();
  const {loginUser} = useSelector(state => state.auth);
  return (
    <MainWrapper>
      {/* TODO: REVERT CODE */}
      {/* {loginUser?.verified ? (
        <ChatTabBar />
      ) : (
        <EmptyChatView onPress={() => navigation.navigate('AddNumber')} />
      )} */}
      <ChatTabBar />
    </MainWrapper>
  );
};

export default Chat;
