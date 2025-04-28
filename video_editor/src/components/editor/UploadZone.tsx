'use client'

import { RootState } from '@/lib/store'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { setVideoUrl, startUpload, updateUploadProgress, completeUpload } from '@/lib/slices/editorSlice'
import { toast } from 'sonner'

export default function UploadZone() {
  const [videoFile, setVideoFile] = useState<File | null>(null) // Local state for File
  const dispatch = useDispatch()
  const { isUploading, uploadProgress } = useSelector((state: RootState) => state.editor)
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setVideoFile(file) // Store File locally
        
        dispatch(startUpload())
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200))
          dispatch(updateUploadProgress(progress))
        }
        dispatch(completeUpload())
        
        // Create and store only the URL in Redux
        const url = URL.createObjectURL(file)
        dispatch(setVideoUrl(url))
        toast('Video uploaded successfully!')
      }
    }
  })
  
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the video file here'
            : 'Drag & drop a video file, or click to select'}
        </p>
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="font-medium">Sample Videos</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Load sample video
              dispatch(setVideoUrl('/mock-assets/sample-video.mp4'))
            }}
          >
            Sample 1
          </Button>
          <Button variant="outline" size="sm">Sample 2</Button>
        </div>
      </div>
    </div>
  )
}