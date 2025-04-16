import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {setAccessToken} from '../auth/authSlice';

import {DOMAIN_BASE_URL} from '../../shared/utils/constant';

const baseQuery = fetchBaseQuery({
  baseUrl: DOMAIN_BASE_URL,
  prepareHeaders: (headers, {getState, endpoint}) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', '*/*');
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  const {dispatch, getState} = api;
  const result = await baseQuery(args, api, extraOptions);

  if (result?.meta?.response?.headers) {
    const newToken = result.meta.response.headers.get('authorization');

    if (newToken) {
      dispatch(setAccessToken(newToken));
    }
  }

  return result;
};

export const apiDomainSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Payouts', 'Notifications'],
  endpoints: builder => ({}),
});
