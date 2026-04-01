import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const EditorPage = lazy(() => import("./App.jsx"));
const TemplateGallery = lazy(() => import("./pages/TemplateGallery"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/templates" replace />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </Suspense>
  );
}
