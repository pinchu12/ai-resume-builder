import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'

const EditorPage = lazy(() => import('./App.jsx'))
const TemplateGallery = lazy(() => import('./pages/TemplateGallery'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/templates" replace />} />
          <Route path="/templates" element={<TemplateGallery />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
