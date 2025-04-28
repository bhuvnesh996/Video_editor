
'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import EditorLayout from '@/components/editor/EditorLayout'

export default function EditorPage() {
  return (
    <Provider store={store}>
      <EditorLayout />
    </Provider>
  )
}