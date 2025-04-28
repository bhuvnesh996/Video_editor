'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Play, Upload, Scissors, Type, Image, Music, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Loader from '@/components/Loader'
import { useEffect, useState } from 'react'


export default function VideoEditorLanding() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // loader for 4 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);


  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Easy Upload",
      description: "Drag and drop your videos or browse files from your device"
    },
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "Precise Editing",
      description: "Cut, trim and rearrange clips with pixel-perfect precision"
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "Text & Subtitles",
      description: "Add animated text, captions and stylish titles"
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Image Overlays",
      description: "Layer images with transparency controls and positioning"
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Audio Tools",
      description: "Adjust volume, add background music and sound effects"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Options",
      description: "Multiple formats and quality settings for any platform"
    }
  ]
  const router = useRouter()

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Modern <span className="text-blue-600">Video Editor</span> Assignment
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          A responsive web-based video editing platform built with Next.js, React, and Tailwind CSS
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2 cursor-pointer" onClick={() => router.push('/editor')}>
            <Play className="w-5 h-5" />
            Demo Editor
          </Button>
          <Button variant="outline"  className = 'cursor-pointer'size="lg"  onClick={() => router.push('/editor')}>
            View Documentation
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Editor Preview</h2>
          </div>
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Video Editor Interface</h3>
              <p className="text-gray-300">Timeline, preview panel and editing tools will appear here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Built With</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <TechCard name="Next.js" description="App router, React Server Components" />
          <TechCard name="React" description="Hooks, Context API, Custom Components" />
          <TechCard name="Tailwind CSS" description="Utility-first styling with plugins" />
          <TechCard name="ShadCN UI" description="Beautifully designed components" />
          <TechCard name="Redux Toolkit" description="State management for complex UI" />
          <TechCard name="TypeScript" description="Type-safe development" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore the Editor?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the modern video editing workflow with this assignment implementation
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Download className="w-5 h-5" />
            Download Source Code
          </Button>
        </div>
      </section>
    </div>
  )
}

function TechCard({ name, description }: { name: string; description: string }) {
  return (
    <Card className="w-full sm:w-[300px] hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl text-blue-600">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}