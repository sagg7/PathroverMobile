import {apiSlice} from '../api/apiSlice';

export const driverApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createDriverProfile: builder.mutation({
      query: (data) => {
        return {
          url: 'profiles',
          method: 'post',
          body: data,
          headers:{}
         
        };
      },
    }),
    getAllRideRequest: builder.mutation({
      query: (data) => {
        return {
          url: 'ride_requests',
          method: 'gt',
          // body: data,
          // headers:{}
         
        };
      },
    }),
    acceptRejectRideRideRequest: builder.mutation({
      query: (data) => {
        return {
          url: 'offers/accept_offer',
          method: 'put',
          body: data,
        };
      },
    }),
    sendRideOffer: builder.mutation({
      query: (data) => {
        return {
          url: 'offers',
          method: 'put',
          body: data,
        };
      },
    }),
    edtProfile: builder.mutation({
      query: (data) => {
        return {
          url: 'profiles/manage_profile',
          method: 'put',
          body: data,
        };
      },
    }),
    supportContact: builder.mutation({
      query: (data) => {
        return {
          url: '',
          method: 'post',
          body: data,
        };
      },
    }),


  }),
  overrideExisting: true,
});

export const { useCreateDriverProfileMutation, useGetAllRideRequestMutation,
  useAcceptRejectRideRideRequestMutation, useSendRideOfferMutation,useSupportContactMutation,
  useEdtProfileMutation } = driverApiSlice;
