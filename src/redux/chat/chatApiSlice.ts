import {apiSlice} from '../api/apiSlice';

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addPhoneNumber: builder.mutation({
      query: data => {
        return {
          url: 'sessions/send_otp',
          method: 'POST',
          body: data,
        };
      },
    }),
    otpVerification: builder.mutation({
      query: data => {
        return {
          url: 'sessions/otp_verification',
          method: 'POST',
          body: data,
        };
      },
    }),
    getAllUsers: builder.mutation({
      query: () => {
        return {
          url: 'searches/all_users',
          method: 'GET',
        };
      },
    }),
    chatSearch: builder.mutation({
      query: data => {
        return {
          url: 'chats/search',
          method: 'POST',
          body: data,
        };
      },
    }),
    deleteChat: builder.mutation({
      query: id => {
        return {
          url: `chats/${id}`,
          method: 'DELETE',
        };
      },
    }),
    getChats: builder.mutation({
      query: () => {
        return {
          url: 'chats/my_chats',
          method: 'GET',
        };
      },
    }),
    getGroupChats: builder.mutation({
      query: () => {
        return {
          url: 'groups',
          method: 'GET',
        };
      },
    }),
    getGroupChatMessages: builder.mutation({
      query: id => {
        return {
          url: `groups/${id}/messages`,
          method: 'GET',
        };
      },
    }),
    createGroup: builder.mutation({
      query: data => {
        return {
          url: 'groups',
          method: 'POST',
          body: data,
        };
      },
    }),
    createGroupMessage: builder.mutation({
      query: ({data, id}) => {
        return {
          url: `groups/${id}/messages`,
          method: 'POST',
          body: data,
        };
      },
    }),
    exitGroup: builder.mutation({
      query: data => {
        return {
          url: 'groups/exit_group',
          method: 'POST',
          body: data,
        };
      },
    }),
    deleteGroup: builder.mutation({
      query: id => {
        return {
          url: `groups/${id}`,
          method: 'DELETE',
        };
      },
    }),
    getChatMessage: builder.mutation({
      query: id => {
        return {
          url: `chats/${id}/messages`,
          method: 'GET',
        };
      },
    }),
    readChatMessage: builder.mutation({
      query: id => {
        return {
          url: `chats/${id}/messages/read`,
          method: 'POST',
        };
      },
    }),
    createChatMessage: builder.mutation({
      query: ({data, id}) => {
        return {
          url: `chats/${id}/messages`,
          method: 'POST',
          body: data,
        };
      },
    }),
    getGroupInfo: builder.mutation({
      query: id => {
        return {
          url: `groups/${id}`,
          method: 'GET',
        };
      },
    }),
    createChat: builder.mutation({
      query: data => {
        return {
          url: 'chats',
          method: 'POST',
          body: data,
        };
      },
    }),
    searchGroupChat: builder.mutation({
      query: data => {
        return {
          url: 'groups/search',
          method: 'POST',
          body: data,
        };
      },
    }),
    addMembers: builder.mutation({
      query: data => {
        return {
          url: 'groups/add_members_group',
          method: 'POST',
          body: data,
        };
      },
    }),
    readGroupChatMessage: builder.mutation({
      query: id => {
        return {
          url: `groups/${id}/messages/read_group_message`,
          method: 'POST',
        };
      },
    }),
    getChatCount: builder.mutation({
      query: () => {
        return {
          url: 'chats/messages_count',
          method: 'GET',
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddPhoneNumberMutation,
  useOtpVerificationMutation,
  useGetAllUsersMutation,
  useChatSearchMutation,
  useDeleteChatMutation,
  useGetChatsMutation,
  useGetGroupChatsMutation,
  useCreateGroupMutation,
  useCreateGroupMessageMutation,
  useExitGroupMutation,
  useDeleteGroupMutation,
  useGetChatMessageMutation,
  useReadChatMessageMutation,
  useCreateChatMessageMutation,
  useGetGroupChatMessagesMutation,
  useGetGroupInfoMutation,
  useCreateChatMutation,
  useSearchGroupChatMutation,
  useAddMembersMutation,
  useReadGroupChatMessageMutation,
  useGetChatCountMutation,
} = chatApiSlice;
