// Redux Store - Reverse engineered from SNL-GMS UI

import { configureStore } from '@reduxjs/toolkit';
import { analystSlice } from './reducers/analyst-slice';

export const store = configureStore({
  reducer: {
    analyst: analystSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
