import {apiSlice} from '../api/apiSlice';

export const managerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllRoutes: builder.query({
      query: () => ({
        url: 'user_routes',
        method: 'GET',
      }),
    }),
    createManagerVehicleRequest: builder.mutation({
      query: data => ({
        url: 'ride_requests',
        method: 'POST',
        body: data,
      }),
    }),
    createRoute: builder.mutation({
      query: data => ({
        url: 'user_routes',
        method: 'POST',
        body: data,
      }),
    }),
    updateRoute: builder.mutation({
      query: ({data, id}) => ({
        url: `user_routes/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteRoute: builder.mutation({
      query: id => ({
        url: `user_routes/${id}`,
        method: 'delete',
      }),
    }),
    getAllSaveRoute: builder.query({
      query: () => ({
        url: 'user_routes',
        method: 'GET',
      }),
    }),
    //
    deleteUserAccount: builder.mutation({
      query: () => ({
        url: 'users/delete_account',
        method: 'DELETE',
      }),
    }),
    acceptDeclineDriverOffer: builder.mutation({
      query: (data: any) => ({
        url: 'offers/update_offer_status',
        method: 'PUT',
        body: data,
      }),
    }),
    cancelRideRequest: builder.mutation({
      query: ({id, data}: any) => ({
        url: `ride_requests/${id}/cancel_ride_before_order`,
        method: 'PUT',
        body: data,
        headers: {},
      }),
    }),

    cancelInProgressRideRequest: builder.mutation({
      query: (data: any) => ({
        url: `orders/cancel_order`,
        method: 'PUT',
        body: data,
      }),
    }),
    updateCurrentRideStatus: builder.mutation({
      query: (data: any) => ({
        url: `orders/order_stages`,
        method: 'POST',
        body: data,
      }),
    }),
    rateDriver: builder.mutation({
      query: (data: any) => {
        return {
          url: `ratings`,
          method: 'post',
          body: data,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllRoutesQuery,
  useCreateManagerVehicleRequestMutation,
  useDeleteUserAccountMutation,
  useCreateRouteMutation,
  useGetAllSaveRouteQuery,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
  useAcceptDeclineDriverOfferMutation,
  useCancelRideRequestMutation,
  useCancelInProgressRideRequestMutation,
  useUpdateCurrentRideStatusMutation,
  useRateDriverMutation,
} = managerApiSlice;
