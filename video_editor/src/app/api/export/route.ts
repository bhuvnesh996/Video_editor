import { NextResponse } from 'next/server'

export async function POST() {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  return NextResponse.json({
    success: true,
    downloadUrl: '/mock-assets/exported-video.mp4'
  })
}