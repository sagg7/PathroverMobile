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
} = managerApiSlice;
