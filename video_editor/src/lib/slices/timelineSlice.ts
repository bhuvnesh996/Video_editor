// File: /lib/slices/timelineSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Segment {
  id: string;
  start: number; // as percentage of video duration
  end: number;   // as percentage of video duration
}

interface TimelineState {
  currentTime: number; // as percentage of video duration
  isPlaying: boolean;
  segments: Segment[];
  videoDuration: number; // in seconds
}

const initialState: TimelineState = {
  currentTime: 0,
  isPlaying: false,
  segments: [],
  videoDuration: 0
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    updateSegment: (state, action: PayloadAction<Segment>) => {
      const index = state.segments.findIndex(segment => segment.id === action.payload.id);
      
      if (index !== -1) {
        state.segments[index] = action.payload;
      } else {
        state.segments.push(action.payload);
      }
    },
    deleteSegment: (state, action: PayloadAction<string>) => {
      state.segments = state.segments.filter(segment => segment.id !== action.payload);
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.videoDuration = action.payload;
    }
  }
});

export const { 
  setCurrentTime, 
  togglePlay, 
  updateSegment, 
  deleteSegment,
  setVideoDuration
} = timelineSlice.actions;

export default timelineSlice.reducer;