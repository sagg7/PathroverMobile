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
          url: 'supports',
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

    sendOfferToManager: builder.mutation({
      query: (data: any) => {
        return {
          url: `offers`,
          method: 'post',
          body: data,
        };
      },
    }),

    sendLocation: builder.mutation({
      query: (data: any) => {
        return {
          url: `users/update_location`,
          method: 'put',
          body: data,
        };
      },
    }),
    rateManager: builder.mutation({
      query: (data: any) => {
        return {
          url: `ratings`,
          method: 'post',
          body: data,
        };
      },
    }),
    getWalletTransactions: builder.mutation({
      query: filter => {
        return {
          url: `transactions?filter=${filter}`,
          method: 'get',
        };
      },
    }),
    withdrawAmount: builder.mutation({
      query: (data: object) => {
        return {
          url: 'transactions',
          method: 'post',
          body: data,
        };
      },
    }),
    linkBankAccount: builder.mutation({
      query: () => {
        return {
          url: 'user_wallet/save_bank_account',
          method: 'POST',
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
  useSendOfferToManagerMutation,
  useSendLocationMutation,
  useRateManagerMutation,
  useGetWalletTransactionsMutation,
  useWithdrawAmountMutation,
  useLinkBankAccountMutation,
} = driverApiSlice;
