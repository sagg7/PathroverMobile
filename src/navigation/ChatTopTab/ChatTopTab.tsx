import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import ChatList from '../../screens/App/EndUser/Chat/ChatList';
import ChatGroup from '../../screens/App/EndUser/Chat/ChatGroup';
import CallList from '../../screens/App/EndUser/Chat/CallList';
import ChatTopTabBar from '../../components/complex/ChatTopTabBar';

const Tab = createMaterialTopTabNavigator();

const ChatTabBar = () => {
  return (
    <Tab.Navigator tabBar={props => <ChatTopTabBar {...props} />}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Chats',
          swipeEnabled: false,
        }}
        name="Chats"
        component={ChatList}
      />
      <Tab.Screen
        options={{tabBarLabel: 'Groups', swipeEnabled: false}}
        name="Groups"
        component={ChatGroup}
      />
      <Tab.Screen
        options={{tabBarLabel: 'Calls', swipeEnabled: false}}
        name="Calls"
        component={CallList}
      />
    </Tab.Navigator>
  );
};

export default ChatTabBar;
