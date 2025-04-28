'use client'

import { Button } from '@/components/ui/button'
import { Download, Save, Settings } from 'lucide-react'
import { toast } from 'sonner'

export default function Toolbar() {
  const handleExport = () => {
    // First toast - loading state
    toast('Your video is being processed. This may take a few minutes.')
    
 
    setTimeout(() => {
 
      toast('Export complete', {
        description: 'Your video is ready to download.',
        action: {
          label: 'Download',
          onClick: () => {
            // Add your download logic here
            console.log('Downloading video...')
          },
        },
      })
    }, 3000)
  }

  return (
    <div className="bg-white border-b p-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <h1 className="font-bold text-lg">Video Editor</h1>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save Project
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Video
        </Button>
      </div>
    </div>
  )
}