import {apiSlice} from '../api/apiSlice';

export const managerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllRoutes: builder.query({
      query: ()=> ({
        url: 'user_routes',
        method: 'GET',
      }),
    }),
    createManagerVehicleRequest: builder.mutation({
      query: (data)=> ({
        url: 'ride_requests',
        method: 'POST',
        body : data
      }),
    }),
    deleteUserAccount: builder.mutation({
      query: ()=> ({
        url: 'users/delete_account',
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
useGetAllRoutesQuery,
useCreateManagerVehicleRequestMutation,
useDeleteUserAccountMutation
} = managerApiSlice;
