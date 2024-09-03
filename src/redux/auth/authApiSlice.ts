import { apiSlice } from '../api/apiSlice';


export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: data => ({
        url: 'sessions',
        method: 'POST',
        body: data,
      }),
	}),

    forgotPassword: builder.mutation({
      query: data => ({
        url: 'passwords/forgot',
        method: 'POST',
        body: data,
      }),
    }),
  
    resetPassword: builder.mutation({
      query: data => ({
        url: 'passwords/reset_password',
        method: 'PUT',
        body: data,
      }),
    }),
    signUp: builder.mutation({
      query: data => ({
        url: 'registrations',
        method: 'POST',
        body: data,
      }),
    }),
  
     verifyOtp: builder.mutation({
      query: data => ({
        url: 'otps/verify_otp',
        method: 'POST',
        body: data,
       }),
    }),
    refreshToken: builder.mutation({
      query: data => ({
        url: '/auth/refresh-tokens',
        method: 'POST',
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: data => ({
        url: '/auth/logout',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useSignUpMutation,
  useRefreshTokenMutation,
	useLogoutUserMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApiSlice;
