import {apiSlice} from '../api/apiSlice';

export const enduserApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllWells: builder.query({
      query: ({...params}) => {
        const queryParams = new URLSearchParams({...params}).toString();
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
  }),

  overrideExisting: true,
});

export const {
  useGetAllWellsQuery,
  useGetAllSaveRoutesQuery,
  useAddRouteReportMutation,
  useGetRouteReportQuery,
  useCreateSubscriptionsMutation,
} = enduserApiSlice;
