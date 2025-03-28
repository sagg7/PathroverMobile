import {createSlice} from '@reduxjs/toolkit';
import { Platform } from 'react-native';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    chat_count: {},
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.unshift({
        _id: Math.random(),
        createdAt: new Date(),
        text: action.payload?.[0]?.text,
        user: {
          name: 'bot',
          _id: 2,
        },
        image: action.payload?.[0]?.attachment?.sourceURL ?? action.payload?.[0]?.attachment?.path,
      });
    },
    addBotMessage: (state, action) => {
      state.messages.unshift({
        _id: Math.random(),
        createdAt: new Date(),
        text: action.payload,
        user: {
          name: 'user',
          _id: 1,
        },
      });
    },
    setChatCount: (state, action) => {
      state.chat_count = action.payload;
    },
  },
});

export const {addUserMessage, addBotMessage, setChatCount} = chatSlice.actions;

export default chatSlice.reducer;
