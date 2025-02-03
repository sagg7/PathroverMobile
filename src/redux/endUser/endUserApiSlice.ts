import {apiSlice} from '../api/apiSlice';

export const enduserApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllWells: builder.query({
      query: () => ({
        url: 'user_routes/well_location',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: true,
});

export const {useGetAllWellsQuery} = enduserApiSlice;
