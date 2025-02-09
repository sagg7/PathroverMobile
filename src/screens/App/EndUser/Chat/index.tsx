import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { MainWrapper } from '../../../../components';
import ChatTabBar from '../../../../navigation/ChatTopTab/ChatTopTab';
import { useSelector } from 'react-redux';
import EmptyChatView from '../../../../components/complex/EmptyChatView';

const Chat = () => {
  const navigation = useNavigation();
  const { loginUser } = useSelector(state => state.auth);

  console.log('============loginUser========================');
  console.log(loginUser);
  console.log('====================================');
  return (
    <MainWrapper>
      {/* <EmptyChatView onPress={() => navigation.navigate('AddNumber')} /> */}

      <ChatTabBar />
    </MainWrapper>
  );
};

export default Chat;
