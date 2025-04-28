'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SubtitlesPanel() {
  const [subtitles, setSubtitles] = useState<Array<{
    id: string
    text: string
    start: number
    end: number
    position: 'bottom' | 'middle' | 'top'
    color: string
  }>>([])

  const [currentSubtitle, setCurrentSubtitle] = useState({
    text: '',
    start: 0,
    end: 5,
    position: 'bottom' as const,
    color: '#ffffff'
  })

  const addSubtitle = () => {
    if (currentSubtitle.text.trim()) {
      setSubtitles([...subtitles, {
        ...currentSubtitle,
        id: Date.now().toString()
      }])
      setCurrentSubtitle({
        text: '',
        start: currentSubtitle.end,
        end: currentSubtitle.end + 5,
        position: 'bottom',
        color: '#ffffff'
      })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Subtitles</h3>
      
      <div className="space-y-2">
        <Label>Text</Label>
        <Input 
          value={currentSubtitle.text}
          onChange={(e) => setCurrentSubtitle({...currentSubtitle, text: e.target.value})}
          placeholder="Enter subtitle text"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start (sec)</Label>
          <Input 
            type="number" 
            value={currentSubtitle.start}
            onChange={(e) => setCurrentSubtitle({...currentSubtitle, start: Number(e.target.value)})}
          />
        </div>
        <div className="space-y-2">
          <Label>End (sec)</Label>
          <Input 
            type="number" 
            value={currentSubtitle.end}
            onChange={(e) => setCurrentSubtitle({...currentSubtitle, end: Number(e.target.value)})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Position</Label>
          <Select
            value={currentSubtitle.position}
            onValueChange={(val) => setCurrentSubtitle({...currentSubtitle, position: val as any})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="middle">Middle</SelectItem>
              <SelectItem value="top">Top</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex items-center space-x-2">
            <Input 
              type="color" 
              value={currentSubtitle.color}
              onChange={(e) => setCurrentSubtitle({...currentSubtitle, color: e.target.value})}
              className="w-10 p-0 h-10"
            />
            <span className="text-sm">{currentSubtitle.color}</span>
          </div>
        </div>
      </div>
      
      <Button onClick={addSubtitle} className="w-full">
        Add Subtitle
      </Button>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Current Subtitles</h4>
        {subtitles.length === 0 ? (
          <p className="text-gray-500 text-sm">No subtitles added yet</p>
        ) : (
          <div className="space-y-2">
            {subtitles.map((sub) => (
              <div key={sub.id} className="p-2 border rounded text-sm">
                <p>{sub.text}</p>
                <p className="text-gray-500 text-xs">{sub.start}s - {sub.end}s | {sub.position}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}