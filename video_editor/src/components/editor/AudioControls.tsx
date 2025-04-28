'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

export default function AudioControls() {
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Original Audio</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider 
            value={[isMuted ? 0 : volume]}
            onValueChange={(val) => {
              setVolume(val[0])
              if (val[0] > 0 && isMuted) setIsMuted(false)
            }}
            max={100}
            step={1}
            className="w-full"
          />
          <span className="text-sm w-8 text-right">{isMuted ? 0 : volume}%</span>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Background Music</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            Add Music Track
          </Button>
          <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500 text-sm">No music added</p>
          </div>
        </div>
      </div>
      
      <div className="h-32 bg-gray-100 rounded">
        {/* Mock audio waveform visualization */}
        <div className="flex items-end h-full px-2 space-x-px">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="bg-blue-500 w-full"
              style={{ 
                height: `${Math.random() * 70 + 10}%`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}