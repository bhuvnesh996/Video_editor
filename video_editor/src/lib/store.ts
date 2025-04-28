// src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit'
import editorReducer from './slices/editorSlice'
import timelineReducer from './slices/timelineSlice'

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    timeline: timelineReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch