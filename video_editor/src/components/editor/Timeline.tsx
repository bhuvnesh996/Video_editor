'use client'

import { useRef, useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { updateSegment, setCurrentTime, togglePlay } from '@/lib/slices/timelineSlice'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Scissors, Crop, Trash2, Play, Pause, Merge } from 'lucide-react'

const ITEM_TYPE = 'TIMELINE_SEGMENT'

interface TimelineSegmentProps {
  id: string
  start: number
  end: number
  color: string
  videoDuration: number
}

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimelineSegment = ({ id, start, end, color, videoDuration }: TimelineSegmentProps) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id, start, end },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { id: string; start: number; end: number }, monitor) => {
      if (item.id !== id) {
        const hoverBoundingRect = ref.current?.getBoundingClientRect()
        const clientOffset = monitor.getClientOffset()
        
        if (hoverBoundingRect && clientOffset) {
          const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
          const hoverClientX = clientOffset.x - hoverBoundingRect.left
          
          if (hoverClientX < hoverMiddleX && item.start < start) {
            dispatch(updateSegment({ id: item.id, start, end: item.end + (start - item.start) }))
            dispatch(updateSegment({ id, start: item.start, end }))
          } else if (hoverClientX > hoverMiddleX && item.start > start) {
            dispatch(updateSegment({ id: item.id, start, end: item.end - (item.start - start) }))
            dispatch(updateSegment({ id, start: item.start, end }))
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  drag(drop(ref))

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const initialStart = start

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const containerWidth = ref.current?.parentElement?.clientWidth || 1
      const percentageDelta = (deltaX / containerWidth) * 100
      const newStart = Math.max(0, Math.min(initialStart + percentageDelta, end - 5))
      
      if (Math.abs(percentageDelta) > 0.5) {
        dispatch(updateSegment({ id, start: newStart, end }))
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResizeEnd = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const initialEnd = end

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const containerWidth = ref.current?.parentElement?.clientWidth || 1
      const percentageDelta = (deltaX / containerWidth) * 100
      const newEnd = Math.max(start + 5, Math.min(initialEnd + percentageDelta, 100))
      
      if (Math.abs(percentageDelta) > 0.5) {
        dispatch(updateSegment({ id, start, end: newEnd }))
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Convert percentage to actual seconds for display
  const startTime = (start / 100) * videoDuration;
  const endTime = (end / 100) * videoDuration;

  return (
    <div
      ref={ref}
      className={`relative h-16 ${color} rounded flex items-center justify-center cursor-move group ${
        isDragging ? 'opacity-50 ring-2 ring-blue-400' : 'opacity-100'
      } ${isOver ? 'ring-2 ring-white' : ''}`}
      style={{ 
        width: `${Math.max(end - start, 3)}%`,
        left: `${start}%`,
        position: 'absolute'
      }}
    >
      {/* Left resize handle */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white hover:bg-opacity-30"
        onMouseDown={handleResizeStart}
      ></div>

      {/* Segment content with actual time */}
      <span className="text-white text-xs font-medium truncate px-2">
        {formatTime(startTime)} - {formatTime(endTime)}
      </span>

      {/* Right resize handle */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white hover:bg-opacity-30"
        onMouseDown={handleResizeEnd}
      ></div>
    </div>
  )
}

export default function Timeline() {
  const { segments, currentTime, isPlaying } = useSelector((state: RootState) => state.timeline)
  const { videoUrl } = useSelector((state: RootState) => state.editor)
  const dispatch = useDispatch()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [videoDuration, setVideoDuration] = useState(120) // Default 2 minutes
  const [selectedSegments, setSelectedSegments] = useState<string[]>([])

  const segmentColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-amber-500',
    'bg-red-500'
  ]

  useEffect(() => {
    if (videoUrl && segments.length === 0) {
      const mockSegments = [
        { id: '1', start: 0, end: 30 },
        { id: '2', start: 30, end: 60 },
        { id: '3', start: 60, end: 100 }
      ]
      mockSegments.forEach(seg => dispatch(updateSegment(seg)))
    }
  }, [videoUrl, segments.length, dispatch])

  // Calculate the actual time in seconds
  const currentTimeInSeconds = (currentTime / 100) * videoDuration;
  
  const renderTimeMarkers = () => {
    const markers = [];
    const numMarkers = 5;
    
    for (let i = 0; i <= numMarkers; i++) {
      const percentage = (i / numMarkers) * 100;
      const timeInSeconds = (percentage / 100) * videoDuration;
      markers.push(
        <span key={i} style={{ position: 'absolute', left: `${percentage}%` }}>
          {formatTime(timeInSeconds)}
        </span>
      );
    }
    
    return (
      <div className="absolute top-0 left-0 right-0 h-6 flex text-xs text-gray-400">
        {markers}
      </div>
    );
  }

  const handleSplitSegment = () => {
    const targetSegment = segments.find(
      segment => currentTime >= segment.start && currentTime <= segment.end
    )
    
    if (targetSegment) {
      const splitPoint = currentTime
      
      dispatch(updateSegment({
        id: targetSegment.id,
        start: targetSegment.start,
        end: splitPoint
      }))
      
      dispatch(updateSegment({
        id: `${Date.now()}`,
        start: splitPoint,
        end: targetSegment.end
      }))
    }
  }

  const handleDeleteSegment = () => {
    const targetSegment = segments.find(
      segment => currentTime >= segment.start && currentTime <= segment.end
    )
    
    if (targetSegment) {
      // Implementation would depend on how you handle segment deletion in your Redux store
      console.log('Delete segment:', targetSegment.id)
    }
  }

  const handleMergeSegments = () => {
    if (selectedSegments.length >= 2) {
      // Find the selected segments
      const segmentsToMerge = segments.filter(seg => selectedSegments.includes(seg.id));
      
      // Find the minimum start and maximum end
      const minStart = Math.min(...segmentsToMerge.map(seg => seg.start));
      const maxEnd = Math.max(...segmentsToMerge.map(seg => seg.end));
      
      // Create a new merged segment
      dispatch(updateSegment({
        id: `merged-${Date.now()}`,
        start: minStart,
        end: maxEnd
      }));
      
      // Delete the old segments (implementation would depend on your Redux setup)
      console.log('Deleting segments after merge:', selectedSegments);
      
      // Clear selection
      setSelectedSegments([]);
    }
  }

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const percentage = (offsetX / rect.width) * 100;
      
      // Ensure the percentage is within bounds
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      
      // Update the current time
      dispatch(setCurrentTime(clampedPercentage));
    }
  }

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg p-8 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-gray-700">No video selected</h3>
          <p className="text-gray-500">Upload or select a video to begin editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-48 p-4 border-t border-gray-700 bg-gray-900">
      {/* Current time display */}
      <div className="text-white text-sm mb-1">
        Current Time: {formatTime(currentTimeInSeconds)}
      </div>

      {/* Time markers */}
      {renderTimeMarkers()}
  
      {/* Timeline */}
      <ScrollArea className="h-28 w-full mt-6 relative">
        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
          style={{ left: `${currentTime}%` }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 absolute -top-1.5 -left-1.5"></div>
        </div>
  
        {/* Segments container */}
        <div 
          ref={timelineRef} 
          className="relative h-20 w-full bg-gray-800 rounded cursor-pointer"
          onClick={handleTimelineClick}
        >
          {segments.map((segment, index) => (
            <TimelineSegment
              key={segment.id}
              id={segment.id}
              start={segment.start}
              end={segment.end}
              color={segmentColors[index % segmentColors.length]}
              videoDuration={videoDuration}
            />
          ))}
        </div>
      </ScrollArea>
  
      {/* Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(togglePlay())}
            className="text-white bg-blue-700 hover:bg-blue-600 border-none"
          >
            {isPlaying ? (
              <><Pause className="w-4 h-4 mr-1" /> Pause</>
            ) : (
              <><Play className="w-4 h-4 mr-1" /> Play</>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSplitSegment}
            className="text-white bg-blue-600 hover:bg-blue-500 border-none"
          >
            <Scissors className="w-4 h-4 mr-1" /> Split
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white bg-green-600 hover:bg-green-500 border-none"
          >
            <Crop className="w-4 h-4 mr-1" /> Trim
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMergeSegments}
            className="text-white bg-purple-600 hover:bg-purple-500 border-none"
            disabled={selectedSegments.length < 2}
          >
            <Merge className="w-4 h-4 mr-1" /> Merge
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSegment}
            className="text-white bg-red-600 hover:bg-red-500 border-none"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
  
        {/* Video duration */}
        <div className="text-white text-sm">
          Total Duration: {formatTime(videoDuration)}
        </div>
      </div>
    </div>
  )
}