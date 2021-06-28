import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { getAllUrl } from './getUrlAPI';


export interface UrlInformations {
  id: string,
  originalUrl: string,
  userId: string,
  hits: number,
  expirationDate: string,
  status: string
}
export interface AdminHomeState {
  urlInfos: UrlInformations[],
  total: number,
  error: string,

}

const initialState: AdminHomeState = {
  urlInfos: [],
  error: '',
  total: 0
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getUrlInfosAsync = createAsyncThunk(
  'user/getUrlInfosAsync',
  async () => {
    // const state = getState() as RootState;
    try {
      const response = await getAllUrl();
      if (response.data) {
        return {
          total: response.data[1],
          urlInfos: response.data[0]
        }
      }
      // The value we return becomes the `fulfilled` action payload
    } catch (error) {
      throw error
    }

  }
);

export const adminHomeSlice = createSlice({
  name: 'adminHome',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setFilters: (state, action : PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // state.userId = action.payload
    },
    setSorting: (state) => {
      // state.urlInfos = {...state.urlInfos}
    },
    deleteUrl: (state, action : PayloadAction<string>) => {
      // state.urlInfos = {...state.urlInfos}
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getUrlInfosAsync.fulfilled, (state, action) => {
        if (action.payload) {
          console.log(action.payload.urlInfos)
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          state.urlInfos = action.payload.urlInfos as UrlInformations[]
          state.total = action.payload.total
        }
      })
      .addCase(getUrlInfosAsync.rejected, (state, action) => {
        if (action.error) {
          state.error = 'Invalid url'
        }
      });
  },
});

export const { setFilters, setSorting, deleteUrl } = adminHomeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUrlInformations = (state: RootState) => state.admin.urlInfos;
// export const selectUrlInfos = (state: RootState) => state.user.urlInfos;
// export const selectError =  (state: RootState) => state.user.error;

export default adminHomeSlice.reducer;
