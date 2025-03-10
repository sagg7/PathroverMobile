import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import {logOut, setAccessToken} from '../auth/authSlice';

import {BASE_URL} from '../../shared/exporter';
console.log(' BASE_URL==>', BASE_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, {getState, endpoint}) => {
    const token = getState()?.auth?.accessToken;
    // if (token) {
    //   headers.set('Authorization', `Bearer ${token}`);
    // }
    headers.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0OCwiZXhwIjoxNzQzOTUwNzU4fQ.VckIduT641vjnjULTsOHwdkijYkPYpo9Mw7yAbSH-3k`);
    headers.set('Accept', '*/*');
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  const {dispatch, getState} = api;
  const result = await baseQuery(args, api, extraOptions);
  // console.log(" baseQueryWithReAuth ~ args==>", args)

  if (result?.meta?.response?.headers) {
    const newToken = result.meta.response.headers.get('authorization');
    if (newToken) {
      dispatch(setAccessToken(newToken));
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Payouts', 'Notifications'],
  endpoints: builder => ({}),
});
