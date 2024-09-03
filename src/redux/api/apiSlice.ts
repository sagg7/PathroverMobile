import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import {logOut, setAccessToken, setRefreshToken} from '../auth/authSlice';

import {BASE_URL} from '../../shared/exporter';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', '*/*');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
  fetchFn: async (url, options, ...args) => {
    const response = await fetch(url, options);
    const headers = response.headers;
    console.log('Response Headers: Tokens', headers?.map?.authorization);
    return response; 
  },
});


let refreshingToken = false;
let tokenRefreshPromise: Promise<void> | null = null;
const tokenRefreshQueue: any = [];

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result: any = '';

  const refreshTokenIfNeeded = async () => {
    if (refreshingToken) {
      return tokenRefreshPromise;
    } else {
      refreshingToken = true;
      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh-tokens',
            method: 'POST',
            body: {
              refreshToken: `${api.getState()?.auth?.refreshToken?.token}`,
            },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          api.dispatch(setAccessToken(refreshResult?.data?.tokens?.access));
          api.dispatch(setRefreshToken(refreshResult?.data?.tokens?.refresh));

          while (tokenRefreshQueue.length) {
            const {resolve} = tokenRefreshQueue.shift();
            resolve();
          }
        } else if (refreshResult.error) {
          api.dispatch(logOut());
          api.dispatch(apiSlice.util.resetApiState());
          while (tokenRefreshQueue.length) {
            const {reject} = tokenRefreshQueue.shift();
            reject(new Error('Token refresh failed.'));
          }
        }
      } catch (error) {
        console.error('Token refresh error:', error);
        while (tokenRefreshQueue.length) {
          const {reject} = tokenRefreshQueue.shift();
          reject(error);
        }
      } finally {
        refreshingToken = false;
      }
    }
  };
  const isTokenExpired = dayjs().isAfter(
    api.getState()?.auth?.accessToken?.expires,
  );
  if (isTokenExpired) {
    if (!tokenRefreshPromise) {
      tokenRefreshPromise = refreshTokenIfNeeded();
    }

    await tokenRefreshPromise;
    tokenRefreshPromise = null;

    result = await baseQuery(args, api, extraOptions);
  } else {
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Payouts', 'Notifications'],
  endpoints: builder => ({}),
});
