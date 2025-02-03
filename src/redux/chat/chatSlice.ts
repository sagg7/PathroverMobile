import {createSlice} from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
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
        image: action.payload?.[0]?.image
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
  },
});

export const {addUserMessage, addBotMessage} = chatSlice.actions;

export default chatSlice.reducer;
