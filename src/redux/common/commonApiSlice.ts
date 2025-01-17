import {apiSlice} from '../api/apiSlice';

export const commonApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOfferHistoryRoleBase: builder.query({
      query: ({role, ...params}) => {
        const queryParams = new URLSearchParams({role, ...params}).toString();
        console.log('queryPArams ', queryParams);

        return {
          url: `orders?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    deleteOfferHistory: builder.mutation({
      query: ({delId, role}) => ({
        url: `orders/${delId}`,
        method: 'DELETE',
        body: role,
      }),
    }),
    userNotification: builder.mutation({
      query: role => ({
        url: `notifications?role=${role}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOfferHistoryRoleBaseQuery,
  useDeleteOfferHistoryMutation,
  useUserNotificationMutation,
} = commonApiSlice;
commonApiSlice;
