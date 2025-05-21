import { apiSlice } from '../api/apiSlice';

export const enduserApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllWells: builder.query({
      async queryFn(arg, _queryApi, _extraOptions, baseQuery) {
        let allWells: any = [];
        let currentPage = 1;
        let totalPages = 1;
        // let perPage = 100;
        let radius = 70;

        try {
          // while (currentPage != totalPages) {
          const params: Record<string, any> = {
            latitude: arg.latitude,
            longitude: arg.longitude,
            radius: radius,
            per_page: arg.per_page,
            page: currentPage,
          };

          if (arg.state != null || arg.state != undefined) {
            params.state = arg.state;
          }
          const queryString = new URLSearchParams(params).toString();
          console.log('params', queryString);

          const result = await baseQuery(
            `user_routes/well_location?${queryString}`,
            _queryApi,
            _extraOptions,
          );

          if (result.error) {
            throw new Error(result.error.message || 'Failed to fetch wells');
          }
          const data: any = result.data;

          allWells = [...allWells, ...data.wells];
          totalPages = data.total_pages;
          // }
          return { data: allWells }; // Return combined data
        } catch (error) {
          console.error('Error fetching wells:', error.message);
          return { error: error.message || 'Unknown error' };
        }
      },
    }),

    getAllSaveRoutes: builder.query({
      query: ({ type, ...params }) => {
        const queryParams = new URLSearchParams({ ...params }).toString();
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
      transformResponse: (res: any) => res?.route_reports,
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
        const { id, ...user_route } = data;
        return {
          url: `user_routes/${id}`,
          method: 'put',
          body: { user_route },
        };
      },
    }),
    wellSearch: builder.mutation({
      query: params => {
        const formData = new FormData();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        return {
          url: 'user_routes/well_search',
          method: 'POST',
          body: formData,
        };
      },
    }),

    getRouteBasedId: builder.mutation({
      query: id => {
        return {
          url: `user_routes/${id}`,
          method: 'get',
        };
      },
    }),
    createShareLinkRoute: builder.mutation({
      query: data => {
        return {
          url: `user_routes/create_route_link`,
          method: 'POST',
          body: data,
        };
      },
    }),
    getNewsBlogs: builder.query({
      query: () => {
        return {
          url: `news_feed`,
          method: 'GET',
        };
      },
      transformResponse: (res: any) => res?.news_feed,
    }),
    getSubscription: builder.query({
      query: () => {
        return {
          url: `subscriptions/my_subscriptions`,
          method: 'GET',
        };
      },
      transformResponse: (res: any) => res?.subscriptions,
    }),
    updateSubscription: builder.mutation({
      query: data => {
        return {
          url: `subscriptions`,
          method: 'PUT',
          body: data,
        };
      },
    }),
    getCurrentUserProfile: builder.query({
      query: () => {
        return {
          url: `profiles/my_profile`,
          method: 'GET',
        };
      },
      transformResponse: (res: any) => res?.user,
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
  useWellSearchMutation,
  useGetRouteBasedIdMutation,
  useCreateShareLinkRouteMutation,
  useGetNewsBlogsQuery,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useGetCurrentUserProfileQuery,
} = enduserApiSlice;
