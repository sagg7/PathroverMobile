import {apiSlice} from '../api/apiSlice';

export const enduserApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllWells: builder.query({
      query: ({...params}) => {
        const queryParams = new URLSearchParams({...params}).toString();
        console.log('\n\nQUERY PARAM HIT\n', queryParams);
        return {
          url: `user_routes/well_location?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getAllSaveRoutes: builder.query({
      query: ({type, ...params}) => {
        const queryParams = new URLSearchParams({...params}).toString();
        return {
          url: `user_routes?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    addRouteReport: builder.mutation({
      query: data => {
        return {
          url: `route_reports`,
          method: 'POST',
          body: data,
        };
      },
    }),
    getRouteReport: builder.query({
      query: () => {
        return {
          url: `route_reports`,
          method: 'GET',
        };
      },
      transformResponse: res => res?.route_reports,
    }),
    createSubscriptions: builder.mutation({
      query: data => {
        return {
          url: `subscriptions`,
          method: 'POST',
          body: data,
        };
      },
    }),
    deleteRoute: builder.mutation({
      query: id => {
        return {
          url: `user_routes/${id}`,
          method: 'delete',
        };
      },
    }),
    editRoute: builder.mutation({
      query: data => {
        const {id, ...user_route} = data;
        return {
          url: `user_routes/${id}`,
          method: 'put',
          body: {user_route},
        };
      },
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllWellsQuery,
  useGetAllSaveRoutesQuery,
  useAddRouteReportMutation,
  useGetRouteReportQuery,
  useCreateSubscriptionsMutation,
  useDeleteRouteMutation,
  useEditRouteMutation,
} = enduserApiSlice;
