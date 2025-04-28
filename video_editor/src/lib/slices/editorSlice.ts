// src/lib/slices/editorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EditorState {
    videoUrl: string | null  // Store only the URL
    isUploading: boolean
    uploadProgress: number
  // other editor state
}

const initialState: EditorState = {

    videoUrl: null,
    isUploading: false,
    uploadProgress: 0
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setVideoUrl: (state, action: PayloadAction<string>) => {
      state.videoUrl = action.payload
    },
    startUpload: (state) => {
      state.isUploading = true
      state.uploadProgress = 0
    },
    updateUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
    completeUpload: (state) => {
      state.isUploading = false
      state.uploadProgress = 100
    }
    // other reducers
  }
})

export const { 
  setVideoFile, 
  setVideoUrl,
  startUpload,
  updateUploadProgress,
  completeUpload
} = editorSlice.actions

export default editorSlice.reducer