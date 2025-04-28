'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import AudioControls from './AudioControls'
import Toolbar from './Toolbar'
import UploadZone from './UploadZone'
import SubtitlesPanel from './SubtitlesPanel'
import ImageOverlay from './ImageOverlay'
import VideoPreview from './VideoPreview'

export default function EditorLayout() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-900">
        <Toolbar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <div className="w-72 shadow-sm flex flex-col bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
            <Tabs defaultValue="video" className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start px-2 pt-2 bg-transparent">
                <TabsTrigger 
                  value="video" 
                  className="data-[state=active]:bg-neutral-100 data-[state=active]:dark:bg-neutral-700 data-[state=active]:text-neutral-900 data-[state=active]:dark:text-white hover:bg-neutral-50 hover:dark:bg-neutral-700/50 transition-colors"
                >
                  Video
                </TabsTrigger>
                <TabsTrigger 
                  value="audio" 
                  className="data-[state=active]:bg-neutral-100 data-[state=active]:dark:bg-neutral-700 data-[state=active]:text-neutral-900 data-[state=active]:dark:text-white hover:bg-neutral-50 hover:dark:bg-neutral-700/50 transition-colors"
                >
                  Audio
                </TabsTrigger>
                <TabsTrigger 
                  value="text" 
                  className="data-[state=active]:bg-neutral-100 data-[state=active]:dark:bg-neutral-700 data-[state=active]:text-neutral-900 data-[state=active]:dark:text-white hover:bg-neutral-50 hover:dark:bg-neutral-700/50 transition-colors"
                >
                  Text & Overlays
                </TabsTrigger>
              </TabsList>
              
              <Separator className="mt-1 bg-neutral-200 dark:bg-neutral-700" />
              
              <ScrollArea className="flex-1 p-4">
                <TabsContent value="video" className="mt-0">
                  <UploadZone />
                </TabsContent>
                
                <TabsContent value="audio" className="mt-0">
                  <AudioControls />
                </TabsContent>
                
                <TabsContent value="text" className="mt-0 space-y-6">
                  <SubtitlesPanel />
                  <Separator className="bg-neutral-200 dark:bg-neutral-700" />
                  <ImageOverlay />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          {/* Main content area */}
          <div className="flex flex-col w-full relative bg-neutral-50 dark:bg-neutral-900">
            <div className="flex-1 p-4">
              <VideoPreview />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}