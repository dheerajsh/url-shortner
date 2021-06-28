import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import adminHomeReducer from '../features/admin/AdminHomeSlice';
import userHomeReducer from '../features/user/userHomeSlice'

export const store = configureStore({
  reducer: {
    user: userHomeReducer,
    admin: adminHomeReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
