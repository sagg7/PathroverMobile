import {apiDomainSlice} from '../api/apiDomainSlice';

export const commonDomainApiSlice = apiDomainSlice.injectEndpoints({
  endpoints: builder => ({
    terms: builder.mutation({
      query: () => ({
        url: 'terms_and_conditions_list',
        method: 'GET',
        responseHandler: (response: any) => response.text(),
      }),
      transformResponse: response => {
        return {response};
      },
    }),
    privacy: builder.mutation({
      query: () => ({
        url: 'privacy_policy_list',
        method: 'GET',
        responseHandler: (response: any) => response.text(),
      }),
      transformResponse: response => {
        return {response};
      },
    }),
  }),
  overrideExisting: true,
});

export const {useTermsMutation, usePrivacyMutation} = commonDomainApiSlice;
commonDomainApiSlice;
