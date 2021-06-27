import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createShortUrl } from './createUrlAPI';


export interface UrlInfo {
  shortUrl: string,
  originalUrl: string
}
export interface UserHomeState {
  userId: string,
  urlInfos: UrlInfo[]
}

const initialState: UserHomeState = {
  userId: '',
  urlInfos: []
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const createShortUrlAsync = createAsyncThunk(
  'user/createShortUrlAsync',
  async (originalUrl: string, { getState }) => {
    const state = getState() as RootState;
    const response = await createShortUrl(originalUrl, state.user.userId);
    console.log(response)
    // The value we return becomes the `fulfilled` action payload
    return ({
      originalUrl,
      shortUrl: response.data
    }) as UrlInfo
  }
);

export const userHomeSlice = createSlice({
  name: 'userHome',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUserId: (state, action : PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.userId = action.payload
    },
    createShortUrlAction: (state) => {
      state.urlInfos = {...state.urlInfos}
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(createShortUrlAsync.fulfilled, (state, action) => {
        // state.status = 'idle';
        const urlInfor = action.payload
        state.urlInfos.push(urlInfor)
        console.log(state.urlInfos)
      });
  },
});

export const { setUserId, createShortUrlAction } = userHomeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUrlInfos = (state: RootState) => state.user.urlInfos;

export default userHomeSlice.reducer;
