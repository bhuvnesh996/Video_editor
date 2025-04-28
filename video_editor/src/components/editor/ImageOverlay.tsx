'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

export default function ImageOverlay() {
  const [overlayImage, setOverlayImage] = useState<{
    url: string
    opacity: number
    size: number
    position: { x: number; y: number }
  } | null>(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const url = URL.createObjectURL(file)
        setOverlayImage({
          url,
          opacity: 100,
          size: 50,
          position: { x: 50, y: 50 }
        })
      }
    }
  })

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-medium">Image Overlay</h3>
      
      {!overlayImage ? (
        <div 
          {...getRootProps()} 
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 text-sm">
            Drag & drop an image overlay, or click to select
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative h-32 bg-gray-100 rounded overflow-hidden">
            <img 
              src={overlayImage.url} 
              alt="Overlay" 
              className="absolute object-contain"
              style={{
                opacity: overlayImage.opacity / 100,
                width: `${overlayImage.size}%`,
                height: `${overlayImage.size}%`,
                left: `${overlayImage.position.x}%`,
                top: `${overlayImage.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Opacity</Label>
            <Slider 
              value={[overlayImage.opacity]}
              onValueChange={(val) => setOverlayImage({...overlayImage, opacity: val[0]})}
              max={100}
              step={1}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Size</Label>
            <Slider 
              value={[overlayImage.size]}
              onValueChange={(val) => setOverlayImage({...overlayImage, size: val[0]})}
              max={100}
              step={1}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>X Position</Label>
              <Slider 
                value={[overlayImage.position.x]}
                onValueChange={(val) => setOverlayImage({
                  ...overlayImage, 
                  position: {...overlayImage.position, x: val[0]}
                })}
                max={100}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Y Position</Label>
              <Slider 
                value={[overlayImage.position.y]}
                onValueChange={(val) => setOverlayImage({
                  ...overlayImage, 
                  position: {...overlayImage.position, y: val[0]}
                })}
                max={100}
                step={1}
              />
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setOverlayImage(null)}
          >
            Remove Overlay
          </Button>
        </div>
      )}
    </div>
  )
}