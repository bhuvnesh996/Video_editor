'use client'

import { useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { setCurrentTime, togglePlay, setVideoDuration } from '@/lib/slices/timelineSlice'
import Timeline from './Timeline'

export default function VideoPreview() {
  const { videoUrl } = useSelector((state: RootState) => state.editor)
  const { currentTime, isPlaying } = useSelector((state: RootState) => state.timeline)
  const dispatch = useDispatch()
  const playerRef = useRef<ReactPlayer>(null)
  
  // Calculate percentage back to seconds for seeking
  const getDurationInSeconds = () => {
    return playerRef.current?.getDuration() || 0;
  }
  
  const currentTimeInSeconds = (currentTime / 100) * getDurationInSeconds();
  
  // Handle duration when video loads
  const handleDuration = (duration: number) => {
    dispatch(setVideoDuration(duration));
  }
  
  // Skip forward/backward functions
  const skipForward = () => {
    const currentDuration = getDurationInSeconds();
    const newTimeInSeconds = Math.min(currentTimeInSeconds + 5, currentDuration);
    const newTimePercentage = (newTimeInSeconds / currentDuration) * 100;
    dispatch(setCurrentTime(newTimePercentage));
    playerRef.current?.seekTo(newTimeInSeconds);
  }
  
  const skipBackward = () => {
    const currentDuration = getDurationInSeconds();
    const newTimeInSeconds = Math.max(currentTimeInSeconds - 5, 0);
    const newTimePercentage = (newTimeInSeconds / currentDuration) * 100;
    dispatch(setCurrentTime(newTimePercentage));
    playerRef.current?.seekTo(newTimeInSeconds);
  }
  
  // Sync player when currentTime changes from Timeline interactions
  useEffect(() => {
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      if (duration) {
        const timeInSeconds = (currentTime / 100) * duration;
        playerRef.current.seekTo(timeInSeconds);
      }
    }
  }, [currentTime]);

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-lg p-8 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-gray-700">No video selected</h3>
          <p className="text-gray-500">
            Upload a video or select one from the library to begin editing
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="default" className="px-6">
            Upload Video
          </Button>
          <Button variant="outline" className="px-6">
            Browse Library
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex  shadow-lg flex-col w-full h-full">
      {/* Video Player */}
      <div className="relative flex justify-center items-center bg-black" style={{ height: '80%', width: '100%' }}>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={isPlaying}
          controls={false}
          width="60%"
          height="50%"
          progressInterval={100}
          onProgress={({ played }) => {
            // Convert played ratio to percentage
            dispatch(setCurrentTime(played * 100));
          }}
          onDuration={handleDuration}
        />

        {/* Playback Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-10 h-10 p-0 shadow-lg"
            onClick={skipBackward}
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-12 h-12 p-0 shadow-lg"
            onClick={() => dispatch(togglePlay())}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-10 h-10 p-0 shadow-lg"
            onClick={skipForward}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div>
         {/* Timeline now takes up more space */}
                    <div className="h-52 bg-red-800 rounded-md shadow-sm">
                      <Timeline />
                    </div>

      </div>
    </div>
  )
}