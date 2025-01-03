import {createSlice} from '@reduxjs/toolkit';

const managerSlice = createSlice({
  name: 'manager',
  initialState: {
    managerRoute: {},
    recentDestSearch: [],
  },
  reducers: {
    setManagerRoute: (state, action) => {
      const updates = action.payload;
      state.managerRoute = {
        ...state.managerRoute,
        ...updates,
      };
    },
    setManagerRouteEmpty: (state, action) => {
      state.managerRoute = {};
    },
    setRecentDestSearch: (state, action) => {
      const MAX_RECENT_SEARCHES = 10;

      const isDuplicate = state.recentDestSearch.some(
        (item: any) =>
          item.latitude === action.payload.latitude &&
          item.longitude === action.payload.longitude,
      );

      if (!isDuplicate) {
        const updatedSearches = [...state.recentDestSearch, action.payload];
        state.recentDestSearch = updatedSearches.slice(-MAX_RECENT_SEARCHES);
      }
    },
  },
});

export const {setManagerRoute, setManagerRouteEmpty, setRecentDestSearch} =
  managerSlice.actions;

export default managerSlice.reducer;
