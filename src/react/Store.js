import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import editorReducer from './features/editorSlice';

const persisteConfig = {
  key: 'root',
  version: 1,
  storage,
};

const reducer = combineReducers({
  editor: editorReducer,
});

const persisitedReducer = persistReducer(persisteConfig, reducer);

export const store = configureStore({
  reducer: persisitedReducer,
});
