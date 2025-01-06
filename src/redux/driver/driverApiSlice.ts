import {apiSlice} from '../api/apiSlice';

export const driverApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createDriverProfile: builder.mutation({
      query: data => {
        return {
          url: 'profiles',
          method: 'post',
          body: data,
          headers: {},
        };
      },
    }),
    getAllRideRequest: builder.query({
      query: data => {
        return {
          url: 'ride_requests',
          method: 'get',
          // body: data,
          // headers:{}
        };
      },
    }),
    acceptRejectRideRideRequest: builder.mutation({
      query: data => {
        return {
          url: 'offers/accept_offer',
          method: 'put',
          body: data,
        };
      },
    }),
    sendRideOffer: builder.mutation({
      query: data => {
        return {
          url: 'offers',
          method: 'put',
          body: data,
        };
      },
    }),
    edtProfile: builder.mutation({
      query: data => {
        return {
          url: 'profiles/manage_profile',
          method: 'put',
          body: data,
        };
      },
    }),
    supportContact: builder.mutation({
      query: data => {
        return {
          url: '',
          method: 'post',
          body: data,
        };
      },
    }),
    getProfileStatus: builder.query({
      query: (userRole: string) => {
        return {
          url: `profiles/document_status?role=${userRole}`,
          method: 'get',
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateDriverProfileMutation,
  useGetAllRideRequestQuery,
  useAcceptRejectRideRideRequestMutation,
  useSendRideOfferMutation,
  useSupportContactMutation,
  useEdtProfileMutation,
  useLazyGetProfileStatusQuery,
} = driverApiSlice;
