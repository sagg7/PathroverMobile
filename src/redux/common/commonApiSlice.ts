import {apiSlice} from '../api/apiSlice';

export const commonApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOfferHistoryRoleBase: builder.query({
      query: ({role, ...params}) => {
        const queryParams = new URLSearchParams({role, ...params}).toString();
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
    getInprogressRide: builder.query({
      query: ({role, ...params}) => {
        const queryParams = new URLSearchParams({role, ...params}).toString();
        return {
          url: `orders/in_progress_order?${queryParams}`,
          method: 'GET',
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOfferHistoryRoleBaseQuery,
  useDeleteOfferHistoryMutation,
  useUserNotificationMutation,
  useGetInprogressRideQuery,
} = commonApiSlice;
commonApiSlice;
