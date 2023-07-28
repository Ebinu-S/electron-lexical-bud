import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  history: [],
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updateSave: (state, action) => {
      state.value = action.payload;
    },
    addHistory: (state, payload) => {
      state.history = [payload.payload, ...state.history];
    },
  },
});

export const { updateSave, addHistory } = editorSlice.actions;
export default editorSlice.reducer;
