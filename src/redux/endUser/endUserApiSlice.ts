import {apiSlice} from '../api/apiSlice';

export const enduserApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllWells: builder.query({
      query: () => ({
        url: 'user_routes/well_location',
        method: 'GET',
      }),
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
  }),

  overrideExisting: true,
});

export const {useGetAllWellsQuery, useGetAllSaveRoutesQuery} = enduserApiSlice;
